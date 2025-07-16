import api from "../../config/axios";
import type { Params, Store } from "../interfaces/whatsapp/template.interfaces";

const prefix = "connection/templates";

class templatesServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async store(data: Store) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("message", data.message);
    formData.append("type", data.type.toString());
    formData.append("contentType", data.contentType.toString());
    if (data.file) {
      formData.append("file", data.file);
    }

    const { data: response } = await api.post(`${prefix}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  async update(id: number, data: Store) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("message", data.message);
    formData.append("type", data.type.toString());
    formData.append("contentType", data.contentType.toString());

    if (data.file) {
      formData.append("file", data.file);
    }

    const { data: response } = await api.put(`${prefix}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
}

export default new templatesServices();
