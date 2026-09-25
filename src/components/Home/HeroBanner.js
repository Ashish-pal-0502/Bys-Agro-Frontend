"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ShopDrawer from "./../Navbar/ShopDrawer";

const FALLBACK_IMAGES = [
  {
    src: "https://bys-agro-bucket.s3.ap-south-1.amazonaws.com/1788846789116_21656542.webp",
    alt: "Assorted Indian spices",
  },
];

const HeroBanner = ({ images = [] }) => {

  const router = useRouter();
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  // Use backend images if available, otherwise fallback
  const slides = images.length > 0 ? images : FALLBACK_IMAGES;

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // Reset index if slides array shrinks
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleShopNow = () => {
    router.push("/all-products");
  };

  const handleExploreCategories = () => {
    setIsShopDrawerOpen(true);
  };

  return (
    <>
      <section className="bg-[#f4e6d2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
            
            {/* Right Side - Image (Shows first on mobile) */}
            <div 
              className="w-full lg:order-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="relative w-full h-full">
                  {slides.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentIndex
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-110 z-0"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || "Banner image"}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-500 cursor-pointer ${
                        index === currentIndex
                          ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#c1552c] rounded-full"
                          : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white/80 rounded-full"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Left Side - Text (Shows below image on mobile) */}
            <div className="lg:order-1 text-center lg:text-left">
              <p className="text-[#B45B2E] uppercase tracking-widest text-xs font-regular mb-3 sm:mb-5 animate-heroFadeIn">
                Farm-Graded Staples
              </p>

              <h1 className="font-serif text-[#2D2018] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight animate-heroSlideUp">
                Pure dal, oil &
                <br className="hidden sm:block" />
                spices for the
                <br className="hidden sm:block" />
                everyday kitchen
              </h1>

              <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg text-[#5F5650] max-w-lg mx-auto lg:mx-0 leading-7 sm:leading-8 animate-heroSlideUp animation-delay-200">
                Lab-tested staples sourced directly from Indian farms, delivered
                to your door within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 animate-heroSlideUp animation-delay-400">
                <button
                  onClick={handleShopNow}
                  className="w-full sm:w-auto bg-[#c1552c] cursor-pointer hover:bg-[#AF5528] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition transform hover:scale-105 duration-300"
                >
                  Shop Now
                </button>

                <button
                  onClick={handleExploreCategories}
                  className="hidden sm:block w-full sm:w-auto border cursor-pointer border-[#6F5E52] text-[#3E322A] hover:bg-[#EFE4D7] font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition transform hover:scale-105 duration-300"
                >
                  Explore Categories
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Shop Drawer */}
      <ShopDrawer
        isOpen={isShopDrawerOpen}
        onClose={() => setIsShopDrawerOpen(false)}
      />
    </>
  );
};

export default HeroBanner;