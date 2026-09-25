

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaShoppingBag, FaBolt } from "react-icons/fa";

const ProductStickyBar = ({
  product,
  currentPrice = 0,
  originalPrice = 0,
  isOutOfStock = false,
  onAddToCart,
  onBuyNow,
  isAdding = false,
  isBuying = false,
  anchorId = "action-buttons",
}) => {
  const [show, setShow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [navHeight, setNavHeight] = useState(120); // fallback

  // ── measure real navbar height ──
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const update = () => setNavHeight(nav.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(nav);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // ── viewport listener ──
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── intersection observer ──
  useEffect(() => {
    let observer;
    const target = document.getElementById(anchorId);
    if (!target) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        if (isDesktop) {
          // show when top of anchor passes under the navbar
          setShow(rect.top < navHeight);
        } else {
          setShow(!entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );
    observer.observe(target);

    return () => observer && observer.disconnect();
  }, [isDesktop, anchorId, navHeight]);

  const productImage = product?.images?.[0] || product?.image?.[0];
  const hasDiscount = originalPrice > currentPrice;

  return (
    <>
      {/* ───── MOBILE BOTTOM BAR ───── */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 w-full z-30 bg-white
          rounded-t-2xl
          shadow-[0_-4px_20px_rgba(58,46,36,0.10)]
          border-t border-[#E8DFD2]
          transition-all duration-300 ease-out
          ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {productImage && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#FCFAF6] border border-[#E8DFD2] shrink-0">
                <Image
                  src={productImage}
                  alt={product?.name || "Product"}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-semibold text-[#2b1b12] line-clamp-1">
                {product?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#2b1b12]">
                  ₹{currentPrice}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] line-through text-gray-400">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm shrink-0 flex items-center gap-1.5 transition-all
              ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-[#B85C38] to-[#c1552c] text-white shadow-md active:scale-[0.97]"
              }`}
          >
            <FaShoppingBag size={12} />
            {isAdding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {/* ───── DESKTOP TOP BAR ───── */}
      <div
        className={`hidden lg:block fixed left-0 w-full z-30
          bg-[#FFF9F2]/95 backdrop-blur-md
          border-b border-[#E8DFD2]
          shadow-[0_4px_20px_rgba(58,46,36,0.06)]
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}
        style={{ top: navHeight }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            {productImage && (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FCFAF6] border border-[#E8DFD2] shrink-0">
                <Image
                  src={productImage}
                  alt={product?.name || "Product"}
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-[#2b1b12] line-clamp-1">
                {product?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#2b1b12]">
                  ₹{currentPrice}
                </span>
                {hasDiscount && (
                  <span className="text-xs line-through text-gray-400">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBuyNow}
              disabled={isOutOfStock || isBuying}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all border-2
                ${
                  isOutOfStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-[#B85C38] text-[#B85C38] bg-white hover:bg-[#FFF3EB] active:scale-[0.97]"
                }`}
            >
              <FaBolt size={12} />
              {isBuying ? "Processing…" : "Buy It Now"}
            </button>

            <button
              onClick={onAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all shadow-md
                ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#B85C38] to-[#c1552c] text-white hover:from-[#a44d2e] hover:to-[#a84320] active:scale-[0.97]"
                }`}
            >
              <FaShoppingBag size={12} />
              {isAdding ? "Adding…" : "Add To Cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductStickyBar;