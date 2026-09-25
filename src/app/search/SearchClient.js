

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";
import apiClient from './../../api/client';
import ProductCard from './../../components/Cards/ProductCard';
import Loader from './../../utility/Loader';

const SearchClient = ({ initialQuery = "" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-focus on load
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      router.replace(`/search?q=${encodeURIComponent(searchQuery)}`);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);


  const performSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/product/search-product", {
        search: query,
        pageNumber: 1,
        pageSize: 20,
      });

      if (response.ok) {
        setSearchResults(response.data.products || []);
      } else {
        setError("Failed to search products");
      }
    } catch (err) {
      console.error(err);
      setError("Error searching products");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (!q.trim()) {
      setIsSearching(false);
      return;
    }
    performSearch(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.replace(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
    // Clear URL query parameter
    router.replace("/search");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Check if we should show results or empty state
  const showResults = searchQuery.trim() && !isSearching && !loading;
  const showEmptyState = !searchQuery.trim() && !loading && !error;
  const showNoResults = searchQuery.trim() && !loading && !isSearching && searchResults.length === 0 && !error;

  return (
    <div className="bg-[#faf4ea] font-figtree min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 ">
        {/* Header - Left Aligned */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IoSparklesOutline className="text-[#c1552c] text-2xl shrink-0" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2b1b12]">
              Search Products
            </h1>
          </div>
          <p className="text-[#5a4a3a] text-sm md:text-base">
            Find your favorite staples, pulses, oils, and more
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <div className="relative group">
            <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#8a8179] text-xl group-focus-within:text-[#c1552c] transition-colors" />

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pulses, oils, spices, dry fruits..."
              className="w-full pl-14 pr-36 py-4 text-base md:text-lg bg-white border-2 border-[#e6ded2] rounded-2xl focus:outline-none focus:border-[#c1552c] focus:shadow-[0_0_0_4px_rgba(193,85,44,0.1)] transition-all duration-200 text-[#2b1b12] placeholder:text-[#a0968c]"
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#c1552c] text-white text-sm md:text-base font-semibold px-5 py-2.5 rounded-xl hover:bg-[#ad4825] transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              Search
            </button>

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-28 top-1/2 transform -translate-y-1/2 text-[#8a8179] hover:text-[#c1552c] transition-colors cursor-pointer p-1 rounded-full hover:bg-[#faf4ea]"
              >
                <FiX size={22} />
              </button>
            )}
          </div>
        </form>

        {/* Results Section */}
        <div className="mt-10">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="text-[#c1552c] text-5xl mb-4">😕</div>
              <p className="text-[#c1552c] text-lg font-medium">{error}</p>
              <p className="text-[#8a8179] text-sm mt-2">Please try again</p>
            </div>
          )}

          {/* Results with products */}
          {!loading && !error && showResults && searchResults.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e6ded2]">
                <p className="text-[#5a4a3a]">
                  Found{" "}
                  <span className="font-bold text-[#2b1b12]">
                    {searchResults.length}
                  </span>{" "}
                  products for &quot;
                  <span className="font-semibold text-[#c1552c]">
                    {searchQuery}
                  </span>
                  &quot;
                </p>
                <span className="text-xs text-[#8a8179] bg-white px-3 py-1 rounded-full border border-[#e6ded2]">
                  {searchResults.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {searchResults.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* No Results Found - Only show when search is complete and no results */}
          {!loading && !error && showNoResults && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e6ded2]">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#2b1b12]">
                No products found
              </h3>
              <p className="text-[#8a8179] mt-2">
                We couldn&apos;t find any products matching &quot;
                <span className="text-[#c1552c] font-medium">
                  {searchQuery}
                </span>
                &quot;
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 text-[#c1552c] font-medium hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Empty State - Only show when no search query */}
          {!loading && !error && showEmptyState && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-white p-12 rounded-3xl shadow-sm max-w-lg text-center border border-[#e6ded2]">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#faf4ea]">
                  <FiSearch size={44} className="text-[#c1552c]" />
                </div>

                <h2 className="text-2xl font-serif font-bold text-[#2b1b12]">
                  What are you looking for?
                </h2>

                <p className="text-[#5a4a3a] mt-2">
                  Find premium quality pulses, oils, spices, dry fruits and more
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1.5 bg-[#faf4ea] text-[#5a4a3a] text-sm rounded-full border border-[#e6ded2]">
                    Toor Dal
                  </span>
                  <span className="px-3 py-1.5 bg-[#faf4ea] text-[#5a4a3a] text-sm rounded-full border border-[#e6ded2]">
                    Mustard Oil
                  </span>
                  <span className="px-3 py-1.5 bg-[#faf4ea] text-[#5a4a3a] text-sm rounded-full border border-[#e6ded2]">
                    Spices
                  </span>
                  <span className="px-3 py-1.5 bg-[#faf4ea] text-[#5a4a3a] text-sm rounded-full border border-[#e6ded2]">
                    Dry Fruits
                  </span>
                  <span className="px-3 py-1.5 bg-[#faf4ea] text-[#5a4a3a] text-sm rounded-full border border-[#e6ded2]">
                    Sugar
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#8a8179]">
                  <MdOutlineLocalOffer className="text-[#c1552c]" />
                  <span>Type above to start searching</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchClient;