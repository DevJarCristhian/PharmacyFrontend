import api from "../../config/axios";
import type { Params } from "../interfaces/people/doctor.interfaces";

const prefix = "people/doctor";

class doctorServices {
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
  async getCity(text: string) {
    const { data } = await api.get(`people/patient/filter/city`, {
      params: { search: text },
    });
    return data;
  }
}

export default new doctorServices();
