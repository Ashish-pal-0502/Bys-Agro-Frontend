"use client";

import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import FloatingLabelInput from './../UI/FloatingLableInput';


export default function ContactSection({
  formData,
  handleInputChange,
  handlePhoneChange,
  errors,
  phoneHelperText,
  setFormData,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-[#e6ded2] p-2 md:p-4"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-[#faf4ea] rounded-2xl flex items-center justify-center mr-4">
          <FaUser className="text-[#c1552c]" size={20} />
        </div>
        <h2 className="text-lg md:text-2xl font-semibold text-[#2b1b12]">
          Contact Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <FloatingLabelInput
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        <FloatingLabelInput
          label="Phone number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          onKeyDown={(e) => {
            const isFirstDigit =
              formData.phone.length === 0 ||
              (e.target.selectionStart === 0 &&
                e.target.selectionEnd === formData.phone.length);
            if (isFirstDigit && /^[0-5]$/.test(e.key)) {
              e.preventDefault();
              toast.error("Mobile number cannot start with 0-5");
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const cleaned = pasted.replace(/\D/g, "").slice(0, 10);
            if (cleaned.length > 0 && /^[6-9]/.test(cleaned)) {
              setFormData((prev) => ({ ...prev, phone: cleaned }));
            } else if (cleaned.length > 0) {
              toast.error("Mobile number must start with 6,7,8, or 9");
            }
          }}
          error={errors.phone}
          helperText={phoneHelperText}
          required
        />
      </div>
    </motion.div>
  );
}