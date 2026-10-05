import { useEffect, useState } from "react";

const TARGET = new Date("2026-10-16T19:00:00+03:00").getTime();
const arabicDigits = (value: number) =>
  String(value)
    .padStart(2, "0")
    .replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)] ?? digit);

const labels = {
  en: ["Days", "Hours", "Minutes", "Seconds"],
  ar: ["يوم", "ساعة", "دقيقة", "ثانية"],
} as const;

export function Countdown({ language }: { language: "en" | "ar" }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const difference = now === null ? 0 : Math.max(0, TARGET - now);
  const values = [
    Math.floor(difference / 86_400_000),
    Math.floor(difference / 3_600_000) % 24,
    Math.floor(difference / 60_000) % 60,
    Math.floor(difference / 1_000) % 60,
  ];

  return (
    <div className="countdown-grid" dir={language === "ar" ? "rtl" : "ltr"}>
      {values.map((value, index) => (
        <div className="countdown-unit" key={labels.en[index]}>
          <span className="countdown-number">
            {now === null ? "—" : language === "ar" ? arabicDigits(value) : String(value).padStart(2, "0")}
          </span>
          <span className="countdown-label">{labels[language][index]}</span>
        </div>
      ))}
    </div>
  );
}
