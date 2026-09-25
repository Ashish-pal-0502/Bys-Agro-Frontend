"use client";

import useAuth from './../../auth/useAuth';
import apiClient from './../../api/client';
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { X, ShieldCheck } from "lucide-react";
import { useCartStore } from "./../../stores/cartStore";
import { auth } from './../../utility/firebase';

export default function VerificationSidebar({
  isOpen,
  onClose,
  email,
  setEmail,
  mobile,
  setMobile,
  isEmailMode,
  setIsEmailMode,
  confirmationResult,    
  setConfirmationResult, 
}) {
  const { logIn } = useAuth();
  const { syncCartToBackend } = useCartStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Reset OTP when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""]);
      setResendTimer(0);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];

      if (!otp[index] && index > 0) {
        updatedOtp[index - 1] = "";
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        updatedOtp[index] = "";
      }
      setOtp(updatedOtp);
    }
  };

  const otpValue = otp.join("");

  const handleVerifyProfile = async () => {
    if (!confirmationResult) {
      toast.error("Session expired. Please request a new OTP.");
      return;
    }
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setVerifyLoading(true);

      //  Verify OTP with Firebase
      const userCredential = await confirmationResult.confirm(otpValue);

      //  Get Firebase ID token
      const firebaseIdToken = await userCredential.user.getIdToken();

      //  Exchange for your backend session (same shape as app)
      const response = await apiClient.post("/user/firebase", {
        idToken: firebaseIdToken,
      });

      if (!response.ok) {
        toast.error(response?.data?.message || "Login failed");
        return;
      }

      const { accessToken, refreshToken, user } = response.data;

      //  Optional: sync cart
      // if (user?._id) {
      //   const synced = await syncCartToBackend(user._id, apiClient);
      //   if (synced) toast.success("Your cart items have been saved!");
      // }

      logIn(accessToken, refreshToken);
      toast.success(response?.data?.message || "Login successful");

      // cleanup
      setMobile("");
      setOtp(["", "", "", "", "", ""]);
      setConfirmationResult(null);
      onClose();
    } catch (err) {
      console.error("Verification error:", err);
      if (err.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please try again.");
      } else if (err.code === "auth/code-expired") {
        toast.error("OTP expired. Please resend.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error(err?.message || "Verification failed");
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend uses Firebase again
  const handleResendCode = async () => {
    if (!mobile) return;
    setResendLoader(true);
    try {
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import(
        "firebase/auth"

      );
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container-resend", {
        size: "invisible",
      });
      const newConfirmation = await signInWithPhoneNumber(
        auth,
        `+91${mobile}`,
        verifier
      );
      setConfirmationResult(newConfirmation);
      setResendTimer(60);
      toast.success("OTP resent successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoader(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#312620]/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 h-full w-full sm:w-110 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slideIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9e1d7]">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2b1b12]">
              {isEmailMode ? "Email Verification" : "Mobile Verification"}
            </h2>
            <p className="text-sm text-[#8a8179] mt-0.5">
              Enter the 4-digit code sent to your{" "}
              {isEmailMode ? "email" : "mobile"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#faf4ea] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={22} className="text-[#5a5a5a]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          <div className="max-w-sm mx-auto">
            {/* OTP Input */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  id={`otp-${index}`}
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-16 text-center text-xl font-bold rounded-xl bg-[#faf4ea] border-2 border-[#e6ded2] focus:border-[#c1552c] focus:ring-2 focus:ring-[#c1552c]/30 outline-none transition-all duration-200 text-[#2b1b12]"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyProfile}
              disabled={verifyLoading || otpValue.length !== 4}
              className={`w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                !verifyLoading && otpValue.length === 4
                  ? "bg-[#c1552c] hover:bg-[#ad4825] hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                  : "bg-[#a0968c] cursor-not-allowed opacity-60"
              }`}
            >
              {verifyLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </button>

            {/* Resend */}
            <div className="mt-6 text-sm flex justify-center gap-2 text-[#8a8179]">
              <span>Didn&apos;t receive the code?</span>
              {resendTimer > 0 ? (
                <span className="text-[#5a4a3a] font-medium">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={resendLoader}
                  className="text-[#c1552c] font-medium hover:underline cursor-pointer transition-colors"
                >
                  {resendLoader ? "Sending..." : "Resend"}
                </button>
              )}
            </div>

            {/* Trust Badge */}
            <div className="mt-8 p-4 bg-[#faf4ea] rounded-xl border border-[#e6ded2]">
              <div className="flex items-center justify-center gap-2 text-xs text-[#5a4a3a]">
                <ShieldCheck size={16} className="text-[#c1552c]" />
                <span>Secure verification • OTP expires in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
       <div id="recaptcha-container-resend"></div>
    </>
  );
}