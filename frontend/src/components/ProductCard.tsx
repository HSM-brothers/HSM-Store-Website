import { formatPrice, type Product } from "@/lib/products";
import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};

export default function ProductCard({ product: p, onAdd }: Props) {
  const { t } = useI18n();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-fg-muted">
            {t("home.noImage")}
          </div>
        )}
        {!p.in_stock && (
          <div className="absolute start-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-fg shadow-sm">
            {t("home.outOfStock")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {p.category && (
          <span className="inline-flex w-fit rounded-md bg-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pill-fg">
            {p.category}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug">
          {p.name}
          {p.unit ? (
            <span className="text-fg-muted"> · {p.unit}</span>
          ) : null}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-sm font-semibold">
            {formatPrice(p.selling_price, p.selling_price_currency)}
          </span>
          <button
            type="button"
            disabled={!p.in_stock}
            onClick={() => onAdd(p)}
            className="h-8 rounded-full bg-accent px-4 text-xs font-semibold text-accent-fg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-fg-muted"
          >
            {t("home.addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}
