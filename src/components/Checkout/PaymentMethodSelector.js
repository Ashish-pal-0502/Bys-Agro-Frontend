"use client";

import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  isCodAvailable,
  checkingCod,
  formData,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/90 backdrop-blur-sm mb-6"
    >
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
          <FaWallet className="text-[#c1552c]" size={14} />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-[#2b1b12]">
          Payment Method
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {/* Online Payments */}
        <label
          className={`flex items-center px-3 py-4 border rounded-2xl cursor-pointer transition-all ${
            paymentMethod === "online payments"
              ? "border-[#c1552c] bg-[#faf4ea]"
              : "border-gray-200 hover:border-[#c1552c]"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="online payments"
            checked={paymentMethod === "online payments"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-[#c1552c] focus:ring-[#c1552c] shrink-0"
          />

          <div className="flex items-center gap-2 ml-3 overflow-x-auto no-scrollbar flex-nowrap">
            <div className="flex items-center gap-1 shrink-0">
              <FaMobileAlt className="text-[#c1552c] text-xs" />
              <span className="text-xs text-gray-700">UPI</span>
            </div>

            <div className="w-px h-4 bg-gray-300 shrink-0"></div>

            <div className="flex items-center gap-1 shrink-0">
              <FaCreditCard className="text-[#c1552c] text-xs" />
              <span className="text-xs text-gray-700">Credit/Debit</span>
            </div>

            <div className="w-px h-4 bg-gray-300 shrink-0"></div>

            <div className="flex items-center gap-1 shrink-0">
              <FaUniversity className="text-[#c1552c] text-xs" />
              <span className="text-xs text-gray-700">Netbanking</span>
            </div>

            <div className="w-px h-4 bg-gray-300 shrink-0"></div>

            <div className="flex items-center gap-1 shrink-0">
              <FaWallet className="text-[#c1552c] text-xs" />
              <span className="text-xs text-gray-700">Wallet</span>
            </div>
          </div>
        </label>

        {/* Cash on Delivery */}
        <label
          className={`flex items-center p-4 border rounded-2xl transition-all ${
            isCodAvailable
              ? "cursor-pointer hover:border-[#c1552c]"
              : "opacity-50 cursor-not-allowed"
          } ${
            paymentMethod === "cash on delivery"
              ? "border-[#c1552c] bg-[#faf4ea]"
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cash on delivery"
            checked={paymentMethod === "cash on delivery"}
            onChange={(e) => {
              if (isCodAvailable) {
                setPaymentMethod(e.target.value);
              }
            }}
            disabled={!isCodAvailable}
            className="w-5 h-5 text-[#c1552c] focus:ring-[#c1552c] disabled:cursor-not-allowed mt-1 shrink-0"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-regular text-xs text-gray-900">
                  Cash on Delivery
                </span>
              </div>
              {checkingCod && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-[#c1552c] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Checking...
                </div>
              )}
            </div>

            {!isCodAvailable && formData.zipCode.length === 6 && (
              <p className="text-sm text-red-500 mt-2">
                COD not available for this location
              </p>
            )}
          </div>
        </label>
      </div>
    </motion.div>
  );
}