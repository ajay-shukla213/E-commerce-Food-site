import axios from "axios";

// Axios Instance
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong on the server";

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;