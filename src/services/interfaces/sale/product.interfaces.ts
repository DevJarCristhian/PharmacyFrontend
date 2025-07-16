export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: string;
  name: string;
  description: string;
  longDescription: string;
  observation: string;
  receive: string;
  condition: number | string;
  status: number | string;
  unitMeasure: number | string;
  costarica: number | string;
  nicaragua: number | string;
  panama: number | string;
  honduras: number | string;
  guatemala: number | string;
  line: number | string;
  maxRedemptions: number | string;
}
