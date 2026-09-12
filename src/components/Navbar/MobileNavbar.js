
"use client";

import {
  Search,
  ShoppingCart,
  User,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import apiClient from './../../api/client';
import useAuth from './../../auth/useAuth';
import toast from "react-hot-toast";


const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about-us" },
  { name: "Blogs", href: "/blogs" },
];

export default function MobileNavbar({

  isOpen,
  onClose,
  onCartClick,
  cartCount,
}) {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --------------------------------
     Fetch Categories
  -------------------------------- */

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

  /* --------------------------------
     Close on route change
  -------------------------------- */

  useEffect(() => {
    onClose();
    setIsShopOpen(false);
  }, [pathname]);

  /* --------------------------------
     Category
  -------------------------------- */

  const handleCategoryClick = (categoryId) => {
    router.push(`/all-products?category=${categoryId}`);
    onClose();
  };

  /* --------------------------------
     Navigation
  -------------------------------- */

  const handleNavigation = (href) => {
    router.push(href);
    onClose();
  };

  const isActive = (path) => {
    return pathname === path;
  };


  
  const handleLoginClick = () => {
    // Open login sidebar
    if (window.openLoginSidebar) {
      window.openLoginSidebar();
    }
    onClose();
  };

  const handleLogout = () => {
  logOut();
  toast.success("Logged out successfully");
  setTimeout(() => {
    navigate("/");
  }, 1000);
};


  if (!isOpen) return null;

  return (
    <>
      {/* ==============================
          BACKDROP
      ============================== */}

      <div
        className="fixed inset-0 bg-[#312620]/40 backdrop-blur-[2px] z-40 lg:hidden"
        onClick={onClose}
      />

      {/* ==============================
          MOBILE MENU
      ============================== */}

      <div id="mobile-menu" className="fixed top-0 left-0 right-0 bg-[#fffdf9] shadow-[0_20px_50px_rgba(49,38,32,0.15)] rounded-b-3xl z-50 lg:hidden max-h-[90vh] overflow-y-auto animate-mobileMenu">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e9e1d7]">

          <button
            onClick={() => handleNavigation("/")}
            className="font-serif text-2xl font-bold text-[#4b2e1e]"
          >
            Anaaj
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#faf4ea] text-[#5a5a5a] transition-colors"
              aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-4">

          {/* ==============================
              ACCOUNT
          ============================== */}

{!user ? (
  // Guest User - Show Login Button
  <button
    onClick={handleLoginClick}
    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#faf4ea] text-left hover:bg-[#f3eadf] transition-colors"
  >
    <div className="w-10 h-10 shrink-0 rounded-full bg-[#c1552c] flex items-center justify-center text-white">
      <User size={19} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-[#4b2e1e]">
        Guest User
      </p>
      <p className="text-xs text-[#8a8179] mt-0.5">
        Sign in for a better experience
      </p>
    </div>
    <ArrowRight size={16} className="text-[#9b9188]" />
  </button>
) : (
  // Logged In User - Show User Info with Logout
  <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#faf4ea]">
    <div className="w-10 h-10 shrink-0 rounded-full bg-[#c1552c] flex items-center justify-center text-white font-semibold text-sm">
      {user?.email?.charAt(0).toUpperCase() || "U"}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#4b2e1e] truncate">
        {user?.email || "User"}
      </p>
      <p className="text-xs text-[#8a8179] truncate">
        Logged in
      </p>
    </div>
    <button
    onClick={() => handleLogout()}
      className="text-xs text-red-500 font-medium hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      Logout
    </button>
  </div>
)}

          {/* ==============================
              NAVIGATION
          ============================== */}

          <div className="mt-5">

            <p className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#a0968c]">
              Navigation
            </p>

            <div className="space-y-1">

              {navItems.map((item) => {

                /* --------------------------------
                   SHOP
                -------------------------------- */

                if (item.name === "Shop") {
                  return (
                    <div key={item.name}>

                      <button
                        onClick={() =>
                          setIsShopOpen(!isShopOpen)
                        }
                        className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                          isShopOpen || isActive("/shop")
                            ? "bg-[#faf4ea] text-[#c1552c]"
                            : "text-[#312620] hover:bg-[#faf4ea]"
                        }`}
                      >

                        <span>Shop</span>

                        <ChevronDown
                          size={17}
                          strokeWidth={1.8}
                          className={`transition-transform duration-200 ${
                            isShopOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                      </button>

                      {/* Category List */}

                      {isShopOpen && (
                        <div className="mt-1 ml-3 pl-3 border-l border-[#e2d7ca] animate-mobileCategories">

                          {loading ? (
                            // Loading skeletons
                            <>
                              {[1, 2, 3, 4, 5].map((_, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 px-3 py-3 animate-pulse"
                                >
                                  <div className="w-4 h-3 bg-[#e6ded2] rounded"></div>
                                  <div className="flex-1 h-4 bg-[#e6ded2] rounded"></div>
                                  <div className="w-4 h-4 bg-[#e6ded2] rounded"></div>
                                </div>
                              ))}
                            </>
                          ) : categories.length > 0 ? (
                            <>
                              {categories.map((category, index) => (
                                <button
                                  key={category._id}
                                  onClick={() => handleCategoryClick(category._id)}
                                  className="group w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg hover:bg-[#faf4ea] transition-colors"
                                >
                                  <span className="text-[10px] font-medium text-[#b5aaa0] group-hover:text-[#c1552c] w-4">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>

                                  <span className="flex-1 text-sm text-[#4b4038] group-hover:text-[#c1552c]">
                                    {category.name}
                                  </span>

                                  <ArrowRight
                                    size={14}
                                    className="opacity-0 -translate-x-1 text-[#c1552c] group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                  />
                                </button>
                              ))}

                              {/* View All */}

                              <button
                                onClick={() => handleNavigation("/all-products")}
                                className="w-full flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[#c1552c] hover:bg-[#faf4ea] rounded-lg transition-colors"
                              >
                                View all products
                                <ArrowRight size={15} />
                              </button>
                            </>
                          ) : (
                            <div className="text-center py-4 text-[#8a8179] text-sm">
                              No categories available
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                }

                /* --------------------------------
                   OTHER ITEMS
                -------------------------------- */

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-[#c1552c] text-white"
                        : "text-[#312620] hover:bg-[#faf4ea] hover:text-[#c1552c]"
                    }`}
                  >

                    <span>{item.name}</span>

                    {isActive(item.href) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}

                  </Link>
                );
              })}

            </div>

          </div>

          {/* ==============================
              ACTIONS
          ============================== */}

          <div className="mt-5 pt-4 border-t border-[#e9e1d7]">

            <p className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#a0968c]">
              Quick actions
            </p>

            <div className="space-y-1">

              {/* Cart */}

              <button
                onClick={onCartClick}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium text-[#312620] hover:bg-[#faf4ea] transition-colors"
              >

                <ShoppingCart
                  size={19}
                  strokeWidth={1.7}
                />

                <span className="flex-1 text-left">
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="bg-[#c1552c] text-white text-[11px] font-bold rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}

                <ArrowRight
                  size={15}
                  className="text-[#a0968c]"
                />

              </button>

              {/* Search */}

              <button
                onClick={() => handleNavigation("/search")}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium text-[#312620] hover:bg-[#faf4ea] transition-colors"
              >

                <Search
                  size={19}
                  strokeWidth={1.7}
                />

                <span className="flex-1 text-left">
                  Search products
                </span>

                <ArrowRight
                  size={15}
                  className="text-[#a0968c]"
                />

              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}