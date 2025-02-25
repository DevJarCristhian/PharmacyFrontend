import api from "../../config/axios";
import type { Params, Update } from "../interfaces/sale/opportunity.interfaces";

const prefix = "sale/opportunity";

class opportunityServices {
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
    const data = await api.get(`people/patient/all/maintenance`);
    return data;
  }
  // async store(data: Store) {
  //   const { data: response } = await api.post(`${prefix}store`, data);
  //   return response;
  // }
  async update(id: string, data: Update) {
    const { data: response } = await api.put(`${prefix}/${id}`, data);
    return response;
  }
  async exportToExcel() {
    const { data } = await api.post(
      `${prefix}/export/`,
      { search: "" },
      { responseType: "blob" }
    );
    return data;
  }
  async getPatients(text: string) {
    const { data } = await api.get(`people/patient/filter/all`, {
      params: { search: text },
    });
    return data;
  }
  async getProduct(text: string) {
    const { data } = await api.get(`sale/product/filter/all`, {
      params: { search: text },
    });
    return data;
  }
  async getPharmacy(text: string) {
    const { data } = await api.get(`data/pharmacy/filter/all`, {
      params: { search: text },
    });
    return data;
  }
}

export default new opportunityServices();
