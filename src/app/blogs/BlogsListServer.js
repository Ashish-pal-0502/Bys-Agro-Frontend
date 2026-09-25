
import Link from "next/link";
import BlogCard from "./../../components/Blog/BlogCard";
import PaginationClient from "./PaginationClient";
import { Parser } from "html-to-react";


const getReadTime = (content = "") => {
  const words = String(content).split(/\s+/).length;
  return Math.ceil(words / 200);
};

export default function BlogsListServer({ blogs = [], pageCount = 0, currentPage = 1 }) {
  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <div className="bg-[#FAF6ED] min-h-screen font-serif">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[#c1552c] uppercase mb-2 font-semibold">
            BYS Agro Journal
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#2b1b12] mb-4">
            Stories from <span className="text-[#c1552c] italic">Our Kitchen</span>
          </h1>
          <p className="text-[#5a4a3a] max-w-2xl mx-auto text-sm md:text-base">
            Discover the stories behind your favorite staples — from farm to table,
            recipes, wellness tips, and the rich heritage of Indian spices & pulses.
          </p>
        </div>

        {/* Featured */}
        {featuredBlog && (
          <div className="grid md:grid-cols-2 gap-8 mb-14 items-center">
            <Link href={`/blogs/${featuredBlog._id}`}>
              <div className="relative h-70 md:h-87.5 rounded-2xl overflow-hidden bg-[#1B3A5C]">
                <img
                  src={featuredBlog.image?.[0]}
                  alt={featuredBlog.heading || "Featured blog"}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 text-[#0F1E2F] left-4 bg-[#E8C547] text-xs px-3 py-1 rounded-lg font-medium">
                  Featured
                </span>
              </div>
            </Link>

            <div>
              <p className="text-xs tracking-widest text-[#c1552c] uppercase mb-2 font-semibold">
                Featured Story
              </p>
              <Link href={`/blogs/${featuredBlog._id}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2b1b12] mb-3 leading-snug hover:text-[#c1552c] transition-colors">
                  { Parser().parse(featuredBlog.heading || "") || "Untitled"}
                </h2>
              </Link>
              <p className="text-[#5a4a3a] text-sm mb-4 line-clamp-3 leading-relaxed">
                {featuredBlog.mdesc || "No description available"}
              </p>
              <div className="text-xs text-[#8a8179] flex items-center gap-3">
                <span>
                  {new Date(featuredBlog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{getReadTime(featuredBlog.content)} min read</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingBlogs.map((blog) => (
            <BlogCard key={blog._id} blogData={blog} />
          ))}
        </div>

        {/* Pagination (client island) */}
        {pageCount > 1 && (
          <div className="mt-10">
            <PaginationClient count={pageCount} page={currentPage} />
          </div>
        )}
      </div>
    </div>
  );
}