import { useMemo, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  label: string;
  dir: "ltr" | "rtl";
  viewportClassName: string;
  children: ReactNode;
};

export default function HorizontalScrollRow({
  label,
  dir,
  viewportClassName,
  children,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const canScrollLeftLabel = useMemo(() => `${label}: scroll left`, [label]);
  const canScrollRightLabel = useMemo(() => `${label}: scroll right`, [label]);

  const scrollByAmount = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(280, Math.floor(el.clientWidth * 0.85));
    const sign = direction === "next" ? 1 : -1;
    el.scrollBy({ left: sign * amount, behavior: "smooth" });
  };

  return (
    <div className="hscroll" data-dir={dir}>
      <button
        type="button"
        className="hscroll__button hscroll__button--left"
        aria-label={canScrollLeftLabel}
        onClick={() => scrollByAmount("prev")}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <div ref={scrollerRef} className={viewportClassName}>
        {children}
      </div>
      <button
        type="button"
        className="hscroll__button hscroll__button--right"
        aria-label={canScrollRightLabel}
        onClick={() => scrollByAmount("next")}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
