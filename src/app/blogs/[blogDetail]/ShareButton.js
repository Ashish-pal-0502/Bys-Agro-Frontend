
"use client";

import { useEffect, useState } from "react";
import { FaShareAlt } from "react-icons/fa";

export default function ShareButton({ title, text, progressOnly = false }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress(Math.min((window.scrollY / total) * 100, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      } catch {}
      return;
    }
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch {}
  };

  if (progressOnly) {
    return (
      <div
        className="fixed top-0 left-0 h-1 bg-[#c1552c] z-50 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e6ded2] hover:bg-white hover:border-[#c1552c] hover:text-[#c1552c] transition-all duration-200"
      aria-label="Share this article"
    >
      <FaShareAlt size={12} aria-hidden="true" />
      <span className="text-xs text-[#5a4a3a]">Share</span>
    </button>
  );
}