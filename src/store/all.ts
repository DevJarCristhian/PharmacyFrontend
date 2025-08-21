import { defineStore } from "pinia";
import dataServices from "../services/data/data.services";

interface DefaultSelect {
  label: string;
  value: number;
}

export const allStore = defineStore("all", {
  state: () => ({
    gender: [] as DefaultSelect[],
    saleStage: [] as DefaultSelect[],
    reasonBuy: [] as DefaultSelect[],
    areas: [] as DefaultSelect[],
    reasonAnulation: [] as DefaultSelect[],
    diagnosis: [] as DefaultSelect[],
    tratmentTime: [] as DefaultSelect[],
    continuation: [] as DefaultSelect[],
    doseRecommended: [] as DefaultSelect[],
    patientStatus: [] as DefaultSelect[],
    patientType: [] as DefaultSelect[],
    maritalStatus: [] as DefaultSelect[],
    countries: [] as DefaultSelect[],
  }),
  actions: {
    setCategories(data: any) {
      const mappings: { [key: string]: string } = {
        "Genero": "gender",
        "ETAPA DE VENTAS": "saleStage",
        "MOTIVOS DE COMPRA": "reasonBuy",
        "AREAS": "areas",
        "Motivo de Anulacion": "reasonAnulation",
        "Diagnostico": "diagnosis",
        "Tiempo de Tratamiento": "tratmentTime",
        "Continuidad": "continuation",
        "Dosis Recomendada": "doseRecommended",
        "Estado del Paciente": "patientStatus",
        "Tipo de Paciente": "patientType",
        "Estado Civil": "maritalStatus",
      };

      data.forEach((item: any) => {
        const key = mappings[item.descripcion as keyof typeof mappings];
        if (key) {
          (this as any)[key] = item.detalles;
        }
      });
    },
    async fetchCountries() {
      let data = await dataServices.getCountries()
      data.unshift({ label: 'Todos', value: 0 })
      this.countries = data
    },
  },
  getters: {
    async getCountries(): Promise<DefaultSelect[]> {
      const store = this as unknown as ReturnType<typeof allStore>;
      if (store.countries.length === 0) { await store.fetchCountries(); }
      return [];
    }
  },
});
