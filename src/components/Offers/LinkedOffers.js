"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronRight,FaChevronLeft, FaFire, FaLock, FaStar } from "react-icons/fa";
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


  const fetchLinkedOffers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/linked-offer/get-linked-offers-by-product`,
        {
          productId: parentProductId,
        },
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

  const calculateDiscountedPrice = (product, offer) => {
    const originalPrice = product.price;
    let discountedPrice = originalPrice;

    if (offer.discountType === "percentage") {
      discountedPrice = Math.round(
        originalPrice - (originalPrice * offer.discountValue) / 100,
      );
    } else if (
      offer.discountType === "flat" ||
      offer.discountType === "fixed"
    ) {
      discountedPrice = Math.round(originalPrice - offer.discountValue);
    }

    return Math.max(discountedPrice, 0);
  };

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
            0,
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

  const addLinkedItemToCart = async (linkedProduct, offer) => {
    const currentTotal = await getCurrentCartTotal();

    if (currentTotal >= 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please checkout or remove items from cart.",
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
              `${linkedProduct.name} added to cart with special offer!`,
          );
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) window.openCartSidebar();
        } else {
          toast.error(response.data.message || "Failed to add item to cart");
        }
      }
    } catch (error) {
      console.error("Error adding linked item to cart:", error);
      toast.error(response.data.message || "Failed to add item to cart");
    }
  };

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

  if (loading) {
    return (
      <div className="mt-6 pt-4 border-t border-[#EFE7E2]">
        <div className="mb-3">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            Special Add-On Offers
          </p>
          <p className="text-xs text-[#666] mt-1">Loading exclusive deals...</p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#E65A20] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (linkedOffers.length === 0) {
    return null;
  }

  const totalSavings = linkedOffers.slice(0, 3).reduce((sum, offer) => {
    const originalPrice = offer.linkedProduct.price;
    const discountedPrice = calculateDiscountedPrice(
      offer.linkedProduct,
      offer,
    );
    return sum + (originalPrice - discountedPrice);
  }, 0);

  return (
    <div className="mt-6 pt-4 border-t font-figtree border-[#EFE7E2]">
      <div className="mb-5 flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#FFF6EA] flex items-center justify-center text-[28px]">
          <GiPresent className="text-3xl text-[#E86D2D]" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#1E1E1E] leading-tight">
            Special Add-On Offers
          </h2>

          <p className="text-xs text-[#555] font-medium">
            Add these at exclusive prices –
            <span className="text-[#E86D2D] font-bold">
              {" "}
              Only with {parentProduct?.name}
            </span>
          </p>
        </div>
      </div>

      <div className="relative">
       {linkedOffers.length > 1 && (
  <button
    onClick={() => scroll("left")}
    className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-gray-200 hover:shadow-lg transition-all items-center justify-center"
  >
    <FaChevronLeft className="w-4 h-4 text-black" />
  </button>
)}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {linkedOffers.slice(0, 3).map((offer, index) => {
            const discountedPrice = calculateDiscountedPrice(
              offer.linkedProduct,
              offer,
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
                className="shrink-0 w-71.25 bg-white border border-[#EAEAEA] rounded-[20px] p-4"
              >
                <div className="mb-5">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium ${
                      index === 0
                        ? "bg-[#5FAD67] text-white"
                        : "bg-[#FBF5E7] text-[#5E5547]"
                    }`}
                  >
                    {index === 0 && <FaFire className="text-sm" />}
                    {index !== 0 && <FaStar className="text-sm" />}
                    {currentLabel}
                  </span>
                </div>

                <div className="flex items-start font-figtree ">
                  <div className="relative w-27.5 h-32.5 shrink-0">
                    <Image
                      src={productImage}
                      alt={offer.linkedProduct.name}
                      fill
                      sizes="110px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-[#212121] leading-6">
                      {offer.linkedProduct.name}
                    </h3>

                    <p className="text-[14px] text-[#787878] mt-2">
                      {offer?.linkedProduct?.weight || "100 gm"}
                    </p>

                    <div className="flex items-center gap-3 mt-5">
                      <span className="text-sm text-[#707070] line-through font-semibold">
                        ₹{offer.linkedProduct.price}
                      </span>

                      <span className="text-[22px] font-bold text-[#2E7D32]">
                        ₹{discountedPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 bg-[#F7F7F2] rounded-xl py-2 text-center">
                  <span className="text-p2-mobile font-semibold text-[#4C8C55]">
                    You save ₹{savings}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 text-[#666]">
                  <FaLock className="w-4 h-4" />
                  <span className="text-[14px] font-medium">
                    Only with this order
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addLinkedItemToCart(offer.linkedProduct, offer);
                  }}
                  className={`w-full mt-6 h-12 cursor-pointer font-figtree rounded-xl text-sm font-medium transition-all ${
                    index === 0
                      ? "bg-[#177A36] text-white"
                      : "bg-white border-2 border-[#177A36] text-[#177A36]"
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
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1.5 border border-gray-200 hover:shadow-lg transition-all hidden md:flex items-center justify-center"
          >
            <FaChevronRight className="w-4 h-4 text-black" />
          </button>
        )} 
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#FDF8EE] border border-[#F4E8CC] px-4 py-3">
          <FiTag className="text-[#E8A23A] text-xl shrink-0" />

          <p className="text-sm font-medium text-[#4A4A4A]">
            These add-on prices are not available <br /> when bought separately.
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
