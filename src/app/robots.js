export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/api/",
        ],
      },
    ],
    sitemap: "https://bysagro.com/sitemap.xml",
    host: "https://bysagro.com",
  };
}