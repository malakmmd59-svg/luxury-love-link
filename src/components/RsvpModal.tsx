import { useEffect, useState } from "react";

export type RsvpData = {
  name: string;
  attending: "yes" | "no";
  guests: number;
};

const STORAGE_KEY = "aziz-malak-rsvp";

export function readRsvp(): RsvpData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RsvpData) : null;
  } catch {
    return null;
  }
}

export function RsvpModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (data: RsvpData) => void;
}) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setDone(false);
      const saved = readRsvp();
      if (saved) {
        setName(saved.name);
        setAttending(saved.attending);
        setGuests(saved.guests);
      }
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data: RsvpData = { name: name.trim(), attending, guests: attending === "yes" ? guests : 0 };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable — confirmation still shown */
    }
    onSaved(data);
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="تأكيد الحضور"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gold/40 bg-card p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-secondary">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold-deep" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="mt-5 font-amiri text-2xl font-bold text-gold-shimmer">
              {attending === "yes" ? "شكراً لكم! تم تأكيد حضوركم" : "شكراً لكم"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {attending === "yes"
                ? `نتشرف بحضوركم يا ${name} — نراكم يوم الجمعة ١٦ أكتوبر`
                : `نتمنى أن نلتقي بكم قريباً يا ${name}`}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="text-center">
              <h3 className="font-amiri text-2xl font-bold text-foreground">تأكيد الحضور</h3>
              <p className="mt-1 text-sm text-muted-foreground">يسعدنا أن نعرف إن كنتم ستشاركوننا الفرحة</p>
            </div>

            <label className="mt-6 block text-sm font-medium">
              الاسم
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="اكتب اسمك هنا"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </label>

            <div className="mt-4">
              <span className="block text-sm font-medium">هل ستستمتعون بالحضور؟</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    { key: "yes", label: "بكل تأكيد! 🌹" },
                    { key: "no", label: "للأسف لا أستطيع" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAttending(opt.key)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      attending === opt.key
                        ? "border-gold bg-secondary text-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {attending === "yes" && (
              <label className="mt-4 block text-sm font-medium">
                عدد الأشخاص
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </label>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-gradient-to-l from-gold-deep via-gold to-gold-deep px-8 py-3.5 text-sm font-bold text-navy shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              تأكيد
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
