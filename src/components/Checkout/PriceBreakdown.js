"use client";

import { motion } from "framer-motion";

export default function PriceBreakdown({
  user,
  backendTotals,
  localTotals,
  formData,
  deliveryFee,
  codHandlingCharge,
  extraDiscount,
  discount,
  appliedCoupon,
  finalTotal,
  paymentMethod,
  deliveryPrices,
}) {
  return (
    <div className="space-y-3 mb-2 font-figtree">
      {/* Price row */}
      <div className="flex justify-between items-center text-gray-800 text-sm font-medium">
        <span>Price</span>
        <div className="flex items-center gap-2">
          {(user
            ? backendTotals?.totalMRPDiscount
            : localTotals?.totalMRPDiscount) > 0 ? (
            <>
              <span className="font-bold text-gray-900 text-sm">
                ₹
                {Math.round(
                  user
                    ? backendTotals.grandTotal
                    : localTotals.grandTotal,
                )}
              </span>
              <span className="line-through text-gray-400 text-sm">
                ₹
                {Math.round(
                  user
                    ? backendTotals.totalMRP
                    : localTotals.totalMRP,
                )}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900 text-sm">
              ₹
              {Math.round(
                user
                  ? backendTotals.totalMRP
                  : localTotals.totalMRP,
              )}
            </span>
          )}
        </div>
      </div>

      {/* Delivery fee */}
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          <span>Delivery fee</span>
          {!formData.zipCode ||
          formData.zipCode.length !== 6 ? (
            <p className="text-xs text-gray-400 mt-1">
              Enter pincode to see delivery options
            </p>
          ) : (
            <p
              className={`text-xs mt-1 ${deliveryFee === 0 ? "text-green-600" : "text-gray-500"}`}
            ></p>
          )}
        </div>
        <div className="text-right">
          <span className="font-semibold">
            {!formData.zipCode || formData.zipCode.length !== 6
              ? "—"
              : deliveryFee === 0
                ? "FREE"
                : `₹${deliveryFee}`}
          </span>
        </div>
      </div>

      {/* Free delivery progress */}
      {deliveryPrices?.feeStrategy === "CONDITIONAL" &&
        deliveryFee > 0 &&
        deliveryPrices?.freeThreshold > 0 &&
        Math.max(
          0,
          (deliveryPrices?.freeThreshold || 500) -
            (user
              ? backendTotals.grandTotal
              : localTotals.grandTotal),
        ) > 0 && (
          <div className="flex justify-between items-center bg-[#faf4ea] p-2 rounded-lg mt-1">
            <span className="text-xs text-[#c1552c]">
              Add ₹
              {Math.max(
                0,
                (deliveryPrices?.freeThreshold || 500) -
                  (user
                    ? backendTotals.grandTotal
                    : localTotals.grandTotal),
              ).toFixed(0)}{" "}
              more to get
              <span className="font-semibold"> FREE delivery</span>
            </span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c1552c] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, ((user ? backendTotals.grandTotal : localTotals.grandTotal) / (deliveryPrices?.freeThreshold || 500)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

      {/* Combo Savings */}
      {backendTotals.totalComboDiscount > 0 && (
        <div className="flex justify-between items-center bg-[#faf4ea] p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-[#c1552c] font-medium text-sm">
              Combo Savings
            </span>
          </div>
          <span className="text-[#c1552c] font-bold text-sm">
            -₹{Math.round(backendTotals.totalComboDiscount)}
          </span>
        </div>
      )}

      {/* COD Handling Charge */}
      {codHandlingCharge > 0 && (
        <div className="flex text-sm justify-between text-amber-600 bg-amber-50 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-amber-700 font-medium">
              COD Handling Charge
            </span>
          </div>
          <span className="text-amber-700 font-bold">
            +₹{codHandlingCharge}
          </span>
        </div>
      )}

      {/* Extra Discount (Online Payment / Special) */}
      {extraDiscount > 0 && (
        <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-green-700 font-medium">
              {paymentMethod === "online payments"
                ? "Online Payment Discount"
                : "Special Discount"}
            </span>
          </div>
          <span className="text-green-700 font-bold">
            -₹
            {Math.round(
              ((user
                ? backendTotals.grandTotal
                : localTotals.grandTotal) *
                extraDiscount) /
                100,
            )}
          </span>
        </div>
      )}

      {/* Coupon Discount */}
      {discount > 0 && (
        <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-green-700 font-medium">
              Coupon Discount
            </span>
            <span className="text-xs text-green-600">
              {appliedCoupon?.type === "Percentage"
                ? `${appliedCoupon?.originalDiscount}% off`
                : `Flat ₹${appliedCoupon?.flatDiscount} off`}
            </span>
          </div>
          <span className="text-green-700 font-bold">
            -₹{discount.toFixed(0)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-[#e6ded2] pt-4">
        <div className="flex justify-between text-xl font-bold text-gray-800">
          <span>Total</span>
          <motion.span
            key={finalTotal}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl text-[#c1552c]"
          >
            ₹{finalTotal.toFixed(0)}
          </motion.span>
        </div>

        <p className="text-sm text-gray-500">
          Including all taxes
        </p>
      </div>
    </div>
  );
}