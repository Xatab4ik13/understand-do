export interface SystemSet {
  id: string;
  name: string;
  price: number;
  /** Минимальная ширина полотна (створки) в мм */
  minSashWidth?: number;
}

export const SETS: Record<string, SystemSet> = {
  set1: { id: "set1", name: "Сет 1 (Без доводчика)", price: 1222, minSashWidth: 500 },
  set2: { id: "set2", name: "Сет 2 (2 доводчика)", price: 3055, minSashWidth: 750 },
  set3: { id: "set3", name: "Сет 3 (1 доводчик)", price: 2140, minSashWidth: 500 },
  set4: { id: "set4", name: "Сет 4 Синхрон", price: 2795 },
  set5: { id: "set5", name: "Сет 5 Каскад", price: 9407 },
  set6: { id: "set6", name: "Сет 6 Стационар", price: 1430 },
};

export const HANDLE_COUNT_PRICES: Record<number, number> = {
  1: 1287,
  2: 2574,
  3: 3861,
  4: 5148,
};
