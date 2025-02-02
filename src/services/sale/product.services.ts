import api from "../../config/axios";
import type { Params } from "../interfaces/people/doctor.interfaces";

const prefix = "sale/product/";

class productServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
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

export default new productServices();
