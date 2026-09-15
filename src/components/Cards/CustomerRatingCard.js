
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiStar, FiUser } from "react-icons/fi";

const CustomerRatingCard = ({
  user,
  rating,
  comment,
  createdAt,
  image,
  images,
}) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [imageError, setImageError] = useState({});

  const reviewImages = images || (image ? [image] : []);
  const displayImages = showAllImages
    ? reviewImages
    : reviewImages.slice(0, 3);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // Unique linear per user for avatar variety
  const gradients = [
    "from-[#2d5016] to-[#4a7c23]",
    "from-[#c9a227] to-[#e0b93a]",
    "from-[#5a6b4a] to-[#7a8b6a]",
    "from-[#8b6f1e] to-[#c9a227]",
  ];
  const gradientIndex =
    (initial.charCodeAt(0) || 0) % gradients.length;
  const avatarGradient = gradients[gradientIndex];

  return (
    <div className="group relative bg-white rounded-2xl p-5 md:p-6 border border-[#e8e2d0] hover:border-[#2d5016]/30 hover:shadow-[0_10px_30px_-10px_rgba(45,80,22,0.15)] transition-all duration-300">
      {/* Subtle accent line */}
      <div className="absolute left-0 top-6 bottom-6 w-1 bg-linear-to-b from-[#2d5016] via-[#c9a227] to-transparent rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-11 h-11 md:w-12 md:h-12 rounded-full bg-linear-to-br ${avatarGradient} flex items-center justify-center shrink-0 shadow-md`}
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user?.name || "User"}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">{initial}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
            <h4 className="font-semibold text-[#1a2e1a] text-sm md:text-base">
              {user?.name || "Anonymous"}
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-[10px] font-semibold">
              ✓ Verified
            </span>
            <span className="text-xs text-[#a8b098]">{formattedDate}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`text-sm ${
                  i < rating
                    ? "text-[#c9a227] fill-[#c9a227]"
                    : "text-[#d4cdb8]"
                }`}
              />
            ))}
            <span className="text-xs font-semibold text-[#5a6b4a] ml-1">
              {rating}.0
            </span>
          </div>

          {/* Comment */}
          <p className="text-[#3a4a2a] text-sm leading-relaxed mb-3">
            {comment}
          </p>

          {/* Images */}
          {reviewImages.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-3">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => window.open(img, "_blank")}
                  className="relative w-18 h-18 md:w-20 md:h-20 rounded-xl overflow-hidden border border-[#e8e2d0] hover:border-[#c9a227] hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ width: "72px", height: "72px" }}
                >
                  <Image
                    src={img}
                    alt={`Review ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={() =>
                      setImageError((prev) => ({ ...prev, [index]: true }))
                    }
                  />
                </button>
              ))}

              {reviewImages.length > 3 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="w-18 h-18 md:w-20 md:h-20 rounded-xl bg-[#f5f0e1] flex flex-col items-center justify-center text-[#2d5016] text-xs font-semibold hover:bg-[#ebe4d0] transition-colors cursor-pointer border border-[#e8e2d0]"
                >
                  <span className="text-base font-bold">
                    +{reviewImages.length - 3}
                  </span>
                  <span className="text-[10px] text-[#7a8b6a]">more</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRatingCard;