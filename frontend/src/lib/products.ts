export type ProductCategory =
  | "produce"
  | "dairy"
  | "bakery"
  | "snacks"
  | "drinks"
  | "household";

export type Product = {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  category: ProductCategory;
  priceUsd: number;
};

export const mockProducts: Product[] = [
  {
    id: "p01",
    name: { en: "Bananas (1kg)", ar: "موز (1 كغ)" },
    category: "produce",
    priceUsd: 1.99,
  },
  {
    id: "p02",
    name: { en: "Tomatoes (1kg)", ar: "بندورة (1 كغ)" },
    category: "produce",
    priceUsd: 2.25,
  },
  {
    id: "p03",
    name: { en: "Milk (1L)", ar: "حليب (1 لتر)" },
    category: "dairy",
    priceUsd: 1.49,
  },
  {
    id: "p04",
    name: { en: "Labneh (500g)", ar: "لبنة (500غ)" },
    category: "dairy",
    priceUsd: 2.95,
  },
  {
    id: "p05",
    name: { en: "Arabic Bread", ar: "خبز عربي" },
    category: "bakery",
    priceUsd: 0.99,
  },
  {
    id: "p06",
    name: { en: "Croissant", ar: "كرواسون" },
    category: "bakery",
    priceUsd: 0.75,
  },
  {
    id: "p07",
    name: { en: "Potato Chips", ar: "شيبس بطاطا" },
    category: "snacks",
    priceUsd: 1.25,
  },
  {
    id: "p08",
    name: { en: "Chocolate Bar", ar: "لوح شوكولا" },
    category: "snacks",
    priceUsd: 0.85,
  },
  {
    id: "p09",
    name: { en: "Orange Juice", ar: "عصير برتقال" },
    category: "drinks",
    priceUsd: 1.8,
  },
  {
    id: "p10",
    name: { en: "Sparkling Water", ar: "مياه غازية" },
    category: "drinks",
    priceUsd: 0.65,
  },
  {
    id: "p11",
    name: { en: "Dish Soap", ar: "سائل جلي" },
    category: "household",
    priceUsd: 2.1,
  },
  {
    id: "p12",
    name: { en: "Paper Towels", ar: "مناشف ورقية" },
    category: "household",
    priceUsd: 2.75,
  }
];
