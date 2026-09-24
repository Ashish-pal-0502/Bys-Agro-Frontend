
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";

const CustomerRatingCard = ({
  user,
  name,
  rating = 0,
  comment = "",
  createdAt,
  image,
  images,
}) => {
  const [showAllImages, setShowAllImages] = useState(false);

  const reviewImages = Array.isArray(images)
    ? images
    : images
    ? [images]
    : Array.isArray(image)
    ? image
    : image
    ? [image]
    : [];

  const displayImages = showAllImages
    ? reviewImages
    : reviewImages.slice(0, 3);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const userName =
    name ||
    (user && typeof user === "object" ? user.name : null) ||
    "Anonymous";

  const userAvatar =
    user && typeof user === "object" ? user.avatar : null;

  const initial = userName.charAt(0).toUpperCase() || "U";

  const gradients = [
    "from-[#2d5016] to-[#4a7c23]",
    "from-[#c9a227] to-[#e0b93a]",
    "from-[#5a6b4a] to-[#7a8b6a]",
    "from-[#8b6f1e] to-[#c9a227]",
  ];
  const gradientIndex = (initial.charCodeAt(0) || 0) % gradients.length;
  const avatarGradient = gradients[gradientIndex];

  return (
    <div className="group relative bg-white rounded-2xl p-4 md:p-4 border border-[#e8e2d0] hover:border-[#2d5016]/30 hover:shadow-[0_10px_30px_-10px_rgba(45,80,22,0.15)] transition-all duration-300">
      <div className="absolute left-0 top-6 bottom-6 w-1 bg-linear-to-b from-[#2d5016] via-[#c9a227] to-transparent rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarGradient} flex items-center justify-center shrink-0 shadow-md`}
        >
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-sm">{initial}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
            <h4 className="font-semibold text-[#1a2e1a] text-xs md:text-sm">
              {userName}
            </h4>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-[9px] font-semibold">
              ✓ Verified
            </span>
            {formattedDate && (
              <span className="text-[11px] text-[#a8b098]">
                {formattedDate}
              </span>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`text-xs ${
                  i < rating
                    ? "text-[#c9a227] fill-[#c9a227]"
                    : "text-[#d4cdb8]"
                }`}
              />
            ))}
            <span className="text-[11px] font-semibold text-[#5a6b4a] ml-1">
              {Number(rating).toFixed(1)}
            </span>
          </div>

          {/* Comment */}
          {comment && (
            <p className="text-[#3a4a2a] text-xs leading-relaxed mb-2 whitespace-pre-wrap">
              {comment}
            </p>
          )}

          {/* Images */}
          {reviewImages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => window.open(img, "_blank")}
                  className="relative rounded-lg overflow-hidden border border-[#e8e2d0] hover:border-[#c9a227] hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ width: "52px", height: "52px" }}
                >
                  <Image
                    src={img}
                    alt={`Review ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                </button>
              ))}

              {reviewImages.length > 3 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="rounded-lg bg-[#f5f0e1] flex flex-col items-center justify-center text-[#2d5016] text-[10px] font-semibold hover:bg-[#ebe4d0] transition-colors cursor-pointer border border-[#e8e2d0]"
                  style={{ width: "52px", height: "52px" }}
                >
                  <span className="text-sm font-bold">
                    +{reviewImages.length - 3}
                  </span>
                  <span className="text-[9px] text-[#7a8b6a]">more</span>
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