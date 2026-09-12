
import AllProductsClient from "./AllProductsClient";

export const metadata = {
  title: "Shop Premium Pulses, Oils, Spices & Dry Fruits Online | BYS Agro",
  description:
    "Shop premium quality pulses (Toor Dal, Moong Dal, Masur Dal), cold-pressed oils, authentic spices, and dry fruits online at BYS Agro. 100% natural, FSSAI approved, delivered pan-India.",
  alternates: { canonical: "/all-products" },
  openGraph: {
    title: "Shop Premium Pulses, Oils, Spices & Dry Fruits Online | BYS Agro",
    description:
      "Shop premium quality pulses, cold-pressed oils, authentic spices, and dry fruits. 100% natural. FSSAI approved. Pan-India delivery.",
    type: "website",
    url: "https://bysagro.com/all-products",
    images: [
      {
        url: "/icons/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "BYS Agro Product Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Pulses, Oils, Spices & Dry Fruits | BYS Agro",
    description:
      "Premium pulses, cold-pressed oils, authentic spices, and dry fruits. 100% natural. FSSAI approved. Pan-India delivery.",
    images: ["/icons/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllProductsPage() {
  return <AllProductsClient />;
}