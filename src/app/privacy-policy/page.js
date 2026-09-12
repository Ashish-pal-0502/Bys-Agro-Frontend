import PrivacyClient from "./PrivacyClient";

export const metadata = {
  title: "Privacy Policy | BYS Agro",
  description:
    "Learn how BYS Agro collects, uses, and protects your personal information when you shop with us.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}