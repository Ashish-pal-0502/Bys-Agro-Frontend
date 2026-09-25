export const metadata = {
  title: "Search Products | Bys Agro",
  description:
    "Find honey, oils, spices, and more from our exclusive organic collection. Search our premium products.",
robots: {
  index: false,
  follow: true,
},
  openGraph: {
    title: "Search Products | Bys Agro",
    description:
      "Find honey, oils, spices, and more from our exclusive organic collection.",
    type: "website",
    images: ["/LogoR.webp"],
  },
  twitter: {
    card: "summary",
    title: "Search Products | Bys Agro",
    description: "Find premium honey and organic products",
    images: ["/LogoR.webp"],
  },
};

export default function SearchLayout({ children }) {
  return <>{children}</>;
}
