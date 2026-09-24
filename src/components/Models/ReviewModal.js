
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiX, FiUpload, FiCheckCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { TbLeaf } from "react-icons/tb";
import toast from "react-hot-toast";
import apiClient from "./../../api/client";
import Image from "next/image";

const ReviewModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmit,
  user,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload valid images (JPEG, PNG, WebP)");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Each image should be less than 5MB");
        return;
      }
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("image", file));

    try {
      setUploadingImage(true);
      const response = await apiClient.post(
        "/uploads/uploadMultiple",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setImageUrls((prev) => [...prev, ...response.data]);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please add rating & review");
      return;
    }
    if (comment.length < 5) {
      toast.error("Review should be at least 5 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReviewSubmit({
        rating,
        comment,
        userId: user?.id,
        productId,
        image: imageUrls?.length > 0 ? imageUrls : null,
      });

      // setRating(0);
      // setComment("");
      // setImageFiles([]);
      // setImageUrls([]);
      // onClose();
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      handleImageUpload(files);
    }
  };

  const removeImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    if (imageUrls.length <= 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
        <motion.div
          className="absolute inset-0 bg-[#1a2e1a]/70 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          ref={modalRef}
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-w-md md:max-w-xl max-h-[92vh] bg-[#fdfcf7] rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-[#e8e2d0]"
        >
          {/* Decorative top linear */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2d5016] via-[#c9a227] to-[#2d5016] z-20" />

          {/* Leaf decorative corner */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#f5f0e1] rounded-full opacity-50 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#2d5016]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="overflow-y-auto scrollbar-hide max-h-[calc(92vh-6px)] relative">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#2d5016] to-[#4a7c23] flex items-center justify-center shadow-md">
                      <TbLeaf className="text-white text-lg" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#1a2e1a] tracking-tight">
                      Share Your Experience
                    </h2>
                  </div>
                  <p className="text-sm text-[#5a6b4a] ml-11">
                    Reviewing{" "}
                    <span className="font-semibold text-[#2d5016]">
                      {productName}
                    </span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#f5f0e1] rounded-full transition-all cursor-pointer group"
                >
                  <FiX className="text-xl text-[#7a8b6a] group-hover:text-[#2d5016] group-hover:rotate-90 transition-all duration-300" />
                </button>
              </div>

              {/* Rating Section */}
              <div className="mb-6 p-5 rounded-2xl bg-linear-to-br from-[#f5f0e1] to-[#faf6e9] border border-[#e8e2d0]">
                <label className="block text-sm font-semibold text-[#1a2e1a] mb-4">
                  Your Rating <span className="text-[#c9a227]">*</span>
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transform transition-all hover:scale-125 active:scale-95"
                      >
                        <FiStar
                          className={`text-3xl transition-all duration-200 ${
                            star <= (hoverRating || rating)
                              ? "text-[#c9a227] fill-[#c9a227] drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]"
                              : "text-[#d4cdb8]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#2d5016]">
                      {rating ? rating.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-sm text-[#7a8b6a]">/ 5.0</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-[#7a8b6a]">Poor</span>
                  {rating > 0 && (
                    <motion.span
                      key={rating}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-[#2d5016] bg-[#2d5016]/10 px-3 py-1 rounded-full"
                    >
                      {ratingLabels[rating - 1]}
                    </motion.span>
                  )}
                  <span className="text-xs text-[#7a8b6a]">Excellent</span>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1a2e1a] mb-3">
                  Your Review <span className="text-[#c9a227]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love about this product? How was your experience?"
                    className="w-full px-4 py-3.5 text-[#1a2e1a] bg-white border-2 border-[#e8e2d0] rounded-2xl focus:ring-2 focus:ring-[#2d5016]/30 focus:border-[#2d5016] outline-none transition-all resize-none placeholder:text-[#a8b098] text-sm"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-[#a8b098] font-medium">
                    {comment.length}/500
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1a2e1a] mb-3">
                  Add Photos{" "}
                  <span className="text-[#7a8b6a] font-normal">
                    (Optional {imageUrls.length > 0 && `· ${imageUrls.length}/5`})
                  </span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                    {imageUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#e8e2d0] shadow-sm">
                          <Image
                            src={url}
                            alt={`Review ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-[#c9a227] text-white p-1.5 rounded-full hover:bg-[#a8881c] cursor-pointer shadow-md transition-all hover:scale-110"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {imageUrls.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full h-28 border-2 border-dashed border-[#c9a227]/40 rounded-2xl bg-[#f5f0e1]/50 hover:bg-[#f5f0e1] hover:border-[#c9a227] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 group"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-8 h-8 border-3 border-[#2d5016] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-[#2d5016] font-medium">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 bg-[#2d5016]/10 rounded-full group-hover:bg-[#2d5016]/20 transition-colors">
                          <FiUpload className="text-xl text-[#2d5016]" />
                        </div>
                        <span className="text-sm text-[#1a2e1a] font-medium">
                          {imageUrls.length === 0
                            ? "Upload photos"
                            : "Add more"}
                        </span>
                        <span className="text-[10px] text-[#a8b098]">
                          JPEG · PNG · WebP (max 5MB)
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Submit */}
              <div className="sticky bottom-0 bg-linear-to-t from-[#fdfcf7] via-[#fdfcf7] to-transparent pt-4 pb-1 -mx-6 md:-mx-8 px-6 md:px-8">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 px-4 text-[#5a6b4a] font-semibold bg-[#f5f0e1] hover:bg-[#ebe4d0] rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !rating ||
                      !comment.trim() ||
                      uploadingImage ||
                      comment.length < 5
                    }
                    className="flex-1 py-3.5 px-4 font-semibold text-white bg-linear-to-r from-[#2d5016] to-[#4a7c23] hover:from-[#1f3a0f] hover:to-[#3a6219] rounded-2xl shadow-lg shadow-[#2d5016]/20 hover:shadow-xl hover:shadow-[#2d5016]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-lg" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#a8b098] mt-3 text-center">
                  Your review helps others make better choices
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;