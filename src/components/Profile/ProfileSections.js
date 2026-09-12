"use client";

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineLocationCity, MdOutlinePinDrop } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

// ─────────────────────────────────────────────
// 1. Field — reusable input/view toggle
// ─────────────────────────────────────────────
export function Field({
  label,
  name,
  value,
  displayValue,
  type = "text",
  placeholder = "",
  maxLength,
  isEditing,
  onChange,
  error,
  icon,
  colSpan = 1,
}) {
  return (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
      {label && (
        <label className="block text-sm font-medium text-[#655849] mb-2">
          {icon && <span className="inline mr-1">{icon}</span>}
          {label}
        </label>
      )}

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 bg-[#faf4ea] border border-[#e6ded2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c1552c] text-[#2b1b12]"
        />
      ) : (
        <p className="text-[#2b1b12] px-4 py-3 bg-[#faf4ea] rounded-xl">
          {displayValue || "Not set"}
        </p>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. Sidebar (left column)
// ─────────────────────────────────────────────
export function Sidebar({ userData, onNavigateOrders, onLogout }) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6 sticky top-24">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-4">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-6xl text-[#c1552c]" />
            )}
          </div>
          <h3 className="font-bold text-[#2b1b12] text-lg">
            {userData?.firstName} {userData?.lastName}
          </h3>
          <p className="text-sm text-[#655849]">{userData?.email}</p>
        </div>

        <div className="border-t border-[#e6ded2] pt-4 space-y-2">
          <button
            onClick={onNavigateOrders}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#655849] hover:bg-[#faf4ea] transition-colors cursor-pointer"
          >
            <FiShoppingBag className="text-[#c1552c]" />
            My Orders
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <FiLogOut className="text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. Header actions (Edit / Cancel / Save)
// ─────────────────────────────────────────────
export function HeaderActions({ isEditing, onEdit, onCancel, onSave }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-[#2b1b12]">
        Personal Information
      </h2>

      {!isEditing ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-[#c1552c] hover:bg-[#faf4ea] rounded-xl transition-colors cursor-pointer"
        >
          <FiEdit2 />
          Edit Profile
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[#655849] hover:bg-[#faf4ea] rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            <FiX />
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#c1552c] text-white rounded-xl hover:bg-[#a84824] transition-colors cursor-pointer flex items-center gap-2"
          >
            <FiSave />
            Save
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. Personal Info (name + email + phone)
// ─────────────────────────────────────────────
export function PersonalInfo({
  isEditing,
  formData,
  userData,
  errors,
  handleInputChange,
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="First Name"
          name="firstName"
          value={formData.firstName}
          displayValue={userData?.firstName}
          isEditing={isEditing}
          onChange={handleInputChange}
          error={errors.firstName}
        />
        <Field
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          displayValue={userData?.lastName}
          isEditing={isEditing}
          onChange={handleInputChange}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Email"
          name="email"
          value={formData.email}
          displayValue={userData?.email}
          type="email"
          isEditing={isEditing}
          onChange={handleInputChange}
          error={errors.email}
          icon={<FiMail className="inline text-[#c1552c]" />}
        />
        <Field
          label="Phone Number"
          name="phone"
          value={formData.phone}
          displayValue={userData?.phone}
          type="tel"
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          isEditing={isEditing}
          onChange={handleInputChange}
          error={errors.phone}
          icon={<FiPhone className="inline text-[#c1552c]" />}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. Address Section
// ─────────────────────────────────────────────
export function AddressSection({
  isEditing,
  formData,
  userData,
  handleInputChange,
}) {
  return (
    <div className="border-t border-[#e6ded2] pt-6">
      <h3 className="text-lg font-bold text-[#2b1b12] mb-4 flex items-center gap-2">
        <FiMapPin className="text-[#c1552c]" />
        Shipping Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Area / Street"
          name="address.area"
          value={formData.address.area}
          displayValue={userData?.address?.area}
          isEditing={isEditing}
          onChange={handleInputChange}
          colSpan={2}
        />
        <Field
          label="City"
          name="address.city"
          value={formData.address.city}
          displayValue={userData?.address?.city}
          isEditing={isEditing}
          onChange={handleInputChange}
          icon={<MdOutlineLocationCity className="inline text-[#c1552c]" />}
        />
        <Field
          label="State"
          name="address.state"
          value={formData.address.state}
          displayValue={userData?.address?.state}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
        <Field
          label="Pincode"
          name="address.pincode"
          value={formData.address.pincode}
          displayValue={userData?.address?.pincode}
          isEditing={isEditing}
          onChange={handleInputChange}
          maxLength={6}
          icon={<MdOutlinePinDrop className="inline text-[#c1552c]" />}
        />
        <Field
          label="Landmark"
          name="address.landmark"
          value={formData.address.landmark}
          displayValue={userData?.address?.landmark}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
        <Field
          label="Country"
          name="address.country"
          value={formData.address.country}
          displayValue={userData?.address?.country || "India"}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. Account Info
// ─────────────────────────────────────────────
export function AccountInfo({ userData }) {
  return (
    <div className="border-t border-[#e6ded2] pt-6">
      <h3 className="text-lg font-bold text-[#2b1b12] mb-4">
        Account Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-[#655849]">Account Type</p>
          <p className="font-semibold text-[#2b1b12] capitalize">
            {userData?.accountType || "Regular"}
          </p>
        </div>
        <div>
          <p className="text-sm text-[#655849]">Member Since</p>
          <p className="font-semibold text-[#2b1b12]">
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}