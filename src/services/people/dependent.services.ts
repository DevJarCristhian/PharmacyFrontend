import api from "../../config/axios";
import type { Params } from "../interfaces/people/dependent.interfaces";

const prefix = "people/dependent";

class dependentServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async exportToExcel() {
    const { data } = await api.post(
      `${prefix}/export/`,
      { search: "" },
      { responseType: "blob" }
    );
    return data;
  }
  async getDepartment(text: string) {
    const { data } = await api.get(`people/patient/filter/department`, {
      params: { search: text },
    });
    return data;
  }
}

export default new dependentServices();
