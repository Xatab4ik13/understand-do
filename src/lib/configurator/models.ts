export interface HandleModel {
  id: string;
  code: string;
  /** Надбавка к цене за створку */
  price: number;
}

export const HANDLE_MODELS: HandleModel[] = [
  { id: "m1", code: "BR ALP 01", price: 0 },
  { id: "m2", code: "BR ALP 02", price: 2310 },
  { id: "m3", code: "BR ALP 03", price: 2888 },
  { id: "m4", code: "BR ALP 04", price: 4042 },
  { id: "m5", code: "BR ALP 05", price: 1732 },
  { id: "m6", code: "BR ALP 06", price: 1155 },
  { id: "m7", code: "BR ALP 07", price: 1732 },
  { id: "m8", code: "BR ALP 08", price: 578 },
  { id: "m9", code: "BR ALP 09", price: 1155 },
  { id: "m10", code: "BR ALP 10", price: 4620 },
];
