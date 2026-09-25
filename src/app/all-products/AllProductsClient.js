

"use client";

import React, { useState, useEffect } from "react";
import apiClient from "../../api/client";
import ProductCard from "../../components/Cards/ProductCard";
import { IoFilter } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from './../../utility/pagination';
import Loader from './../../utility/Loader';

const AllProductsClient = ({ initialPage = 1 }) => {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showDesktopPriceSlider, setShowDesktopPriceSlider] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "";

  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    mostSelling: false,
    category: initialCategory,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    mostSelling: false,
    category: initialCategory,
  });

  // Fetch categories
  const getAllCategories = async () => {
    try {
      const response = await apiClient.get("/variation/category/get");
      if (response.ok) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Update category from URL
  useEffect(() => {
    const category = searchParams?.get("category") || "";
    if (category !== appliedFilters.category) {
      setTempFilters((prev) => ({ ...prev, category }));
      setAppliedFilters((prev) => ({ ...prev, category }));
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Fetch products
  const getAllProduct = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        pageNumber: page,
        pageSize: 20,
      };

      if (appliedFilters.category) {
        params.category = appliedFilters.category;
      }

      if (appliedFilters.minPrice > 0) {
        params.minPrice = appliedFilters.minPrice;
      }
      if (appliedFilters.maxPrice < 2000) {
        params.maxPrice = appliedFilters.maxPrice;
      }
      if (appliedFilters.mostSelling) {
        params.mostSelling = true;
      }

  

      const response = await apiClient.get("/product/get-all-products", params);


      if (response.ok) {
        setAllProducts(response.data.products || []);
        setTotalPages(response.data.pageCount || 1);
        setCurrentPage(page);
        setTotalProducts(
          response.data.total || response.data.products?.length || 0,
        );
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error fetching products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProduct(currentPage);
  }, [currentPage, appliedFilters]);

  const handleApplyFilters = () => {
    const updatedFilters = { ...tempFilters };
    setAppliedFilters({ ...tempFilters });
    setCurrentPage(1);
    setShowDesktopPriceSlider(false);
    setDrawerOpen(false);

    const query = new URLSearchParams({
      page: 1,
    });

    if (updatedFilters.category) {
      query.set("category", updatedFilters.category);
    }
    if (updatedFilters.minPrice > 0) {
      query.set("minPrice", updatedFilters.minPrice);
    }
    if (updatedFilters.maxPrice < 2000) {
      query.set("maxPrice", updatedFilters.maxPrice);
    }
    if (updatedFilters.mostSelling) {
      query.set("mostSelling", true);
    }

    router.push(`/all-products?${query.toString()}`);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    const resetFilters = {
      minPrice: 0,
      maxPrice: 2000,
      mostSelling: false,
      category: "",
    };

    setTempFilters(resetFilters);
    setDrawerOpen(false);
    setAppliedFilters(resetFilters);
    setShowDesktopPriceSlider(false);
    setCurrentPage(1);
    router.push("/all-products");
  };

  const PriceSlider = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Min Price</span>
              <span className="font-medium">₹{tempFilters.minPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={tempFilters.minPrice}
              onChange={(e) =>
                handleTempFilterChange("minPrice", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Price</span>
              <span className="font-medium">₹{tempFilters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={tempFilters.maxPrice}
              onChange={(e) =>
                handleTempFilterChange("maxPrice", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c1552c;
              border: 2px solid white;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              transition: all 0.1s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c1552c;
              border: 2px solid white;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              cursor: pointer;
            }
          `}</style>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-2">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Selected Range</div>
              <div className="font-bold text-gray-800 text-xl">
                ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ea] ">
        <Loader />
      </div>
    );
  }

  if (error && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ea] ">
        <div className="text-xl font-figtree text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-serif bg-[#faf4ea] py-8">
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-row sm:flex-row justify-between items-center sm:items-center mb-6 gap-4">
          <div className="hidden lg:flex items-center gap-6 flex-wrap relative">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Filters:</span>

              <button
                onClick={() => {
                  const newMostSellingValue = !tempFilters.mostSelling;
                  handleTempFilterChange("mostSelling", newMostSellingValue);
                  setAppliedFilters((prev) => ({
                    ...prev,
                    mostSelling: newMostSellingValue,
                  }));
                  setCurrentPage(1);
                }}
                className={`flex items-center cursor-pointer gap-1 px-4 py-2 rounded-lg border text-sm transition-all ${
                  tempFilters.mostSelling
                    ? "bg-[#c1552c] text-white border-[#c1552c]"
                    : "border-gray-300 text-gray-700 hover:bg-amber-50"
                }`}
              >
                {tempFilters.mostSelling && <MdCheck className="mr-1" />}
                Most Selling
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <span>Category:</span>
                  <span className="font-semibold text-[#c1552c] capitalize">
                    {tempFilters.category 
                      ? categories.find(c => c._id === tempFilters.category)?.name || tempFilters.category
                      : "All"}
                  </span>
                  {showCategoryDropdown ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-amber-100 p-2 z-40">
                    <button
                      onClick={() => {
                        handleTempFilterChange("category", "");
                        const updatedFilters = { ...tempFilters, category: "" };
                        setAppliedFilters(updatedFilters);
                        setCurrentPage(1);
                        setShowCategoryDropdown(false);
                        router.push("/all-products");
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
                        tempFilters.category === ""
                          ? "bg-amber-50 text-[#c1552c] font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      All
                      {tempFilters.category === "" && <MdCheck size={16} />}
                    </button>
                    {categories.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => {
                          handleTempFilterChange("category", item._id);
                          const updatedFilters = {
                            ...tempFilters,
                            category: item._id,
                          };
                          setAppliedFilters(updatedFilters);
                          setCurrentPage(1);
                          setShowCategoryDropdown(false);
                          const query = new URLSearchParams({
                            category: item._id,
                          });
                          router.push(`/all-products?${query.toString()}`);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm capitalize flex justify-between items-center transition ${
                          tempFilters.category === item._id
                            ? "bg-amber-50 text-[#c1552c] font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {item.name}
                        {tempFilters.category === item._id && <MdCheck size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setShowDesktopPriceSlider(!showDesktopPriceSlider)
                  }
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <span>Price:</span>
                  <span className="font-semibold text-[#c1552c]">
                    ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
                  </span>
                  {showDesktopPriceSlider ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </button>

                {showDesktopPriceSlider && (
                  <div className="absolute top-full -left-50 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-amber-100 p-6 z-40">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Price Range
                        </h3>
                        <button
                          onClick={() => setShowDesktopPriceSlider(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                      <PriceSlider />
                      <button
                        onClick={handleApplyFilters}
                        className="w-full mt-4 bg-[#c1552c] cursor-pointer text-white py-2.5 rounded-xl font-medium hover:bg-[#ad4825] transition"
                      >
                        Apply Price Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="lg:hidden flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm bg-white shadow-sm hover:bg-gray-50  text-gray-700"
            onClick={() => setDrawerOpen(true)}
          >
            <IoFilter size={18} /> Filters
            {(tempFilters.minPrice > 0 ||
              tempFilters.maxPrice < 2000 ||
              tempFilters.mostSelling ||
              tempFilters.category) && (
              <span className="ml-1 bg-[#c1552c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[
                  tempFilters.mostSelling,
                  tempFilters.minPrice > 0,
                  tempFilters.maxPrice < 2000,
                  tempFilters.category,
                ].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className="font-semibold text-gray-700 text-sm sm:text-base">
            {totalProducts} {totalProducts === 1 ? "product" : "products"} found
          </div>
        </div>

        {/* Active Filters Display */}
        {(appliedFilters.minPrice > 0 ||
          appliedFilters.maxPrice < 2000 ||
          appliedFilters.mostSelling ||
          appliedFilters.category) && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active filters:
              </span>

              {appliedFilters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Category: {categories.find(c => c._id === appliedFilters.category)?.name || appliedFilters.category}
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        category: "",
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                      router.push("/all-products");
                    }}
                    className="ml-1.5 text-amber-600 hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              {appliedFilters.mostSelling && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Most Selling
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        mostSelling: false,
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                    }}
                    className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              {(appliedFilters.minPrice > 0 ||
                appliedFilters.maxPrice < 2000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  Price: ₹{appliedFilters.minPrice} - ₹{appliedFilters.maxPrice}
                  <button
                    onClick={() => {
                      const updatedFilters = {
                        ...appliedFilters,
                        minPrice: 0,
                        maxPrice: 2000,
                      };
                      setTempFilters(updatedFilters);
                      setAppliedFilters(updatedFilters);
                      setCurrentPage(1);
                    }}
                    className="ml-1.5 text-amber-600 cursor-pointer hover:text-amber-800"
                  >
                    <IoClose size={16} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="lg:ml-auto text-center cursor-pointer text-sm text-amber-600 hover:text-amber-800 font-medium px-3 py-1.5 hover:bg-amber-100 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <section className="w-full flex justify-center items-center">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {allProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>

        {allProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-figtree text-lg">
              No products found. Try adjusting your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-6 py-2.5 bg-[#c1552c] cursor-pointer text-white rounded-lg font-medium hover:bg-[#ad4825] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="my-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-700 font-medium px-3 py-1 hover:bg-amber-50 rounded"
            >
              Clear all
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 h-[calc(100vh-140px)] overflow-y-auto">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Most Selling
            </h3>
            <button
              onClick={() =>
                handleTempFilterChange("mostSelling", !tempFilters.mostSelling)
              }
              className={`flex items-center w-full p-4 rounded-xl border-2 transition-all ${
                tempFilters.mostSelling
                  ? "bg-amber-50 border-[#c1552c] text-[#c1552c]"
                  : "border-gray-200 text-gray-700 hover:border-amber-300"
              }`}
            >
              <div
                className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                  tempFilters.mostSelling
                    ? "bg-[#c1552c] border-[#c1552c]"
                    : "border-gray-300"
                }`}
              >
                {tempFilters.mostSelling && (
                  <MdCheck className="text-white" size={16} />
                )}
              </div>
              <span className="font-medium text-base">
                Show Most Selling Products
              </span>
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Category
            </h3>

            <button
              onClick={() => handleTempFilterChange("category", "")}
              className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
                tempFilters.category === ""
                  ? "bg-amber-50 border-[#c1552c] text-[#c1552c]"
                  : "border-gray-200 text-gray-700 hover:border-amber-300"
              }`}
            >
              <div
                className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                  tempFilters.category === ""
                    ? "bg-[#c1552c] border-[#c1552c]"
                    : "border-gray-300"
                }`}
              >
                {tempFilters.category === "" && (
                  <MdCheck className="text-white" size={16} />
                )}
              </div>
              <span className="font-medium text-base capitalize">All</span>
            </button>

            {categories.map((item) => (
              <button
                key={item._id}
                onClick={() => handleTempFilterChange("category", item._id)}
                className={`flex items-center w-full p-4 rounded-xl border-2 transition-all mb-3 ${
                  tempFilters.category === item._id
                    ? "bg-amber-50 border-[#c1552c] text-[#c1552c]"
                    : "border-gray-200 text-gray-700 hover:border-amber-300"
                }`}
              >
                <div
                  className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center ${
                    tempFilters.category === item._id
                      ? "bg-[#c1552c] border-[#c1552c]"
                      : "border-gray-300"
                  }`}
                >
                  {tempFilters.category === item._id && (
                    <MdCheck className="text-white" size={16} />
                  )}
                </div>
                <span className="font-medium text-base capitalize">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          <PriceSlider />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white shadow-lg">
          <button
            onClick={() => {
              setDrawerOpen(false);
              handleApplyFilters();
            }}
            className="w-full bg-[#c1552c] text-white py-3.5 cursor-pointer rounded-xl font-semibold text-base shadow-md hover:bg-[#ad4825] transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {showDesktopPriceSlider && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDesktopPriceSlider(false)}
        />
      )}
    </div>
  );
};

export default AllProductsClient;