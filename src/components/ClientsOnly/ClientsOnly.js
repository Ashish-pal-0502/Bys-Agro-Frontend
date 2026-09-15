"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Footer from "./../Footer/Footer";
import ScrollToTop from "./../ScrollToTop/ScrollToTop";
import Navbar from "./../Navbar/Navbar";
import AuthContext from "./../../auth/context";
import CartSidebar from "./../../app/cart/cartSidebar";
import LoginSidebar from "./../Auth/LoginSidebar";
import VerificationSidebar from "./../Auth/VerificationSidebar";
import toast from "react-hot-toast";

const ClientOnly = ({ children }) => {
  const [user, setUser] = useState();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Function to open cart from Navbar
  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // Global function to open cart and login from anywhere
  useEffect(() => {
    // Cart functions
    window.openCartSidebar = () => {
      setIsCartOpen(true);
    };

    window.closeCartSidebar = () => {
      setIsCartOpen(false);
    };

    // Login functions
    window.openLoginSidebar = () => {
      console.log("Opening login sidebar");
      setIsLoginOpen(true);
    };

    window.closeLoginSidebar = () => {
      setIsLoginOpen(false);
    };

    // Verification functions
    window.openVerificationSidebar = () => {
      setIsVerificationOpen(true);
    };

    window.closeVerificationSidebar = () => {
      setIsVerificationOpen(false);
    };

    // Listen for cart update events
    const handleCartUpdate = () => {
      console.log("Cart updated");
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      delete window.openCartSidebar;
      delete window.closeCartSidebar;
      delete window.openLoginSidebar;
      delete window.closeLoginSidebar;
      delete window.openVerificationSidebar;
      delete window.closeVerificationSidebar;
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Close cart on navigation (optional - improves UX)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsCartOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
  const handleAuthFailed = () => {
    setUser(null);
    localStorage.removeItem("token");
    setIsCartOpen(false);
    setIsLoginOpen(false);
    setIsVerificationOpen(false);

    toast.error("Your session has expired. Please log in again.", {
      id: "session-expired",
    });
  };

  window.addEventListener("authFailed", handleAuthFailed);
  return () => window.removeEventListener("authFailed", handleAuthFailed);
}, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          openLoginModal: () => setIsLoginOpen(true),
          closeLoginModal: () => setIsLoginOpen(false),
        }}
      >
        <Navbar onCartClick={handleCartOpen} />
        <main className="relative mt-26">
          {children}
          <ScrollToTop />
        </main>
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        {/* Login Sidebar */}
        <LoginSidebar
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          mobile={mobile}
          setMobile={setMobile}
          email={email}
          setEmail={setEmail}
          isEmailMode={isEmailMode}
          setIsEmailMode={setIsEmailMode}
          setIsVerificationModalOpen={setIsVerificationOpen}
          setConfirmationResult={setConfirmationResult} 
        />

        {/* Verification Sidebar */}
        <VerificationSidebar
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          email={email}
          setEmail={setEmail}
          mobile={mobile}
          setMobile={setMobile}
          isEmailMode={isEmailMode}
          setIsEmailMode={setIsEmailMode}
           confirmationResult={confirmationResult} 
           setConfirmationResult={setConfirmationResult} 
        />
      </AuthContext.Provider>
    </>
  );
};

export default ClientOnly;
