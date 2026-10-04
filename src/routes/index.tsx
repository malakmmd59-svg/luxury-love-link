import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImage from "@/assets/hero-couple.png";
import ornament from "@/assets/floral-ornament.png";
import { Countdown } from "@/components/Countdown";
import { RsvpModal, readRsvp, type RsvpData } from "@/components/RsvpModal";

/* ─────────────────────────────────────────────
   ✏️  عدّل بيانات الحفل من هنا فقط:
   ───────────────────────────────────────────── */
const EVENT = {
  time: "الساعة ٧:٠٠ مساءً",
  venueName: "قاعة الاستقبال",
  venueAddress: "سيتم الإعلان عن العنوان قريباً",
  mapsUrl: "https://www.google.com/maps",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دعوة خطوبة عزيز وملك | ١٦ أكتوبر" },
      {
        name: "description",
        content:
          "يتشرف عزيز وملك بدعوتكم لمشاركتهم فرحتهم بمناسبة خطوبتهما — الجمعة ١٦ أكتوبر ٢٠٢٦",
      },
      { property: "og:title", content: "دعوة خطوبة عزيز وملك" },
      {
        property: "og:description",
        content: "شاركونا فرحتنا بمناسبة الخطوبة — الجمعة ١٦ أكتوبر ٢٠٢٦",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-amiri text-3xl font-bold text-gold-shimmer sm:text-4xl">{children}</h2>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/70" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/70" />
      </div>
    </div>
  );
}

function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-secondary text-gold-deep">
      {children}
    </div>
  );
}

function Index() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);

  useEffect(() => {
    setRsvp(readRsvp());
  }, []);

  return (
    <main dir="rtl" lang="ar" className="relative min-h-screen overflow-x-hidden bg-background font-cairo">
      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-5 py-14">
        {/* ornament corners */}
        <img src={ornament} alt="" aria-hidden className="pointer-events-none absolute -top-4 -right-6 w-44 opacity-60 float-slow sm:-right-10 sm:w-64" />
        <img src={ornament} alt="" aria-hidden className="pointer-events-none absolute -bottom-4 -left-6 w-44 rotate-180 opacity-60 float-slow sm:-left-10 sm:w-64" />

        <Reveal className="flex flex-col items-center text-center">
          <p className="font-amiri text-lg text-muted-foreground sm:text-xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

          <div className="glow-pulse mt-8 rounded-t-full border border-gold/50 p-2.5 sm:p-3">
            <div className="overflow-hidden rounded-t-full border border-gold/30">
              <img
                src={heroImage}
                alt="عزيز وملك"
                width={1024}
                height={1280}
                className="h-64 w-52 object-cover object-top sm:h-96 sm:w-80"
              />
            </div>
          </div>

          <p className="mt-10 text-xs font-semibold tracking-[0.5em] text-gold-deep">دعــوة خطــوبة</p>

          <h1 className="mt-4 font-amiri text-5xl font-bold leading-tight text-gold-shimmer sm:text-7xl">
            عزيز <span className="font-amiri italic">&amp;</span> ملك
          </h1>

          <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground sm:text-base">
            <span>الجمعة</span>
            <span className="h-1 w-1 rotate-45 bg-gold" />
            <span className="font-amiri text-lg text-foreground sm:text-xl">١٦ أكتوبر ٢٠٢٦</span>
          </div>

          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-9 rounded-full bg-gradient-to-l from-gold-deep via-gold to-gold-deep px-10 py-3.5 text-sm font-bold text-navy shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            تأكيد الحضور
          </button>
        </Reveal>
      </section>

      {/* ═══════════════ Countdown ═══════════════ */}
      <section className="relative px-5 py-16 sm:py-20">
        <Reveal>
          <SectionTitle>العد التنازلي للفرحة</SectionTitle>
          <div className="mx-auto mt-8 max-w-lg">
            <Countdown />
          </div>
        </Reveal>
      </section>

      {/* ═══════════════ Event details ═══════════════ */}
      <section className="relative px-5 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        <Reveal>
          <SectionTitle>تفاصيل الحفل</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-gold/30 bg-card p-7 shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--gold)_55%,transparent)] sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <DetailIcon>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gold-deep">التاريخ</p>
                  <p className="mt-0.5 font-amiri text-xl font-bold text-foreground">الجمعة ١٦ أكتوبر ٢٠٢٦</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <DetailIcon>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gold-deep">الوقت</p>
                  <p className="mt-0.5 font-amiri text-xl font-bold text-foreground">{EVENT.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <DetailIcon>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="13" r="4" />
                    <circle cx="16" cy="10" r="4" />
                  </svg>
                </DetailIcon>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gold-deep">العروسان</p>
                  <p className="mt-0.5 font-amiri text-xl font-bold text-foreground">عزيز &amp; ملك</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════ Location ═══════════════ */}
      <section className="relative px-5 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        <Reveal>
          <SectionTitle>الموقع</SectionTitle>
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl border border-gold/30 bg-card shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--gold)_55%,transparent)]">
            {/* venue placeholder visual */}
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-l from-secondary via-accent to-secondary">
              <img src={ornament} alt="" aria-hidden className="absolute inset-0 m-auto w-56 opacity-25" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-card text-gold-deep shadow-md">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>
            <div className="p-7 text-center sm:p-9">
              <h3 className="font-amiri text-2xl font-bold text-foreground">{EVENT.venueName}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{EVENT.venueAddress}</p>
              <a
                href={EVENT.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                افتح الموقع على خرائط جوجل
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════ RSVP ═══════════════ */}
      <section className="relative px-5 pb-20 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        <Reveal className="mx-auto max-w-xl text-center">
          <SectionTitle>نتشرف بحضوركم</SectionTitle>
          <p className="mt-6 font-amiri text-xl leading-loose text-foreground/90 sm:text-2xl">
            «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            يتشرف عزيز وملك بدعوتكم لمشاركتهما لحظة الفرح — يرجى تأكيد حضوركم قبل الموعد
          </p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-8 rounded-full bg-gradient-to-l from-gold-deep via-gold to-gold-deep px-12 py-4 text-sm font-bold text-navy shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {rsvp ? (rsvp.attending === "yes" ? "تم تأكيد حضوركم ✓" : "تم الرد — شكراً لكم") : "تأكيد الحضور"}
          </button>
          {rsvp && (
            <p className="mt-3 text-xs text-muted-foreground">رد باسم {rsvp.name} — اضغط للتغيير</p>
          )}
        </Reveal>
      </section>

      {/* ═══════════════ Footer ═══════════════ */}
      <footer className="border-t border-gold/20 px-5 py-8 text-center">
        <p className="font-amiri text-lg text-gold-shimmer">عزيز &amp; ملك</p>
        <p className="mt-1 text-xs text-muted-foreground">ننتظر مشاركتكم فرحتنا — ١٦ أكتوبر ٢٠٢٦</p>
      </footer>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} onSaved={setRsvp} />
    </main>
  );
}
