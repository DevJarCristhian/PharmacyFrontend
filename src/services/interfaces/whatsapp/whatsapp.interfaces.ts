export interface Params {
  // page: number;
  // perPage: number;
  search?: string | null;
}

export interface ParamsPatient {
  search?: string | null;
  gender?: number | null;
  birthDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface GetPatient {
  id: string;
  documentNumber: string;
  name: string;
  gender: string;
  phone: string;
  birthDate: string;
  age: string;
  selected: boolean;
}

export interface GetContact {
  id?: number;
  description: string;
  maintenanceId: number;
  category: string;
  status: number;
}

export interface GetMessageDefault {
  contactId: number;
  name: string;
  number: string;
  profilePicUrl: string;
  lastMessage: string;
  lastMessageDate: string;
  mediaType: string;
  fromMe: number;
  messages: {
    id: number;
    body: string;
    ack: number;
    read: number;
    mediaType: string;
    mediaUrl?: string;
    fromMe?: number;
    isDelete?: string;
    createdAt?: string;
  }[];
}

export interface StoreMessage {
  contactId: number;
  number: string;
  message: string;
  mediaType: string;
  file: string | null;
  read?: string;
}

export interface StoreManyMessage {
  templateId: number | null;
  patients: {
    patientId: string;
    number: string;
    name: string;
  }[];
}
