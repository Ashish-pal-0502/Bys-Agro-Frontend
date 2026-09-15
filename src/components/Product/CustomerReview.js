

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomerRatingCard from "../Cards/CustomerRatingCard";
import apiClient from "./../../api/client";
import { FiMessageSquare, FiPlus } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";
import useAuth from "./../../auth/useAuth";
import Pagination from "./../../utility/pagination";

function CustomerReview({
  productId,
  handleCreateReview,
  currentProduct,
  groupId,
}) {
  const [reviews, setReviews] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getProductReview();
  }, [currentPage, currentProduct]);

  const getProductReview = async () => {
    try {
      const response = await apiClient.get(
        "/product/get-product-reviews-by-group-id",
        {
          groupId: groupId,
          pageNumber: currentPage,
          pageSize: 10,
        },
      );

      setAllData(response.data);
      setReviews(response.data.reviews);
      setTotalReviews(response.data.totalReviews);
      setTotalPages(response.data.pageCount || 1);
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
      setReviews([]);
      setTotalReviews(0);
      setTotalPages(1);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const staticRatings = {
    "RAW-WILD-FOREST-HONEY": { rating: 4.6, reviews: "50+" },
    "PURE-ACACIA-HONEY": { rating: 4.9, reviews: "100+" },
    "PURE-JAMUN-HONEY": { rating: 4.8, reviews: "100+" },
    "PURE-TULSI-HONEY": { rating: 4.8, reviews: "100+" },
    "PURE-HIMALAYAN-HONEY": { rating: 4.7, reviews: "50+" },
    "PURE-SUNDERBAN-HONEY": { rating: 4.7, reviews: "50+" },
    "BLUE-BUTTERFLY-PEA-TEA": { rating: 4.9, reviews: "100+" },
    "HIBISCUS-PETAL-TEA": { rating: 4.8, reviews: "100+" },
    "TURMERIC-GREEN-TEA": { rating: 4.7, reviews: "50+" },
    "MORINGA-GREEN-TEA": { rating: 4.7, reviews: "50+" },
    "APPLE-CINNAMON-GREEN-TEA": { rating: 4.8, reviews: "50+" },
    "KASHMIRI-KAHWA": { rating: 4.9, reviews: "100+" },
  };

  const productKey = currentProduct?.visualId
    ?.split("-")
    ?.slice(0, -1)
    ?.join("-");

  const staticData = staticRatings[productKey] || null;
  const displayRating = staticData?.rating || 0;
  const displayReviews = staticData?.reviews || "";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[#e8e2d0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2d5016] to-[#4a7c23] flex items-center justify-center shadow-md">
            <TbLeaf className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-[#1a2e1a] tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-xs text-[#7a8b6a] mt-0.5">
              Real experiences from our community
            </p>
          </div>
        </div>

        {user && reviews?.length > 0 && (
          <button
            onClick={handleCreateReview}
            className="group inline-flex items-center gap-2 bg-linear-to-r from-[#2d5016] to-[#4a7c23] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-[#2d5016]/20 hover:shadow-xl hover:shadow-[#2d5016]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <FiPlus className="text-base group-hover:rotate-90 transition-transform duration-300" />
            Write a Review
          </button>
        )}
      </div>

      {reviews?.length === 0 ? (
        /* Empty State */
        <div className="relative overflow-hidden text-center py-16 px-6 rounded-3xl bg-linear-to-br from-[#f5f0e1] via-[#faf6e9] to-[#f5f0e1] border border-[#e8e2d0]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#2d5016]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#c9a227]/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center gap-5">
            <div className="p-5 bg-white rounded-full shadow-md border border-[#e8e2d0]">
              <FiMessageSquare className="text-3xl text-[#2d5016]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a2e1a] mb-2">
                No Reviews Yet
              </h3>
              <p className="text-[#5a6b4a] max-w-md mx-auto text-sm leading-relaxed">
                Be the first to share your experience with this product. Your
                review will help others make better choices.
              </p>
            </div>

            {user && (
              <button
                onClick={handleCreateReview}
                className="mt-2 inline-flex items-center gap-2 bg-linear-to-r from-[#2d5016] to-[#4a7c23] text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-[#2d5016]/20 hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <FiPlus className="text-base" />
                Write the First Review
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Rating Summary */
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10 p-6 md:p-8 rounded-3xl bg-linear-to-br from-[#f5f0e1] to-[#faf6e9] border border-[#e8e2d0]">
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-sm border border-[#e8e2d0]">
              <span className="text-3xl font-bold text-[#2d5016]">
                {displayRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-[#7a8b6a] font-medium mt-0.5">
                OUT OF 5
              </span>
            </div>

            <div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image
                    key={i}
                    src="/icons/rating-star.png"
                    alt="star"
                    width={20}
                    height={20}
                    className={
                      i < Math.floor(displayRating) ? "" : "opacity-30"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-[#5a6b4a]">
                Based on{" "}
                <span className="font-semibold text-[#2d5016]">
                  {displayReviews} reviews
                </span>
              </p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-16 bg-[#e8e2d0]" />

          <p className="text-sm text-[#5a6b4a] lg:max-w-xs leading-relaxed">
            Trusted by our community. Every review is verified from real
            purchases.
          </p>
        </div>
      )}

      {reviews?.length > 0 && (
        <>
          <div className="flex flex-col gap-5">
            {reviews.map((r, i) => (
              <CustomerRatingCard key={i} {...r} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerReview;