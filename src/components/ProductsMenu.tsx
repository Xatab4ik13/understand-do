import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export function ProductsMenu({ itemClass }: { itemClass: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className={itemClass}
        onClick={() => setOpen(true)}
      >
        Наша продукция
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-3 min-w-44 -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-background p-1.5 shadow-[0_18px_45px_color-mix(in_oklab,var(--foreground)_12%,transparent)]"
        >
          <Link
            to="/products/brendors"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
          >
            Брендорс
          </Link>
        </div>
      ) : null}
    </div>
  );
}
