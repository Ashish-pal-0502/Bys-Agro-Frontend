import { Suspense } from "react";

import CheckoutSuccess from "./checkoutSuccess";
export const metadata = {
  title: "Order Confirmed | BYS Agro",
  description: "Your order has been placed successfully.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-64 h-40 rounded-3xl bg-[#faf4ea] animate-pulse" />
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
