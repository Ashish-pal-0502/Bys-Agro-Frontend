
"use client";

import {
 Search, 
  ShoppingCart, 
  User, 
  Menu, 
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "./../../stores/cartStore";
import { useState, useEffect, useRef  } from "react";
import { useRouter, usePathname } from "next/navigation";
import MobileNavbar from "./MobileNavbar";
import ShopDrawer from "./ShopDrawer";
import Banner from './BannerMessage';
import useAuth from './../../auth/useAuth';
import { useCartCount } from './../../hooks/useCartCount';

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about-us" },
  { name: "Blogs", href: "/blogs" },

];

export default function Navbar({ onCartClick }) {
  const router = useRouter();
  const pathname = usePathname()
  const {user, logOut} = useAuth()

  const { count: cartCount, loading } = useCartCount();

const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);

  /* --------------------------------
     Close Shop Drawer with ESC
  -------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsShopDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  /* --------------------------------
     Cart
  -------------------------------- */

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else if (window.openCartSidebar) {
      window.openCartSidebar();
    }
  };

  /* --------------------------------
     Navigation
  -------------------------------- */

  const handleNavigation = (href) => {
    setIsShopDrawerOpen(false);
    router.push(href);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  const handleUserClick = () => {
  if (user) {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  } else {
    if (window.openLoginSidebar) {
      window.openLoginSidebar();
    }
  }
};

const handleLogout = async () => {
 await logOut();
  toast.success("Logged out successfully");
};

  return (
    <>
      {/* =========================================
          MAIN NAVBAR
      ========================================= */}

      <nav className="fixed top-0 left-0 w-full bg-[#faf4ea] border-b border-[#e6ded2] z-50">
        {/* =====================================
            TOP BANNER COMPONENT
        ===================================== */}

        <Banner />

        {/* =====================================
            NAVBAR CONTENT
        ===================================== */}

        <div className="max-w-7xl mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
          {/* ===================================
              LOGO
          =================================== */}

          <div className="shrink-0">
            <h1
              onClick={() => router.push("/")}
              className="text-3xl cursor-pointer font-serif font-bold text-[#4b2e1e] tracking-tight"
            >
            Bys Agro
            </h1>
          </div>

          {/* ===================================
              DESKTOP NAVIGATION
          =================================== */}

          <div className="hidden lg:flex items-center gap-10 h-full">
            {navItems.map((item) => {
              /* ================================
                  SHOP
              ================================= */

              if (item.name === "Shop") {
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsShopDrawerOpen(true)}
                    className={`flex items-center font-serif gap-1 text-sm font-medium cursor-pointer transition-colors ${
                      isActive(item.href)
                        ? "text-[#c1552c]"
                        : "text-[#312620] hover:text-[#c1552c]"
                    }`}
                  >
                    Shop

                    <ChevronDown
                      size={14}
                      strokeWidth={1.8}
                      className={`transition-transform duration-300 ${
                        isShopDrawerOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                );
              }

              /* ================================
                  OTHER NAV ITEMS
              ================================= */

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-sm cursor-pointer font-serif font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-[#c1552c]"
                      : "text-[#312620] hover:text-[#c1552c]"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* ===================================
              RIGHT SIDE
          =================================== */}

          <div className="flex items-center gap-3 md:gap-6">
            {/* =================================
                SEARCH
            ================================= */}
<button
  type="button"
  onClick={() => router.push("/search")}
  aria-label="Search products"
  className="hidden md:inline-flex items-center gap-2.5 h-12 px-4 rounded-full bg-[#efe8dd] cursor-pointer hover:bg-[#e6ded2] transition-colors focus-visible:outline-2 focus-visible:outline-[#c1552c] focus-visible:outline-offset-2"
>
  <Search size={18} strokeWidth={1.8} className="shrink-0 text-[#8a8a8a]" aria-hidden="true" />
</button>

            {/* =================================
                CART
            ================================= */}

        <button
  onClick={handleCartClick}
  className="hover:scale-105 cursor-pointer transition relative"
  aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
>
  <ShoppingCart size={24} strokeWidth={1.7} className="text-[#5a5a5a]" aria-hidden="true" />
  {cartCount > 0 && (
    <span
      aria-hidden="true"
      className="absolute -top-3 -right-3 bg-[#c1552c] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
    >
      {cartCount}
    </span>
  )}
</button>

         

<div className="relative" ref={dropdownRef}>


  <button
  onClick={handleUserClick}
  className="cursor-pointer group hidden lg:block relative"
  aria-label={user ? `Account menu for ${user.email}` : "Sign in"}
  aria-haspopup="menu"
  aria-expanded={isUserDropdownOpen}
>
  <User size={24}       className="text-[#5a5a5a] group-hover:text-[#c1552c] transition-colors"aria-hidden="true" />
  {user && (
    <span
      aria-hidden="true"
      className="absolute -top-1.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
    />
  )}
</button>

  {/* Dropdown */}
  {isUserDropdownOpen && user && (
    <div className="absolute -right-8 top-13 w-72 bg-white rounded-2xl shadow-2xl border border-[#e6ded2] overflow-hidden z-50 animate-dropdownIn">
      {/* User Info */}
      <div className="px-5 py-4 bg-linear-to-r from-[#faf4ea] to-[#f5ede1] border-b border-[#e6ded2]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#c1552c] flex items-center justify-center text-white font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2b1b12] truncate">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-[#8a8179] truncate">
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>


      <div className="py-2">
  <button
    onClick={() => {
      setIsUserDropdownOpen(false);
      router.push("/orders");
    }}
    className="w-full flex cursor-pointer items-center gap-3 px-5 py-3 text-sm text-[#2b1b12] hover:bg-[#faf4ea] transition-colors group"
  >
    <div className="w-8 h-8 rounded-lg bg-[#faf4ea] group-hover:bg-[#c1552c]/10 flex items-center justify-center transition-colors">
      <ShoppingCart size={16} className="text-[#5a5a5a] group-hover:text-[#c1552c]" />
    </div>
    <span className="flex-1 text-left">My Orders</span>
    <ChevronRight size={14} className="text-[#8a8179]" />
  </button>

  <button
    onClick={() => {
      setIsUserDropdownOpen(false);
      router.push("/profile");
    }}
    className="w-full flex cursor-pointer items-center gap-3 px-5 py-3 text-sm text-[#2b1b12] hover:bg-[#faf4ea] transition-colors group"
  >
    <div className="w-8 h-8  rounded-lg bg-[#faf4ea] group-hover:bg-[#c1552c]/10 flex items-center justify-center transition-colors">
      <User size={16} className="text-[#5a5a5a] group-hover:text-[#c1552c]" />
    </div>
    <span className="flex-1 text-left">My Profile</span>
    <ChevronRight size={14} className="text-[#8a8179]" />
  </button>
</div>

      {/* Divider */}
      <div className="border-t border-[#e6ded2]"></div>

      {/* Logout */}
    <div className="py-2">
  <button
    onClick={handleLogout}
    className="w-full flex cursor-pointer items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
  >
    <div className="w-8 h-8  rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
      <LogOut size={16} className="text-red-500" />
    </div>
    <span className="flex-1 text-left">Logout</span>
    <ChevronRight size={14} className="text-red-300" />
  </button>
</div>
    </div>
  )}
</div>

            {/* =================================
                MOBILE MENU
            ================================= */}

           <button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="lg:hidden cursor-pointer hover:bg-[#e6ded2] rounded-lg transition-colors"
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  <Menu size={24} className="text-[#4b2e1e]" aria-hidden="true" />
</button>
          </div>
        </div>
      </nav>

      {/* =========================================
          SHOP DRAWER COMPONENT
      ========================================= */}

      <ShopDrawer
        isOpen={isShopDrawerOpen}
        onClose={() => setIsShopDrawerOpen(false)}
      />

      {/* =========================================
          MOBILE NAVBAR
      ========================================= */}

      <MobileNavbar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onCartClick={handleCartClick}
        cartCount={cartCount}
      />
    </>
  );
}