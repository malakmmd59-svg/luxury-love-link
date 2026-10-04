import { useEffect, useState } from "react";

// ⏰ عد تنازلي حتى لحظة الحفل — الجمعة ١٦ أكتوبر ٢٠٢٦، ٧:٠٠ مساءً
const TARGET = new Date(2026, 9, 16, 19, 0, 0).getTime();

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabicDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => AR_DIGITS[Number(d)] ?? d);

type Units = { days: number; hours: number; minutes: number; seconds: number; passed: boolean };

function getUnits(): Units {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    passed: false,
  };
}

export function Countdown() {
  const [units, setUnits] = useState<Units | null>(null);

  useEffect(() => {
    setUnits(getUnits());
    const id = setInterval(() => setUnits(getUnits()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { value: units?.days, label: "يوم" },
    { value: units?.hours, label: "ساعة" },
    { value: units?.minutes, label: "دقيقة" },
    { value: units?.seconds, label: "ثانية" },
  ];

  return (
    <div dir="ltr" className="grid grid-cols-4 gap-2 sm:gap-4">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex flex-col items-center rounded-2xl border border-gold/30 bg-card px-1 py-4 shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--gold)_60%,transparent)] sm:py-6"
        >
          <span className="font-amiri text-3xl font-bold text-gold-shimmer tabular-nums sm:text-5xl">
            {cell.value === undefined ? "٠٠" : toArabicDigits(String(cell.value).padStart(2, "0"))}
          </span>
          <span dir="rtl" className="mt-1 text-[11px] font-medium text-muted-foreground sm:text-sm">
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}
