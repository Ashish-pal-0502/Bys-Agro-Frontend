"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import { useCartStore } from "./../../stores/cartStore";

const CompactLinkedOffers = ({
  parentProductId,
  parentProduct,
  onAddSuccess,
}) => {
  const [linkedOffers, setLinkedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getTotalQuantity } = useCartStore();
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
        setLinkedOffers(response.data.offers.slice(0, 3));
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

          if (onAddSuccess) {
            await onAddSuccess();
          }
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) window.openCartSidebar();
        } else {
          toast.error(response.data.message || "Failed to add item to cart");
        }
      }
    } catch (error) {
      console.error("Error adding linked item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E56A5C] border-t-transparent"></div>
      </div>
    );
  }

  if (linkedOffers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {linkedOffers.map((offer) => {
          const discountedPrice = calculateDiscountedPrice(
            offer.linkedProduct,
            offer,
          );
          const savings = offer.linkedProduct.price - discountedPrice;

          return (
            <div
              key={offer._id}
              className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={offer.linkedProduct?.images?.[0] || "/placeholder.png"}
                  alt={offer.linkedProduct.name}
                  fill
                  sizes="48px"
                  className="object-contain rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                  {offer.linkedProduct.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                  <span className="text-[10px] line-through text-gray-400">
                    ₹{offer.linkedProduct.price}
                  </span>
                  <span className="text-xs font-bold text-[#E56A5C]">
                    ₹{discountedPrice}
                  </span>
                  <span className="text-[9px] text-green-600 font-medium">
                    Save ₹{savings}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addLinkedItemToCart(offer.linkedProduct, offer)}
                className="shrink-0 text-xs bg-[#E56A5C] hover:bg-[#c1552c] text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400">
        <FaLock className="w-2 h-2" />
        <span>Only with this order</span>
      </div>
    </div>
  );
};

export default CompactLinkedOffers;