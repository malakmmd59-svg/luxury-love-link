import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import couple from "@/assets/couple.jpg.asset.json";
import { Countdown } from "@/components/Countdown";
import { RsvpModal, readRsvp, type RsvpData } from "@/components/RsvpModal";

/* عدّل بيانات الحفل من هنا */
const EVENT = {
  timeAr: "الساعة ٧:٠٠ مساءً",
  timeEn: "7:00 in the evening",
  venueName: "قاعة الاستقبال",
  venueEn: "The Grand Reception Hall",
  venueAddress: "سيتم الإعلان عن العنوان قريباً",
  mapsUrl: "https://www.google.com/maps",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aziz & Malak — دعوة خطوبة عزيز وملك | ١٦ أكتوبر ٢٠٢٦" },
      { name: "description", content: "يتشرف عزيز وملك بدعوتكم لحفل خطوبتهما — الجمعة ١٦ أكتوبر ٢٠٢٦" },
      { property: "og:title", content: "Aziz & Malak — Engagement Invitation" },
      { property: "og:description", content: "Join us on October 16th, 2026 — شاركونا فرحتنا" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setV(true), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${v ? "reveal-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Eyebrow({ en, ar }: { en: string; ar: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-cormorant text-xs uppercase tracking-[0.45em] text-rose-gold">{en}</span>
      <span className="font-amiri text-2xl text-navy sm:text-3xl">{ar}</span>
      <span className="mt-2 flex items-center gap-2">
        <span className="h-px w-10 bg-gold" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-10 bg-gold" />
      </span>
    </div>
  );
}

function Envelope({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const go = () => {
    if (open) return;
    setOpen(true);
    setTimeout(onOpen, 2600);
  };
  return (
    <div className={`env-wrap fixed inset-0 z-50 flex flex-col items-center justify-center bg-background grain px-6 ${open ? "env-open" : ""}`}>
      <p className="mb-10 font-cormorant text-xs uppercase tracking-[0.5em] text-rose-gold">You are invited</p>
      <button onClick={go} aria-label="Tap to open invitation" className="relative h-56 w-80 [perspective:1200px] sm:h-64 sm:w-96">
        <div className="env-letter absolute inset-x-4 top-4 bottom-2 flex flex-col items-center justify-center bg-ivory border-metal">
          <span className="font-playfair text-2xl italic text-navy">Aziz &amp; Malak</span>
          <span className="font-amiri text-lg text-rose-gold">عزيز و ملك</span>
        </div>
        <div className="absolute inset-0 bg-navy shadow-luxe" style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
        <div className="env-flap absolute inset-x-0 top-0 h-[60%] bg-navy brightness-125" style={{ filter: "brightness(1.25)" }} />
        <span className="absolute left-1/2 top-[55%] z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-luxe transition-opacity duration-300" style={{ background: "var(--gradient-metal)", opacity: open ? 0 : 1 }}>
          <span className="font-playfair text-lg italic text-navy">A&amp;M</span>
        </span>
      </button>
      <p className="mt-12 animate-pulse font-cormorant text-sm uppercase tracking-[0.4em] text-navy">Tap to open</p>
      <p className="font-amiri text-base text-muted-foreground">اضغط لفتح الدعوة</p>
    </div>
  );
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  useEffect(() => setRsvp(readRsvp()), []);
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background grain text-foreground">
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      {/* Hero */}
      <header className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-14 text-center">
        <p className="font-cormorant text-xs uppercase tracking-[0.5em] text-rose-gold">Together with their families</p>
        <p className="mt-2 font-amiri text-lg text-navy">بكل الحب والفرح ندعوكم</p>

        <Reveal className="relative mt-10">
          <div className="absolute -inset-4 rounded-t-full border border-gold/40" />
          <div className="glass border-metal shadow-luxe rounded-t-full p-2.5">
            <div className="h-[26rem] w-72 overflow-hidden rounded-t-full sm:h-[34rem] sm:w-96">
              <img src={couple.url} alt="Aziz and Malak" className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" />
            </div>
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-4 font-cormorant text-xs uppercase tracking-[0.4em] text-gold-deep">Engagement</span>
        </Reveal>

        <Reveal delay={150} className="mt-14">
          <h1 dir="ltr" className="font-playfair text-6xl font-normal leading-none text-navy sm:text-8xl">
            Aziz <span className="font-cormorant italic text-metal">&amp;</span> Malak
          </h1>
          <p className="mt-4 font-amiri text-4xl text-metal sm:text-5xl">عزيز &amp; ملك</p>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-5">
            <span className="h-px flex-1 bg-gold/60" />
            <div className="text-center">
              <p dir="ltr" className="font-cormorant text-lg tracking-[0.3em] text-navy">16 · 10 · 2026</p>
              <p className="font-amiri text-lg text-rose-gold">١٦ أكتوبر ٢٠٢٦</p>
            </div>
            <span className="h-px flex-1 bg-gold/60" />
          </div>
        </Reveal>
      </header>

      {/* Details */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal><Eyebrow en="The Celebration" ar="تفاصيل الحفل" /></Reveal>
        <div className="mt-12 grid gap-px overflow-hidden border-metal shadow-luxe sm:grid-cols-3">
          {[
            { en: "Date", ar: "التاريخ", v1: "Friday, October 16th", v2: "الجمعة ١٦ أكتوبر ٢٠٢٦" },
            { en: "Time", ar: "الوقت", v1: EVENT.timeEn, v2: EVENT.timeAr },
            { en: "The Couple", ar: "العروسان", v1: "Aziz & Malak", v2: "عزيز و ملك" },
          ].map((d, i) => (
            <Reveal key={d.en} delay={i * 120} className="bg-ivory px-6 py-10 text-center">
              <p className="font-cormorant text-[0.7rem] uppercase tracking-[0.4em] text-rose-gold">{d.en} · {d.ar}</p>
              <p dir="ltr" className="mt-4 font-playfair text-xl italic text-navy">{d.v1}</p>
              <p className="mt-1 font-amiri text-lg text-muted-foreground">{d.v2}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal><Eyebrow en="Counting the Moments" ar="العد التنازلي" /></Reveal>
        <Reveal delay={150} className="mt-12"><Countdown /></Reveal>
      </section>

      {/* Venue */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal><Eyebrow en="The Venue" ar="مكان الحفل" /></Reveal>
        <Reveal delay={150} className="mt-12">
          <div className="grid overflow-hidden border-metal shadow-luxe sm:grid-cols-2">
            <div className="relative flex min-h-64 items-center justify-center bg-navy">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <path key={i} d={`M0 ${i * 22} Q100 ${i * 22 + 30} 200 ${i * 22}`} stroke="var(--champagne)" strokeWidth=".5" fill="none" />
                ))}
              </svg>
              <div className="relative flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--gradient-metal)" }}>
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-navy" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
                </span>
                <span className="mt-4 font-cormorant text-xs uppercase tracking-[0.4em] text-champagne">Location</span>
              </div>
            </div>
            <div className="bg-ivory p-8 text-center sm:p-10 sm:text-right">
              <p dir="ltr" className="font-playfair text-2xl italic text-navy">{EVENT.venueEn}</p>
              <p className="mt-1 font-amiri text-2xl text-rose-gold">{EVENT.venueName}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{EVENT.venueAddress}</p>
              <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-luxe mt-8 font-cairo">
                <span>Open in Google Maps</span><span className="h-3 w-px bg-current opacity-40" /><span className="tracking-normal">افتح الموقع</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* RSVP */}
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <Reveal><Eyebrow en="Kindly Respond" ar="تأكيد الحضور" /></Reveal>
        <Reveal delay={150}>
          <p className="mt-8 font-amiri text-xl leading-loose text-navy">حضوركم يكمّل فرحتنا</p>
          <p className="font-cormorant text-lg italic text-muted-foreground">Your presence would make our day complete</p>
          {rsvp && (
            <p className="mt-6 text-sm text-rose-gold">
              {rsvp.attending === "yes" ? `شكراً ${rsvp.name} — تم تأكيد حضوركم` : `شكراً ${rsvp.name} على ردكم`}
            </p>
          )}
          <button onClick={() => setRsvpOpen(true)} className="btn-luxe solid mt-10 font-cairo">
            <span>Confirm Attendance</span><span className="h-3 w-px bg-current opacity-40" /><span className="tracking-normal">تأكيد الحضور</span>
          </button>
        </Reveal>
      </section>

      <footer className="border-t border-gold/30 py-10 text-center">
        <p dir="ltr" className="font-playfair text-2xl italic text-metal">A &amp; M</p>
        <p className="mt-2 font-cormorant text-xs uppercase tracking-[0.4em] text-muted-foreground">16 · 10 · 2026</p>
      </footer>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} onSaved={setRsvp} />
    </div>
  );
}
