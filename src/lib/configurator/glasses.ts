export interface Glass {
  id: string;
  name: string;
  pricePerSqm: number;
  /** Максимальная высота створки в мм (если есть ограничение) */
  maxHeight?: number;
}

export const GLASSES: Glass[] = [
  { id: "g1", name: "Зеркало триплекс 4+4мм", pricePerSqm: 8676 },
  { id: "g2", name: "Зеркало бронза триплекс 4+4мм", pricePerSqm: 11340 },
  { id: "g3", name: "Зеркало графит триплекс 4+4мм", pricePerSqm: 11340 },
  { id: "g4", name: "Зеркало осветленное триплекс 4+4мм", pricePerSqm: 13500 },
  { id: "g5", name: "Стекло 4мм", pricePerSqm: 3132 },
  { id: "g6", name: "Стекло триплекс 4+4 мм", pricePerSqm: 5724 },
  { id: "g7", name: "Стекло 6мм", pricePerSqm: 4356 },
  { id: "g8", name: "Стекло осветленное 4мм", pricePerSqm: 5760 },
  { id: "g9", name: "Стекло осветленное триплекс 4+4 мм", pricePerSqm: 10980 },
  { id: "g10", name: "Стекло осветленное 6мм", pricePerSqm: 8622 },
  { id: "g11", name: "Стекло тонированное бронза 4мм", pricePerSqm: 3942 },
  { id: "g12", name: "Стекло тонированное бронза триплекс 4+4 мм", pricePerSqm: 7614 },
  { id: "g13", name: "Стекло тонированное графит 4мм", pricePerSqm: 5022 },
  { id: "g14", name: "Стекло тонированное графит триплекс 4+4 мм", pricePerSqm: 7614 },
  { id: "g15", name: "Стекло тонированное черное 4мм", pricePerSqm: 9540 },
  { id: "g16", name: "Стекло тонированное черное триплекс 4+4мм", pricePerSqm: 12132 },
  { id: "g17", name: "Стекло тонированное бронза 6мм", pricePerSqm: 6606 },
  { id: "g18", name: "Стекло тонированное графит 6мм", pricePerSqm: 6606 },
  { id: "g19", name: "Стекло тонированное черное 6мм", pricePerSqm: 11520 },
  { id: "g20", name: "Стекло Сатинат бронза 4мм", pricePerSqm: 7182 },
  { id: "g21", name: "Стекло Сатинат бронза триплекс 4+4 мм", pricePerSqm: 9774 },
  { id: "g22", name: "Стекло Сатинат графит 4мм", pricePerSqm: 7182 },
  { id: "g23", name: "Стекло Сатинат графит триплекс 4+4 мм", pricePerSqm: 9774 },
  { id: "g24", name: "Стекло Сатинат 4мм", pricePerSqm: 4482 },
  { id: "g25", name: "Стекло Сатинат триплекс 4+4мм", pricePerSqm: 7452 },
  { id: "g26", name: "Стекло Сатинат белый осветленный 4мм", pricePerSqm: 7704 },
  { id: "g27", name: "Стекло Сатинат белый осветленный триплекс 4+4мм", pricePerSqm: 12924 },
  { id: "g28", name: "Стекло Сатинат бронза 6мм", pricePerSqm: 9090 },
  { id: "g29", name: "Стекло Сатинат графит 6мм", pricePerSqm: 9090 },
  { id: "g30", name: "Стекло Сатинат 6мм", pricePerSqm: 7254 },
  { id: "g31", name: "Стекло Дихроник 4мм", pricePerSqm: 18360 },
  { id: "g32", name: "Стекло Дихроник 6мм", pricePerSqm: 21816 },
  { id: "g33", name: "Стекло Мору 4мм", pricePerSqm: 10980, maxHeight: 2800 },
  { id: "g34", name: "Стекло Мору 6мм", pricePerSqm: 14040, maxHeight: 2800 },
  { id: "g35", name: "Стекло Мору Графит титан 6мм", pricePerSqm: 16200, maxHeight: 2800 },
  { id: "g36", name: "Стекло Мору Бронза титан 6мм", pricePerSqm: 16200, maxHeight: 2800 },
  { id: "g37", name: "Стекло Кафедрал 4мм", pricePerSqm: 14040, maxHeight: 2800 },
  { id: "g38", name: "Стекло Вижн 4мм", pricePerSqm: 11700, maxHeight: 2800 },
  { id: "g39", name: "Стекло Вижн 6мм", pricePerSqm: 15120, maxHeight: 2800 },
];
