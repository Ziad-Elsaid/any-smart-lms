import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding auth headers for login and register endpoints
    const publicEndpoints = ['/auth/login', '/auth/register'];
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log("Axios: Skipping auth header for public endpoint:", config.url);
      delete config.headers.Authorization;
      return config;
    }

    const rawToken = localStorage.getItem("accessToken");
    console.log("Axios raw token from localStorage:", rawToken);

    let accessToken = "";
    if (rawToken) {
      try {
        accessToken = JSON.parse(rawToken);
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("accessToken");
      }
    }

    // Only add Authorization header if we have a valid token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Axios adding token to request:", config.url);
    } else {
      console.log("Axios: No token found, skipping Authorization header for:", config.url);
      // Ensure we don't add an undefined or empty Authorization header
      delete config.headers.Authorization;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
