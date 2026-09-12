import { Domine, Manrope } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ClientOnly from "./../components/ClientsOnly/ClientsOnly";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";


const domine = Domine({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-domine",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CLIENT || "http://localhost:3000",
  ),
  title:
    "BYS Agro – Premium Quality Pulses, Spices, Oils & Dry Fruits | Pure & Natural",
  description:
    "Shop premium quality pulses (Toor Dal, Moong Dal, Masur Dal), cold-pressed cooking oils (Mustard Oil, Sunflower Oil), authentic spices, sugar, salts, and dry fruits & nuts at BYS Agro. FSSAI approved. 100% natural. Delivered pan-India.",
  keywords: [
    "BYS Agro",
    "buy pulses online India",
    "premium quality dal",
    "Toor Dal online",
    "Moong Dal buy online",
    "Masur Dal India",
    "cold-pressed mustard oil",
    "sunflower cooking oil",
    "buy spices online",
    "kitchen spices India",
    "dry fruits online",
    "nuts online India",
    "sugar and salts",
    "FSSAI approved",
    "pure natural products",
    "grocery essentials",
    "Indian kitchen staples",
    "healthy cooking oils",
    "premium dry fruits",
    "authentic Indian spices",
  ],
  icons: {
    icon: "/Icon512.png",
  },
  openGraph: {
    title: "BYS Agro – Premium Quality Pulses, Spices, Oils & Dry Fruits",
    description:
      "Premium pulses, cold-pressed oils, authentic spices, and dry fruits. 100% natural. FSSAI approved. No additives.",
    url: "https://bysagro.com",
    siteName: "BYS Agro",
    images: [
      {
        url: "/icons/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "BYS Agro – Premium Quality Grocery Essentials",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYS Agro – Premium Quality Pulses, Spices, Oils & Dry Fruits",
    description:
      "Premium pulses, cold-pressed oils, authentic spices, and dry fruits. 100% natural. FSSAI approved. Pan-India delivery.",
    images: ["/icons/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${domine.variable} ${manrope.variable}`}>
      <body>
         <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          // clientId="985394702355-u6ffiuek808sja4hdbedujlfj1ou57l3.apps.googleusercontent.com"
        >

        <Suspense fallback={null}>
          <ClientOnly>{children}</ClientOnly>
        </Suspense>
        <Toaster position="bottom-right" reverseOrder={false} />

        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
