import { create } from "apisauce";

const apiClient = create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "http://3.109.124.131:5000/api",
  withCredentials: true,
  headers: { Accept: "application/vnd.github.v3+json" },
});

// ---- Helpers ----
const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const setAccessToken = (token) => {
  localStorage.setItem("token", token);
  //  keep the middleware cookie in sync
  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=900; SameSite=Lax`;
  }
};

const removeAccessToken = () => {
  localStorage.removeItem("token");
  if (typeof document !== "undefined") {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  }
};

// ---- Add access token to every request ----
if (typeof window !== "undefined") {
  apiClient.addAsyncRequestTransform(async (request) => {
    const token = getAccessToken();
    if (!token) return;
    request.headers["x-auth-token"] = token;
  });
}

// ---- Handle 401 + refresh ----
apiClient.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post("/user/refresh-tokens");
        if (refreshResponse.ok && refreshResponse.data?.accessToken) {
          const newToken = refreshResponse.data.accessToken;
          setAccessToken(newToken);              //updates cookie too
          originalRequest.headers["x-auth-token"] = newToken;
          return apiClient.axiosInstance(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        removeAccessToken();                      //clears cookie too

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("authFailed"));
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;