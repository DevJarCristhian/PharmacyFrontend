import api from "../../config/axios";
// import type { Params } from "../interfaces/whatsapp/whatsapp.interfaces";

const prefix = "connection/";

class whatsappServices {
  async getMessages() {
    const { data } = await api.get(`${prefix}messages`);
    return data;
  }

  async getContacts() {
    const { data } = await api.get(`${prefix}contacts`);
    return data;
  }

  async getPatients(text: string) {
    const { data } = await api.get(`people/patient`, {
      params: { search: text },
    });
    return data;
  }
  // async store(data: StoreCategory) {
  //   const { data: response } = await api.post(`${prefix}store`, data);
  //   return response;
  // }
  // async update(id: number, data: StoreCategory) {
  //   const { data: response } = await api.put(`${prefix}update/${id}`, data);
  //   return response;
  // }
}

export default new whatsappServices();
