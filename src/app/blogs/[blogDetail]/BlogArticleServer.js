
import Image from "next/image";
import { Parser } from "html-to-react";
import ShareButton from "./ShareButton";

const getReadingTime = (html) => {
  const text = html?.replace(/<[^>]*>?/gm, "") || "";
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

    const stripHeadingTags = (html = "") =>
  html.replace(/<\/?h[1-6][^>]*>/gi, "");

export default function BlogArticleServer({ blog }) {
  const readingTime = getReadingTime(blog.content);

  return (
    <div className="bg-[#faf4ea] min-h-screen font-serif">
      <ShareButton progressOnly />

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        <p className="text-xs tracking-widest uppercase text-[#c1552c] text-center mb-3 font-semibold">
          BYS Agro Journal
        </p>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-[#2b1b12] leading-tight mb-4">
         {Parser().parse(stripHeadingTags(blog.heading || "")) || "Untitled"}
        </h1>

        <p className="text-center text-[#5a4a3a] max-w-2xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
          {blog.mdesc || "No description available"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#8a8179] mb-10">
          <span>
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Recently"}
          </span>
          <span className="w-1 h-1 bg-[#e6ded2] rounded-full"></span>
          <span>{readingTime} min read</span>
          <span className="w-px h-4 bg-[#e6ded2] mx-2"></span>
          <ShareButton title={blog.heading} text={blog.mdesc} />
        </div>

        {blog.image?.[0] && (
          <div className="relative h-65 md:h-105 rounded-3xl overflow-hidden mb-12">
            <Image
              src={blog.image[0]}
              alt={blog.heading || "Blog post image"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* <article className="prose prose-lg max-w-none text-[#2b1b12] prose-headings:text-[#2b1b12] prose-headings:font-serif prose-p:text-[#5a4a3a] prose-p:leading-relaxed prose-strong:text-[#2b1b12] prose-ul:text-[#5a4a3a] prose-li:text-[#5a4a3a]"> */}

        <article className="prose prose-lg max-w-none
  prose-p:my-6
  prose-headings:mt-10 prose-headings:mb-4
  prose-li:my-2
  prose-ul:my-6
  text-[#2b1b12]
  prose-headings:text-[#2b1b12]
  prose-headings:font-serif
  prose-p:text-[#5a4a3a]
  prose-p:leading-relaxed
  prose-strong:text-[#2b1b12]
  prose-ul:text-[#5a4a3a]
  prose-li:text-[#5a4a3a]">
          {Parser().parse(blog.content || "<p>No content available</p>")}
        </article>

        <div className="mt-10 bg-[#efe8dd] rounded-2xl p-6 flex items-center gap-4 border border-[#e6ded2]">
          <div className="w-12 h-12 rounded-full bg-[#c1552c] text-white flex items-center justify-center font-bold text-lg">
            {getInitials(blog?.user || "BYS Agro")}
          </div>
          <div>
            <h4 className="font-semibold text-[#2b1b12]">
              {blog?.user || "BYS Agro Team"}
            </h4>
            <p className="text-sm text-[#5a4a3a]">
              Sharing stories from Indian farms and kitchens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}