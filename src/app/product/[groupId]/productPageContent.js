"use client";

import { useState, useEffect } from "react";
import ProductImageViewer from "./../../../components/Product/ProductImageViewer";
import ProductDetails from "./../../../components/Product/ProductDetails";
import apiClient from "../../../api/client";
import YouMightAlsoLike from "../../../components/YouMightAlsoLike/YouMightAlsoLike";
import ReviewModal from './../../../components/Models/ReviewModal';
import CustomerReview from './../../../components/Product/CustomerReview';
import useAuth from './../../../auth/useAuth';

const ProductPageContent = ({ products = [], groupId, initialVisualId }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [excludeProductId, setExcludeProductId] = useState(products?.[0]?._id);
  const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
      const { user } = useAuth();

   useEffect(() => {
    if (products?.length > 0 && !isInitialized) {
      let initialProduct = products[0];

      if (initialVisualId) {
        const foundProduct = products.find(
          (p) => p.visualId === initialVisualId,
        );
        if (foundProduct) {
          initialProduct = foundProduct;
        }
      }

      setCurrentProduct(initialProduct);
      setIsInitialized(true);
    }
  }, [products, initialVisualId, isInitialized]);

  useEffect(() => {
    if (excludeProductId && currentProduct?.category?._id) {
      getProductsYouMayAlsoLike();
    }
  }, [excludeProductId, currentProduct?.category?._id]);

    const getProductsYouMayAlsoLike = async () => {
    const response = await apiClient.post("/product/get-related-by-category", {
      category: currentProduct?.category?._id,
      excludeProductId: excludeProductId,
    });

    setYouMayAlsoLikeProducts(response.data.products);
  };

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

      console.log(
        "payload" , formData
      )

      // const response = await apiClient.post(
      //   "/product/create-product-review",
      //   formData,
      // );

      // if (response.ok) {
      //   toast.success(response.data.message || "Review added successfully");
      //   setIsReviewModalOpen(false);
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 800);
      // } else {
      //   toast.error(response.data.message || "Failed to add review");
      // }
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen w-full bg-[#faf4ea]">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-16 lg:max-w-6xl lg:mx-auto">
        <div className="lg:w-1/2 lg:max-w-lg lg:self-stretch">
          <div className="sticky top-32">
            <ProductImageViewer
              product={currentProduct}
              discount={currentProduct.discount}
            />
          </div>
        </div>

        <div className="lg:w-1/2 lg:max-w-lg">
          <ProductDetails
            products={products}
            groupId={groupId}
             initialVisualId={initialVisualId} 
            onVariantChange={handleVariantChange}
            currentProduct={currentProduct}
          />
        </div>
      </div>


         {youMayAlsoLikeProducts.length > 0 && (
        <div className=" md:mt-8">
          <YouMightAlsoLike youMayAlsoLikeProducts={youMayAlsoLikeProducts} />
        </div>
      )}


      
      {/* ✅ Customer Reviews Section */}
      <div id="customer-reviews-section" className="w-full lg:max-w-7xl mx-auto">
        <CustomerReview
          productId={currentProduct?._id}
          groupId={currentProduct?.groupId || groupId}
          handleCreateReview={openReviewModal}
          currentProduct={currentProduct}
        />
      </div>

      {/* ✅ Review Modal */}
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