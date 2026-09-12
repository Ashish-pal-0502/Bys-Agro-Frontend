

import { useContext } from "react";
import AuthContext from "./context";
import { jwtDecode } from "jwt-decode";
import apiClient from "./../api/client";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (accessToken, refreshToken) => {
    const user = jwtDecode(accessToken);
    setUser(user);

    // Store in localStorage (for apiClient x-auth-token header)
    localStorage.setItem("token", accessToken);

    // Also set a cookie (for Next.js middleware to read)
    if (typeof document !== "undefined") {
      document.cookie = `token=${accessToken}; path=/; max-age=900; SameSite=Lax`;
    }
  };

  const logOut = async () => {
    try {
     const res =  await apiClient.post("/user/logout");
     console.log("res of llout", res)
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");

      // Clear the middleware cookie
      if (typeof document !== "undefined") {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      }

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