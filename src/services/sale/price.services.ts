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
}

export default new priceServices();
