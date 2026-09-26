

"use client";
import Image from "next/image";

const ResponsiveBanner = ({
  desktopImg,
  mobileImg,
  desktopAlt,
  mobileAlt,

  // NEW PROPS
  title,
  highlight,
  subtitle,
  highlightColor = "#c1552c",

  desktopHeight = 400,
  mobileHeight = 420,
}) => {
  return (
    <section className="w-full  relative">
      {/* Mobile */}
      <div className="block lg:hidden w-full relative">
        <Image
          src={mobileImg}
          alt={mobileAlt}
          width={490}
          height={mobileHeight}
          className="w-full h-auto object-cover"
        />
        {/* Text Overlay on Mobile */}
        <div className="absolute inset-0 flex flex-col justify-start px-8 py-3 items-start bg-black/20">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {title}{" "}
            <span
              className="font-bold italic"
              style={{ color: highlightColor }}
            >
              {highlight}
            </span>
          </h2>
          <p className="text-white/90 font-medium text-sm md:text-base mt-1 max-w-xs">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block w-full relative">
        <Image
          src={desktopImg}
          alt={desktopAlt}
          width={1400}
          height={desktopHeight}
          className="w-full h-auto object-cover"
        />
        {/* Text Overlay on Desktop */}
        <div className="absolute inset-0 flex flex-col justify-start py-3 items-start px-8 bg-black/10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            {title}{" "}
            <span
              className="font-bold italic"
              style={{ color: highlightColor }}
            >
              {highlight}
            </span>
          </h2>
          <p className="text-white/90 font-medium text-lg lg:text-xl mt-2 max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveBanner;