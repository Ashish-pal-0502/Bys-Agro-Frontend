"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay";
import {
  calculateFinalTotal,
  calculateItemsFinalPrice,
} from "../../utility/checkout/calculations";
import { calculateTotalWeight } from "../../utility/checkout/weight";
import apiClient from "./../../api/client";
import AuthContext from "./../../auth/context";
import useAuth from "./../../auth/useAuth";
import AddressSection from "./../../components/Checkout/AddressSection";
import CartItemsList from "./../../components/Checkout/CartItemsList";
import ContactSection from "./../../components/Checkout/ContactSection";
import CouponSection from "./../../components/Checkout/CouponSection";
import PaymentMethodSelector from "./../../components/Checkout/PaymentMethodSelector";
import PriceBreakdown from "./../../components/Checkout/PriceBreakdown";
import { useCheckoutCart } from "./../../hooks/checkout/useCheckoutCart";
import { useCheckoutUser } from "./../../hooks/checkout/useCheckoutUser";
import { useCodAvailability } from "./../../hooks/checkout/useCodAvailability";
import { useCoupon } from "./../../hooks/checkout/useCoupon";
import { useDeliveryPrices } from "./../../hooks/checkout/useDeliveryPrices";
import { useCartStore } from "./../../stores/cartStore";
import { calculateDeliveryFee } from "./../../utility/checkout/shipping";
import { validateCheckoutForm } from "./../../utility/checkout/validators";
import Loader from "./../../utility/Loader";

export default function CheckoutContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { openLoginModal } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [originalShippingCharges, setOriginalShippingCharges] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("online payments");
  const [shippingCharges, setShippingCharges] = useState({});
  const { error, Razorpay } = useRazorpay();
  const [errors, setErrors] = useState({});
  const [phoneHelperText, setPhoneHelperText] = useState("");
  // Form states
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [deliveryFee, setDeliveryFee] = useState(0);

  const {
    cartItems,
    subtotal,
    backendTotals,
    setShipping,
    fetchCartData,
    applyLinkedDiscountsToCart,
  } = useCheckoutCart({ user, router });

  const validateForm = () => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discountAmount,
    couponError,
    setCouponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCoupon({
    userId: user?.id,
    cartTotal: backendTotals.grandTotal,
  });

  const { deliveryPrices, extraDiscount, codHandlingCharge } =
    useDeliveryPrices(paymentMethod);

  const { isCodAvailable, checkingCod } = useCodAvailability({
    zipCode: formData.zipCode,
    cartItems,
    paymentMethod,
  });
  const { userData, isAddressSaving, getUser, updateUserDetails } =
    useCheckoutUser({ user, formData, setFormData, validateForm });

  const localTotals = {
    totalMRPDiscount: 100,
  };
  const discount = discountAmount || 0;

  const finalTotal = calculateFinalTotal({
    grandTotal: backendTotals.grandTotal,
    deliveryFee,
    codHandlingCharge,
    extraDiscount,
    couponDiscount: discount,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("redirectToCheckout")) {
      localStorage.removeItem("redirectToCheckout");
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [user]);

  useEffect(() => {
    getShippingCharges();
  }, [user, formData?.zipCode, cartItems, paymentMethod]);

  useEffect(() => {
    const cartTotal = backendTotals.grandTotal;

    const fee = calculateDeliveryFee(cartTotal, deliveryPrices);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, deliveryPrices]);

  const handleNoShippingOptions = () => {
    let calculatedShipping = subtotal > 500 ? 0 : 50;
    if (calculatedShipping > 0) {
      calculatedShipping = 80;
    }

    setShipping(calculatedShipping);
    setShippingCharges({
      cost: calculatedShipping,
      name: "Standard Shipping",
      delivery_days: "5-7",
      delivery_hours: "Estimated",
    });
  };

  const getShippingCharges = async () => {
    if (
      !formData?.zipCode ||
      formData.zipCode.length !== 6 ||
      cartItems.length === 0
    ) {
      return;
    }

    const weightInGrams = await calculateTotalWeight(cartItems);
    const weightInKg = weightInGrams / 1000;

    const orderItems = cartItems.map((item) => {
      const isCartItem = !!item.product;
      const productData = isCartItem ? item.product : item;
      const quantity = item?.quantity || 1;

      let finalPrice = productData?.price || 0;
      const originalPrice = productData?.price || 0;

      const discount = productData?.discount || 0;
      const isFlash = productData?.isFlash && productData?.flash;
      const flashId = isFlash ? productData.flash._id : null;

      if (isFlash) {
        const flash = productData.flash;
        if (flash.discountType === "PERCENT") {
          finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
        } else if (flash.discountType === "FIXED") {
          finalPrice = finalPrice - flash.discountValue;
        }
      } else if (discount > 0) {
        finalPrice = finalPrice - (finalPrice * discount) / 100;
      }

      finalPrice = Math.max(finalPrice, 0);

      return {
        name: productData?.name || "Product",
        qty: quantity,
        image: productData?.images?.[0] || "/icons/honey-jar.png",
        price: originalPrice,
        finalPrice: finalPrice,
        product: productData?._id,
        flashId: flashId,
        isCombo: productData?.isCombo || false,
        itemWeight: parseFloat(productData?.weight || 0),
        weight: parseFloat(
          productData?.packageWeight || productData?.weight || 0,
        ),
        height: productData?.height || 0,
        length: productData?.length || 0,
        width: productData?.width || 0,
      };
    });

    try {
      const response = await apiClient.post(
        "/shipping/calculate-shipping-cost-for-order",
        {
          orderItems: orderItems,
          deliveryPincode: formData.zipCode,
          total: finalTotal,
          weight: weightInKg.toString(),
          paymentMethod:
            paymentMethod === "online payments" ? "PREPAID" : "COD",
        },
      );

      if (response.ok) {
        const shippingData = response.data;

        setOriginalShippingCharges(shippingData?.totalShippingCost);

        let selectedShipping = null;

        if (shippingData?.cheapest?.cost !== undefined) {
          selectedShipping = shippingData.cheapest;
        } else if (shippingData?.fastest?.cost !== undefined) {
          selectedShipping = shippingData.fastest;
        } else if (shippingData?.recommended?.cost !== undefined) {
          selectedShipping = shippingData.recommended;
        }

        const hasFreeDelivery = selectedShipping?.delivery === true;

        if (selectedShipping) {
          if (hasFreeDelivery) {
            selectedShipping.cost = 0;
          }

          if (selectedShipping.cost > 0) {
            selectedShipping.cost = 80;
          }

          setShippingCharges(selectedShipping);
          setShipping(selectedShipping.cost || 0);
        } else {
          handleNoShippingOptions();
        }
      } else {
        handleNoShippingOptions();
      }
    } catch (error) {
      console.error("Error fetching shipping charges:", error);
      handleNoShippingOptions();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);

    if (value.length === 1 && !/^[6-9]/.test(value)) {
      value = "";
    } else if (value.length > 1) {
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleZipCodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      zipCode: value,
    }));

    if (errors.zipCode) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "",
      }));
    }

    if (value.length === 6) {
      await fetchPincodeDetails(value);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    setIsFetchingPincode(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      if (response.ok) {
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const firstPostOffice = data[0].PostOffice[0];

          setFormData((prev) => ({
            ...prev,
            city:
              firstPostOffice.District || firstPostOffice.Block || prev.city,
            state: firstPostOffice.State || prev.state,
            address: firstPostOffice.Name || prev.address,
          }));

          toast.success("City & State auto-filled!");
        } else {
          console.log("No pincode data found");
        }
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openLoginModal();
      return;
    }
    if (!validateForm()) {
      return;
    }

    const addressSaved = await updateUserDetails();
    if (!addressSaved) return;

    if (!shippingCharges?.cost && shippingCharges?.cost !== 0) {
      toast.error("Please wait for shipping calculation to complete");
      return;
    }

    const weightInGrams = await calculateTotalWeight(cartItems);
    const weightInKg = weightInGrams / 1000;

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => {
        const isCartItem = !!item.product;
        const productData = isCartItem ? item.product : item;
        const quantity = item?.quantity || 1;

        let finalPrice = productData?.price || 0;
        const originalPrice = productData?.price || 0;

        const discount = productData?.discount || 0;
        const isFlash = productData?.isFlash && productData?.flash;
        const flashId = isFlash ? productData.flash._id : null;

        if (isFlash) {
          const flash = productData.flash;
          if (flash.discountType === "PERCENT") {
            finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
          } else if (flash.discountType === "FIXED") {
            finalPrice = finalPrice - flash.discountValue;
          }
        } else if (discount > 0) {
          finalPrice = finalPrice - (finalPrice * discount) / 100;
        }

        finalPrice = Math.max(finalPrice, 0);
        finalPrice = Math.round(finalPrice);

        return {
          name: productData?.name || "Product",
          qty: quantity,
          image: productData?.images?.[0] || "/icons/honey-jar.png",
          price: originalPrice,
          finalPrice: finalPrice,
          product: productData?._id,
          flashId: flashId,
          isCombo: productData?.isCombo || false,
          itemWeight: parseFloat(productData?.weight || 0),
          weight: parseFloat(
            productData?.packageWeight || productData?.weight || 0,
          ),
          height: productData?.height || 0,
          length: productData?.length || 0,
          width: productData?.width || 0,
        };
      });

      const shippingAddress = {
        area: formData.area || "",
        city: formData.city || "",
        landmark: formData.landmark || "",
        mobileNumber: formData.phone || "",
        email: formData.email || "",
        pincode: formData.zipCode || "",
        state: formData.state || "",
      };

      const ItemsFinalPrice = calculateItemsFinalPrice(cartItems);

      const orderData = {
        orderItems,
        courierId: shippingCharges?.courier_id,
        courierName: shippingCharges?.courier_name,
        shippingAddress,
        shippingPrice: deliveryFee,
        paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
        totalWeight: weightInKg,
        itemsPrice: Number(ItemsFinalPrice),
        totalPrice: Number(finalTotal),
        userId: user?.id,
        freeDelivery: deliveryFee === 0,
        discount: discount,
        couponCode: appliedCoupon?.code || null,
        extraDiscount: extraDiscount,
        codHandlingCharge: codHandlingCharge,
      };

      // console.log("pyaload", orderData);

      const response = await apiClient.post("/order/create-order", orderData);

      if (response.ok) {
        const orderData = response.data.orders[0];

        if (paymentMethod === "cash on delivery") {
          await apiClient.delete("/cart/clear", {
            userId: user?.id,
          });

          useCartStore.getState().clearCart();
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          localStorage.removeItem("buyNowItem");

          toast.success("Order placed successfully!");

          router.replace(`/checkout/success?orderId=${orderData._id}`);

          return;
        }

        const result = await createRazorpayOrder(finalTotal);
        const options = {
          key: result?.data?.notes?.key,
          amount: finalTotal,
          currency: "INR",
          name: "Bys Agro.",
          description: "Order Transaction",
          image: "https://bysagro.com/LogoR.webp",
          order_id: result?.data?.id,
          handler: async (res) => {
            try {
              const orderIds = response.data.orders.map((order) => order._id);
              await verifyOrder(orderIds, {
                razorpay_order_id: res?.razorpay_order_id,
                razorpay_payment_id: res?.razorpay_payment_id,
                razorpay_signature: res?.razorpay_signature,
              });
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(
                "We couldn't confirm your payment. Please contact support.",
              );
            }
          },
          prefill: {
            email: user?.email,
            name: user?.name,
          },
          theme: {
            color: "#E56A5C",
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
      } else {
        toast.error(response.data.message || "Order not placed!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOrder = async (orderIds, razorpayPayload) => {
    const idsArray = Array.isArray(orderIds) ? orderIds : [orderIds];

    const response = await apiClient.post("/order/verify-order", {
      orderIds: idsArray,
      razorpay_order_id: razorpayPayload.razorpay_order_id,
      razorpay_payment_id: razorpayPayload.razorpay_payment_id,
      razorpay_signature: razorpayPayload.razorpay_signature,
    });

    const serverStatus = response?.data?.paymentStatus;

    if (response.ok && serverStatus === "completed") {
      await apiClient.delete("/cart/clear", { userId: user?.id });
      useCartStore.getState().clearCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      localStorage.removeItem("buyNowItem");

      toast.success("Order placed successfully!");
      router.replace(`/checkout/success?orderId=${idsArray[0]}`);
    } else if (serverStatus === "failed") {
      toast.error("Payment failed. Please try again.");
    } else {
      toast.error("Payment is being verified. Check 'My Orders' in a moment.");
      router.replace("/orders");
    }
  };

  const createRazorpayOrder = async (finalTotal) => {
    try {
      const response = await apiClient.get("/order/payment", {
        userId: user?.id,
        total: Math.round(finalTotal),
      });

      if (response?.ok) {
        return response;
      } else {
        toast.error(
          response?.data?.message || "Failed to create Razorpay order",
        );
        return null;
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Failed to create Razorpay order");
      return null;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif">
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-7xl mx-auto">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-[#E56A5C] rounded-full opacity-10"
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(i) * 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-2 lg:py-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-20 space-y-3">
                <ContactSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handlePhoneChange={handlePhoneChange}
                  errors={errors}
                  phoneHelperText={phoneHelperText}
                  setFormData={setFormData}
                />

                <AddressSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleZipCodeChange={handleZipCodeChange}
                  errors={errors}
                  isFetchingPincode={isFetchingPincode}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-8"
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-4">
                    <h3 className="text-lg md:text-2xl font-semibold text-[#2b1b12] mb-6 text-center">
                      Order Summary
                    </h3>

                    <CartItemsList
                      cartItems={cartItems}
                      isCartOpen={isCartOpen}
                      onToggle={() => setIsCartOpen(!isCartOpen)}
                    />

                    <CouponSection
                      appliedCoupon={appliedCoupon}
                      couponCode={couponCode}
                      setCouponCode={setCouponCode}
                      couponError={couponError}
                      setCouponError={setCouponError}
                      isApplyingCoupon={isApplyingCoupon}
                      handleApplyCoupon={handleApplyCoupon}
                      handleRemoveCoupon={handleRemoveCoupon}
                    />

                    <PriceBreakdown
                      user={user}
                      backendTotals={backendTotals}
                      localTotals={localTotals}
                      formData={formData}
                      deliveryFee={deliveryFee}
                      codHandlingCharge={codHandlingCharge}
                      extraDiscount={extraDiscount}
                      discount={discount}
                      appliedCoupon={appliedCoupon}
                      finalTotal={finalTotal}
                      paymentMethod={paymentMethod}
                      deliveryPrices={deliveryPrices}
                    />

                    <PaymentMethodSelector
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      isCodAvailable={isCodAvailable}
                      checkingCod={checkingCod}
                      formData={formData}
                    />

                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                      className="w-full bg-[#c1552c] cursor-pointer text-white py-4 rounded-4xl font-bold text-lg shadow-lg mb-4 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#a84824]"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10">
                            Pay ₹{finalTotal.toFixed(0)}
                          </span>
                          <motion.div
                            className="absolute inset-0 cursor-pointer bg-[#a84824]"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </>
                      )}
                    </motion.button>

                    <div className="mt-2 pt-2 border-t border-[#e6ded2]">
                      <p className="text-center text-sm text-gray-600 ">
                        Your Personal Information Is Securely Protected
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
