export const metadata = {
  title: "My Orders | Bys Agro",
  description:
    "View and manage your order history, track shipments, and download invoices on Bys Agro.",
  robots: "noindex, follow",
  openGraph: {
    title: "My Orders | Bys Agro",
    description: "Track your purchases and order status on Bys Agro.",
    type: "website",
    images: [
      {
        url: "/LogoR.webp",
        width: 1200,
        height: 630,
        alt: "Bys Agro Orders Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "My Orders | Bys Agro",
    description: "Track your purchases and order status.",
    images: ["/LogoR.webp"],
  },
};

export default function OrdersLayout({ children }) {
  return <>{children}</>;
}