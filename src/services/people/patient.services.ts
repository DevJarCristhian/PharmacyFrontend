import api from "../../config/axios";
import type { Params, Update } from "../interfaces/people/patient.interfaces";

const prefix = "people/patient";

class patientServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async getById(id: string) {
    const { data } = await api.get(`${prefix}/${id}`);
    return data;
  }
  async getCategories() {
    const data = await api.get(`${prefix}/all/maintenance`);
    return data;
  }
  async update(id: string, data: Update) {
    const { data: response } = await api.put(`${prefix}/${id}`, data);
    return response;
  }
  async exportToExcel(params: Params) {
    const { data } = await api.post(`${prefix}/export/`, params, {
      responseType: "blob",
    });
    return data;
  }
  async getDepartment(text: string) {
    const { data } = await api.get(`${prefix}/filter/department`, {
      params: { search: text },
    });
    return data;
  }
}

export default new patientServices();
