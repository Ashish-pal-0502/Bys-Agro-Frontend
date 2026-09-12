"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, LogRocket, etc.)
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf4ea] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-[#e6ded2] p-8 text-center">
        <div className="w-16 h-16 bg-[#faf4ea] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-semibold text-[#2b1b12] mb-2">
          Something went wrong
        </h2>
        <p className="text-[#5a4a3a] mb-6 text-sm">
          We hit an unexpected error. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#c1552c] text-white rounded-xl font-semibold hover:bg-[#a84824] cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-[#e6ded2] text-[#2b1b12] rounded-xl font-semibold hover:bg-[#faf4ea]"
          >
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-6 text-left text-xs bg-[#faf4ea] p-3 rounded-xl overflow-auto text-red-600">
            {error?.message}
          </pre>
        )}
      </div>
    </div>
  );
}