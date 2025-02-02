export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  departmentName: string;
  countryName: string;
  fullName: string;
  address: string;
  email: string;
  gender: number;
  phone: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  enrollmentDate: string;
}

export interface Store {
  patientInformation: string;
  programStartDate: string;
  doctorName: string;
  institutionName: string;
  medicationConsumption: string;
  // emailSending: number;
  // whatsappSending: number;
  // physicalMailSending: number;
  verified: string;
  gender: number;
  quantityRedemptions: string;
  operatorId: string;
  civilStatus: number;
  patientStatus: number;
  patientType: number;

  contactName: string;
  description: string;
  dateUpdated: string;
}

// {
//     // "id": 10162,
//     // "FullName": "HEIDY LUCRECIA CAMEY AJPACAJA",
//     // "documentType": "dpi",
//     // "patientInformation": "{\"medicos\":[\"0\"],\"medicamento\":[\"3\"]}",
//     "programStartDate": "2025-01-23",
//     "doctorName": "LOURDES GABRIELA MARTINEZ DOMINGUEZ",
//     "institutionName": "SIN INSTITUCION",
//     "medicationConsumption": 1,
//     "emailSending": 1,
//     "whatsappSending": 1,
//     "physicalMailSending": 0,
//     "verified": 5,
//     "redemptions": 1,
//     "operatorId": 0,
//     "civilStatus": null,
//     "patientStatus": null,
//     "contactName": "",
//     "description": "",
//     "dateUpdated": "2025-01-23 17:04:40",
//     // "createdBy": null,
//     // "updatedBy": null,
//     // "createdAt": "2025-01-23 00:00:00",
//     // "deleted": 0
// }
