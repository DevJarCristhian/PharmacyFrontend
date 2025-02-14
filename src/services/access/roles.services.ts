import api from "../../config/axios";
import type { Params, Store } from "../interfaces/access/roles.interfaces";
const prefix = "access/roles/";

class rolesServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async store(data: Store) {
    const filterData = data.permissions.filter((permission) =>
      Number.isInteger(permission)
    );
    data.permissions = filterData;

    const { data: response } = await api.post(`${prefix}`, data);
    return response;
  }
  async update(id: number, data: Store) {
    const filterData = data.permissions.filter((permission) =>
      Number.isInteger(permission)
    );
    data.permissions = filterData;

    const { data: response } = await api.put(`${prefix}${id}`, data);
    return response;
  }
  async getPermissions() {
    const { data } = await api.get(`${prefix}permissions`);
    return data;
  }
}

export default new rolesServices();
