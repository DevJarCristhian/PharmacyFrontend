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

  async getTemplates(search: string) {
    const { data } = await api.get(`connection/templates/type`, {
      params: { search },
    });
    return data;
  }

  async sendMessage(data: StoreMessage) {
    const formData = new FormData();
    formData.append("contactId", data.contactId.toString());
    formData.append("number", data.number);
    formData.append("message", data.message);

    if (data.file) {
      formData.append("file", data.file);
      formData.append("mediaType", "image");
    } else {
      formData.append("mediaType", "chat");
    }

    const { data: response } = await api.post(`ws/send-message`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
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
