
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaBolt,
  FaTruck,
  FaLeaf,
  FaShieldAlt,
} from "react-icons/fa";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";
import { Parser } from "html-to-react";
import AccordionItem from "./../Accordian/AccordianProductDetails";
import ProductInfoTabs from "./../Product/ProductInfoTabs";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import ProductStickyBar from './ProductStickyBar';
// import LinkedOffers from "../Offers/LinkedOffers";
import LinkedOffers from './LinkedOffers';

const ProductDetails = ({
  products,
  groupId,
  initialVisualId,
  onVariantChange,
  currentProduct,
}) => {
  const router = useRouter();
  const { addToCart, getTotalQuantity } = useCartStore();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    setQty(1);
  }, [currentProduct?._id]);

  useEffect(() => {
    if (products?.length > 0) {
      let initialIndex = 0;
      if (initialVisualId) {
        const foundIndex = products.findIndex((p) => p.visualId === initialVisualId);
        if (foundIndex !== -1) initialIndex = foundIndex;
      }
      setSelectedVariant(initialIndex);
    }
  }, [products, initialVisualId]);

  const variants =
    products?.map((product, index) => {
      const originalPrice = product.price;
      const normalPrice =
        product.discount > 0
          ? Math.round(originalPrice - (originalPrice * product.discount) / 100)
          : originalPrice;

      let finalPrice = normalPrice;
      let saveAmount = originalPrice - normalPrice;

      if (product.isFlash && product.flash) {
        if (product.flash.discountType === "PERCENT") {
          finalPrice = Math.round(
            originalPrice - (originalPrice * product.flash.discountValue) / 100
          );
        } else {
          finalPrice = Math.round(originalPrice - product.flash.discountValue);
        }
        finalPrice = Math.max(finalPrice, 0);
        saveAmount = originalPrice - finalPrice;
      }

      return {
        id: index,
        visualId: product.visualId,
        productId: product._id,
        price: finalPrice,
        oldPrice: originalPrice,
        weight: product.weight || "250g",
        save: saveAmount,
        product,
      };
    }) || [];

  const originalPrice = currentProduct?.price || 0;
  const discountedPrice =
    currentProduct?.discount > 0
      ? Math.round(originalPrice - (originalPrice * currentProduct.discount) / 100)
      : originalPrice;

  let finalFlashPrice = discountedPrice;
  if (currentProduct?.isFlash && currentProduct?.flash) {
    if (currentProduct.flash.discountType === "PERCENT") {
      finalFlashPrice = Math.round(
        originalPrice - (originalPrice * currentProduct.flash.discountValue) / 100
      );
    } else {
      finalFlashPrice = Math.round(originalPrice - currentProduct.flash.discountValue);
    }
    finalFlashPrice = Math.max(finalFlashPrice, 0);
  }

  const currentPrice =
    currentProduct?.isFlash && currentProduct?.flash ? finalFlashPrice : discountedPrice;

  const isOutOfStock = currentProduct?.countInStock?.quantity <= 0;

  const handleVariantChange = (index) => {
    setSelectedVariant(index);
    const variant = variants[index];
    if (!variant) return;

    if (onVariantChange && variant.product) onVariantChange(variant.product);

    const params = new URLSearchParams(window.location.search);
    if (index === 0) params.delete("visualId");
    else params.set("visualId", variant.visualId);

    const queryString = params.toString();
    const url = queryString ? `/product/${groupId}?${queryString}` : `/product/${groupId}`;
    router.replace(url, { scroll: false });
  };

  const increment = () => qty < 4 && setQty(qty + 1);
  const decrement = () => qty > 1 && setQty(qty - 1);

  const getCurrentCartTotal = async () => {
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", { userId: user?.id });
        if (response.data && Array.isArray(response.data?.cart)) {
          return response.data.cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
        }
        return 0;
      } catch (error) {
        console.error("Error fetching cart:", error);
        return 0;
      }
    }
    return getTotalQuantity();
  };

  const validateAndAddToCart = async () => {
    const qtyToAdd = qty;
    const currentTotalQuantity = await getCurrentCartTotal();
    const newTotalQuantity = currentTotalQuantity + qtyToAdd;

    if (newTotalQuantity > 4) {
      toast.error(
        `Maximum 4 items per order. You already have ${currentTotalQuantity} item(s) in cart.`
      );
      return false;
    }

    let existingProductQuantity = 0;
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", { userId: user?.id });
        if (response.data && Array.isArray(response.data?.cart)) {
          const existingItem = response.data.cart.find(
            (item) =>
              item.product._id === currentProduct._id ||
              item.product === currentProduct._id
          );
          existingProductQuantity = existingItem?.quantity || 0;
        }
      } catch (error) {
        console.error("Error checking product in cart:", error);
      }
    } else {
      const cart = useCartStore.getState().cart;
      const existingItem = cart.find((item) => item.product._id === currentProduct._id);
      existingProductQuantity = existingItem?.quantity || 0;
    }

    if (existingProductQuantity + qtyToAdd > 4) {
      toast.error("Maximum 4 items of this product allowed");
      return false;
    }

    try {
      if (user) {
        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: { product: currentProduct._id, qty: qtyToAdd },
          type: "increment",
        });

        if (response.ok) {
          toast.success(response.data.message || `${currentProduct?.name} added to cart!`);
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) window.openCartSidebar();
          return true;
        } else {
          toast.error("Failed to add item to cart");
          return false;
        }
      } else {
        addToCart(currentProduct, qtyToAdd);
        toast.success(`${currentProduct?.name} added to cart!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        if (window.openCartSidebar) window.openCartSidebar();
        return true;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      return false;
    }
  };

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    setIsAdding(true);
    await validateAndAddToCart();
    setIsAdding(false);
  };

  const handleBuyNow = async (e) => {
    e?.stopPropagation();
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    setIsBuying(true);
    const added = await validateAndAddToCart();
    setIsBuying(false);
    if (added) router.push("/checkout");
  };

  // const renderStars = () => {
  //   const stars = [];
  //   const rating = currentProduct?.rating || 0;
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating - fullStars >= 0.5;

  //   for (let i = 0; i < 5; i++) {
  //     if (i < fullStars) stars.push(<FaStar key={i} className="text-[#E58103]" />);
  //     else if (i === fullStars && hasHalfStar)
  //       stars.push(<FaStarHalfAlt key={i} className="text-[#E58103]" />);
  //     else stars.push(<FaRegStar key={i} className="text-[#E58103] opacity-40" />);
  //   }
  //   return stars;
  // };

  const renderStars = () => {
  const stars = [];
  const rating = Number(currentProduct?.averageRating || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="text-[#E58103]" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-[#E58103]" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-[#E58103] opacity-40" />);
    }
  }
  return stars;
};

  if (!currentProduct) {
    return (
      <div className="w-full px-4 text-left">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const totalPrice = currentPrice * qty;

  return (
    <div className="w-full font-serif">
      <div className="w-full text-left">
        {/* ── Trust Badges ── */}
        <div className="flex flex-wrap gap-2 mb-3">
          {currentProduct?.features?.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-[#cde9b1] text-[#405B2A] px-3 py-1 rounded-full font-medium tracking-wide"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* ── Product Name ── */}
        <h1 className="text-2xl md:text-3xl lg:text-[2rem] leading-tight text-[#2b1b12] font-semibold mb-2">
          {currentProduct?.name}
        </h1>

        {/* ── Rating ── */}
        {/* <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 text-sm">{renderStars()}</div>
          <span className="text-sm font-semibold text-[#1A3232]">
            {typeof currentProduct?.rating === "number"
              ? currentProduct.rating.toFixed(1)
              : "0.0"}
          </span>
          <span className="text-sm text-gray-500">
            (
            {Array.isArray(currentProduct?.reviews)
              ? currentProduct.reviews.length
              : typeof currentProduct?.reviews === "number"
              ? currentProduct.reviews
              : 0}{" "}
            reviews)
          </span>
        </div> */}

        {/* ── Rating (clickable → scrolls to reviews) ── */}
<button
  type="button"
  onClick={() => {
    const el = document.getElementById("customer-reviews-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
  className="group flex items-center gap-2 mb-4 cursor-pointer transition-opacity hover:opacity-80"
  aria-label="Jump to customer reviews"
>
  <div className="flex items-center gap-0.5 text-sm">{renderStars()}</div>

  <span className="text-sm font-semibold text-[#1A3232]">
    {Number(currentProduct?.averageRating || 0).toFixed(1)}
  </span>

  <span className="text-sm text-[#7D6F60] underline decoration-[#DAD0C4] underline-offset-2 group-hover:decoration-[#B85C38] group-hover:text-[#B85C38] transition-colors">
    (
    {currentProduct?.reviewsCount ??
      (Array.isArray(currentProduct?.reviews)
        ? currentProduct.reviews.length
        : 0)}{" "}
    {currentProduct?.reviewsCount === 1 ||
    (Array.isArray(currentProduct?.reviews) &&
      currentProduct.reviews.length === 1)
      ? "review"
      : "reviews"}
    )
  </span>
</button>

        {/* ── Price Block ── */}
        <div className="bg-[#FFF9F2] border border-[#F0E4D3] rounded-2xl px-5 py-4 mb-5">
          <div className="flex items-baseline flex-wrap gap-3">
            <span className="font-bold text-3xl md:text-4xl text-[#2b1b12]">
              ₹{currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <>
                <span className="line-through text-gray-400 text-lg">
                  ₹{originalPrice}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-bold">
                  {Math.round(
                    ((originalPrice - currentPrice) / originalPrice) * 100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>
          {originalPrice > currentPrice && (
            <p className="text-sm text-[#3D5A45] font-medium mt-1.5">
              You save ₹{originalPrice - currentPrice} on this order
            </p>
          )}
        </div>

        {/* ── Weight Variants ── */}
        {products?.length > 0 && (
          <>
            <h5 className="font-semibold text-[#2b1b12] text-sm uppercase tracking-wider mb-3">
              Select Pack Size
            </h5>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {variants?.map((v) => {
                const isActive = v.id === selectedVariant;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    className={`relative rounded-xl py-1 md:py-3 px-2 text-center cursor-pointer transition-all duration-200 border-2
                      ${
                        isActive
                          ? "bg-[#FFF3EB] border-[#B85C38] shadow-sm"
                          : "bg-white border-[#E8DFD2] hover:border-[#B85C38]/60"
                      }`}
                  >
                    <p
                      className={`font-semibold text-sm ${
                        isActive ? "text-[#B85C38]" : "text-[#2b1b12]"
                      }`}
                    >
                      {v.weight}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">₹{v.price}</p>
                    {isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B85C38] rounded-full flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Description ── */}
        <div className="mt-2 text-[#655849] leading-7 text-[15px]">
          {Parser().parse(currentProduct?.description || "")}
        </div>

        {/* ── Quantity + Add to Cart (grouped inline) ── */}
        <div className="mt-6 mb-4">
          <h5 className="font-semibold text-[#2b1b12] text-sm uppercase tracking-wider mb-3">
            Quantity
          </h5>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stepper */}
            <div className="flex items-center border-2 border-[#E8DFD2] rounded-xl overflow-hidden bg-white">
              <button
                onClick={decrement}
                disabled={qty === 1}
                aria-label="Decrease quantity"
                className={`w-11 h-11 cursor-pointer flex items-center justify-center transition-colors ${
                  qty === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-[#2b1b12] hover:bg-[#FFF3EB] active:bg-[#FFE9DB]"
                }`}
              >
                <FaMinus size={12} />
              </button>
              <span className="w-12 text-center text-lg font-semibold text-[#2b1b12] border-x-2 border-[#E8DFD2] h-11 flex items-center justify-center">
                {qty}
              </span>
              <button
                onClick={increment}
                disabled={qty >= 4}
                aria-label="Increase quantity"
                className={`w-11 h-11 cursor-pointer flex items-center justify-center transition-colors ${
                  qty >= 4
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-[#2b1b12] hover:bg-[#FFF3EB] active:bg-[#FFE9DB]"
                }`}
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Price summary right next to stepper */}
            <div className="flex flex-col">
              <span className="text-xs text-[#7D6F60]">Subtotal</span>
              <span className="text-lg font-bold text-[#2b1b12]">₹{totalPrice}</span>
            </div>

            {isOutOfStock && (
              <span className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div id="action-buttons"  className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`w-full py-2 md:py-3.5 rounded-xl cursor-pointer font-semibold border-2 transition-all flex items-center justify-center gap-2
              ${
                isOutOfStock
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-[#B85C38] text-[#B85C38] bg-white hover:bg-[#FFF3EB] active:scale-[0.98]"
              }`}
          >
            <FaShoppingBag size={14} />
            {isAdding ? "Adding…" : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isBuying || isOutOfStock}
            className={`w-full py-2 md:py-3.5 rounded-xl cursor-pointer font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-md
              ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-linear-to-r from-[#B85C38] to-[#c1552c] hover:from-[#a44d2e] hover:to-[#a84320] active:scale-[0.98]"
              }`}
          >
            <FaBolt size={13} />
            {isBuying ? "Processing…" : "Buy Now"}
          </button>
        </div>

        {/* ── Trust Strip ── */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-[#E8DFD2]">
          <div className="flex flex-col items-center text-center gap-1.5">
            <FaTruck className="text-[#B85C38]" size={18} />
            <span className="text-[11px] text-[#655849] font-medium leading-tight">
              Free Shipping<br />Above ₹500
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5">
            <FaLeaf className="text-[#3D5A45]" size={18} />
            <span className="text-[11px] text-[#655849] font-medium leading-tight">
              100% Natural<br />Ingredients
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5">
            <FaShieldAlt className="text-[#B85C38]" size={18} />
            <span className="text-[11px] text-[#655849] font-medium leading-tight">
              Secure<br />Checkout
            </span>
          </div>
        </div>

        <LinkedOffers
  parentProductId={currentProduct?._id}
  parentProduct={currentProduct}
/>

        {/* ── Product Info Tabs ── */}
        <ProductInfoTabs currentProduct={currentProduct} />

        {/* ── Recipe Suggestion ── */}
        {currentProduct?.recipe && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 font-medium">
              Try it in: {currentProduct.recipe} — A comforting classic
            </p>
          </div>
        )}
      </div>

      <ProductStickyBar
  product={currentProduct}
  currentPrice={currentPrice}
  originalPrice={originalPrice}
  isOutOfStock={isOutOfStock}
  onAddToCart={handleAddToCart}
  onBuyNow={handleBuyNow}
  isAdding={isAdding}
  isBuying={isBuying}
  anchorId="action-buttons"
/>
    </div>
  );
};

export default ProductDetails;