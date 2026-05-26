import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isAppLocale } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const requestedLocale = typeof locale === "string" ? locale : defaultLocale;
  const resolvedLocale = isAppLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  };
});
