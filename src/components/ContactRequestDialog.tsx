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
import { submitContactRequest } from "@/lib/api/contact.functions";
import { toast } from "sonner";

export function ContactRequestDialog({
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
          <DialogTitle>Оставить заявку</DialogTitle>
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
            <Label htmlFor="cr-name">Имя *</Label>
            <Input
              id="cr-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cr-phone">Телефон *</Label>
              <Input
                id="cr-phone"
                required
                inputMode="tel"
                placeholder="+7…"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cr-email">Email</Label>
              <Input
                id="cr-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cr-message">Комментарий</Label>
            <Textarea
              id="cr-message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              disabled={loading}
            />
          </div>
          {summary && (
            <p className="text-xs text-muted-foreground">
              К заявке будет приложена текущая конфигурация из конфигуратора.
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Отправляем…" : "Отправить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
