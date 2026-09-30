export type GlassType = { slug: string; name: string };

export const GLASS_TYPES: GlassType[] = [
  { slug: "clear", name: "Стекло" },
  { slug: "optiwhite", name: "Осветлённое стекло" },
  { slug: "satin", name: "Стекло сатинат" },
  { slug: "satin-light", name: "Стекло сатинат осветлённый" },
  { slug: "satin-graphite", name: "Стекло сатинат графит" },
  { slug: "satin-bronze", name: "Стекло сатинат бронза" },
  { slug: "toned-graphite", name: "Стекло тонированное графит" },
  { slug: "toned-bronze", name: "Стекло тонированное бронза" },
  { slug: "toned-black", name: "Стекло тонированное чёрный" },
  { slug: "moru", name: "Стекло Мору" },
  { slug: "moru-graphite", name: "Стекло Мору графит" },
  { slug: "moru-bronze", name: "Стекло Мору бронза" },
  { slug: "vision", name: "Стекло Вижн" },
  { slug: "cathedral", name: "Стекло Кафедрал" },
  { slug: "dichroic", name: "Стекло Дихроик" },
];

export const glassImage = (slug: string) => `/img/glass/${slug}.webp`;
