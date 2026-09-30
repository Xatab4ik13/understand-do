import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type Props = {
  isDealer: boolean;
  onDealerLogin: () => void;
  onDealerRequest: () => void;
  onLogout: () => void;
};

const itemCls =
  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[0.95rem] font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]";

export function SiteMenu({ isDealer, onDealerLogin, onDealerRequest, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const act = (fn: () => void) => () => {
    close();
    fn();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full transition-[background-color,transform] duration-100 hover:bg-muted active:scale-[0.94]"
      >
        <span
          className={`absolute h-[1.5px] w-5 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "rotate-45" : "-translate-y-[4px]"}`}
        />
        <span
          className={`absolute h-[1.5px] w-5 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "-rotate-45" : "translate-y-[4px]"}`}
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2.5rem))] origin-top-right rounded-2xl border border-border/60 bg-background/95 p-2 shadow-[0_24px_60px_color-mix(in_oklab,var(--foreground)_14%,transparent)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-opacity ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
      >
        <Link to="/products/brendors" onClick={close} className={itemCls}>
          Наша продукция
        </Link>
        <Link to="/profiles" onClick={close} className={itemCls}>
          Алюминиевый профиль
        </Link>
        <Link to="/glass" onClick={close} className={itemCls}>
          Виды стекла
        </Link>
        <Link to="/about" onClick={close} className={itemCls}>
          О компании
        </Link>
        <Link to="/contacts" onClick={close} className={itemCls}>
          Контакты
        </Link>

        <div className="my-2 h-px bg-border/70" />

        {isDealer ? (
          <button type="button" className={itemCls} onClick={act(onLogout)}>
            Выйти
          </button>
        ) : (
          <button type="button" className={itemCls} onClick={act(onDealerLogin)}>
            Для дилеров
          </button>
        )}
        <button type="button" className={itemCls} onClick={act(onDealerRequest)}>
          Стать дилером
        </button>
      </div>
    </div>
  );
}
