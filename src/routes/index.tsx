import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import couple from "@/assets/couple.jpg.asset.json";
import music from "@/assets/i-found-you.mp3.asset.json";
import specialMomentOne from "@/assets/special-moment-1.jpg.asset.json";
import specialMomentTwo from "@/assets/special-moment-2.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { RsvpModal, readRsvp, type RsvpData } from "@/components/RsvpModal";

const EVENT = {
  mapsUrl: "https://maps.app.goo.gl/73r5NvV88qaigw8H7?g_st=ac",
};

const MUSIC_SRC = music.url;

type Language = "en" | "ar";

const copy = {
  en: {
    openingNames: "AZIZ & MALAK",
    open: "Open invitation",
    family: "Together with their families",
    title: "Aziz & Malak",
    subtitle: "Two hearts, one beautiful beginning.",
    heroCaption: "Engagement",
    date: "October 16, 2026",
    detailsKicker: "The celebration",
    detailsTitle: "A day to remember",
    details: [
      { label: "Date", value: "Friday, October 16" },
      { label: "Time", value: "7:00 in the evening" },
      { label: "The couple", value: "Aziz & Malak" },
    ],
    countdownKicker: "Counting the moments",
    countdownTitle: "Until we celebrate",
    momentsKicker: "Special moments",
    momentsTitle: "Little memories, big feelings.",
    momentAlt: ["Aziz and Malak sharing a joyful moment", "A bouquet of deep red roses from their special day"],
    venueKicker: "The venue",
    venueTitle: "Kerdasa, Giza",
    venueBody: "Join us as we celebrate this beautiful beginning with the people we love.",
    viewLocation: "View location",
    rsvpKicker: "Kindly respond",
    rsvpTitle: "Will you join us?",
    rsvpBody: "Your presence would make our celebration complete.",
    confirm: "Confirm attendance",
    confirmed: (name: string) => `Thank you, ${name}. Your response has been saved.`,
    declined: (name: string) => `Thank you for letting us know, ${name}.`,
    musicOn: "Music on",
    musicOff: "Music off",
    musicReady: "Music ready",
    musicUnavailable: "Add licensed audio",
  },
  ar: {
    openingNames: "عزيز و ملك",
    open: "افتح الدعوة",
    family: "بكل الحب والفرح ندعوكم",
    title: "عزيز و ملك",
    subtitle: "قلبان وبداية جميلة تجمعهما المحبة.",
    heroCaption: "حفل الخطوبة",
    date: "١٦ أكتوبر ٢٠٢٦",
    detailsKicker: "تفاصيل الحفل",
    detailsTitle: "يوم لا يُنسى",
    details: [
      { label: "التاريخ", value: "الجمعة ١٦ أكتوبر" },
      { label: "الوقت", value: "الساعة ٧:٠٠ مساءً" },
      { label: "العروسان", value: "عزيز و ملك" },
    ],
    countdownKicker: "نعد اللحظات",
    countdownTitle: "حتى نحتفل معاً",
    momentsKicker: "لحظات خاصة",
    momentsTitle: "ذكريات صغيرة ومشاعر كبيرة.",
    momentAlt: ["عزيز وملك في لحظة سعيدة", "باقة من الورود الحمراء من يومهما المميز"],
    venueKicker: "مكان الحفل",
    venueTitle: "كرداسة، الجيزة",
    venueBody: "شاركونا الاحتفال بهذه البداية الجميلة بين أهلنا وأحبائنا.",
    viewLocation: "عرض الموقع",
    rsvpKicker: "تأكيد الحضور",
    rsvpTitle: "هل ستشاركوننا فرحتنا؟",
    rsvpBody: "حضوركم يكمّل فرحتنا ويجعل يومنا أجمل.",
    confirm: "تأكيد الحضور",
    confirmed: (name: string) => `شكراً ${name}، تم حفظ تأكيد حضوركم.`,
    declined: (name: string) => `شكراً لإبلاغنا يا ${name}.`,
    musicOn: "الموسيقى مفعّلة",
    musicOff: "الموسيقى متوقفة",
    musicReady: "الموسيقى جاهزة",
    musicUnavailable: "أضف ملفاً مرخصاً",
  },
} as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aziz & Malak — Luxury Engagement Invitation" },
      { name: "description", content: "The engagement invitation of Aziz and Malak — October 16, 2026." },
      { property: "og:title", content: "Aziz & Malak — Engagement Invitation" },
      { property: "og:description", content: "Join Aziz and Malak as they celebrate their engagement on October 16, 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}>{children}</div>;
}

function LanguageSwitcher({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-switcher" aria-label="Language">
      <Button
        type="button"
        variant="ghost"
        className={`language-option h-auto rounded-none p-0 hover:bg-transparent ${language === "en" ? "is-active" : ""}`}
        onClick={() => onChange("en")}
        aria-pressed={language === "en"}
      >
        English
      </Button>
      <span className="language-divider" />
      <Button
        type="button"
        variant="ghost"
        className={`language-option h-auto rounded-none p-0 hover:bg-transparent ${language === "ar" ? "is-active" : ""}`}
        onClick={() => onChange("ar")}
        aria-pressed={language === "ar"}
      >
        عربي
      </Button>
    </div>
  );
}

function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const text = copy[language];

  useEffect(() => setRsvp(readRsvp()), []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  const openInvitation = useCallback(() => {
    setOpened(true);
    if (MUSIC_SRC && audioRef.current) {
      audioRef.current.volume = 0.55;
      void audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (!MUSIC_SRC || !audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      void audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
  }, [musicOn]);

  const changeLanguage = (nextLanguage: Language) => setLanguage(nextLanguage);

  return (
    <main className="invitation-page" dir={language === "ar" ? "rtl" : "ltr"}>
      {MUSIC_SRC ? <audio ref={audioRef} src={MUSIC_SRC} loop preload="metadata" /> : null}

      <div className={`opening-screen ${opened ? "is-open" : ""}`} aria-hidden={opened}>
        <div className="opening-language"><LanguageSwitcher language={language} onChange={changeLanguage} /></div>
        <div className="relative z-10 text-center">
          <p className="opening-monogram" dir="ltr">A &amp; M</p>
          <div className="opening-ornament" />
          <p className="opening-names">{text.openingNames}</p>
          <Button className="invitation-button mt-10" onClick={openInvitation}>{text.open}</Button>
        </div>
      </div>

      {opened && (
        <div className="top-controls">
          <LanguageSwitcher language={language} onChange={changeLanguage} />
          <Button
            type="button"
            variant="ghost"
            className="music-control"
            onClick={toggleMusic}
            disabled={!MUSIC_SRC}
            title={MUSIC_SRC ? text.musicReady : text.musicUnavailable}
            aria-label={MUSIC_SRC ? (musicOn ? text.musicOn : text.musicOff) : text.musicUnavailable}
          >
            {musicOn ? <Volume2 /> : <VolumeX />}
            <span>{MUSIC_SRC ? (musicOn ? text.musicOn : text.musicOff) : text.musicOff}</span>
            <span className="music-dot" />
          </Button>
        </div>
      )}

      <div className={`invitation-content ${opened ? "is-visible" : ""}`} aria-hidden={!opened}>
        <header className="hero-section">
          <div className="section-shell hero-grid">
            <div className="hero-copy">
              <p className="section-kicker">{text.family}</p>
              <p className="hero-date">{text.date}</p>
              <h1 className="hero-title">{text.title}</h1>
              <p className="hero-subtitle">{text.subtitle}</p>
              <div className="mt-8 w-20 editorial-rule" />
            </div>
            <div className="hero-image-wrap">
              <img src={couple.url} alt={text.title} className="hero-image" />
              <span className="hero-caption">{text.heroCaption}</span>
            </div>
          </div>
        </header>

        <section className="editorial-section">
          <Reveal className="section-shell text-center">
            <p className="section-kicker">{text.detailsKicker}</p>
            <h2 className="section-heading">{text.detailsTitle}</h2>
            <div className="details-grid">
              {text.details.map((detail) => (
                <div className="detail-item" key={detail.label}>
                  <p className="detail-label">{detail.label}</p>
                  <p className="detail-value">{detail.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="editorial-section pt-8">
          <Reveal className="section-shell text-center">
            <p className="section-kicker">{text.countdownKicker}</p>
            <h2 className="section-heading">{text.countdownTitle}</h2>
            <Countdown language={language} />
          </Reveal>
        </section>

        <section className="editorial-section">
          <Reveal className="section-shell text-center">
            <p className="section-kicker">{text.momentsKicker}</p>
            <h2 className="section-heading">{text.momentsTitle}</h2>
            <div className="moments-grid">
              {[specialMomentOne, specialMomentTwo].map((photo, index) => (
                <div className="moment-frame" key={photo.asset_id}>
                  <img className="moment-image" src={photo.url} alt={text.momentAlt[index] ?? text.momentsKicker} />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="editorial-section">
          <Reveal className="section-shell">
            <div className="venue-layout">
              <div className="venue-mark" aria-hidden="true"><span className="venue-initials" dir="ltr">A·M</span></div>
              <div className="venue-copy">
                <p className="section-kicker">{text.venueKicker}</p>
                <h2 className="venue-name">{text.venueTitle}</h2>
                <p className="mt-4 text-sm leading-8 text-muted-foreground">{text.venueBody}</p>
                <Button className="invitation-button mt-7" asChild>
                  <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">{text.viewLocation}</a>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="section-shell pb-12">
          <Reveal className="rsvp-band">
            <p className="section-kicker">{text.rsvpKicker}</p>
            <h2 className="section-heading">{text.rsvpTitle}</h2>
            <p className="rsvp-note">{text.rsvpBody}</p>
            {rsvp ? <p className="saved-response">{rsvp.attending === "yes" ? text.confirmed(rsvp.name) : text.declined(rsvp.name)}</p> : null}
            <Button className="invitation-button mt-8" onClick={() => setRsvpOpen(true)}>{text.confirm}</Button>
          </Reveal>
        </section>

        <footer className="invitation-footer">
          <div className="mx-auto mb-8 max-w-xs editorial-rule" />
          <p className="footer-monogram" dir="ltr">A &amp; M</p>
          <p className="footer-date">{text.date}</p>
        </footer>
      </div>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} onSaved={setRsvp} language={language} />
    </main>
  );
}
