
"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiInfo,
  FiCopy,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";
import { MdCancel, MdOutlineLocalShipping } from "react-icons/md";
import { RiTimerLine } from "react-icons/ri";
import { IoLocationOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import ReviewModal from "./../../../components/Models/ReviewModal";
import useAuth from "./../../../auth/useAuth";
import { FiStar } from "react-icons/fi"; 

import apiClient from "./../../../api/client";
import Loader from './../../../utility/Loader';

const statusConfig = {
  Delivered: {
    icon: <FiCheckCircle className="text-green-500" />,
    color: "bg-green-100 text-green-800",
    textColor: "text-green-600",
  },
  Processing: {
    icon: <FiClock className="text-amber-500" />,
    color: "bg-amber-100 text-amber-800",
    textColor: "text-amber-600",
  },
  "Out for Delivery": {
    icon: <FiTruck className="text-blue-500" />,
    color: "bg-blue-100 text-blue-800",
    textColor: "text-blue-600",
  },
  Cancelled: {
    icon: <MdCancel className="text-red-500" />,
    color: "bg-red-100 text-red-800",
    textColor: "text-red-600",
  },
  Shipped: {
    icon: <FiTruck className="text-blue-500" />,
    color: "bg-blue-100 text-blue-800",
    textColor: "text-blue-600",
  },
  "Pickup Generated": {
    icon: <FiPackage className="text-purple-500" />,
    color: "bg-purple-100 text-purple-800",
    textColor: "text-purple-600",
  },
};

const paymentMethodConfig = {
  PREPAID: {
    color: "bg-green-100 text-green-800",
    icon: "💳",
    label: "Prepaid",
  },
  COD: {
    color: "bg-blue-100 text-blue-800",
    icon: "📦",
    label: "Cash on Delivery",
  },
  "cash on delivery": {
    color: "bg-gray-100 text-gray-800",
    icon: "📦",
    label: "Cash on Delivery",
  },
  card: {
    color: "bg-purple-100 text-purple-800",
    icon: "💳",
    label: "Card",
  },
  razorpay: {
    color: "bg-blue-100 text-blue-800",
    icon: "💰",
    label: "Razorpay",
  },
  upi: {
    color: "bg-indigo-100 text-indigo-800",
    icon: "📱",
    label: "UPI",
  },
};

const shipmentStatusConfig = {
  "Pickup Generated": {
    label: "Pickup Generated",
    icon: <FiPackage className="text-purple-600" />,
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    badge: "bg-purple-100 text-purple-800",
    description: "Shipping label created. Courier will pick up soon.",
    stage: 1,
  },
  "Pickup Scheduled": {
    label: "Pickup Scheduled",
    icon: <FiClock className="text-blue-600" />,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    badge: "bg-blue-100 text-blue-800",
    description: "Pickup scheduled with the courier.",
    stage: 2,
  },
  "In Transit": {
    label: "In Transit",
    icon: <FiTruck className="text-amber-600" />,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    badge: "bg-amber-100 text-amber-800",
    description: "Your package is on the way to you.",
    stage: 3,
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    icon: <FiTruck className="text-orange-600" />,
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    badge: "bg-orange-100 text-orange-800",
    description: "Delivery agent is on the way to your address.",
    stage: 4,
  },
  Delivered: {
    label: "Delivered",
    icon: <FiCheckCircle className="text-green-600" />,
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    badge: "bg-green-100 text-green-800",
    description: "Package successfully delivered.",
    stage: 5,
  },
  Processing: {
    label: "Processing",
    icon: <FiClock className="text-gray-600" />,
    bg: "bg-gray-50",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    badge: "bg-gray-100 text-gray-800",
    description: "Order is being processed.",
    stage: 0,
  },
  "RTO Initiated": {
    label: "Return Initiated",
    icon: <MdCancel className="text-red-600" />,
    bg: "bg-red-50",
    border: "border-red-200",
    iconBg: "bg-red-100",
    badge: "bg-red-100 text-red-800",
    description: "Package is being returned to sender.",
    stage: 6,
  },
};

const getStatusColor = (status) => {
  const defaultConfig = shipmentStatusConfig["Processing"];
  return shipmentStatusConfig[status] || defaultConfig;
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [reviewProduct, setReviewProduct] = useState(null); // { _id, name, groupId }
const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const orderId = params.id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStatus = (deliveryStatus) => {
    const statusMap = {
      Processing: "Processing",
      Shipped: "Shipped",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    };
    return statusMap[deliveryStatus] || deliveryStatus;
  };

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get("/order/myorders-details", {
        id: orderId,
      });

      if (response.ok || response.data) {
        setOrder(response.data);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Error loading order details");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  //review 

  const openReviewModal = (item) => {
  
  if (!user) {
    toast.error("Please login to write a review");
    return;
  }
  // adjust these fields to match what your order item actually stores
  setReviewProduct({
    _id: item.product?._id ,
    name: item.name,
    groupId: item.product?.groupId,
  });
  setIsReviewModalOpen(true);
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

  const getShipmentTrackingTimeline = () => {
    if (!order?.shipment?.liveTrackingData?.shipment_track) {
      return [];
    }

    const shipmentTrack = order.shipment.liveTrackingData.shipment_track;
    const timeline = [];

    timeline.push({
      status: "Order Placed",
      date: order.createdAt,
      completed: true,
      description: "Your order has been confirmed",
      icon: <IoCheckmarkDoneCircle className="text-green-500" />,
    });

    shipmentTrack.forEach((track, index) => {
      if (track.current_status) {
        timeline.push({
          status: track.current_status,
          date: track.updated_time_stamp || order.updatedAt,
          completed: true,
          description: getTrackingStatusDescription(track.current_status),
          icon: getTrackingStatusIcon(track.current_status),
        });
      }
    });

    if (shipmentTrack.length > 0 && shipmentTrack[0].edd) {
      timeline.push({
        status: "Estimated Delivery",
        date: shipmentTrack[0].edd,
        completed: false,
        description: `Expected delivery by ${formatDate(shipmentTrack[0].edd)}`,
        icon: <RiTimerLine className="text-purple-500" />,
      });
    }

    const uniqueTimeline = timeline.reduce((acc, current) => {
      const isDuplicate = acc.find((item) => item.status === current.status);
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueTimeline.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;

      if (a.date && b.date) {
        return new Date(a.date) - new Date(b.date);
      }

      return 0;
    });
  };

  const getTrackingStatusDescription = (status) => {
    const descriptions = {
      "Pickup Generated": "Shipping label created. Courier will pick up soon.",
      "In Transit": "Package is on the way to destination.",
      "Out for Delivery": "Delivery agent is on the way to your address.",
      Delivered: "Package has been delivered successfully.",
      Processing: "Order is being processed by the courier.",
    };
    return descriptions[status] || "Package status updated";
  };

  const getTrackingStatusIcon = (status) => {
    const icons = {
      "Pickup Generated": <FiPackage className="text-purple-500" />,
      "In Transit": <FiTruck className="text-amber-500" />,
      "Out for Delivery": <FiTruck className="text-orange-500" />,
      Delivered: <FiCheckCircle className="text-green-500" />,
      Processing: <FiClock className="text-gray-500" />,
    };
    return icons[status] || <FiClock className="text-gray-500" />;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ea]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-red-500 text-2xl" />
          </div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchOrderDetails}
            className="px-6 py-2 bg-[#c1552c] text-white rounded-lg hover:bg-[#a84824] transition-colors mr-3 cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-[#e6ded2] rounded-lg cursor-pointer hover:bg-[#faf4ea] transition-colors text-[#2b1b12]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ea]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-gray-500 text-2xl" />
          </div>
          <p className="text-[#655849] text-lg mb-4">Order not found</p>
          <button
            onClick={() => router.push("/orders")}
            className="px-6 py-2 bg-[#c1552c] text-white rounded-lg hover:bg-[#a84824] transition-colors cursor-pointer"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const uiStatus = getOrderStatus(order.deliveryStatus);
  const statusInfo = statusConfig[uiStatus] || statusConfig.Processing;
  const paymentInfo =
    paymentMethodConfig[order.paymentMethod?.toUpperCase()] ||
    paymentMethodConfig["PREPAID"];

  const currentShipmentStatus =
    order?.shipment?.liveTrackingData?.shipment_track?.[0]?.current_status ||
    "Processing";
  const shipmentStatusInfo = getStatusColor(currentShipmentStatus);

  const shipmentTrack = order?.shipment?.liveTrackingData?.shipment_track || [];
  const currentTrack = shipmentTrack[0] || {};

  const trackingTimeline = getShipmentTrackingTimeline();

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 cursor-pointer text-[#655849] hover:text-[#2b1b12] transition-colors"
            >
              <FiArrowLeft />
              Back to Orders
            </button>
          </div>

          <div className="flex flex-row gap-4 justify-start items-center flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-[#2b1b12]">
                Order #{order._id?.slice(-8) || "N/A"}
              </h1>
              <p className="text-[#655849]">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${statusInfo.color}`}
            >
              {statusInfo.icon}
              {uiStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6">
              <h2 className="text-xl font-bold text-[#2b1b12] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#faf4ea] rounded-lg flex items-center justify-center">
                  <FiPackage className="text-[#c1552c]" />
                </div>
                Order Items ({order.orderItems?.length || 0})
              </h2>

            <div className="space-y-4">
  {order.orderItems?.map((item, index) => (
    <div
      key={index}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#faf4ea] rounded-xl hover:bg-[#f5ede1] transition-colors"
    >
      {/* Left: image + details */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#faf4ea] rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#2b1b12] text-sm sm:text-base truncate">
            {item.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
            <p className="text-xs sm:text-sm text-[#655849]">
              Qty: {item.qty}
            </p>
            <span className="text-xs sm:text-sm bg-white text-[#c1552c] px-2 py-0.5 rounded-full">
              {item?.itemWeight}g
            </span>
          </div>

          {item.flashId && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mt-1 inline-block">
              Flash Sale
            </span>
          )}
        </div>
      </div>

      {/* Right: price + action */}
      <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-3 sm:gap-0 sm:text-right shrink-0">
        <div className="flex flex-col items-start sm:items-end">
          {item.finalPrice < item.price ? (
            <>
              <span className="text-base sm:text-lg font-bold text-[#2b1b12]">
                ₹{item.finalPrice.toFixed(0)}
              </span>
              <span className="text-xs sm:text-sm text-[#8a8179] line-through">
                ₹{item.price.toFixed(0)}
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg font-bold text-[#2b1b12]">
              ₹{item.price.toFixed(0)}
            </span>
          )}
          <p className="text-xs sm:text-sm text-[#655849] mt-1">
            Total: ₹{(item.finalPrice || item.price).toFixed(0) * item.qty}
          </p>
        </div>

        {uiStatus === "Delivered" && (
          <button
            onClick={() => openReviewModal(item)}
            className="sm:mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#c1552c] border border-[#c1552c] rounded-lg hover:bg-[#c1552c] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <FiStar size={12} />
            Write Review
          </button>
        )}
      </div>
    </div>
  ))}
</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2b1b12] flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#faf4ea] rounded-lg flex items-center justify-center">
                    <FiTruck className="text-[#c1552c]" />
                  </div>
                  Shipment Tracking
                </h2>
                {order?.shipment?.liveTrackingData?.track_url && (
                  <a
                    href={order.shipment.liveTrackingData.track_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#faf4ea] text-[#c1552c] rounded-lg hover:bg-[#f5ede1] transition-colors cursor-pointer"
                  >
                    <FiExternalLink />
                    Tracking Url
                  </a>
                )}
              </div>

              <div className="space-y-6">
                {uiStatus === "Delivered" ? (
                  <div
                    className={`p-6 rounded-xl ${shipmentStatusInfo.bg} border ${shipmentStatusInfo.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${shipmentStatusInfo.iconBg}`}
                        >
                          {shipmentStatusInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-[#2b1b12]">
                            {currentShipmentStatus}
                          </h3>
                          <p className="text-[#655849] mt-1">
                            {shipmentStatusInfo.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <FiTruck className="text-[#8a8179] text-sm sm:text-base shrink-0" />
                              <span className="text-xs sm:text-sm text-[#2b1b12] truncate max-w-25 sm:max-w-37.5 md:max-w-none">
                                {currentTrack.courier_name ||
                                  order.courierName ||
                                  "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <IoLocationOutline className="text-[#8a8179] text-sm sm:text-base shrink-0" />
                              <span className="text-xs sm:text-sm text-[#2b1b12] truncate max-w-30 sm:max-w-45 md:max-w-none">
                                {currentTrack.origin
                                  ? `${currentTrack.origin} → ${currentTrack.destination || ""}`
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <FiCalendar className="text-[#8a8179] text-sm sm:text-base shrink-0" />
                              <span className="text-xs sm:text-sm text-[#2b1b12] whitespace-nowrap">
                                {currentTrack.delivered_date ||
                                currentTrack.updated_time_stamp
                                  ? formatDateTime(
                                      currentTrack.delivered_date ||
                                        currentTrack.updated_time_stamp,
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-[#faf4ea] p-4 rounded-xl border border-[#e6ded2]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[#faf4ea] rounded-full flex items-center justify-center">
                            <RiTimerLine className="text-[#c1552c]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#8a8179]">
                              Estimated Delivery
                            </p>
                            <p className="font-bold text-[#2b1b12]">
                              {currentTrack.edd
                                ? formatDate(currentTrack.edd)
                                : "Calculating..."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#faf4ea] p-4 rounded-xl border border-[#e6ded2]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[#faf4ea] rounded-full flex items-center justify-center">
                            <FiPackage className="text-[#c1552c]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#8a8179]">AWB Number</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono font-bold text-[#2b1b12]">
                                {order?.shipment?.awb || "Generating..."}
                              </p>
                              <button
                                onClick={() =>
                                  copyToClipboard(order?.shipment?.awb || "")
                                }
                                className="text-[#8a8179] hover:text-[#2b1b12] cursor-pointer transition-colors"
                                title="Copy AWB"
                              >
                                <FiCopy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#faf4ea] p-4 rounded-xl border border-[#e6ded2]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[#faf4ea] rounded-full flex items-center justify-center">
                            <MdOutlineLocalShipping className="text-[#c1552c]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#8a8179]">Courier</p>
                            <p className="font-bold text-[#2b1b12]">
                              {currentTrack.courier_name ||
                                order.courierName ||
                                "Not assigned"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#2b1b12] text-lg">
                        Tracking Timeline
                      </h4>

                      {trackingTimeline.length > 0 ? (
                        <div className="space-y-4">
                          {trackingTimeline.map((item, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    item.completed
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {item.icon}
                                </div>
                                {index < trackingTimeline.length - 1 && (
                                  <div
                                    className={`w-0.5 h-full flex-1 ${
                                      item.completed
                                        ? "bg-green-200"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="flex-1 pb-6">
                                <div className="flex items-center justify-between">
                                  <h5
                                    className={`font-semibold ${
                                      item.completed
                                        ? "text-[#2b1b12]"
                                        : "text-[#8a8179]"
                                    }`}
                                  >
                                    {item.status}
                                  </h5>
                                  {item.date && (
                                    <span className="text-sm text-[#8a8179]">
                                      {formatDateTime(item.date)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#655849] mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-[#e6ded2] rounded-xl">
                          <div className="w-16 h-16 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiClock className="text-[#8a8179] text-2xl" />
                          </div>
                          <p className="text-[#655849] mb-2">
                            Tracking updates will appear here
                          </p>
                          <p className="text-sm text-[#8a8179]">
                            Check back soon for shipment progress
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="bg-linear-to-r from-[#faf4ea] to-[#faf4ea] p-6 rounded-xl border border-[#e6ded2]">
                  <h4 className="font-semibold text-[#2b1b12] mb-4">
                    Package Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-[#8a8179] mb-1">Weight</p>
                      <p className="font-bold text-[#2b1b12]">
                        {currentTrack.weight || order.totalWeight || 0}g
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8a8179] mb-1">Packages</p>
                      <p className="font-bold text-[#2b1b12]">
                        {currentTrack.packages || 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8a8179] mb-1">Payment Type</p>
                      <p className="font-bold text-[#2b1b12]">
                        {order.paymentMethod === "PREPAID" ? "Prepaid" : "COD"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8a8179] mb-1">Last Updated</p>
                      <p className="font-bold text-[#2b1b12]">
                        {order?.shipment?.lastTrackedAt
                          ? formatDate(order.shipment.lastTrackedAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2b1b12] mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#655849]">
                  <span>Items Price</span>
                  <span className="font-semibold text-[#2b1b12]">
                    ₹{order?.itemsPrice.toFixed(0)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{order.discount}</span>
                  </div>
                )}

        

{Number(order?.codHandlingCharge) > 0 && (
  <div className="flex justify-between text-amber-600">
    <span>COD Handling Charge</span>
    <span className="font-semibold">
      +₹{Number(order.codHandlingCharge).toFixed(0)}
    </span>
  </div>
)}

{Number(order?.extraDiscount) > 0 && (
  <div className="flex justify-between text-green-600">
    <span>
      {order.paymentMethod === "PREPAID"
        ? "Online Payment Discount"
        : "Special Discount"}
      {/* {` (${order.extraDiscount}%)`} */}
    </span>
    <span className="font-semibold">
      -₹{Math.round((Number(order.itemsPrice) * Number(order.extraDiscount)) / 100)}
    </span>
  </div>
)}
                <div className="flex justify-between text-[#655849]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#2b1b12]">
                    {order.shippingPrice === 0 || order.freeDelivery
                      ? "FREE"
                      : `₹${order.shippingPrice.toFixed(0)}`}
                  </span>
                </div>

                <div className="border-t border-[#e6ded2] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#2b1b12]">
                    <span>Total</span>
                    <span className="text-2xl text-[#c1552c]">
                      ₹{order.totalPrice.toFixed(0)}
                    </span>
                  </div>
                  {order.freeDelivery && (
                    <p className="text-sm text-green-600 mt-1 text-right">
                      Free delivery applied
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-[#faf4ea] rounded-xl border border-[#e6ded2]">
                <div className="flex items-center gap-2 mb-2">
                  <FiCreditCard className="text-[#655849]" />
                  <h3 className="font-semibold text-[#2b1b12]">
                    Payment Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#655849]">Status:</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus === "completed"
                        ? "Completed"
                        : order.isPaid
                          ? "Paid"
                          : order.paymentStatus || "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#655849]">Method:</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${paymentInfo.color}`}
                    >
                      {order.paymentMethod === "PREPAID"
                        ? "Prepaid"
                        : order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod || "Prepaid"}
                    </span>
                  </div>
                  {order.isPaid && order.paidAt && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#655849]">Paid On:</p>
                      <span className="text-sm font-medium text-[#2b1b12]">
                        {formatDate(order.paidAt)}
                      </span>
                    </div>
                  )}
                  {order.paymentMethod === "PREPAID" && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#655849]">Type:</p>
                      <span className="text-sm font-medium text-[#2b1b12]">
                        Prepaid
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mb-6 p-4 bg-[#faf4ea] rounded-xl border border-[#e6ded2]">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-[#655849]" />
                    <h3 className="font-semibold text-[#2b1b12]">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {order.shippingAddress.area && (
                      <p className="text-sm text-[#655849]">
                        Area: {order.shippingAddress.area}
                      </p>
                    )}
                    {order.shippingAddress.landmark && (
                      <p className="text-sm text-[#655849]">
                        Landmark: {order.shippingAddress.landmark}
                      </p>
                    )}
                    <p className="text-sm text-[#655849]">
                      City: {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-[#655849]">
                      Phone: {order.shippingAddress.mobileNumber}
                    </p>
                    {order.shippingAddress.email && (
                      <p className="text-sm text-[#655849]">
                        Email: {order.shippingAddress.email}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
  isOpen={isReviewModalOpen}
  onClose={() => setIsReviewModalOpen(false)}
  productId={reviewProduct?._id}
  productName={reviewProduct?.name}
  onReviewSubmit={handleCreateReview}
  user={user}
/>
    </div>
  );
}
