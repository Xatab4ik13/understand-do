export type OpeningOption = "Левое" | "Правое" | "Стационар";

export interface SashConfig {
  /** Допустимые ID систем для этой створки */
  allowedSets: string[];
  /** Допустимые варианты открывания */
  allowedOpenings: OpeningOption[];
  /** Имеет ли створка ручку (стационарные не имеют) */
  hasHandle: boolean;
}

export interface PartitionType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  /** Высота створки = высота проёма + sashHeightOffset (может быть отрицательной) */
  sashHeightOffset: number;
  /**
   * Формула ширины створки.
   * Пример: ширина проёма = W, формула возвращает ширину одной створки.
   */
  sashWidthFormula: (openingWidth: number) => number;
  /** Количество створок (множитель для кв.м и моделей ручек) */
  sashCount: number;
  /** Конфигурация каждой створки */
  sashes: SashConfig[];
  /** Максимальное общее количество ручек */
  maxHandleCount: number;
}

const ALL_OPENINGS: OpeningOption[] = ["Левое", "Правое", "Стационар"];
const LR: OpeningOption[] = ["Левое", "Правое"];
const STATIONARY: OpeningOption[] = ["Стационар"];

export const PARTITION_TYPES: PartitionType[] = [
  {
    id: "type-1",
    name: "Тип №1 — 1 створка вдоль стены",
    description: "Одна сдвижная створка вдоль стены",
    basePrice: 19180,
    sashHeightOffset: 15,
    sashWidthFormula: (w) => w + 46,
    sashCount: 1,
    sashes: [
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
    ],
    maxHandleCount: 2,
  },
  {
    id: "type-2",
    name: "Тип №2 — 2 створки вдоль стены",
    description: "Две сдвижные створки вдоль стены",
    basePrice: 38129,
    sashHeightOffset: 15,
    sashWidthFormula: (w) => (w + 46) / 2,
    sashCount: 2,
    sashes: [
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-2-sync",
    name: "Тип №2 Синхрон — 2 створки, синхронное открытие",
    description: "Две створки с синхронным открыванием",
    basePrice: 38129,
    sashHeightOffset: 15,
    sashWidthFormula: (w) => (w + 46) / 2,
    sashCount: 2,
    sashes: [
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
      { allowedSets: ["set4"], allowedOpenings: LR, hasHandle: true },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-3-active",
    name: "Тип №3 — 2 активные створки",
    description: "Две активные створки",
    basePrice: 34192,
    sashHeightOffset: -69,
    sashWidthFormula: (w) => (w - 23) / 2 + 23,
    sashCount: 2,
    sashes: [
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ALL_OPENINGS, hasHandle: true },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ALL_OPENINGS, hasHandle: true },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-3-stat",
    name: "Тип №3 — 1 стационар + 1 активная",
    description: "1 стационарная + 1 активная створка",
    basePrice: 34192,
    sashHeightOffset: -69,
    sashWidthFormula: (w) => (w - 23) / 2 + 23,
    sashCount: 2,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ALL_OPENINGS, hasHandle: true },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-4",
    name: "Тип №4 — 2 стационар + 1 центральная активная",
    description: "Две стационарные створки, одна центральная активная",
    basePrice: 54380,
    sashHeightOffset: -69,
    sashWidthFormula: (w) => (w - 23) / 3 + 23,
    sashCount: 3,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-5",
    name: "Тип №5 — 2 стационар + 2 активные",
    description: "Две стационарные и две активные створки",
    basePrice: 72506,
    sashHeightOffset: -69,
    sashWidthFormula: (w) => (w / 2 - 23) / 2 + 23,
    sashCount: 4,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ["Левое"], hasHandle: true },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ["Правое"], hasHandle: true },
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-5-sync",
    name: "Тип №5 Синхрон — 2 стационар + 2 активные",
    description: "С синхронным открыванием активных створок",
    basePrice: 72506,
    sashHeightOffset: -69,
    sashWidthFormula: (w) => (w / 2 - 23) / 2 + 23,
    sashCount: 4,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set4"], allowedOpenings: ["Левое"], hasHandle: true },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: ["Правое"], hasHandle: true },
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
    ],
    maxHandleCount: 4,
  },
  {
    id: "type-6",
    name: "Тип №6 — 3 створки (2 подвижные + 1 стационар)",
    description: "Три створки: две подвижные, одна стационарная",
    basePrice: 62232,
    sashHeightOffset: -76,
    sashWidthFormula: (w) => (w - 23) / 3 + 23,
    sashCount: 3,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set5"], allowedOpenings: LR, hasHandle: false },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
    ],
    maxHandleCount: 2,
  },
  {
    id: "type-7",
    name: "Тип №7 — 3 подвижные + 1 стационар",
    description: "Три подвижные створки и одна стационарная",
    basePrice: 86872,
    sashHeightOffset: -77,
    sashWidthFormula: (w) => (w - 23) / 4 + 23,
    sashCount: 4,
    sashes: [
      { allowedSets: ["set6"], allowedOpenings: STATIONARY, hasHandle: false },
      { allowedSets: ["set5"], allowedOpenings: LR, hasHandle: false },
      { allowedSets: ["set5"], allowedOpenings: LR, hasHandle: false },
      { allowedSets: ["set1", "set2", "set3"], allowedOpenings: LR, hasHandle: true },
    ],
    maxHandleCount: 4,
  },
];

export function getPartitionType(id: string): PartitionType | undefined {
  return PARTITION_TYPES.find((t) => t.id === id);
}

// Ограничения размеров
export const STANDARD_SASH = {
  minWidth: 500,
  maxWidth: 1000,
  minHeight: 1000,
  maxHeight: 2500,
};
export const NONSTANDARD_SASH = {
  maxWidth: 1400,
  maxHeight: 3000,
};
export const NONSTANDARD_MARKUP = 0.3; // +30%
export const RRC_MARKUP = 0.7; // +70%
