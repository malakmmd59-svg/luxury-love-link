import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

const copy = {
  en: {
    title: "Kindly respond",
    intro: "We would be delighted to know if you will join us.",
    name: "Your name",
    placeholder: "Enter your name",
    question: "Will you be attending?",
    yes: "Joyfully accepts",
    no: "Regretfully declines",
    guests: "Number of guests",
    submit: "Confirm attendance",
    close: "Close",
    thanksYes: "Your attendance is confirmed",
    thanksNo: "Thank you for letting us know",
    messageYes: (name: string) => `We look forward to celebrating with you, ${name}.`,
    messageNo: (name: string) => `We will miss you, ${name}, and hope to see you soon.`,
  },
  ar: {
    title: "تأكيد الحضور",
    intro: "يسعدنا أن نعرف إن كنتم ستشاركوننا هذه الفرحة.",
    name: "الاسم",
    placeholder: "اكتب اسمك هنا",
    question: "هل ستتمكنون من الحضور؟",
    yes: "بكل سرور",
    no: "للأسف لن أتمكن",
    guests: "عدد الضيوف",
    submit: "تأكيد الحضور",
    close: "إغلاق",
    thanksYes: "تم تأكيد حضوركم",
    thanksNo: "شكراً لإبلاغنا",
    messageYes: (name: string) => `نتطلع للاحتفال معكم يا ${name}.`,
    messageNo: (name: string) => `سنفتقدكم يا ${name} ونتمنى أن نراكم قريباً.`,
  },
} as const;

export function RsvpModal({
  open,
  onClose,
  onSaved,
  language,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (data: RsvpData) => void;
  language: "en" | "ar";
}) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);
  const text = copy[language];

  useEffect(() => {
    if (!open) return;
    setDone(false);
    const saved = readRsvp();
    if (saved) {
      setName(saved.name);
      setAttending(saved.attending);
      setGuests(saved.guests || 1);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const data: RsvpData = { name: name.trim(), attending, guests: attending === "yes" ? guests : 0 };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Confirmation still works when browser storage is unavailable.
    }
    onSaved(data);
    setDone(true);
  };

  return (
    <div
      className="rsvp-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={text.title}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="rsvp-dialog" onClick={(event) => event.stopPropagation()}>
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto h-px w-16 bg-gold" />
            <h3 className="mt-8 font-display text-3xl text-foreground">
              {attending === "yes" ? text.thanksYes : text.thanksNo}
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              {attending === "yes" ? text.messageYes(name) : text.messageNo(name)}
            </p>
            <Button onClick={onClose} className="invitation-button mt-8">
              {text.close}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="text-center">
              <p className="section-kicker">RSVP</p>
              <h3 className="mt-3 font-display text-3xl text-foreground">{text.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{text.intro}</p>
            </div>

            <label className="mt-8 block text-sm text-foreground">
              {text.name}
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder={text.placeholder}
                className="editorial-input"
              />
            </label>

            <fieldset className="mt-6">
              <legend className="text-sm text-foreground">{text.question}</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant="outline"
                    onClick={() => setAttending(option)}
                    className={`choice-button ${attending === option ? "is-selected" : ""}`}
                  >
                    {text[option]}
                  </Button>
                ))}
              </div>
            </fieldset>

            {attending === "yes" && (
              <label className="mt-6 block text-sm text-foreground">
                {text.guests}
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(event) => setGuests(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
                  className="editorial-input"
                />
              </label>
            )}

            <Button type="submit" className="invitation-button mt-8 w-full">
              {text.submit}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
