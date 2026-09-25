import { jwtDecode } from "jwt-decode";

// The middleware only checks that this cookie exists to gate /checkout, /orders and /profile,
// so its lifetime has to track the token's. A fixed short max-age logs users out of those
// pages while their token is still valid.
const FALLBACK_SECONDS = 15 * 60;

const secondsUntilExpiry = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (typeof exp === "number") {
      return Math.max(Math.floor(exp - Date.now() / 1000), 0);
    }
  } catch {
    // not a decodable JWT; use the fallback below
  }
  return FALLBACK_SECONDS;
};

export const setAuthCookie = (token) => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${token}; path=/; max-age=${secondsUntilExpiry(token)}; SameSite=Lax${secure}`;
};

export const clearAuthCookie = () => {
  if (typeof document === "undefined") return;

  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
};
