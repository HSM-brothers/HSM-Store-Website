import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/routing";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  matcher: ["/((?!api|_next/data|_next/static|_next/image|.*\\..*).*)"],
};
