export type ProductImage = { src: string; w: number; h: number };

export type ProductLine = {
  slug: string;
  name: string;
  eyebrow: string;
  caption: string;
  images: ProductImage[];
};

const image = (n: number) => `/img/products/brendors/brendors-${String(n).padStart(2, "0")}.webp`;

export const PRODUCT_LINES: ProductLine[] = [
  {
    slug: "brendors",
    name: "Брендорс",
    eyebrow: "Наша продукция",
    caption:
      "Алюминиевые стеклянные перегородки Брендорс — раздвижные и распашные конструкции в чёрном профиле.",
    images: [
      { src: image(1), w: 1050, h: 1400 },
      { src: image(2), w: 1080, h: 1080 },
      { src: image(3), w: 960, h: 1280 },
      { src: image(4), w: 806, h: 635 },
      { src: image(5), w: 1050, h: 1400 },
      { src: image(6), w: 1050, h: 1400 },
      { src: image(7), w: 1050, h: 1400 },
      { src: image(8), w: 960, h: 1280 },
      { src: image(9), w: 1050, h: 1400 },
    ],
  },
];

export const getProductLine = (slug: string) => PRODUCT_LINES.find((p) => p.slug === slug);
