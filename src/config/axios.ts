import axios from "axios";
const apiBaseUrl = "http://127.0.0.1:8000/api/";
let URL = import.meta.env.VITE_APP_URL;
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("apiBaseUrl", URL);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      status,
      data: { message: _ },
    } = error.response;

    if ([500, 400, 404, 409].includes(status)) {
      // const useGlobalStores = globalStores();
      // useGlobalStores.setShowDialogError(true, message);
      // useGlobalStores.setShowLoading(false);
    }

    if (status == 401 && !localStorage.getItem("tokenRemoved")) {
      localStorage.removeItem("token");
      localStorage.setItem("tokenRemoved", "true");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
