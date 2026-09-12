"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { GiPresent } from "react-icons/gi";

export default function CartItemsList({ cartItems, isCartOpen, onToggle }) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex cursor-pointer items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[#2b1b12]">Your Items</h4>
          <span className="text-xs text-gray-500">
            ({cartItems.length} items)
          </span>
        </div>
        <div className="flex cursor-pointer items-center gap-2">
          <svg
            className={`w-4 h-4 text-[#c1552c] transition-transform duration-200 ${
              isCartOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isCartOpen && (
          <div
            className={`space-y-4 ${cartItems.length > 3 ? "max-h-96 no-scrollbar overflow-y-auto pr-2" : ""}`}
          >
            {cartItems.map((item) => {
              const originalPrice = item?.product?.price || item?.price || 0;
              const internalDiscount =
                item?.product?.discount || item?.discount || 0;
              const isFlash = item?.product?.isFlash && item?.product?.flash;
              const hasLinkedOffer = !!item?.linkedVia;

              let displayPrice = originalPrice;
              let showDiscount = false;
              let isComboDiscount = false;
              let comboDiscountValue = 0;
              let comboDiscountType = "";
              let finalDiscountPercent = 0;

              if (isFlash) {
                const flash = item.product.flash || item.flash;
                if (flash?.discountType === "PERCENT") {
                  displayPrice =
                    originalPrice -
                    (originalPrice * flash.discountValue) / 100;
                  finalDiscountPercent = flash.discountValue;
                } else if (flash?.discountType === "FIXED") {
                  displayPrice = originalPrice - flash.discountValue;
                  finalDiscountPercent =
                    (flash.discountValue / originalPrice) * 100;
                }
                displayPrice = Math.max(displayPrice, 0);
                showDiscount = true;
              } else if (hasLinkedOffer && item.linkedVia?.linkedOfferId) {
                const offer = item.linkedVia.linkedOfferId;
                comboDiscountValue = offer.discountValue;
                comboDiscountType = offer.discountType;
                isComboDiscount = true;

                if (comboDiscountType === "percentage") {
                  const totalDiscountPercent =
                    internalDiscount + comboDiscountValue;
                  displayPrice =
                    originalPrice -
                    (originalPrice * totalDiscountPercent) / 100;
                  finalDiscountPercent = totalDiscountPercent;
                } else if (
                  comboDiscountType === "flat" ||
                  comboDiscountType === "fixed"
                ) {
                  const priceAfterInternal =
                    originalPrice - (originalPrice * internalDiscount) / 100;
                  displayPrice = priceAfterInternal - comboDiscountValue;
                  finalDiscountPercent =
                    ((originalPrice - displayPrice) / originalPrice) * 100;
                }
                displayPrice = Math.max(displayPrice, 0);
                showDiscount = true;
              } else if (internalDiscount > 0) {
                displayPrice =
                  originalPrice - (originalPrice * internalDiscount) / 100;
                displayPrice = Math.max(displayPrice, 0);
                finalDiscountPercent = internalDiscount;
                showDiscount = true;
              }

              displayPrice = Math.round(displayPrice);

              const getComboDiscountText = () => {
                if (comboDiscountType === "percentage") {
                  return `+${comboDiscountValue}%`;
                } else if (
                  comboDiscountType === "flat" ||
                  comboDiscountType === "fixed"
                ) {
                  return `+₹${comboDiscountValue}`;
                }
                return null;
              };

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow mb-3"
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden relative">
                        <Image
                          src={
                            item?.product?.images?.[0] ||
                            item?.images?.[0] ||
                            "/icons/honey-jar.png"
                          }
                          alt={
                            item?.product?.name || item?.name || "Product"
                          }
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>

                      {!isFlash &&
                        internalDiscount > 0 &&
                        !isComboDiscount && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {Math.round(internalDiscount)}%
                          </div>
                        )}

                      {isFlash && showDiscount && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {Math.round(finalDiscountPercent)}%
                        </div>
                      )}

                      {isComboDiscount && !isFlash && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {Math.round(internalDiscount)}%
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                            {item?.product?.name || item?.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item?.product?.weight ||
                              item?.weight ||
                              "Standard weight"}
                          </p>

                          {isComboDiscount && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <GiPresent className="text-[#c1552c] text-xs" />
                              <span className="text-xs bg-[#faf4ea] text-[#c1552c] px-2 py-0.5 rounded-full font-medium">
                                Combo discount {getComboDiscountText()} OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div>
                          {showDiscount ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-[#c1552c] text-base">
                                ₹
                                {(
                                  displayPrice * (item?.quantity || 1)
                                ).toFixed(0)}
                              </span>
                              <span className="text-xs line-through text-gray-400">
                                ₹
                                {(
                                  originalPrice * (item?.quantity || 1)
                                ).toFixed(0)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-800 text-base">
                              ₹
                              {(
                                displayPrice * (item?.quantity || 1)
                              ).toFixed(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-[#c1552c] rounded-lg border border-gray-200 px-2 py-1">
                            <span className="text-sm font-medium">
                              Qty: {item?.quantity || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}