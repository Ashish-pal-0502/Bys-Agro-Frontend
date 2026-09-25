

"use client";

import { useState, useEffect } from "react";
import ProductImageViewer from "./../../../components/Product/ProductImageViewer";
import ProductDetails from "./../../../components/Product/ProductDetails";
import YouMightAlsoLike from "../../../components/YouMightAlsoLike/YouMightAlsoLike";
import ReviewModal from "./../../../components/Models/ReviewModal";
import CustomerReview from "./../../../components/Product/CustomerReview";
import useAuth from "./../../../auth/useAuth";
import toast from "react-hot-toast";
import apiClient from "./../../../api/client";

const ProductPageContent = ({ products = [], groupId, initialVisualId }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [excludeProductId, setExcludeProductId] = useState(products?.[0]?._id);
  const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (products?.length > 0 && !isInitialized) {
      let initialProduct = products[0];

      if (initialVisualId) {
        const foundProduct = products.find((p) => p.visualId === initialVisualId);
        if (foundProduct) initialProduct = foundProduct;
      }

      setCurrentProduct(initialProduct);
      setIsInitialized(true);
    }
  }, [products, initialVisualId, isInitialized]);


  const getProductsYouMayAlsoLike = async () => {
    try {
      const response = await apiClient.post("/product/get-related-by-category", {
        category: currentProduct?.category?._id,
        excludeProductId,
      });
      setYouMayAlsoLikeProducts(response.data.products);
    } catch (err) {
      console.error("Failed to load related products:", err);
    }
  };

  useEffect(() => {
    if (excludeProductId && currentProduct?.category?._id) {
      getProductsYouMayAlsoLike();
    }
  }, [excludeProductId, currentProduct?.category?._id]);

  const handleVariantChange = (selectedProduct) => {
    setCurrentProduct(selectedProduct);
    setExcludeProductId(selectedProduct._id);
  };

  const handleCreateReview = async (formData) => {
    try {
      if (!user) {
        toast.error("Please login to write a review");
        return;
      }

      const response = await apiClient.post("/product/create-product-review", formData);

      if (response.ok) {
        toast.success(response.data.message || "Review added successfully");
        setIsReviewModalOpen(false);
        setReviewRefreshKey((k) => k + 1);
      } else {
        toast.error(response.data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Something went wrong");
    }
  };

  const openReviewModal = () => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    setIsReviewModalOpen(true);
  };

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#B85C38] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#655849] font-serif tracking-wide">Loading product…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#faf4ea] font-serif">
      {/* ─── Main Product Section ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="lg:w-1/2 lg:sticky lg:top-28">
            <ProductImageViewer
              product={currentProduct}
              discount={currentProduct.discount}
            />
          </div>

          {/* Details */}
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <ProductDetails
              products={products}
              groupId={groupId}
              initialVisualId={initialVisualId}
              onVariantChange={handleVariantChange}
              currentProduct={currentProduct}
            />
          </div>
        </div>
      </div>


      {/* ─── You May Also Like ─── */}
      {youMayAlsoLikeProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 ">
          <YouMightAlsoLike youMayAlsoLikeProducts={youMayAlsoLikeProducts} />
        </div>
      )}

      {/* ─── Customer Reviews ─── */}
      <div id="customer-reviews-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 ">
        <CustomerReview
          productId={currentProduct?._id}
          groupId={currentProduct?.groupId || groupId}
          handleCreateReview={openReviewModal}
          currentProduct={currentProduct}
          refreshKey={reviewRefreshKey}
        />
      </div>

      {/* ─── Review Modal ─── */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={currentProduct?._id}
        productName={currentProduct?.name}
        onReviewSubmit={handleCreateReview}
        user={user}
      />
    </div>
  );
};

export default ProductPageContent;