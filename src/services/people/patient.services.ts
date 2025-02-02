import api from "../../config/axios";
import type { Params, Store } from "../interfaces/people/patient.interfaces";

const prefix = "people/patient/";

class patientServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async getById(id: number) {
    const { data } = await api.get(`${prefix}${id}`);
    return data;
  }
  async getCategories() {
    const { data } = await api.get(`all/maintenance`);
    return data;
  }
  async store(data: Store) {
    const { data: response } = await api.post(`${prefix}store`, data);
    return response;
  }
  async update(id: number, data: Store) {
    const { data: response } = await api.put(`${prefix}update/${id}`, data);
    return response;
  }

  async exportToExcel() {
    const { data } = await api.post(
      `${prefix}export/`,
      { search: "" },
      { responseType: "blob" }
    );
    return data;
  }
}

export default new patientServices();
