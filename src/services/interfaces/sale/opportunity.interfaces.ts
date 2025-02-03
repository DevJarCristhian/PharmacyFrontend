export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  documentNumber: string;
  patientFullName: string;
  farmacyName: string;
  productName: string;
  invoiceSerie: string;
  invoiceNumber: string;
  quantity: number | string;
  invoiceDate: string;
  dateUpdated: string;
}

export interface GetbyId {
  id?: number;
  active: number | string;
  usedQuantity: number | string;
  cancellation: string | null;
  certificationDate: string | null;
  exchangeState: string | null;
  validation: string | null;

  lastDateTaken: string | null;
  dateAbandonTreatment: string | null;

  reasonBuyId: number | null;
  reasonAnulationId: number | null;
  diagnosisId: number | null;
  doseId: number | null;
  treatmentTimeId: number | null;

  observations: string;
  dateUpdated: string;
}

export interface Store {
  id?: number;
  reasonBuyId: number;
  reasonAnulationId: number;
  diagnosisId: number;
  doseId: number;
  treatmentTimeId: number;
  lastDateTaken: string;
  dateAbandonTreatment: string;
}
