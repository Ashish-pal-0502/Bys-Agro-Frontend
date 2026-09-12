"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../api/client";

export function useCheckoutUser({ user, formData, setFormData, validateForm }) {
  const [userData, setUserData] = useState({});
  const [isAddressSaving, setAddressSaving] = useState(false);

  const getUser = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get("/user/get-user-by-id", {
        id: user?.id,
      });
      if (response.ok) {
        const u = response.data.user;
        setUserData(u);
        setFormData((prev) => ({
          ...prev,
          email: u.email || prev.email,
          firstName: u.firstName || prev.firstName,
          lastName: u.lastName || prev.lastName,
          address: u.address?.area || u.address?.address || prev.address,
          landmark: u.address?.landmark || prev.landmark,
          city: u.address?.city || prev.city,
          area: u.address?.area || prev.city,
          state: u.address?.state || prev.state,
          zipCode: u.address?.zipCode || u.address?.pincode || prev.zipCode,
          phone: u.phone || u.mobile || u.contactNumber || prev.phone,
        }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

   const updateUserDetails = async () => {
    if (!user) return false;

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return false;
    }

    setAddressSaving(true);

    try {
      const response = await apiClient.post("/user/update", {
        userId: user?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          area: formData.area,
          state: formData.state,
          city: formData.city,
          landmark: formData.landmark || "",
          mobile: formData.phone,
          email: formData.email,
          pincode: formData.zipCode,
        },
      });

      if (response.ok) {
        const u = response.data.user;
        setFormData((prev) => ({
          ...prev,
          email: u.email || prev.email,
          firstName: u.firstName || prev.firstName,
          lastName: u.lastName || prev.lastName,
          address: u.address?.area || u.address?.address || prev.address,
          landmark: u.address?.landmark || prev.landmark,
          city: u.address?.city || prev.city,
          area: u.address?.area || prev.city,
          state: u.address?.state || prev.state,
          zipCode: u.address?.zipCode || u.address?.pincode || prev.zipCode,
          phone: u.phone || u.mobile || u.contactNumber || prev.phone,
        }));

        toast.success(response?.data?.message || "Address Updated!");
        return true;
      } else {
        toast.error("Failed to save address");
        return false;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error saving address");
      return false;
    } finally {
      setAddressSaving(false);
    }
  };

  return { userData, isAddressSaving, getUser, updateUserDetails };
}