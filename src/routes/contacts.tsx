import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/logo-icon.png.asset.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitContactRequest } from "@/lib/api/contact.functions";
import { toast } from "sonner";

const logoUrl = logoAsset.url;

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Brand Alum" },
      {
        name: "description",
        content:
          "Контакты Brand Alum: производство межкомнатных алюминиевых стеклянных перегородок в Москве",
      },
      { property: "og:title", content: "Контакты — Brand Alum" },
      {
        property: "og:description",
        content: "Контакты Brand Alum: производство алюминиевых стеклянных перегородок в Москве",
      },
    ],
  }),
  component: Contacts,
});

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    website: "",
  });

  const reset = () =>
    setForm({ name: "", phone: "", email: "", message: "", website: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactRequest({ data: { ...form } });
      toast.success("Сообщение отправлено. Мы свяжемся с вами.");
      reset();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Не удалось отправить";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="hidden"
        aria-hidden="true"
      />
      <div className="space-y-1.5">
        <Label htmlFor="ct-name">Имя *</Label>
        <Input
          id="ct-name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={loading}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-phone">Телефон *</Label>
          <Input
            id="ct-phone"
            required
            inputMode="tel"
            placeholder="+7…"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-email">Email</Label>
          <Input
            id="ct-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ct-message">Сообщение</Label>
        <Textarea
          id="ct-message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Отправляем…" : "Отправить"}
      </Button>
    </form>
  );
}

function Contacts() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex h-24 items-center gap-2 md:h-32 md:items-stretch">
            <img src={logoUrl} alt="Логотип Brand Alum" className="h-full w-auto" />
            <div className="flex flex-col justify-center">
              <div className="inline-flex flex-col">
                <span className="font-['Inter'] text-[2.5rem] font-black uppercase leading-[0.85] tracking-tight text-foreground md:text-[3.25rem]">
                  Brand
                </span>
                <span className="font-['Inter'] text-[2.5rem] font-black uppercase leading-[0.85] tracking-tight text-foreground md:text-[3.25rem]">
                  Alum
                </span>
                <div className="mt-1 h-[2px] w-full bg-foreground" />
              </div>
              <span className="mt-1 font-sans text-sm font-medium leading-tight text-foreground md:text-base">
                Алюминиевые стеклянные перегородки
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1 font-['Inter'] text-sm font-black uppercase tracking-tight text-foreground transition-opacity hover:opacity-70 md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-['Inter'] text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
          Контакты
        </h1>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-foreground md:text-lg">
              Компания Brandalum — производство межкомнатных алюминиевых стеклянных
              перегородок в Москве.
            </p>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Контакты
              </h2>
              <p className="mt-2 text-base text-foreground">
                <a
                  href="mailto:zakaz@brandalum.ru"
                  className="transition-opacity hover:opacity-70"
                >
                  zakaz@brandalum.ru
                </a>
              </p>
              <p className="mt-1 text-base text-foreground">
                <a
                  href="tel:+79060640955"
                  className="transition-opacity hover:opacity-70"
                >
                  89060640955
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Адрес
              </h2>
              <p className="mt-2 text-base text-foreground">
                Москва, Симферопольское шоссе 15/1, 3й этаж
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">Форма обратной связи</h2>
            <div className="mt-4 rounded-lg border bg-card p-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
