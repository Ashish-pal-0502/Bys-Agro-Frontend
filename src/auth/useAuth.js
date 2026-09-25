

import { useContext } from "react";
import AuthContext from "./context";
import { jwtDecode } from "jwt-decode";
import apiClient from "./../api/client";
import { setAuthCookie, clearAuthCookie } from "./authCookie";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (accessToken, refreshToken) => {
    const user = jwtDecode(accessToken);
    setUser(user);

    // Store in localStorage (for apiClient x-auth-token header)
    localStorage.setItem("token", accessToken);

    // Also set a cookie (for Next.js middleware to read)
    setAuthCookie(accessToken);
  };

  const logOut = async () => {
    try {
      await apiClient.post("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");

      // Clear the middleware cookie
      clearAuthCookie();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  return { user, logIn, logOut, getAccessToken };
};

export default useAuth;