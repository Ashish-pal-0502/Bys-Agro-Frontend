import TermsClient from "./TermsClient";

export const metadata = {
  title: "Terms & Conditions | BYS Agro",
  description:
    "Read the terms and conditions for shopping with BYS Agro — orders, pricing, shipping, returns, and user responsibilities.",
  alternates: { canonical: "/terms-conditions" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsClient />;
}