
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";

const ProductImageViewer = ({ product }) => {
  const images = product?.images || [];
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    setIndex(0);
    setIsLoaded(false);
  }, [product]);

  useEffect(() => {
    // Preload next image
    if (images[index + 1]) {
      const img = new window.Image();
      img.src = images[index + 1];
    }
  }, [index, images]);

  const handleSwipeStart = (clientX) => {
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleSwipeMove = (clientX) => {
    if (!isDragging.current) return;
    const diff = startX.current - clientX;
    if (diff > 60) {
      setIndex((prev) => Math.min(prev + 1, images.length - 1));
      isDragging.current = false;
    }
    if (diff < -60) {
      setIndex((prev) => Math.max(prev - 1, 0));
      isDragging.current = false;
    }
  };

  const handleSwipeEnd = () => {
    isDragging.current = false;
  };

  const goPrev = () => setIndex((p) => Math.max(p - 1, 0));
  const goNext = () => setIndex((p) => Math.min(p + 1, images.length - 1));

  // Hover zoom on desktop
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (!images.length) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-[#F7F2EA] rounded-2xl border border-[#DAD0C4]">
        <span className="text-[#7D6F60] font-serif">No image available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ────────── DESKTOP LAYOUT ────────── */}
      <div className="hidden lg:flex gap-4">
        {/* Vertical Thumbnail Rail */}
        {images.length > 1 && (
          <div className="flex flex-col gap-3 shrink-0 max-h-150 overflow-y-auto no-scrollbar py-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FCFAF6] transition-all duration-200 group
                  ${
                    i === index
                      ? "ring-2 ring-[#B85C38] ring-offset-2 ring-offset-[#faf4ea]"
                      : "ring-1 ring-[#DAD0C4]/70 hover:ring-[#B85C38]/50"
                  }`}
              >
                <Image
                  src={img}
                  fill
                  sizes="80px"
                  className="object-cover"
                  alt={`Thumbnail ${i + 1}`}
                />
                {i !== index && (
                  <div className="absolute inset-0 bg-white/30 group-hover:bg-transparent transition-colors" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative flex-1 group">
          {/* Discount Badge */}
          {product?.discount > 0 && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-linear-to-br from-[#E56B5D] to-[#B85C38] text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg tracking-wide">
                {Math.round(product.discount)}% OFF
              </div>
            </div>
          )}

          {/* Image count chip */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-[#2b1b12] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#DAD0C4]/60">
              {index + 1} / {images.length}
            </div>
          )}

          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-square rounded-3xl overflow-hidden bg-[#FCFAF6] border border-[#DAD0C4]/60 shadow-[0_4px_30px_rgba(58,46,36,0.06)] cursor-zoom-in"
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-linear-to-br from-[#F7F2EA] to-[#FCFAF6] animate-pulse" />
            )}

            <Image
              src={images[index]}
              alt={product?.name || "Product image"}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
              onLoad={() => setIsLoaded(true)}
              className={`object-contain p-6 lg:p-10 transition-all duration-300 ${
                isZoomed ? "scale-[1.6]" : "scale-100"
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : {}
              }
            />

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#655849] text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#DAD0C4]/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <FiZoomIn size={12} />
              Hover to zoom
            </div>

            {/* Nav arrows (visible on hover) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  disabled={index === 0}
                  aria-label="Previous image"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-[#DAD0C4] flex items-center justify-center shadow-md transition-all z-20
                    ${
                      index === 0
                        ? "opacity-0 pointer-events-none"
                        : "opacity-0 group-hover:opacity-100 hover:bg-[#B85C38] hover:text-white hover:border-[#B85C38]"
                    }`}
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  disabled={index === images.length - 1}
                  aria-label="Next image"
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-[#DAD0C4] flex items-center justify-center shadow-md transition-all z-20
                    ${
                      index === images.length - 1
                        ? "opacity-0 pointer-events-none"
                        : "opacity-0 group-hover:opacity-100 hover:bg-[#B85C38] hover:text-white hover:border-[#B85C38]"
                    }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ────────── MOBILE / TABLET LAYOUT ────────── */}
      <div className="lg:hidden w-full">
        <div className="relative w-full group">
          {/* Discount Badge */}
          {product?.discount > 0 && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-linear-to-br from-[#E56B5D] to-[#B85C38] text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg tracking-wide">
                {Math.round(product.discount)}% OFF
              </div>
            </div>
          )}

          {/* Image count chip */}
          {images.length > 1 && (
            <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm text-[#2b1b12] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#DAD0C4]/60">
              {index + 1} / {images.length}
            </div>
          )}

          <div
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FCFAF6] border border-[#DAD0C4]/60 shadow-sm"
            onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
            onTouchEnd={handleSwipeEnd}
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-linear-to-br from-[#F7F2EA] to-[#FCFAF6] animate-pulse" />
            )}

            <Image
              src={images[index]}
              alt={product?.name || "Product image"}
              fill
              sizes="100vw"
              priority
              onLoad={() => setIsLoaded(true)}
              className="object-contain p-4 transition-opacity duration-300"
            />
          </div>

          {/* Dots */}
          {images.length > 1 && images.length <= 8 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-[#B85C38]" : "w-1.5 bg-[#DAD0C4]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Horizontal thumbnails below on mobile */}
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 overflow-x-auto no-scrollbar px-1 py-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative shrink-0 w-14 h-14 aspect-square rounded-lg overflow-hidden bg-[#FCFAF6] transition-all
                  ${
                    i === index
                      ? "ring-2 ring-[#B85C38] ring-offset-1 ring-offset-[#faf4ea]"
                      : "ring-1 ring-[#DAD0C4]/70"
                  }`}
              >
                <Image
                  src={img}
                  fill
                  sizes="56px"
                  className="object-cover"
                  alt={`Thumbnail ${i + 1}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageViewer;