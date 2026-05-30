export const locales = ["ar", "en"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "ar";

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: AppLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

type Messages = {
  common: {
    clear: string;
    collapse: string;
    expand: string;
  };
  nav: {
    title: string;
    brand: string;
    brandTagline: string;
    searchPlaceholder: string;
    filter: string;
    categories: string;
    allCategories: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    english: string;
    arabic: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  home: {
    allCategories: string;
    viewAll: string;
    error: string;
    noResults: string;
    noImage: string;
    outOfStock: string;
    addToCart: string;
  };
  cart: {
    title: string;
    close: string;
    empty: string;
    remove: string;
    increment: string;
    decrement: string;
    subtotal: string;
    yourName: string;
    yourNamePlaceholder: string;
    checkoutWhatsApp: string;
    clear: string;
  };
};

export const messages: Record<AppLocale, Messages> = {
  en: {
    common: {
      clear: "Clear",
      collapse: "Collapse",
      expand: "Expand",
    },
    nav: {
      title: "HSM",
      brand: "HSM",
      brandTagline: "FRESH PICKS. EVERY DAY.",
      searchPlaceholder: "Search products…",
      filter: "Filter by category",
      categories: "Categories",
      allCategories: "All categories",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      english: "English",
      arabic: "Arabic",
    },
    hero: {
      eyebrow: "CURATED · UPDATED DAILY",
      titleLine1: "The good stuff,",
      titleLine2: "already in your cart.",
      subtitle:
        "Hand-picked everyday essentials. Build your basket and send the order straight to us on WhatsApp.",
    },
    home: {
      allCategories: "All",
      viewAll: "View all",
      error: "Could not load products. Please try again.",
      noResults: "No products match your filters.",
      noImage: "No image",
      outOfStock: "Out of stock",
      addToCart: "Add to cart",
    },
    cart: {
      title: "Cart",
      close: "Close",
      empty: "Your cart is empty.",
      remove: "Remove",
      increment: "Increase quantity",
      decrement: "Decrease quantity",
      subtotal: "Subtotal",
      yourName: "Your name (optional)",
      yourNamePlaceholder: "e.g. Sara",
      checkoutWhatsApp: "Send order via WhatsApp",
      clear: "Clear cart",
    },
  },
  ar: {
    common: {
      clear: "مسح",
      collapse: "طيّ",
      expand: "توسيع",
    },
    nav: {
      title: "HSM",
      brand: "HSM",
      brandTagline: "منتجات مختارة. كل يوم.",
      searchPlaceholder: "ابحث عن المنتجات…",
      filter: "تصفية حسب الفئة",
      categories: "التصنيفات",
      allCategories: "كل الفئات",
      language: "اللغة",
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      english: "English",
      arabic: "العربية",
    },
    hero: {
      eyebrow: "مختارة · تُحدّث يومياً",
      titleLine1: "كل ما تحتاجه،",
      titleLine2: "بين يديك بسهولة.",
      subtitle:
        "منتجات يومية مختارة بعناية. أضف ما تريد إلى السلة وأرسل طلبك مباشرة عبر واتساب.",
    },
    home: {
      allCategories: "الكل",
      viewAll: "عرض الكل",
      error: "تعذّر تحميل المنتجات. حاول مرة أخرى.",
      noResults: "لا توجد منتجات مطابقة.",
      noImage: "بدون صورة",
      outOfStock: "غير متوفر",
      addToCart: "أضف للسلة",
    },
    cart: {
      title: "السلة",
      close: "إغلاق",
      empty: "السلة فارغة.",
      remove: "إزالة",
      increment: "زيادة الكمية",
      decrement: "إنقاص الكمية",
      subtotal: "المجموع",
      yourName: "اسمك (اختياري)",
      yourNamePlaceholder: "مثلاً: سارة",
      checkoutWhatsApp: "إرسال الطلب عبر واتساب",
      clear: "تفريغ السلة",
    },
  },
};

export function formatResults(locale: AppLocale, count: number): string {
  if (locale === "ar") {
    if (count === 0) return "لا نتائج";
    if (count === 1) return "نتيجة واحدة";
    if (count === 2) return "نتيجتان";
    if (count >= 3 && count <= 10) return `${count} نتائج`;
    return `${count} نتيجة`;
  }
  if (count === 0) return "No results";
  if (count === 1) return "1 result";
  return `${count} results`;
}

export function formatCount(locale: AppLocale, count: number): string {
  if (locale === "ar") {
    if (count === 1) return "منتج واحد";
    if (count === 2) return "منتجان";
    if (count >= 3 && count <= 10) return `${count} منتجات`;
    return `${count} منتج`;
  }
  return count === 1 ? "1 product" : `${count} products`;
}
