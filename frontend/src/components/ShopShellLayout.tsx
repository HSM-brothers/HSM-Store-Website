import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PanelLeft } from "lucide-react";

type Props = {
  sidebar: ReactNode;
  sidebarEyebrow: string;
  collapseLabel: string;
  expandLabel: string;
  children: ReactNode;
};

const storageKey = "hsm.shop.sidebar-collapsed.v1";

const readInitialCollapsed = () => {
  try {
    return window.localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
};

export default function ShopShellLayout({
  sidebar,
  sidebarEyebrow,
  collapseLabel,
  expandLabel,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readInitialCollapsed());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "true" : "false");
    } catch {
      // ignore
    }
  }, [collapsed]);

  const sidebarState = useMemo(
    () => (collapsed ? "collapsed" : "expanded"),
    [collapsed],
  );
  const toggleLabel = collapsed ? expandLabel : collapseLabel;

  return (
    <section className="shop-shell" data-sidebar={sidebarState}>
      <aside className="shop-shell__sidebar" aria-label={sidebarEyebrow}>
        <div className="shop-sidebar">
          <div className="shop-sidebar__header">
            <p className="shop-sidebar__eyebrow">{sidebarEyebrow}</p>
            <button
              type="button"
              className="icon-button shop-sidebar__collapse"
              aria-label={toggleLabel}
              title={toggleLabel}
              onClick={() => setCollapsed((value) => !value)}
            >
              <PanelLeft size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="shop-sidebar__inner">{sidebar}</div>
        </div>
      </aside>

      <div className="shop-shell__main">
        {collapsed ? (
          <button
            type="button"
            className="shop-sidebar__expand"
            aria-label={expandLabel}
            onClick={() => setCollapsed(false)}
          >
            <PanelLeft size={18} aria-hidden="true" />
          </button>
        ) : null}
        <div className="shop-shell__mainInner">{children}</div>
      </div>
    </section>
  );
}
