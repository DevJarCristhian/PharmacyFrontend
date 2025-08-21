import api from "../../config/axios";
import type { Params } from "../interfaces/people/doctor.interfaces";

const prefix = "sale/price/";

class priceServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async exportToExcel(params: Params) {
    const { data } = await api.post(`${prefix}export/`, params, {
      responseType: "blob",
    });
    return data;
  }

  async update(id: string, data: { price: string, chainId: string }) {
    const { data: response } = await api.put(`${prefix}${id}`, data);
    return response;
  }
}

export default new priceServices();
