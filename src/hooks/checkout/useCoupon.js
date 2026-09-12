"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "./../../api/client";

export function useCoupon({ userId, cartTotal }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await apiClient.get("/variation/apply-coupon", {
        code: couponCode.trim(),
        userId: userId,
      });

      if (response.ok) {
        const couponData = response.data.promoCode;

        let discountAmount = 0;

        if (couponData.type === "Percentage") {
          discountAmount = (cartTotal * couponData.discount) / 100;

          if (
            couponData.maxDiscount &&
            discountAmount > couponData.maxDiscount
          ) {
            discountAmount = couponData.maxDiscount;
          }
        } else if (couponData.type === "Flat") {
          discountAmount = couponData.flatDiscount;
        }

        discountAmount = Math.min(discountAmount, cartTotal);

        setDiscountAmount(discountAmount);
        setAppliedCoupon({
          code: couponCode.trim(),
          discount: discountAmount,
          type: couponData.type,
          originalDiscount: couponData.discount,
          flatDiscount: couponData.flatDiscount,
          maxDiscount: couponData.maxDiscount,
        });

        toast.success(
          `Coupon applied! ${
            couponData.type === "Percentage"
              ? `${couponData.discount}% off`
              : `₹${couponData.flatDiscount} off`
          }`,
        );
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        toast.error("Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon");
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discountAmount,
    couponError,
    setCouponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
}