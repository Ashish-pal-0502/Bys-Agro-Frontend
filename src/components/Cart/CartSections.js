

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { IoClose, IoTrashOutline } from "react-icons/io5";

// ─────────────────────────────────────────────
// 1. Loading State (plain content — no slide wrapper)
// ─────────────────────────────────────────────
export function LoadingCart({ onClose }) {
  return (
    <>
      <div className="flex justify-between items-center rounded-tl-4xl p-5 bg-white border-b border-amber-100">
        <div>
          <h2 className="font-bold text-xl text-gray-800">Your Cart</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoClose className="text-xl cursor-pointer text-gray-600" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c1552c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2b1b12]">Loading cart...</p>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// 2. Empty State (plain content — no slide wrapper)
// ─────────────────────────────────────────────
export function EmptyCart({ onClose, onStartShopping }) {
  return (
    <>
      <div className="flex justify-between items-center p-5 rounded-tl-4xl bg-white border-b border-amber-100">
        <h2 className="font-semibold text-xl text-gray-800">Your Cart</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoClose className="text-xl cursor-pointer text-gray-600" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 mb-6 relative"
        >
          <div className="absolute inset-0 bg-[#E56A5C]/10 rounded-full"></div>
          <div className="absolute inset-3 bg-amber-100 rounded-full flex items-center justify-center">
            <FiShoppingBag className="text-5xl text-[#E56A5C]" />
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Your Cart is Empty
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-8"
        >
          Looks like you haven&apos;t added anything yet
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartShopping}
          className="bg-[#E56A5C] cursor-pointer text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Start Shopping
        </motion.button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// 3. Cart Item Row (with all discount logic)
// ─────────────────────────────────────────────
export function CartItemRow({
  item,
  updatingItem,
  getTotalCartQuantity,
  onRemove,
  onQuantityChange,
}) {
  const originalPrice = item?.product?.price || 0;
  const internalDiscount = item?.product?.discount || 0;
  const isFlash = item?.product?.isFlash && item?.product?.flash;
  const hasLinkedOffer = !!item?.linkedVia;

  let displayPrice = originalPrice;
  let showDiscount = false;
  let isComboDiscount = false;
  let comboDiscountValue = 0;
  let comboDiscountType = "";
  let totalDiscountPercent = 0;

  if (hasLinkedOffer && item.linkedVia?.linkedOfferId) {
    const offer = item.linkedVia.linkedOfferId;
    comboDiscountValue = offer.discountValue;
    comboDiscountType = offer.discountType;
    isComboDiscount = true;
  }

  if (isComboDiscount) {
    if (comboDiscountType === "percentage") {
      totalDiscountPercent = internalDiscount + comboDiscountValue;
      displayPrice =
        originalPrice - (originalPrice * totalDiscountPercent) / 100;
    } else if (comboDiscountType === "flat" || comboDiscountType === "fixed") {
      const priceAfterInternal =
        originalPrice - (originalPrice * internalDiscount) / 100;
      displayPrice = priceAfterInternal - comboDiscountValue;
      totalDiscountPercent =
        ((originalPrice - displayPrice) / originalPrice) * 100;
    }
    displayPrice = Math.max(displayPrice, 0);
    showDiscount = true;
  } else if (isFlash) {
    const flash = item.product.flash;
    if (flash.discountType === "PERCENT") {
      displayPrice =
        originalPrice - (originalPrice * flash.discountValue) / 100;
    } else {
      displayPrice = originalPrice - flash.discountValue;
    }
    displayPrice = Math.max(displayPrice, 0);
    showDiscount = true;
  } else if (internalDiscount > 0) {
    displayPrice = originalPrice - (originalPrice * internalDiscount) / 100;
    displayPrice = Math.max(displayPrice, 0);
    showDiscount = true;
  }

  const getComboDiscountText = () => {
    if (comboDiscountType === "percentage") {
      return `+${comboDiscountValue}%`;
    } else if (comboDiscountType === "flat" || comboDiscountType === "fixed") {
      return `+₹${comboDiscountValue}`;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className="bg-gray-100 rounded-2xl p-2 shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden relative">
            <Image
              src={item?.product?.images?.[0] || "/icons/honey-jar.png"}
              alt={item?.product?.name || "Product"}
              fill
              sizes="80px"
              className="object-cover rounded-xl"
            />
          </div>

          {internalDiscount > 0 && !isFlash && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {Math.round(internalDiscount)}%
            </div>
          )}

          {isFlash && showDiscount && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              SALE
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                {item?.product?.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {item?.product?.weight}
              </p>

              {isComboDiscount && (
                <div className="flex items-center gap-1.5 mt-1">
                  <GiPresent className="text-xs bg-[#faf4ea] text-[#c1552c]" />
                  <span className="text-xs bg-[#faf4ea] text-[#c1552c] px-2 py-0.5 rounded-full font-medium">
                    Combo discount {getComboDiscountText()} OFF
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              {showDiscount ? (
                <div className="flex flex-col items-end">
                  <span className="font-bold text-amber-600 text-lg">
                    ₹{Math.round(displayPrice)}
                  </span>
                  <span className="text-xs line-through text-gray-400">
                    ₹{Math.round(originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-800 text-base">
                  ₹{Math.round(displayPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(item)}
                className="w-8 h-8 flex cursor-pointer items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
              >
                <IoTrashOutline size={16} />
              </button>

              <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                <button
                  onClick={() =>
                    onQuantityChange(item, item.quantity - 1, item.quantity)
                  }
                  disabled={item.quantity <= 1 || updatingItem === item._id}
                  className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                >
                  −
                </button>

                <span className="text-sm font-medium w-6 text-center">
                  {updatingItem === item._id ? (
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <p className="text-gray-700">{item.quantity}</p>
                  )}
                </span>

                <button
                  onClick={() =>
                    onQuantityChange(item, item.quantity + 1, item.quantity)
                  }
                  disabled={
                    updatingItem === item._id ||
                    item.quantity >= 4 ||
                    getTotalCartQuantity() >= 4 ||
                    item.quantity >=
                      (item?.product?.countInStock?.quantity || 0)
                  }
                  className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 4. Breakdown (bottom panel)
// ─────────────────────────────────────────────
export function CartBreakdown({
  user,
  backendTotals,
  localTotals,
  deliveryFee,
  deliveryPrices,
  extraDiscount,
  codHandlingCharge,
  activeDiscountType,
}) {
  const currentGrandTotal = user
    ? backendTotals.grandTotal
    : localTotals.grandTotal;
  const currentTotalMRP = user ? backendTotals.totalMRP : localTotals.totalMRP;
  const currentTotalMRPDiscount = user
    ? backendTotals.totalMRPDiscount
    : localTotals.totalMRPDiscount;

  return (
    <div className="border-t border-dashed pt-3 space-y-2">
      {/* Price */}
      <div className="flex justify-between items-center">
        <span>Price</span>
        <div className="flex items-center gap-2">
          {currentTotalMRPDiscount > 0 && (
            <>
              <span className="font-bold text-gray-900 text-sm">
                ₹{Math.round(currentGrandTotal)}
              </span>
              <span className="line-through text-gray-400 text-sm">
                ₹{Math.round(currentTotalMRP)}
              </span>
            </>
          )}
          {!(currentTotalMRPDiscount > 0) && (
            <span className="font-bold text-gray-900 text-sm">
              ₹{Math.round(currentTotalMRP)}
            </span>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="flex justify-between items-center">
        <span>Delivery fee</span>
        <span>
          {deliveryFee === 0 ? (
            <span className="font-regular">
              FREE shipping{" "}
              {activeDiscountType === "PREPAID"
                ? "(Prepaid)"
                : activeDiscountType === "COD"
                  ? "(COD)"
                  : ""}
            </span>
          ) : (
            `₹${deliveryFee}`
          )}
        </span>
      </div>

      {/* Combo Savings */}
      {backendTotals.totalComboDiscount > 0 && (
        <div className="flex justify-between items-center bg-primary-100 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-primary-400 font-medium">Combo Savings</span>
          </div>
          <span className="text-primary-400 font-bold">
            -₹{Math.round(backendTotals.totalComboDiscount)}
          </span>
        </div>
      )}

      {/* Free shipping progress */}
      {deliveryPrices?.feeStrategy !== "FREE" &&
        deliveryPrices?.feeStrategy !== "FIXED" &&
        backendTotals.grandTotal < (deliveryPrices?.freeThreshold || 500) &&
        backendTotals.grandTotal > 0 && (
          <div className="flex justify-between items-center bg-primary-100 p-2 rounded-lg mt-1">
            <span className="text-xs text-primary-400">
              Add ₹
              {Math.max(
                0,
                (deliveryPrices?.freeThreshold || 500) -
                  backendTotals.grandTotal,
              ).toFixed(0)}{" "}
              more to get
              <span className="font-semibold"> FREE shipping (Prepaid)</span>
            </span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c1552c] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (backendTotals.grandTotal / (deliveryPrices?.freeThreshold || 500)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

      {/* Extra Discount - Prepaid */}
      {extraDiscount > 0 && activeDiscountType === "PREPAID" && (
        <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-green-700 font-medium">
              Online Payment Discount
            </span>
          </div>
          <span className="text-green-700 font-bold">
            -₹{Math.round((currentGrandTotal * extraDiscount) / 100)}
          </span>
        </div>
      )}

      {/* Extra Discount - COD */}
      {extraDiscount > 0 && activeDiscountType === "COD" && (
        <div className="flex justify-between items-center bg-primary-50 p-2 rounded-lg -mx-2 px-2">
          <div className="flex flex-col">
            <span className="text-primary-400 font-medium">
              Special Discount
            </span>
            <span className="text-xs text-gray-500">
              Special discount applied
            </span>
          </div>
          <span className="text-primary-400 font-bold">
            -₹{Math.round((currentGrandTotal * extraDiscount) / 100)}
          </span>
        </div>
      )}

      {/* COD Handling Charge */}
      {codHandlingCharge > 0 && activeDiscountType === "COD" && (
        <div className="flex justify-between items-center">
          <span>COD Handling Charge</span>
          <span className="text-warning">+₹{codHandlingCharge}</span>
        </div>
      )}

      {/* Grand Total */}
      <div className="border-t border-dashed pt-2 mt-2 flex justify-between font-semibold text-gray-800">
        <span>Grand total</span>
        <span>
          ₹
          {Math.round(
            currentGrandTotal +
              deliveryFee +
              (activeDiscountType === "COD" ? codHandlingCharge : 0) -
              (currentGrandTotal * (extraDiscount || 0)) / 100,
          )}
        </span>
      </div>
    </div>
  );
}