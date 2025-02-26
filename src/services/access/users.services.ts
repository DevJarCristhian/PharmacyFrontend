import api from "../../config/axios";
import type { Params, Store } from "../interfaces/access/users.interfaces";
const prefix = "access/users/";

class usersServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async store(data: Store) {
    const { data: response } = await api.post(`${prefix}`, data);
    return response;
  }
  async update(id: number, data: Store) {
    const { data: response } = await api.put(`${prefix}${id}`, data);
    return response;
  }
  async getRoles() {
    const { data } = await api.get(`${prefix}roles`);
    return data;
  }
  async exportToExcel(params: Params) {
    const { data } = await api.post(`${prefix}export/`, params, {
      responseType: "blob",
    });
    return data;
  }
}

export default new usersServices();
