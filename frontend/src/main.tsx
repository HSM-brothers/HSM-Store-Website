import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import { CartProvider } from "@/components/CartProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
