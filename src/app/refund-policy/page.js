import RefundClient from "./RefundClient";

export const metadata = {
  title: "Refund & Returns Policy | BYS Agro",
  description:
    "BYS Agro return and refund policy — 7-day returns, refund timelines, eligibility, and process.",
  alternates: { canonical: "/refund-policy" },
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return <RefundClient />;
}