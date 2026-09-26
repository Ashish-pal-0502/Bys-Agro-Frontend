
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiPackage, FiTruck } from "react-icons/fi";
import { MdCancel, MdOutlineReceiptLong } from "react-icons/md";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import Pagination from './../../utility/pagination';
import Loader from './../../utility/Loader';

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
};

const paymentMethodConfig = {
  "cash on delivery": {
    color: "bg-gray-100 text-gray-800",
    icon: "📦",
    label: "Cash on Delivery",
  },
  "online payments": {
    color: "bg-blue-100 text-blue-800",
    icon: "💰",
    label: "online payments",
  },
  upi: {
    color: "bg-indigo-100 text-indigo-800",
    icon: "📱",
    label: "UPI",
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      Shipped: "Out for Delivery",
      Delivered: "Delivered",
      Cancelled: "Cancelled",
    };
    return statusMap[deliveryStatus] || deliveryStatus;
  };

  const handleViewDetails = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  const getMyOrders = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get("/order/myorders1", {
        userId: user.id,
        pageSize: 10,
        pageNumber: currentPage,
      });

      if (response.ok || response.data) {
        const ordersData = Array.isArray(response.data)
          ? response.data
          : response.ok
            ? response.data?.orders || []
            : [];

        setOrders(ordersData);
        setTotalPages(response.data.pageCount || 1);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error loading your orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getMyOrders(currentPage);
    } else {
      setIsLoading(false);
    }
  }, [user, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#faf4ea] flex items-center justify-center">
        <Loader />
      </div>
    );
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
            onClick={getMyOrders}
            className="px-6 py-2 bg-[#c1552c] text-white rounded-lg hover:bg-[#a84824] transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#faf4ea] font-serif">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="text-xl md:text-3xl font-bold text-[#2b1b12]">My Orders</h1>
      <p className="text-[#655849]">Track and manage your purchases</p>
    </div>


          {orders.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6 mb-8">
            <h3 className="text-xl font-bold text-[#2b1b12] mb-4">
              Orders Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">
                  {
                    orders.filter(
                      (o) => getOrderStatus(o.deliveryStatus) === "Delivered",
                    ).length
                  }
                </p>
                <p className="text-[#655849]">Delivered</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">
                  {
                    orders.filter(
                      (o) =>
                        getOrderStatus(o.deliveryStatus) === "Out for Delivery",
                    ).length
                  }
                </p>
                <p className="text-[#655849]">In Transit</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-3xl font-bold text-amber-600">
                  {
                    orders.filter(
                      (o) => getOrderStatus(o.deliveryStatus) === "Processing",
                    ).length
                  }
                </p>
                <p className="text-[#655849]">Processing</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-3xl font-bold text-gray-600">
                  {
                    orders.filter(
                      (o) => getOrderStatus(o.deliveryStatus) === "Cancelled",
                    ).length
                  }
                </p>
                <p className="text-[#655849]">Cancelled</p>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#e6ded2]">
            <div className="w-24 h-24 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-[#c1552c] text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#2b1b12] mb-2">
              No orders yet
            </h3>
            <p className="text-[#655849] mb-6">
              You haven&apos;t placed any orders yet
            </p>
            <button
              onClick={() => router.replace("/all-products")}
              className="px-6 py-3 cursor-pointer bg-[#c1552c] text-white rounded-xl font-semibold hover:bg-[#a84824] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const uiStatus = getOrderStatus(order.deliveryStatus);

              const statusInfo =
                statusConfig[uiStatus] || statusConfig.Processing;
              const paymentInfo =
                paymentMethodConfig[order?.paymentMethod?.toLowerCase()] ||
                paymentMethodConfig["cash on delivery"];

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] overflow-hidden"
                >
                  <div className="p-6 border-b border-[#e6ded2]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#2b1b12]">
                            Order #{order._id?.slice(-8) || "N/A"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${statusInfo.color}`}
                          >
                            {statusInfo.icon}
                            {uiStatus}
                          </span>
                        </div>
                        <p className="text-[#655849]">
                          Placed on {formatDateTime(order.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#c1552c]">
                          ₹
                          {(
                            order.totalPrice?.toFixed(0) || "0"
                          ).toLocaleString()}
                        </p>
                        <p className="text-sm text-[#8a8179]">
                          {order.orderItems?.length || 0} item
                          {(order.orderItems?.length || 0) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                      {order.orderItems?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-[#faf4ea] rounded-xl p-3"
                        >
                          <div className="w-16 h-16 bg-[#faf4ea] rounded-lg flex items-center justify-center">
                            <Image
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-[#2b1b12]">
                              {item.name}
                            </p>
                            <p className="text-sm text-[#655849]">
                              Qty: {item.qty} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-50 rounded-xl p-3">
                          <span className="text-[#655849] font-medium">
                            +{order.orderItems.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-[#faf4ea] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MdOutlineReceiptLong className="text-[#655849]" />
                          <h4 className="font-semibold text-[#2b1b12]">
                            Payment
                          </h4>
                        </div>
                        <p className="text-sm text-[#655849]">
                          Status:{" "}
                          <span
                            className={
                              order.isPaid
                                ? "text-green-600 font-medium"
                                : "text-amber-600 font-medium"
                            }
                          >
                            {order.isPaid ? "Paid" : order?.paymentStatus}
                          </span>
                        </p>
                        <div className="flex text-sm text-[#655849] items-center gap-2 mb-1">
                          Method:
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${paymentInfo.color}`}
                          >
                            {order?.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#faf4ea] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTruck className="text-[#655849]" />
                          <h4 className="font-semibold text-[#2b1b12]">
                            Shipping
                          </h4>
                        </div>
                        {order.shippingAddress ? (
                          <>
                            <p className="text-sm text-[#655849] line-clamp-2">
                              {order.shippingAddress.area}{" "}
                              {order.shippingAddress.landmark}{" "}
                              {order.shippingAddress.city}
                            </p>
                            <p className="text-xs text-[#8a8179] mt-1">
                              {order.shippingAddress.state} -{" "}
                              {order.shippingAddress.pincode}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-[#655849]">
                            Address not available
                          </p>
                        )}
                      </div>

                      <div className="bg-[#faf4ea] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiClock className="text-[#655849]" />
                          <h4 className="font-semibold text-[#2b1b12]">
                            Timeline
                          </h4>
                        </div>
                        {order.deliveredAt ? (
                          <p className="text-sm text-[#655849]">
                            Delivered on {formatDate(order.deliveredAt)}
                          </p>
                        ) : (
                          <p className="text-sm text-[#655849]">
                            Last updated: {formatDate(order.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-[#e6ded2] bg-[#faf4ea]">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="px-6 py-3 bg-[#c1552c] cursor-pointer text-white rounded-xl font-semibold hover:bg-[#a84824] transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      
      </div>
    </div>
  );
}