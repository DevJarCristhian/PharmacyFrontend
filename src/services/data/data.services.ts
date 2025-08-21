import api from "../../config/axios";

class dataServices {
    async getCountries() {
        const { data } = await api.get(`data/default/countries`);
        return data;
    }

}

export default new dataServices();
