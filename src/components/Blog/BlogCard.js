
"use client";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { Parser } from "html-to-react";

const BlogCard = ({ blogData }) => {
  const words = blogData?.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="bg-[#faf4ea] rounded-2xl overflow-hidden border border-[#e6ded2] hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blogs/${blogData._id}`}>
        <div className="h-45 bg-[#e6ded2] overflow-hidden">
          <img
            src={blogData?.image?.[0] || "/placeholder-blog.jpg"}
            alt={blogData?.heading || "Blog post"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-[#c1552c] font-semibold">
          BYS Agro
        </p>

        <Link href={`/blogs/${blogData._id}`}>
          <h3 className="text-base cursor-pointer font-semibold text-[#2b1b12] leading-snug line-clamp-2 hover:text-[#c1552c] transition-colors">
            {Parser().parse(blogData?.heading || "") || blogData.heading || "Untitled"}
          </h3>
        </Link>

        <p className="text-sm text-[#5a4a3a] line-clamp-2 leading-relaxed">
          {blogData.mdesc || "No description available"}
        </p>

        <div className="flex items-center justify-between text-xs text-[#8a8179] pt-2 border-t border-[#e6ded2]">
          <span>
            {blogData.createdAt
              ? new Date(blogData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : "Recently"}
          </span>

          <div className="flex items-center gap-1">
            <FaClock size={12} />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;