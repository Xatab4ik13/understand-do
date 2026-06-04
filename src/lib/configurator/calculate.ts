import { GLASSES } from "./glasses";
import { PARTITION_MODELS } from "./models";
import { HANDLE_COUNT_PRICES, SETS } from "./sets";
import {
  NONSTANDARD_MARKUP,
  NONSTANDARD_SASH,
  RRC_MARKUP,
  STANDARD_SASH,
  type PartitionType,
} from "./types";

export interface Selections {
  openingHeight: number; // мм
  openingWidth: number; // мм
  glassId: string;
  profileId: string;
  modelId: string;
  /** id выбранной системы для каждой створки (длина = sashCount) */
  setIds: string[];
  /** открывания для каждой створки */
  openings: string[];
  /** общее количество ручек */
  handleCount: number;
  /** позиции ручек (1..4) для каждой створки; пустой массив если без ручки */
  handlePositions: number[][];
}

export interface CalculationResult {
  sashHeight: number;
  sashWidth: number;
  sqmPerSash: number;
  totalSqm: number;
  glassPrice: number;
  basePartPrice: number;
  modelsPrice: number;
  setsPrice: number;
  handlesPrice: number;
  totalPrice: number;
  nonStandardMarkup: number;
  totalWithMarkup: number;
  rrcPrice: number;
  warnings: string[];
  errors: string[];
  isNonStandard: boolean;
}

export function calculate(
  type: PartitionType,
  s: Selections,
): CalculationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const glass = GLASSES.find((g) => g.id === s.glassId);
  const model = PARTITION_MODELS.find((m) => m.id === s.modelId);

  if (s.openingHeight <= 0) errors.push("Введите высоту проёма");
  if (s.openingWidth <= 0) errors.push("Введите ширину проёма");

  const sashHeight = s.openingHeight + type.sashHeightOffset;
  const sashWidth = type.sashWidthFormula(s.openingWidth);
  const sqmPerSash = (sashHeight / 1000) * (sashWidth / 1000);
  const totalSqm = sqmPerSash * type.sashCount;

  // Ограничения размеров
  let isNonStandard = false;
  if (sashWidth > 0 && sashHeight > 0) {
    const widthInStd =
      sashWidth >= STANDARD_SASH.minWidth && sashWidth <= STANDARD_SASH.maxWidth;
    const heightInStd =
      sashHeight >= STANDARD_SASH.minHeight && sashHeight <= STANDARD_SASH.maxHeight;
    if (!widthInStd || !heightInStd) {
      isNonStandard = true;
      warnings.push(
        `Нестандартный размер створки (${Math.round(sashHeight)}×${Math.round(sashWidth)} мм). Наценка +30%.`,
      );
    }
    if (
      sashWidth > NONSTANDARD_SASH.maxWidth ||
      sashHeight > NONSTANDARD_SASH.maxHeight
    ) {
      errors.push(
        `Размер створки превышает максимум ${NONSTANDARD_SASH.maxHeight}×${NONSTANDARD_SASH.maxWidth} мм`,
      );
    }
  }

  // Проверка соответствия позиций и количества ручек
  const totalPositions = s.handlePositions.reduce((sum, arr) => sum + arr.length, 0);
  if (totalPositions > 0 && totalPositions !== s.handleCount) {
    warnings.push(
      `Отмечено позиций ручек: ${totalPositions}, выбрано ручек: ${s.handleCount}. Проверьте.`,
    );
  }

  const glassPrice = glass?.pricePerSqm ?? 0;
  const basePartPrice = type.basePrice + glassPrice * totalSqm;
  const modelsPrice = (model?.price ?? 0) * type.sashCount;
  const setsPrice = s.setIds.reduce((sum, id) => sum + (SETS[id]?.price ?? 0), 0);
  const handlesPrice = HANDLE_COUNT_PRICES[s.handleCount] ?? 0;

  const totalPrice = basePartPrice + modelsPrice + setsPrice + handlesPrice;
  const nonStandardMarkup = isNonStandard ? totalPrice * NONSTANDARD_MARKUP : 0;
  const totalWithMarkup = totalPrice + nonStandardMarkup;
  const rrcPrice = totalWithMarkup * (1 + RRC_MARKUP);

  return {
    sashHeight,
    sashWidth,
    sqmPerSash,
    totalSqm,
    glassPrice,
    basePartPrice,
    modelsPrice,
    setsPrice,
    handlesPrice,
    totalPrice,
    nonStandardMarkup,
    totalWithMarkup,
    rrcPrice,
    warnings,
    errors,
    isNonStandard,
  };
}

export function formatRub(n: number): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
