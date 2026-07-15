import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitDealerRequest } from "@/lib/api/contact.functions";
import { toast } from "sonner";

export function DealerRequestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    company: "",
    message: "",
    website: "", // honeypot
  });

  const reset = () =>
    setForm({ name: "", phone: "", city: "", company: "", message: "", website: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitDealerRequest({ data: form });
      toast.success("Заявка отправлена. Мы свяжемся с вами.");
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Не удалось отправить";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Стать дилером</DialogTitle>
        </DialogHeader>
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
            <Label htmlFor="dr-name">Имя *</Label>
            <Input
              id="dr-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dr-phone">Телефон *</Label>
              <Input
                id="dr-phone"
                required
                inputMode="tel"
                placeholder="+7…"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dr-city">Город *</Label>
              <Input
                id="dr-city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dr-company">Компания</Label>
            <Input
              id="dr-company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dr-message">Комментарий</Label>
            <Textarea
              id="dr-message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Отправляем…" : "Отправить заявку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
