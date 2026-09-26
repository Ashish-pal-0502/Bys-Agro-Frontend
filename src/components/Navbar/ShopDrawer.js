

"use client";

import { X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect,useRef } from "react";
import apiClient from './../../api/client';

export default function ShopDrawer({ isOpen, onClose }) {
    const drawerRef = useRef(null);
const previousFocusRef = useRef(null);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/variation/category/get");

      if (response.ok) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAllCategories();
    }
  }, [isOpen]);



useEffect(() => {
  if (!isOpen) return;

  previousFocusRef.current = document.activeElement;
  const drawer = drawerRef.current;
  if (!drawer) return;

  const focusable = drawer.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  first?.focus();

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    previousFocusRef.current?.focus?.();
  };
}, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryClick = (categoryId) => {
    // Navigate to all-products with category filter
    router.push(`/all-products?category=${categoryId}`);
    onClose();
  };


  const handleNavigation = (href) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 lg:bg-[#312620]/25 lg:backdrop-blur-[2px] z-60"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
      ref={drawerRef}
  role="dialog"
  aria-modal="true"
  aria-label="Shop by category"
      className="fixed hidden lg:block top-0 right-0 h-full w-105 max-w-[90vw] bg-[#fffdf9] z-70 lg:shadow-[-20px_0_60px_rgba(49,38,32,0.12)] animate-shopDrawer">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-7 pt-7 pb-6 border-b border-[#e9e1d7]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c1552c]">
                  Explore our range
                </p>
                <h2 className="mt-2 text-2xl font-serif font-bold text-[#312620]">
                  Shop by Category
                </h2>
                <p className="mt-2 text-sm leading-5 text-[#8a8179]">
                  Discover everyday essentials carefully selected for your kitchen.
                </p>
              </div>

              <button
                onClick={onClose}
                className="shrink-0 ml-4 w-10 cursor-pointer h-10 rounded-full flex items-center justify-center text-[#5a5a5a] hover:bg-[#faf4ea] hover:text-[#c1552c] transition-colors"
                aria-label="Close shop menu"
              >
                <X size={20} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          {/* Category List */}
          <div className="flex-1 overflow-y-auto px-5 py-5 shop-drawer-scroll">
            {loading ? (
              // Loading skeletons
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-5 animate-pulse"
                  >
                    <div className="w-7 h-4 bg-[#e6ded2] rounded"></div>
                    <div className="flex-1 h-5 bg-[#e6ded2] rounded"></div>
                    <div className="w-4 h-4 bg-[#e6ded2] rounded"></div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="group w-full cursor-pointer flex items-center gap-4 px-4 py-5 rounded-xl text-left hover:bg-[#faf4ea] transition-all duration-200"
                  >
                    <span className="w-7 shrink-0 text-[11px] font-medium tracking-wide text-[#b5aaa0] group-hover:text-[#c1552c] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-base font-medium text-[#312620] group-hover:text-[#c1552c] transition-colors">
                      {category.name}
                    </span>
                    <ArrowRight
                      size={17}
                      strokeWidth={1.6}
                      className="text-[#b5aaa0] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#c1552c] transition-all duration-200"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#8a8179]">
                <p>No categories available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-7 py-6 bg-[#faf4ea] border-t border-[#e9e1d7]">
            <button
              onClick={() => handleNavigation("/all-products")}
              className="w-full flex items-center cursor-pointer justify-between px-5 py-4 rounded-xl bg-[#c1552c] text-white text-sm font-semibold hover:bg-[#ad4825] transition-colors"
            >
              <span>View all products</span>
              <ArrowRight size={17} />
            </button>
            <p className="mt-4 text-center text-[11px] text-[#8a8179]">
              Quality staples, sourced with care.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}