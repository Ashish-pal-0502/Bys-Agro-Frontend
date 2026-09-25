import CheckoutContent from "./checkoutContent";

export const metadata = {
  title: "Checkout | Bys Agro – Secure Payment",
  description:
    "Complete your Bys Agro order. Secure checkout with UPI, cards & net banking. Fast delivery across India.",
  openGraph: {
    title: "Secure Checkout – Bys Agro",
    description: "Complete your purchase with secure payment options.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Checkout | Bys Agro",
    description: "Secure payment – complete your order.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}