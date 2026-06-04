export interface Profile {
  id: string;
  code: string;
  name: string;
}

export const PROFILES: Profile[] = [
  { id: "p1", code: "AL", name: "Анодированный Хром" },
  { id: "p2", code: "AL BL", name: "Анодированный Чёрный" },
  { id: "p3", code: "AL G", name: "Анодированный Золотой" },
  { id: "p4", code: "AL SH", name: "Анодированный Шампань" },
  { id: "p5", code: "AL RAL", name: "Выкрас в RAL K7" },
];
