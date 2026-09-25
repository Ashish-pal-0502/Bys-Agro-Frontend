

"use client";

import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: "Shop All", href: "/all-products" },
    { label: "Pulses & Dal", href: "/category/pulses-dal" },
    { label: "Cooking Oils", href: "/category/cooking-oils" },
    // { label: "Spices", href: "/category/spices" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact-us" },
    // { label: "Help & Support", href: "/help-support" },
  ];

  return (
    <footer className="bg-[#3A2E24] text-[#F7F2EA] font-serif">

      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* =====================================
              BRAND
          ===================================== */}

          <div className="md:col-span-5">

            <Link
              href="/"
              className="inline-block font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#F7F2EA]"
            >
              Anaaj
            </Link>

            <p className="mt-5 max-w-sm text-sm md:text-[15px] leading-7 text-[#D8CBBE]">
              Thoughtfully sourced staples from trusted Indian farms,
              brought to your kitchen with care.
            </p>

            {/* Social */}
      <div className="flex items-center gap-3 mt-7">
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-9 h-9 rounded-full border border-[#6A594B] flex items-center justify-center text-[#D8CBBE] hover:bg-[#B85C38] hover:border-[#B85C38] hover:text-white transition-all duration-200"
  >
    <FaInstagram size={17} />
  </a>

  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="w-9 h-9 rounded-full border border-[#6A594B] flex items-center justify-center text-[#D8CBBE] hover:bg-[#B85C38] hover:border-[#B85C38] hover:text-white transition-all duration-200"
  >
    <FaFacebook size={17} />
  </a>
</div>
          </div>


          {/* =====================================
              SHOP
          ===================================== */}

          <div className="md:col-span-2">

            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F7F2EA] mb-5">
              Shop
            </h3>

            <nav className="flex flex-col gap-3">

              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-[#CBBCAF] hover:text-[#F7F2EA] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

            </nav>
          </div>


          {/* =====================================
              COMPANY
          ===================================== */}

          <div className="md:col-span-2">

            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F7F2EA] mb-5">
              Company
            </h3>

            <nav className="flex flex-col gap-3">

              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-[#CBBCAF] hover:text-[#F7F2EA] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

            </nav>
          </div>


          {/* =====================================
              CONTACT
          ===================================== */}

          <div className="md:col-span-3">

            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F7F2EA] mb-5">
              Get in touch
            </h3>

            <div className="space-y-4">

              {/* Location */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  strokeWidth={1.7}
                  className="shrink-0 mt-0.5 text-[#B85C38]"
                />

                <span className="text-sm leading-5 text-[#CBBCAF]">
                  New Delhi, India
                </span>

              </div>


              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-[#CBBCAF] hover:text-[#F7F2EA] transition-colors"
              >

                <Phone
                  size={17}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#B85C38]"
                />

                <span>+91 98765 43210</span>

              </a>


              {/* Email */}
              <a
                href="mailto:support@anaaj.com"
                className="flex items-center gap-3 text-sm text-[#CBBCAF] hover:text-[#F7F2EA] transition-colors"
              >

                <Mail
                  size={17}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#B85C38]"
                />

                <span>support@anaaj.com</span>

              </a>

            </div>

          </div>

        </div>
      </div>


      {/* =========================================
          BOTTOM BAR
      ========================================= */}

      <div className="border-t border-[#5A493D]">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">

            {/* Copyright */}

            <p className="text-xs text-[#AFA093] text-center md:text-left">
              © {year}{" "}
              <span className="text-[#D8CBBE]">
                Anaaj
              </span>
              . All rights reserved.
            </p>


            {/* Legal */}

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">

              <Link
                href="/privacy-policy"
                className="text-xs text-[#AFA093] hover:text-[#F7F2EA] transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-conditions"
                className="text-xs text-[#AFA093] hover:text-[#F7F2EA] transition-colors"
              >
                Terms of Service
              </Link>

              <Link
                href="/refund-policy"
                className="text-xs text-[#AFA093] hover:text-[#F7F2EA] transition-colors"
              >
                Refund Policy
              </Link>

            </nav>

          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;