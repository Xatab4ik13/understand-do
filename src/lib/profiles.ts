export const PROFILE_COLORS = [
  { id: "01", name: "Черный анод" },
  { id: "02", name: "Серебро" },
  { id: "03", name: "Золото" },
  { id: "04", name: "Шампань" },
] as const;

export type Profile = {
  slug: string;
  name: string;
  colors: string[]; // color ids available
  scheme?: string;
};

const all = ["01", "02", "03", "04"];

export const PROFILES: Profile[] = [
  { slug: "vertical", name: "Вертикальный профиль", colors: all, scheme: "/img/profiles/vertical-scheme.webp" },
  { slug: "horizontal", name: "Горизонтальный профиль", colors: all, scheme: "/img/profiles/horizontal-scheme.webp" },
  { slug: "cornice", name: "Карниз", colors: all, scheme: "/img/profiles/cornice-scheme.webp" },
  { slug: "bracket", name: "Кронштейн стенового крепления", colors: all },
  { slug: "cover", name: "Крышка вертикального профиля", colors: all },
  { slug: "divider", name: "Разделитель трека", colors: ["01"] },
];

export const profileImage = (slug: string, color: string) => `/img/profiles/${slug}-${color}.webp`;
export const colorName = (id: string) => PROFILE_COLORS.find((c) => c.id === id)?.name ?? "";
