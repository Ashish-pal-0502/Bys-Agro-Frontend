import { create } from "apisauce";

const apiClient = create({
  // baseURL: "https://bys-agro-backend.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  baseURL: "http://3.109.124.131:5000/api",
  // baseURL: "http://192.168.31.106:5000/api",
  withCredentials: true, // refresh token will automatically be sent via cookie
  headers: { Accept: "application/vnd.github.v3+json" },
});

// ---- Add access token to every request ----
if (typeof window !== "undefined") {
  apiClient.addAsyncRequestTransform(async (request) => {
    const token = getAccessToken();
    if (!token) return;

    //  use only the header your backend expects
    request.headers["x-auth-token"] = token;
  });
}

// ---- Helper functions ----
const getAccessToken = () => localStorage.getItem("token");
const setAccessToken = (token) => localStorage.setItem("token", token);
const removeAccessToken = () => localStorage.removeItem("token");

// ---- Handle 401 + refresh logic ----
apiClient.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Backend uses refresh token from cookie automatically
        const refreshResponse = await apiClient.post("/user/refresh-tokens");

        if (refreshResponse.ok && refreshResponse.data?.accessToken) {
          const newToken = refreshResponse.data.accessToken;
          setAccessToken(newToken);

          originalRequest.headers["x-auth-token"] = newToken;

          return apiClient.axiosInstance(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        removeAccessToken();
        // window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
