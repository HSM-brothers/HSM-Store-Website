import type { AppLocale } from "@/i18n/messages";

const AR_CATEGORY_MAP: Record<string, string> = {
  "Bakery & Bread": "المخبوزات والخبز",
  Beverages: "المشروبات",
  "Canned & Jarred Goods": "المعلبات والمرطبانات",
  "Cleaning & Household": "التنظيف والمنزل",
  Coffee: "القهوة",
  "Dairy & Eggs": "الألبان والبيض",
  Electronics: "الإلكترونيات",
  "Frozen Foods": "الأطعمة المجمّدة",
  "Hookah Accessories": "مستلزمات الأرجيلة",
  "Oils & Cooking Fats": "الزيوت والدهون",
  Other: "أخرى",
  "Pasta, Rice & Grains": "المعكرونة والأرز والحبوب",
  "Personal Care & Hygiene": "العناية الشخصية والنظافة",
  "Sauces & Condiments": "الصلصات والإضافات",
  "Snacks & Confectionery": "الوجبات الخفيفة والحلويات",
  "Spices & Seasonings": "البهارات والتوابل",
  Tea: "الشاي",
  "Tobacco & Smoking": "التبغ والتدخين",
};

export function categoryLabel(locale: AppLocale, category: string | null): string {
  if (!category) return "—";
  if (locale !== "ar") return category;
  return AR_CATEGORY_MAP[category] ?? category;
}

