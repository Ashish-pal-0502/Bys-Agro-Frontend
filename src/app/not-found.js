import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center font-serif bg-[#faf4ea] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-[#e6ded2] p-8 text-center">
        <div className="text-5xl font-bold text-[#c1552c] mb-2">404</div>
        <h2 className="text-xl font-semibold text-[#2b1b12] mb-2">
          Page not found
        </h2>
        <p className="text-[#5a4a3a] mb-6 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#c1552c] text-white rounded-xl font-semibold hover:bg-[#a84824]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}