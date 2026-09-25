

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import apiClient from "./../../../api/client";
import { useCartStore } from "./../../../stores/cartStore";
import useAuth from "./../../../auth/useAuth";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  // console.log(" order id", orderId)

  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const response = await apiClient.get("/order/myorders-details", {
        id: orderId,
      });

      // console.log("response fetch order", response)

      if (response.ok || response.data) {
        setOrder(response.data);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Error loading order details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    window.history.replaceState(null, "", "/checkout/success");
  }, []);

  //  Clear cart on the success page — after checkout has fully unmounted
  useEffect(() => {
    const clearCart = async () => {
      try {
        if (user?.id) {
         const res =  await apiClient.delete("/cart/clear", { userId: user.id });
        }
      } catch (err) {
        console.error("Failed to clear cart on server:", err);
      } finally {
        useCartStore.getState().clearCart();
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        localStorage.removeItem("buyNowItem");
      }
    };

    clearCart();
  }, [user?.id]);

  const handleNavigateToOrders = () => {
    router.replace("/orders");
  };

  const handleNavigateToHome = () => {
    router.replace("/all-products");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf4ea] font-serif flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-[#c1552c] animate-spin mx-auto mb-4" />
          <p className="text-[#2b1b12]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf4ea] font-serif flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#e6ded2] p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#2b1b12] mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleNavigateToHome}
            className="w-full bg-[#c1552c] cursor-pointer text-white py-3 rounded-2xl font-semibold hover:bg-[#a84824] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#e6ded2] p-8 md:p-12 max-w-md w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <IoCheckmarkCircle className="w-14 h-14 text-green-500" />
          </motion.div>

          <h1 className="text-3xl font-bold text-[#2b1b12] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[#655849] mb-6">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          {orderId && (
            <div className="bg-[#faf4ea] border border-[#e6ded2] rounded-2xl p-4 mb-6">
              <p className="text-sm text-[#8a8179]">Order ID</p>
              <p className="font-bold text-[#2b1b12]">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={handleNavigateToOrders}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#c1552c] cursor-pointer text-white py-3 rounded-2xl font-semibold hover:bg-[#a84824] transition-colors"
            >
              View Order Details
            </motion.button>

            <button
              onClick={handleNavigateToHome}
              className="w-full border-2 cursor-pointer border-[#c1552c] text-[#c1552c] py-3 rounded-2xl font-semibold hover:bg-[#faf4ea] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}