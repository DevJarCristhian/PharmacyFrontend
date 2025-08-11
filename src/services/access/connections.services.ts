import api from "../../config/axios";
import type {
  Params,
  Store,
  UpdateConnection,
} from "../interfaces/access/connections.interfaces";
const prefix = "connection";

class connectionsServices {
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
    const { data: response } = await api.put(`${prefix}/${id}`, data);
    return response;
  }
  async getRoles() {
    const { data } = await api.get(`${prefix}roles`);
    return data;
  }

  async updateQr(id: number, data: UpdateConnection) {
    const { data: response } = await api.put(`${prefix}${id}`, data);
    return response;
  }

  async disconnectWhatsapp() {
    const { data: response } = await api.post(`ws/disconnect/`);
    return response;
  }
}

export default new connectionsServices();
