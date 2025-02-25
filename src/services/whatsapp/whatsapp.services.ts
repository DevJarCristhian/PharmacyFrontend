import api from "../../config/axios";
import type {
  ParamsPatient,
  StoreManyMessage,
  StoreMessage,
} from "../interfaces/whatsapp/whatsapp.interfaces";

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
    const { data } = await api.get(`people/patient/filter/all`, {
      params: { search: text },
    });
    return data;
  }

  async getPatientFilters(params: ParamsPatient) {
    const { data } = await api.get(`people/patient/filter/select`, {
      params,
    });
    return data;
  }

  async sendMessage(values: StoreMessage) {
    const { data } = await api.post(`ws/send-message`, values);
    return data;
  }

  async sendManyMessage(values: StoreManyMessage) {
    const { data } = await api.post(`ws/send-many-message`, values);
    return data;
  }

  // async update(id: number, data: StoreCategory) {
  //   const { data: response } = await api.put(`${prefix}update/${id}`, data);
  //   return response;
  // }
}

export default new whatsappServices();
