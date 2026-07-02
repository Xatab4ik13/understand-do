// Интерьерные рендеры — используются на карточках выбора типа (главная)
import interior1 from "@/assets/interiors/interior_1.jpg.asset.json";
import interior2 from "@/assets/interiors/interior_2.jpg.asset.json";
import interior3 from "@/assets/interiors/interior_3.jpg.asset.json";
import interior4 from "@/assets/interiors/interior_4.jpg.asset.json";
import interior5 from "@/assets/interiors/interior_5.jpg.asset.json";
import interior6 from "@/assets/interiors/interior_6.jpg.asset.json";
import interior7 from "@/assets/interiors/interior_7.jpg.asset.json";

// Технические схемы — используются рядом с проекцией в конфигураторе
import scheme1 from "@/assets/types/type1.jpg.asset.json";
import scheme2 from "@/assets/types/type2.jpg.asset.json";
import scheme3active from "@/assets/types/type3active.jpg.asset.json";
import scheme3stat from "@/assets/types/type3stat.jpg.asset.json";
import scheme4 from "@/assets/types/type4.jpg.asset.json";
import scheme5 from "@/assets/types/type5.jpg.asset.json";
import scheme6 from "@/assets/types/type6.jpg.asset.json";
import scheme7 from "@/assets/types/type7.jpg.asset.json";

// Карточки выбора типа — интерьерные фото
export const TYPE_IMAGES: Record<string, string> = {
  "type-1": interior7.url,
  "type-2": interior6.url,
  "type-2-sync": interior6.url,
  "type-3-active": interior5.url,
  "type-3-stat": interior5.url,
  "type-4": interior3.url,
  "type-5": interior1.url,
  "type-5-sync": interior1.url,
  "type-6": interior4.url,
  "type-7": interior2.url,
};

// Схемы — рядом с проекцией в конфигураторе
export const TYPE_SCHEMES: Record<string, string> = {
  "type-1": scheme1.url,
  "type-2": scheme2.url,
  "type-2-sync": scheme2.url,
  "type-3-active": scheme3active.url,
  "type-3-stat": scheme3stat.url,
  "type-4": scheme4.url,
  "type-5": scheme5.url,
  "type-5-sync": scheme5.url,
  "type-6": scheme6.url,
  "type-7": scheme7.url,
};
