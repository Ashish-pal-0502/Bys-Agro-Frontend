"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiUser
} from "react-icons/fi";
import {
  AccountInfo,
  AddressSection,
  HeaderActions,
  PersonalInfo,
  Sidebar,
} from "../../components/Profile/ProfileSections";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import Loader from "./../../utility/Loader";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      area: "",
      city: "",
      state: "",
      landmark: "",
      pincode: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState({});

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await apiClient.get("/user/get-user-by-id", {
        id: user.id,
      });

      if (response.ok && response.data) {
        const userData = response.data.user;
        setUserData(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: {
            area: userData.address?.area || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            landmark: userData.address?.landmark || "",
            pincode: userData.address?.pincode || "",
            country: userData.address?.country || "",
          },
        });
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indian mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }


    try {
      const response = await apiClient.post("/user/update", {
        userId: user?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          area: formData.address.area,
          city: formData.address.city,
          state: formData.address.state,
          landmark: formData.address.landmark,
          pincode: formData.address.pincode,
          country: formData.address.country || "India",
        },
      });


      if (response.ok) {
        toast.success(response.data.message || "Profile updated successfully!");
        setIsEditing(false);
        await fetchUserProfile();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: {
          area: userData.address?.area || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          landmark: userData.address?.landmark || "",
          pincode: userData.address?.pincode || "",
          country: userData.address?.country || "",
        },
      });
    }
  };

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf4ea] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#faf4ea] rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="text-[#c1552c] text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-[#2b1b12] mb-2">
            Please Login
          </h3>
          <p className="text-[#655849] mb-6">
            You need to be logged in to view your profile
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-[#c1552c] text-white rounded-xl font-semibold hover:bg-[#a84824] transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif py-8">
      <div className="max-w-4xl mx-auto px-4 lg:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2b1b12]">My Profile</h1>
          <p className="text-[#655849]">Manage your account details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Sidebar
            userData={userData}
            onNavigateOrders={() => router.push("/orders")}
            onLogout={handleLogout}
          />

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e6ded2] p-6">
              <HeaderActions
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onCancel={handleCancel}
                onSave={handleSave}
              />

              <div className="space-y-6">
                <PersonalInfo
                  isEditing={isEditing}
                  formData={formData}
                  userData={userData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />

                <AddressSection
                  isEditing={isEditing}
                  formData={formData}
                  userData={userData}
                  handleInputChange={handleInputChange}
                />

                <AccountInfo userData={userData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}