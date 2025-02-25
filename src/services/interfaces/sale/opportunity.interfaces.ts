export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  emissionDate?: string | null;
  patientId?: string | null;
  productId?: string | null;
  pharmacyId?: string | null;
  userId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Get {
  id?: string;
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

export interface GetOpportunity {
  id?: string;
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

export interface Update {
  reasonBuyId: number | null;
  reasonAnulationId: number | null;
  diagnosisId: number | null;
  doseId: number | null;
  treatmentTimeId: string;
  lastDateTaken: string;
  dateAbandonTreatment: string | null;
  observations: string | null;
}
