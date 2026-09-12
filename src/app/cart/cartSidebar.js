
"use client";

import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaMoneyCheck } from "react-icons/fa6";
import { GiPresent } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import CompactLinkedOffers from "./../../components/Offers/CompactLinkedOffers";
import { useCartStore } from "./../../stores/cartStore";
import {
  LoadingCart,
  EmptyCart,
  CartItemRow,
  CartBreakdown,
} from "./../../components/Cart/CartSections";

export default function CartSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const {
    cart: localCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    syncCartToBackend,
  } = useCartStore();

  const [backendCartData, setBackendCartData] = useState([]);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [codDeliveryPrices, setCodDeliveryPrices] = useState(null);
  const [prepaidDeliveryPrices, setPrepaidDeliveryPrices] = useState(null);
  const [activeDiscountType, setActiveDiscountType] = useState(null);

  // offers states
  const [selectedParentForOffers, setSelectedParentForOffers] = useState(null);
  const [showLinkedOffers, setShowLinkedOffers] = useState(true);
  const [availableParents, setAvailableParents] = useState([]);
  const [isCheckingOffers, setIsCheckingOffers] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true);

  // backend discount states
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  // Merge local and backend carts
  const cartData = user ? backendCartData : localCart;

  const getLocalCartTotals = () => {
    if (!Array.isArray(localCart) || localCart.length === 0) {
      return {
        totalMRP: 0,
        totalMRPDiscount: 0,
        totalComboDiscount: 0,
        grandTotal: 0,
      };
    }

    let totalMRP = 0;
    let totalMRPDiscount = 0;

    localCart.forEach((item) => {
      const price = item?.product?.price || 0;
      const discount = item?.product?.discount || 0;
      const qty = item?.quantity || 1;

      totalMRP += price * qty;
      totalMRPDiscount += ((price * discount) / 100) * qty;
    });

    const grandTotal = totalMRP - totalMRPDiscount;

    return {
      totalMRP,
      totalMRPDiscount,
      totalComboDiscount: 0,
      grandTotal,
    };
  };

  const getTotalCartQuantity = () => {
    if (!Array.isArray(cartData)) return 0;
    return cartData.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  const localTotals = getLocalCartTotals();

  // ─────────────────────────────────────────────
  // Fetch cart — silent mode avoids showing loader on refetches
  // ─────────────────────────────────────────────
  const getCartCount = async ({ silent = false } = {}) => {
    if (!user) return;

    try {
      if (!silent) setIsInitialLoad(true);
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let backendItems = [];
      if (response.data && Array.isArray(response.data?.cart)) {
        backendItems = response.data.cart;
      } else if (response.data && Array.isArray(response.data.items)) {
        backendItems = response.data.items;
      } else if (response.data && response.data.cart) {
        backendItems = response.data.cart || [];
      }

      setBackendCartData(backendItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setBackendCartData([]);
    } finally {
      setIsInitialLoad(false);
    }
  };

  const checkLinkedOffersForCart = async () => {
    if (!user || cartData.length === 0) return;

    setIsCheckingOffers(true);
    try {
      const parentsWithOffers = [];

      for (const item of cartData) {
        const response = await apiClient.get(
          "/linked-offer/get-linked-offers-by-product",
          {
            productId: item.product._id,
          },
        );

        if (response.data?.offers?.length > 0) {
          parentsWithOffers.push({
            productId: item.product._id,
            product: item.product,
            offers: response.data.offers,
          });
        }
      }

      setAvailableParents(parentsWithOffers);
      if (parentsWithOffers.length > 0) {
        setSelectedParentForOffers(parentsWithOffers[0]);
        setShowLinkedOffers(true);
      } else {
        setShowLinkedOffers(false);
      }
    } catch (error) {
      console.error("Error checking linked offers:", error);
    } finally {
      setIsCheckingOffers(false);
    }
  };

  const applyLinkedDiscountsToCart = async () => {
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
  };

  const getDeliveryPrices = async () => {
    try {
      const prepaidResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "PREPAID",
      });

      const codResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "COD",
      });

      let prepaidData = null;
      let codData = null;

      if (prepaidResponse.ok && prepaidResponse.data?.data) {
        prepaidData = prepaidResponse.data.data;
        setPrepaidDeliveryPrices(prepaidData);
      }

      if (codResponse.ok && codResponse.data?.data) {
        codData = codResponse.data.data;
        setCodDeliveryPrices(codData);
      }

      if (prepaidData && prepaidData.extraDiscount > 0) {
        setDeliveryPrices(prepaidData);
        setExtraDiscount(prepaidData.extraDiscount || 0);
        setCodHandlingCharge(0);
        setActiveDiscountType("PREPAID");
      } else if (codData && codData.extraDiscount > 0) {
        setDeliveryPrices(codData);
        setExtraDiscount(codData.extraDiscount || 0);
        setCodHandlingCharge(codData.codHandlingCharge || 0);
        setActiveDiscountType("COD");
      } else {
        setDeliveryPrices(prepaidData || codData || null);
        setExtraDiscount(0);
        setCodHandlingCharge(0);
        setActiveDiscountType(null);
      }
    } catch (error) {
      console.error("Error fetching delivery prices:", error);
    }
  };

  const calculateDeliveryFee = (cartTotal) => {
    if (!deliveryPrices) return 0;

    const { feeStrategy, feeAmount, freeThreshold } = deliveryPrices;

    if (feeStrategy === "FREE") {
      return 0;
    } else if (feeStrategy === "CONDITIONAL") {
      return cartTotal >= freeThreshold ? 0 : feeAmount;
    } else if (feeStrategy === "FIXED") {
      return feeAmount;
    }

    return 0;
  };

  const removeSingleItemFromCart = async (item) => {
    if (user) {
      const response = await apiClient.delete("/cart/remove", {
        cartItemId: item._id,
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        getCartCount({ silent: true });
        applyLinkedDiscountsToCart();
        checkLinkedOffersForCart();
        toast.success(response.data.message || "Done!");
      }
    } else {
      removeFromCart(item._id);
      toast.success("Item removed from cart!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  const handleQuantityChange = async (
    cartItem,
    newQuantity,
    currentQuantity,
  ) => {
    if (newQuantity < 1) return;

    const currentTotalQuantity = getTotalCartQuantity();
    const quantityDifference = newQuantity - currentQuantity;
    const newTotalQuantity = currentTotalQuantity + quantityDifference;

    if (newQuantity > currentQuantity && newTotalQuantity > 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please remove some items before adding more.",
      );
      return;
    }

    if (newQuantity > currentQuantity && newQuantity > 4) {
      toast.error(
        "You can add maximum 4 items of the same product. For larger quantities, please create another order.",
      );
      return;
    }

    if (newQuantity > currentQuantity) {
      const availableStock = cartItem?.product?.countInStock?.quantity || 0;
      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    setUpdatingItem(cartItem?._id);

    try {
      if (user) {
        const type = newQuantity > currentQuantity ? "increment" : "decrement";

        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: {
            product: cartItem?.product?._id,
            qty: Math.abs(newQuantity - currentQuantity),
          },
          type: type,
        });

        if (response.ok) {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          getCartCount({ silent: true });
          toast.success(
            response.data.message ||
              `Quantity ${type === "increment" ? "increased" : "decreased"}!`,
          );
        } else {
          toast.error("Failed to update quantity");
        }
      } else {
        if (newQuantity > currentQuantity) {
          increaseQty(cartItem?._id);
        } else {
          decreaseQty(cartItem?._id);
        }
        toast.success(`Quantity updated!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const refreshCartData = async () => {
    if (user) {
      await getCartCount({ silent: true });
      await applyLinkedDiscountsToCart();
      await checkLinkedOffersForCart();
    }
  };

  const handleCheckout = () => {
    if (!user) {
      onClose();
      localStorage.setItem("redirectToCheckout", "true");
      return;
    }

    router.push("/checkout");
    onClose();
  };

  useEffect(() => {
    if (user && cartData.length > 0) {
      checkLinkedOffersForCart();
    } else {
      setShowLinkedOffers(false);
      setAvailableParents([]);
      setSelectedParentForOffers(null);
    }
  }, [user, cartData]);

  useEffect(() => {
    if (user && localCart.length > 0) {
      const syncCart = async () => {
        const success = await syncCartToBackend(user.id, apiClient);
        if (success) {
          getCartCount({ silent: true });
        }
      };
      syncCart();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getCartCount(); // ← initial load (non-silent)
    } else {
      setIsInitialLoad(false);
    }
  }, [user]);

  useEffect(() => {
    getDeliveryPrices();
  }, []);

  useEffect(() => {
    if (user && backendCartData.length > 0) {
      applyLinkedDiscountsToCart();
    }
  }, [user, backendCartData]);

  useEffect(() => {
    if (isOpen && user) {
      getCartCount({ silent: true }); // ← refetch on open, no loader flash
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen && cartData?.length > 0) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 60,
          spread: 70,
          origin: { x: 0.8, y: 0.2 },
        });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const cartTotal = user ? backendTotals.grandTotal : localTotals.grandTotal;
    const fee = calculateDeliveryFee(cartTotal);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, deliveryPrices]);

  useEffect(() => {
    const openCartFromEvent = () => {
      window.dispatchEvent(new CustomEvent("triggerCartOpen"));
    };

    window.addEventListener("openCartSidebar", openCartFromEvent);

    return () => {
      window.removeEventListener("openCartSidebar", openCartFromEvent);
    };
  }, []);

  // ─────────────────────────────────────────────
  // Single sliding panel — content swaps by state
  // ─────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:rounded-tl-4xl lg:rounded-bl-4xl right-0 top-0 h-full w-full sm:w-lg md:w-sm bg-[#FAFAF6] z-50 flex flex-col font-figtree shadow-2xl"
          >
            {isInitialLoad ? (
              <LoadingCart onClose={onClose} />
            ) : cartData?.length === 0 ? (
              <EmptyCart
                onClose={onClose}
                onStartShopping={() => {
                  onClose();
                  router.push("/all-products");
                }}
              />
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center rounded-tl-4xl p-5 bg-white border-b border-amber-100">
                  <div>
                    <h2 className="font-bold text-xl text-gray-800">
                      Your Cart
                    </h2>
                    <p className="text-sm text-gray-500">
                      {cartData.length}{" "}
                      {cartData.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <IoClose className="text-xl cursor-pointer text-gray-600" />
                  </button>
                </div>

                {/* Linked offers */}
                {showLinkedOffers && selectedParentForOffers && (
                  <div className="sticky top-0 z-10 bg-linear-to-r from-primary-50 to-amber-50 border-b border-primary-200 shadow-sm">
                    <div
                      onClick={() => setIsOffersExpanded(!isOffersExpanded)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#FDF5F0] transition-colors rounded-t-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <GiPresent className="text-[#E56A5C] text-sm animate-bounce" />
                        </div>
                        <p className="text-xs font-semibold text-[#E56A5C]">
                          Special Add-On Offers Available!
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#c1552c] font-medium">
                          Add to save more
                        </span>
                        {isOffersExpanded ? (
                          <FaChevronUp className="w-3 h-3 text-[#c1552c]" />
                        ) : (
                          <FaChevronDown className="w-3 h-3 text-[#c1552c]" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOffersExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 max-h-48 lg:max-h-40 overflow-y-auto no-scrollbar">
                            {availableParents.length > 1 && (
                              <div className="flex items-center gap-1 mb-2 overflow-x-auto no-scrollbar">
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                  For:
                                </span>
                                <div className="flex gap-1">
                                  {availableParents.map((parent) => (
                                    <button
                                      key={parent.productId}
                                      onClick={() =>
                                        setSelectedParentForOffers(parent)
                                      }
                                      className={`text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        selectedParentForOffers?.productId ===
                                        parent.productId
                                          ? "bg-primary-400 text-white"
                                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                      }`}
                                    >
                                      {parent.product.name.length > 15
                                        ? parent.product.name.substring(0, 15) +
                                          "..."
                                        : parent.product.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <CompactLinkedOffers
                              parentProductId={selectedParentForOffers.productId}
                              parentProduct={selectedParentForOffers.product}
                              onAddSuccess={refreshCartData}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Items list */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                  {cartData.map((item) => (
                    <CartItemRow
                      key={item._id}
                      item={item}
                      updatingItem={updatingItem}
                      getTotalCartQuantity={getTotalCartQuantity}
                      onRemove={removeSingleItemFromCart}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>

                {/* Bottom panel */}
                <div className="sticky bottom-0 z-20 bg-white border-t border-amber-100 shadow-lg rounded-bl-4xl">
                  <div
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex justify-between items-center px-5 py-4 cursor-pointer"
                  >
                    <div className="flex text-sm items-center gap-2 font-semibold text-gray-800">
                      <FaMoneyCheck className="text-lg text-[#E56A5C]" />
                      <span>Estimated total</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">
                        <span>
                          ₹
                          {Math.round(
                            (user
                              ? backendTotals.grandTotal
                              : localTotals.grandTotal) +
                              deliveryFee +
                              (activeDiscountType === "COD"
                                ? codHandlingCharge
                                : 0) -
                              ((user
                                ? backendTotals.grandTotal
                                : localTotals.grandTotal) *
                                (extraDiscount || 0)) /
                                100,
                          )}
                        </span>
                      </span>
                      {showBreakdown ? (
                        <FaChevronUp className="text-gray-500 text-sm" />
                      ) : (
                        <FaChevronDown className="text-gray-500 text-sm" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-4 text-sm text-gray-600"
                      >
                        <CartBreakdown
                          user={user}
                          backendTotals={backendTotals}
                          localTotals={localTotals}
                          deliveryFee={deliveryFee}
                          deliveryPrices={deliveryPrices}
                          extraDiscount={extraDiscount}
                          codHandlingCharge={codHandlingCharge}
                          activeDiscountType={activeDiscountType}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-5 pb-5">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-[#c1552c] cursor-pointer text-white py-3.5 rounded-2xl font-semibold text-base shadow-md hover:shadow-lg transition-all"
                    >
                      Checkout
                    </button>

                    <div className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <span>Powered by</span>
                      <img
                        src="/icons/razorpay.png"
                        alt="razorpay"
                        className="h-6 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}