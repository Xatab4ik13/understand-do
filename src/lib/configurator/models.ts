import alp01 from "@/assets/models/alp-01.webp.asset.json";
import alp02 from "@/assets/models/alp-02.webp.asset.json";
import alp03 from "@/assets/models/alp-03.webp.asset.json";
import alp04 from "@/assets/models/alp-04.webp.asset.json";
import alp05 from "@/assets/models/alp-05.webp.asset.json";
import alp06 from "@/assets/models/alp-06.webp.asset.json";
import alp07 from "@/assets/models/alp-07.webp.asset.json";
import alp08 from "@/assets/models/alp-08.webp.asset.json";
import alp09 from "@/assets/models/alp-09.webp.asset.json";
import alp10 from "@/assets/models/alp-10.webp.asset.json";

export interface PartitionModel {
  id: string;
  code: string;
  /** Надбавка к цене за створку */
  price: number;
  image: string;
}

export const PARTITION_MODELS: PartitionModel[] = [
  { id: "m1", code: "BR ALP 01", price: 0, image: alp01.url },
  { id: "m2", code: "BR ALP 02", price: 2310, image: alp02.url },
  { id: "m3", code: "BR ALP 03", price: 2888, image: alp03.url },
  { id: "m4", code: "BR ALP 04", price: 4042, image: alp06.url },
  { id: "m5", code: "BR ALP 05", price: 1732, image: alp05.url },
  { id: "m6", code: "BR ALP 06", price: 1155, image: alp04.url },
  { id: "m7", code: "BR ALP 07", price: 1732, image: alp07.url },
  { id: "m8", code: "BR ALP 08", price: 578, image: alp08.url },
  { id: "m9", code: "BR ALP 09", price: 1155, image: alp09.url },
  { id: "m10", code: "BR ALP 10", price: 4620, image: alp10.url },
];
