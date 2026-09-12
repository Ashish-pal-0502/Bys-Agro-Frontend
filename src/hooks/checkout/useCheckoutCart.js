"use client";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import apiClient from "./../../api/client";
import { deduplicateCartItems } from "./../../utility/checkout/cartHelpers";

export function useCheckoutCart({ user, router }) {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  const fetchCartData = useCallback(async () => {
    if (!user) return;

    try {
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let items = [];
      if (response.data) {
        if (Array.isArray(response.data.cart)) items = response.data.cart;
        else if (Array.isArray(response.data.items)) items = response.data.items;
        else if (response.data.cart) items = response.data.cart;
      }

      if (items.length === 0) {
        toast.error("Your cart is empty");
        router.push("/");
        return;
      }

      const deduplicatedItems = deduplicateCartItems(items);

      const calculatedSubtotal = deduplicatedItems.reduce((sum, item) => {
        const originalPrice = item?.product?.price || 0;
        const quantity = item?.quantity || 0;
        const discount = item?.product?.discount || 0;
        const isFlash = item?.product?.isFlash && item?.product?.flash;

        let finalPrice = originalPrice;

        if (isFlash) {
          const flash = item.product.flash;
          if (flash.discountType === "PERCENT") {
            finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
          } else if (flash.discountType === "FIXED") {
            finalPrice = finalPrice - flash.discountValue;
          }
        } else if (discount > 0) {
          finalPrice = finalPrice - (finalPrice * discount) / 100;
        }

        finalPrice = Math.max(finalPrice, 0);
        return sum + Math.round(finalPrice) * quantity;
      }, 0);

      const originalSubtotal = deduplicatedItems.reduce(
        (sum, item) =>
          sum + (item?.product?.price || 0) * (item?.quantity || 0),
        0,
      );

      const calculatedShipping = calculatedSubtotal > 500 ? 0 : 50;

      setCartItems(deduplicatedItems);
      setSubtotal(calculatedSubtotal);
      setOriginalSubtotal(originalSubtotal);
      setShipping(calculatedShipping);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart information");
    }
  }, [user, router]);

  const applyLinkedDiscountsToCart = useCallback(async () => {
    try {
      const response = await apiClient.post("/cart/apply-linked-discounts", {
        userId: user?.id,
      });

      if (response.data) {
        setBackendTotals({
          totalMRP: response.data.totalMRP || 0,
          totalComboDiscount: response.data.totalComboDiscount || 0,
          totalMRPDiscount: response.data.totalMRPDiscount || 0,
          grandTotal: response.data.grandTotal || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cart totals:", error);
    }
  }, [user]);

  // ✅ Fetch cart on mount / user change
  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // ✅ Apply linked discounts whenever user or cart items change
  useEffect(() => {
    if (user) {
      applyLinkedDiscountsToCart();
    }
  }, [user, cartItems, applyLinkedDiscountsToCart]);

  // ✅ Listen for external cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        fetchCartData();
        applyLinkedDiscountsToCart();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user, fetchCartData, applyLinkedDiscountsToCart]);

  return {
    cartItems,
    subtotal,
    originalSubtotal,
    shipping,
    backendTotals,
    setCartItems,
    setShipping,
    fetchCartData,
    applyLinkedDiscountsToCart,
  };
}