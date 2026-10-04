import { useEffect } from "react";

export type LightboxImage = { src: string; alt: string } | null;

export function Lightbox({ image, onClose }: { image: LightboxImage; onClose: () => void }) {
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/92 p-5 backdrop-blur-md"
    >
      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_24px_60px_color-mix(in_oklab,var(--foreground)_18%,transparent)]"
      />
    </div>
  );
}
