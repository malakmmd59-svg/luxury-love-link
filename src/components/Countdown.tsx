import { useEffect, useState } from "react";

const TARGET = new Date("2026-10-16T19:00:00+03:00").getTime();
const ar = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)] ?? d);

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, TARGET - now);
  const units = [
    { v: Math.floor(diff / 864e5), en: "Days", ar: "يوم" },
    { v: Math.floor(diff / 36e5) % 24, en: "Hours", ar: "ساعة" },
    { v: Math.floor(diff / 6e4) % 60, en: "Minutes", ar: "دقيقة" },
    { v: Math.floor(diff / 1e3) % 60, en: "Seconds", ar: "ثانية" },
  ];
  return (
    <div dir="ltr" className="grid grid-cols-4 gap-2 sm:gap-4">
      {units.map((u) => (
        <div key={u.en} className="glass border-metal shadow-luxe flex flex-col items-center rounded-t-full px-1 pb-4 pt-6 sm:pt-8">
          <span className="font-playfair text-3xl tabular-nums text-navy sm:text-5xl">{now === null ? "--" : String(u.v).padStart(2, "0")}</span>
          <span className="mt-1 font-cairo text-xs text-rose-gold">{now === null ? "" : ar(u.v)}</span>
          <span className="mt-3 h-px w-6 bg-gold" />
          <span className="mt-2 font-cormorant text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">{u.en}</span>
          <span className="font-amiri text-sm text-navy">{u.ar}</span>
        </div>
      ))}
    </div>
  );
}
