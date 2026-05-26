"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

export default function Providers({
  children,
  locale,
  messages,
  timeZone,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
  timeZone?: string;
}) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
