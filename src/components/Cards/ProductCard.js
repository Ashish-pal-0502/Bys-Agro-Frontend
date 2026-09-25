
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "./../../stores/cartStore";
import toast from "react-hot-toast";
import Link from "next/link";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart, getTotalQuantity } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  // Get current total quantity in cart
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

  // Add to cart function
  const addProductToCart = async (e, product) => {
    e.stopPropagation();
    const qty = 1;

    const currentTotalQuantity = await getCurrentCartTotal();
    const newTotalQuantity = currentTotalQuantity + qty;

    if (newTotalQuantity > 4) {
      toast.error(
        `Maximum 4 items allowed per order. You already have ${currentTotalQuantity} item(s) in cart.`,
      );
      return;
    }

    let existingProductQuantity = 0;
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", {
          userId: user?.id,
        });
        if (response.data && Array.isArray(response.data?.cart)) {
          const existingItem = response.data.cart.find(
            (item) => item.product._id === product._id || item.product === product._id
          );
          existingProductQuantity = existingItem?.quantity || 0;
        }
      } catch (error) {
        console.error("Error checking product in cart:", error);
      }
    } else {
      const cart = useCartStore.getState().cart;
      const existingItem = cart.find((item) => item.product._id === product._id);
      existingProductQuantity = existingItem?.quantity || 0;
    }

    if (existingProductQuantity >= 4) {
      toast.error("Maximum 4 items of this product allowed");
      return;
    }

    try {
      if (user) {
        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: {
            product: product._id,
            qty: qty,
          },
          type: "increment",
        });

        if (response.ok) {
          toast.success(response.data.message || "Item added to cart!");
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) {
            window.openCartSidebar();
          }
        } else {
          toast.error("Failed to add item to cart");
        }
      } else {
        addToCart(product, qty);
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        if (window.openCartSidebar) {
          window.openCartSidebar();
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const productImage = product.images?.[0] || product.image || "https://via.placeholder.com/400x300";
  const discountedPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
  const weightDisplay = product.weight 
    ? `${product.weight}${product.weightUnit || 'g'}` 
    : product.weight || '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link
          href={{
            pathname: `/product/${product.groupId}`,
            query: { visualId: product.visualId },
          }}
          onClick={() => sessionStorage.setItem("productId", product._id)}
          className="relative w-full h-full block cursor-pointer"
        >
          <Image
            src={productImage}
            alt={product.name || "Product"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x300";
            }}
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}

        {/* Stock Status */}
        {product.countInStock?.quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold px-3 py-1 bg-red-600 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Category */}
        {product.category?.name && (
          <p className="text-[10px] font-medium text-[#c1552c] uppercase tracking-wider">
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <Link
          href={{
            pathname: `/product/${product.groupId}`,
            query: { visualId: product.visualId },
          }}
          onClick={() => sessionStorage.setItem("productId", product._id)}
          className="block cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-gray-800 hover:text-[#c1552c] transition-colors line-clamp-1">
            {product.name || "Product Name"}
          </h3>
        </Link>

        {/* Weight */}
        <p className="text-xs text-gray-500">
          {weightDisplay}
        </p>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₹{discountedPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            className={`${
              product.countInStock?.quantity > 0
                ? "bg-[#c1552c] hover:bg-[#a84824] active:scale-95 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-white text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5`}
            onClick={(e) => addProductToCart(e, product)}
            disabled={product.countInStock?.quantity === 0}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.countInStock?.quantity > 0 ? "Add" : "Sold"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;