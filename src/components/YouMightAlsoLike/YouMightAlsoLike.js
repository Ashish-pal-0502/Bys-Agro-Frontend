"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";
import ProductCard from "./../Cards/ProductCard";

function YouMightAlsoLike({ youMayAlsoLikeProducts = [] }) {
  const router = useRouter();

  if (!youMayAlsoLikeProducts || youMayAlsoLikeProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 font-serif">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e8dfd2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#B85C38] to-[#c1552c] flex items-center justify-center shadow-md">
            <FiShoppingBag className="text-white text-base" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-[#1a2e1a] tracking-tight">
              Shop Together
            </h2>
            <p className="text-xs text-[#7D6F60] mt-0.5 flex items-center gap-1.5">
              <TbLeaf className="text-[#3D5A45] text-sm" />
              Handpicked pairings from our pantry
            </p>
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {youMayAlsoLikeProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default YouMightAlsoLike;