"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import FloatingLabelInput from './../UI/FloatingLableInput';


export default function AddressSection({
  formData,
  handleInputChange,
  handleZipCodeChange,
  errors,
  isFetchingPincode,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-[#e6ded2] p-2 md:p-4"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
          <FaMapMarkerAlt className="text-[#c1552c]" size={20} />
        </div>
        <h2 className="text-lg md:text-2xl font-semibold text-[#2b1b12]">
          Shipping Address
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <FloatingLabelInput
          label="First name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          required
        />

        <FloatingLabelInput
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />

        <div className="md:col-span-2">
          <FloatingLabelInput
            label="Address"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            error={errors.area}
            required
          />
        </div>

        <div className="relative">
          <FloatingLabelInput
            label="ZIP code"
            name="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            error={errors.zipCode}
            maxLength={6}
            inputMode="numeric"
            required
          />
          {isFetchingPincode && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-[#c1552c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <FloatingLabelInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          error={errors.city}
          required
        />

        <FloatingLabelInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          error={errors.state}
          required
        />

        <div className="md:col-span-2">
          <FloatingLabelInput
            label="Landmark (nearby place, optional)"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            error={errors.landmark}
          />
        </div>
      </div>
    </motion.div>
  );
}