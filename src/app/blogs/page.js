import BlogsListServer from "./BlogsListServer";

export const metadata = {
  title: "Blogs | BYS Agro – Stories from Indian Farms & Kitchens",
  description:
    "Recipes, wellness tips, and stories behind premium Indian pulses, spices, cold-pressed oils, and dry fruits. From farm to table with BYS Agro.",
  keywords: [
    "BYS Agro blog",
    "Indian recipes",
    "pulses recipes",
    "spices guide",
    "cold-pressed oil benefits",
    "healthy Indian cooking",
    "farm to table India",
  ],
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blogs | BYS Agro",
    description:
      "Recipes, wellness tips, and stories behind premium Indian staples.",
    url: "https://bysagro.com/blogs",
    siteName: "BYS Agro",
    type: "website",
    images: [
      {
        url: "/icons/og-blogs.jpg",
        width: 1200,
        height: 630,
        alt: "BYS Agro Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | BYS Agro",
    description: "Recipes, wellness tips, and stories from Indian kitchens.",
    images: ["/icons/og-blogs.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function BlogsPage({ searchParams }) {
  // Next.js 15+ : searchParams is a Promise
  const resolved = await searchParams;
  const currentPage = Number(resolved?.page) || 1;

  let blogs = [];
  let pageCount = 0;

  try {
    // plain fetch
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/blog/get-all-blogs?pageNumber=${currentPage}`,
      { next: { revalidate: 300 } },
    );

    if (res.ok) {
      const data = await res.json();
      blogs = data.blogs || [];
      pageCount = data.pageCount || 0;
    }
  } catch (err) {
    console.error("Server fetch failed for blogs:", err);
  }

  return (
    <BlogsListServer
      blogs={blogs}
      pageCount={pageCount}
      currentPage={currentPage}
    />
  );
}
