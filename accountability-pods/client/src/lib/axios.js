import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthEndpoint = /\/users\/(login|register|refresh|logout)(\?|$)/.test(requestUrl);

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retried || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(`${apiBaseURL}/users/refresh`, {}, { withCredentials: true })
          .then((response) => {
            const newAccessToken = response.data?.data?.accessToken;
            if (!newAccessToken) throw new Error("Token refresh response did not include an access token");
            localStorage.setItem("accessToken", newAccessToken);
            return newAccessToken;
          })
          .finally(() => { refreshPromise = null; });
      }

      const accessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(refreshError);
    }
  },
);

export default api;
