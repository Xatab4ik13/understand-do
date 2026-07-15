import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { dealerLogin } from "@/lib/api/dealer.functions";
import { useInvalidateDealerMode } from "@/hooks/useDealerMode";
import { toast } from "sonner";

export function DealerLoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const invalidate = useInvalidateDealerMode();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await dealerLogin({ data: { password } });
      if (res.ok) {
        toast.success("Дилерский режим включён");
        await invalidate();
        setPassword("");
        onOpenChange(false);
      } else {
        toast.error("Неверный пароль");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setPassword(""); onOpenChange(o); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вход для дилеров</DialogTitle>
          
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dealer-password">Пароль</Label>
            <Input
              id="dealer-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !password}>
              {loading ? "Проверяем…" : "Войти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
