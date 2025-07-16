import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_URL;
// const apiBaseUrl = "https://backendcrm.up.railway.app/api/";
// const apiBaseUrl = "https://backendwha-production.up.railway.app/api/";

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
