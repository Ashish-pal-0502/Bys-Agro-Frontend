"use client";

import { motion } from "framer-motion";

export default function CouponSection({
  appliedCoupon,
  couponCode,
  setCouponCode,
  couponError,
  setCouponError,
  isApplyingCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
}) {
  return (
    <div className="mb-6">
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-linear-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-green-800">
                    {appliedCoupon.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.type === "Percentage"
                      ? `${appliedCoupon.originalDiscount}% off`
                      : `Flat ₹${appliedCoupon.flatDiscount} off`}
                    {appliedCoupon.maxDiscount &&
                      appliedCoupon.type === "Percentage" &&
                      ` (Max ₹${appliedCoupon.maxDiscount})`}
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
            >
              Remove
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError("");
              }}
              placeholder="Enter coupon code"
              className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] focus:border-transparent pr-32 text-[#2b1b12]"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#c1552c] text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#a84824]"
            >
              {isApplyingCoupon ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Applying
                </div>
              ) : (
                "Apply"
              )}
            </motion.button>
          </div>
          {couponError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2"
            >
              {couponError}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}