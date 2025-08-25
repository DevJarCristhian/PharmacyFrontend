import api from "../config/axios";
export interface login {
  email: string;
  password: string;
}

const prefix = "/auth";
const apiBaseUrl = import.meta.env.VITE_API_URL + "/api/auth";

class authServices {
  async login(params: login) {
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        console.error("Login failed:", response.statusText);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Network error during login:", error);
      return null;
    }
  }

  async getUser() {
    const { data } = await api.get(`${prefix}/user`);
    return data;
  }

  async logout() {
    await api.post(`${prefix}/logout`);
  }
}

export default new authServices();
