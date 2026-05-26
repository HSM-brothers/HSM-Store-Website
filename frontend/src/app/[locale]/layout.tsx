import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Kufi_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import type { CSSProperties } from "react";
import Providers from "@/components/Providers";
import { getLocaleDirection, isAppLocale, locales, type AppLocale } from "@/i18n/routing";
import "../globals.css";

const latin = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-latin",
  weight: ["400", "500", "600", "700"],
});

const arabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HSM Mini Market",
  description: "HSM Store Website (frontend)",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  const messages = await getMessages();
  const dir = getLocaleDirection(locale as AppLocale);
  const fontUi =
    dir === "rtl" ? "var(--font-arabic)" : "var(--font-latin)";
  const style = { "--font-ui": fontUi } as CSSProperties;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${latin.variable} ${arabic.variable} h-full antialiased`}
      style={style}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
