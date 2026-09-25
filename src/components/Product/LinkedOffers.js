
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronRight,
  FaChevronLeft,
  FaFire,
  FaLock,
  FaStar,
} from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import { useCartStore } from "./../../stores/cartStore";

const LinkedOffers = ({ parentProductId, parentProduct }) => {
  const [linkedOffers, setLinkedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const { addToCart, getTotalQuantity } = useCartStore();
  const { user } = useAuth();


  /* ─── Fetch ─── */
  const fetchLinkedOffers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/linked-offer/get-linked-offers-by-product`,
        { productId: parentProductId }
      );

      if (response.data?.offers) {
        setLinkedOffers(response.data.offers);
      }
    } catch (error) {
      console.error("Error fetching linked offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentProductId) {
      fetchLinkedOffers();
    }
  }, [parentProductId]);

  /* ─── Price math (LOGIC FROM FILE 1) ─── */
  // Uses product.price as the base, supports percentage / flat / fixed
  const calculateDiscountedPrice = (product, offer) => {
    const originalPrice = product?.price || 0;
    let discountedPrice = originalPrice;

    if (offer.discountType === "percentage") {
      discountedPrice = Math.round(
        originalPrice - (originalPrice * offer.discountValue) / 100
      );
    } else if (
      offer.discountType === "flat" ||
      offer.discountType === "fixed"
    ) {
      discountedPrice = Math.round(originalPrice - offer.discountValue);
    }

    return Math.max(discountedPrice, 0);
  };

  /* ─── Cart total (LOGIC FROM FILE 1) ─── */
  const getCurrentCartTotal = async () => {
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", {
          userId: user?.id,
        });
        let totalQty = 0;
        if (response.data && Array.isArray(response.data?.cart)) {
          totalQty = response.data.cart.reduce(
            (sum, item) => sum + (item?.quantity || 0),
            0
          );
        }
        return totalQty;
      } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
      }
    } else {
      return getTotalQuantity();
    }
  };

  /* ─── Add to cart (LOGIC FROM FILE 1) ─── */
  const addLinkedItemToCart = async (linkedProduct, offer) => {
    const currentTotal = await getCurrentCartTotal();

    if (currentTotal >= 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please checkout or remove items from cart."
      );
      return;
    }

    try {
      if (user) {
        const response = await apiClient.post("/cart/add-linked-item", {
          userId: user?.id,
          linkedProductId: linkedProduct._id,
          quantity: 1,
          parentProductId: parentProductId,
          linkedOfferId: offer._id,
        });

        if (response.ok) {
          toast.success(
            response.data.message ||
              `${linkedProduct.name} added to cart with special offer!`
          );
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) window.openCartSidebar();
        } else {
          toast.error(response.data.message || "Failed to add item to cart");
        }
      }
      // NOTE: File 1 has no guest fallback — kept as-is for parity
    } catch (error) {
      console.error("Error adding linked item to cart:", error);
      toast.error(error?.response?.data?.message || "Failed to add item to cart");
    }
  };

  /* ─── Scroll ─── */
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="mt-8 pt-6 border-t border-[#E8DFD2] font-serif">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#2b1b12] tracking-wide">
            Special Add-On Offers
          </p>
          <p className="text-xs text-[#7D6F60] mt-1">
            Loading exclusive deals…
          </p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#B85C38] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (linkedOffers.length === 0) return null;

  /* ─── Total savings (LOGIC FROM FILE 1) ─── */
  const totalSavings = linkedOffers.slice(0, 3).reduce((sum, offer) => {
    const originalPrice = offer.linkedProduct.price;
    const discountedPrice = calculateDiscountedPrice(
      offer.linkedProduct,
      offer
    );
    return sum + (originalPrice - discountedPrice);
  }, 0);

  return (
    <div className="mt-8 pt-6 border-t border-[#E8DFD2] font-serif">
      {/* ─── Section header ─── */}
      <div className="mb-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FFF3EB] border border-[#F0DFCF] flex items-center justify-center shrink-0">
          <GiPresent className="text-2xl text-[#B85C38]" />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-[#2b1b12] leading-tight">
            Special Add-On Offers
          </h2>
          <p className="text-xs text-[#7D6F60] font-medium mt-0.5">
            Add these at exclusive prices —{" "}
            <span className="text-[#B85C38] font-bold">
              only with {parentProduct?.name}
            </span>
          </p>

          {/* Total savings line (from FILE 1 logic) */}
          {totalSavings > 0 && (
            <p className="text-[11px] text-[#3D5A45] font-semibold mt-1">
              Save up to ₹{totalSavings} on this bundle
            </p>
          )}
        </div>
      </div>

      {/* ─── Carousel ─── */}
      <div className="relative">
        {linkedOffers.length > 1 && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-[#E8DFD2] hover:shadow-lg hover:bg-[#FFF3EB] transition-all items-center justify-center cursor-pointer"
          >
            <FaChevronLeft className="w-4 h-4 text-[#B85C38]" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {linkedOffers.slice(0, 3).map((offer, index) => {
            /* LOGIC FROM FILE 1 — reads from offer.linkedProduct.price */
            const discountedPrice = calculateDiscountedPrice(
              offer.linkedProduct,
              offer
            );
            const savings = offer.linkedProduct.price - discountedPrice;

            const productImage =
              offer.linkedProduct?.images?.[0] ||
              offer.linkedProduct?.imageUrl?.[0] ||
              "/placeholder.png";

            const labels = ["MOST ADDED", "GREAT CHOICE", "CALMING PICK"];
            const currentLabel = labels[index] || "SPECIAL OFFER";

            return (
              <div
                key={offer._id}
                className="shrink-0 w-[285px] bg-[#FCFAF6] border border-[#E8DFD2] rounded-[20px] p-4 hover:shadow-[0_4px_20px_rgba(58,46,36,0.08)] transition-shadow"
              >
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                      index === 0
                        ? "bg-[#B85C38] text-white"
                        : "bg-[#FFF3EB] text-[#B85C38] border border-[#F0DFCF]"
                    }`}
                  >
                    {index === 0 ? (
                      <FaFire className="text-[10px]" />
                    ) : (
                      <FaStar className="text-[10px]" />
                    )}
                    {currentLabel}
                  </span>
                </div>

                {/* Product row */}
                <div className="flex items-start gap-3">
                  <div className="relative w-[100px] h-[120px] shrink-0 rounded-xl overflow-hidden bg-white border border-[#E8DFD2]/60">
                    <Image
                      src={productImage}
                      alt={offer.linkedProduct?.name || "Product"}
                      fill
                      sizes="100px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-[#2b1b12] leading-5 line-clamp-2">
                      {offer.linkedProduct?.name || "Product"}
                    </h3>
                    <p className="text-[12px] text-[#7D6F60] mt-1">
                      {offer?.linkedProduct?.weight || "100 gm"}
                    </p>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xs text-[#9a8b7a] line-through font-medium">
                        ₹{offer.linkedProduct.price}
                      </span>
                      <span className="text-[20px] font-bold text-[#3D5A45]">
                        ₹{discountedPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings pill */}
                <div className="mt-3 bg-[#F5F1E8] rounded-xl py-1.5 text-center">
                  <span className="text-[13px] font-semibold text-[#B85C38]">
                    You save ₹{savings}
                  </span>
                </div>

                {/* Trust line */}
                <div className="flex items-center gap-1.5 mt-2 text-[#7D6F60]">
                  <FaLock className="w-3 h-3" />
                  <span className="text-[11px] font-medium">
                    Only with this order
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addLinkedItemToCart(offer.linkedProduct, offer);
                  }}
                  className={`w-full mt-4 h-10 cursor-pointer rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    index === 0
                      ? "bg-gradient-to-r from-[#B85C38] to-[#c1552c] text-white shadow-md hover:from-[#a44d2e] hover:to-[#a84320]"
                      : "bg-white border-2 border-[#B85C38] text-[#B85C38] hover:bg-[#FFF3EB]"
                  }`}
                >
                  + Add for ₹{discountedPrice}
                </button>
              </div>
            );
          })}
        </div>

        {linkedOffers.length > 1 && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-[#E8DFD2] hover:shadow-lg hover:bg-[#FFF3EB] transition-all items-center justify-center cursor-pointer"
          >
            <FaChevronRight className="w-4 h-4 text-[#B85C38]" />
          </button>
        )}
      </div>

      {/* ─── Footnote ─── */}
      <div className="mt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#FFF9F2] border border-[#F0DFCF] px-4 py-3">
          <FiTag className="text-[#B85C38] text-lg shrink-0" />
          <p className="text-[13px] font-medium text-[#4a3f34] leading-snug">
            These add-on prices are not available when bought separately.
          </p>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LinkedOffers;