import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LanguagePreference = "en" | "tr";

const LANGUAGE_STORAGE_KEY = "flight-demo-language";

const normalizeLanguage = (language?: string | null): LanguagePreference =>
  language?.startsWith("tr") ? "tr" : "en";

const getInitialLanguage = (
  fallback: LanguagePreference
): LanguagePreference => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage === "tr" || storedLanguage === "en") {
    return storedLanguage;
  }

  return fallback;
};

export function Navbar() {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<LanguagePreference>(() =>
    getInitialLanguage(normalizeLanguage(i18n.language))
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    if (normalizeLanguage(i18n.language) !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const navigationItems = useMemo(
    () => [
      { to: "/flight-search", label: t("navigation.flightSearch") },
      { to: "/flight-reservation", label: t("navigation.flightReservation") },
    ],
    [t]
  );

  const handleLanguageToggle = () => {
    setLanguage((currentLanguage) => (currentLanguage === "en" ? "tr" : "en"));
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-transparent px-4 pb-6 pt-6 backdrop-blur-3xl">
      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white shadow-[0_18px_55px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:gap-6 md:px-8">
        <div aria-hidden className="pointer-events-none">
          <div className="absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-sky-400/25 blur-2xl" />
          <div className="absolute -right-12 top-0 h-20 w-20 rounded-full bg-rose-500/25 blur-2xl" />
        </div>

        <Link
          to="/flight-search"
          className="relative z-10 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/80 transition-colors hover:text-white sm:text-sm"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-white/15 text-[0.6rem] text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.35)]">
            ✈
          </span>
          {t("navigation.brand")}
        </Link>

        <nav className="relative z-10 hidden flex-1 items-center justify-center sm:flex">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-1 backdrop-blur">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70 transition-all duration-200 hover:text-white md:text-xs",
                    isActive &&
                      "bg-white text-slate-900 shadow-[0_10px_22px_rgba(15,23,42,0.25)]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageToggle}
            aria-label={t("navigation.languageToggleAria", {
              language: t(`navigation.languageLabel.${language}`),
            })}
            className="rounded-full border-white/25 bg-white/10 px-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition-all hover:scale-[1.03] hover:bg-white hover:text-slate-900 sm:px-4"
          >
            <Globe className="size-4" aria-hidden />
            <span className="hidden sm:inline">
              {t(`navigation.languageLabel.${language}`)}
            </span>
            <span className="sm:hidden">{language.toUpperCase()}</span>
          </Button>
        </div>
      </div>

      <nav className="relative z-10 mt-4 flex items-center justify-center sm:hidden">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-white/70 backdrop-blur">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-1 transition-colors hover:text-white",
                  isActive && "bg-white text-slate-900"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
