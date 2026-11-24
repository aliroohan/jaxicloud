import {
  LOCALES,
  type Locale,
} from "@/lib/content/blocks";

export { LOCALES, type Locale };

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { code: string; label: string; native: string }> = {
  da: { code: "DA", label: "Danish", native: "Dansk" },
  en: { code: "EN", label: "English", native: "English" },
  de: { code: "DE", label: "German", native: "Deutsch" },
  fr: { code: "FR", label: "French", native: "Français" },
  nl: { code: "NL", label: "Dutch", native: "Nederlands" },
  nb: { code: "NB", label: "Norwegian", native: "Norsk" },
  sv: { code: "SV", label: "Swedish", native: "Svenska" },
  tr: { code: "TR", label: "Turkish", native: "Türkçe" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Strip a leading locale segment from a pathname. */
export function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const parts = pathname.split("/");
  // ["", "en", "solutions", "dashcam"]
  if (parts.length > 1 && isLocale(parts[1])) {
    const rest = "/" + parts.slice(2).join("/");
    return { locale: parts[1], path: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/" };
  }
  return { locale: null, path: pathname || "/" };
}

/** Prefix a path with a locale. Path should start with `/`. */
export function withLocale(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

/** Swap locale in a pathname that may or may not already have one. */
export function swapLocale(pathname: string, nextLocale: Locale): string {
  const { path } = stripLocale(pathname);
  return withLocale(nextLocale, path);
}

/** Localized page roots that preserve path on language switch. */
export const LOCALIZED_ROOTS = ["/", "/solutions", "/contact", "/services", "/blog", '/applications'] as const;

export function hasLocalizedRoute(path: string): boolean {
  return LOCALIZED_ROOTS.some((root) =>
    root === "/" ? path === "/" : path === root || path.startsWith(`${root}/`),
  );
}

export const UI_COPY: Record<
  Locale,
  {
    solutions: string;
    allSolutions: string;
    solutionsIndexLede: string;
    backToSolutions: string;
    requestDemo: string;
    learnMore: string;
    unhandledHint: string;
  }
> = {
  en: {
    solutions: "Solutions",
    allSolutions: "All solutions",
    solutionsIndexLede:
      "Fleet, sensor, and telematics solutions shaped for how you operate.",
    backToSolutions: "Back to solutions",
    requestDemo: "Request a demo",
    learnMore: "Learn more",
    unhandledHint: "Content block pending design",
  },
  da: {
    solutions: "Løsninger",
    allSolutions: "Alle løsninger",
    solutionsIndexLede:
      "Flåde-, sensor- og telematikløsninger tilpasset din drift.",
    backToSolutions: "Tilbage til løsninger",
    requestDemo: "Anmod om en demo",
    learnMore: "Læs mere",
    unhandledHint: "Indholdsblok afventer design",
  },
  de: {
    solutions: "Lösungen",
    allSolutions: "Alle Lösungen",
    solutionsIndexLede:
      "Flotten-, Sensor- und Telematiklösungen für Ihren Betrieb.",
    backToSolutions: "Zurück zu Lösungen",
    requestDemo: "Demo anfordern",
    learnMore: "Mehr erfahren",
    unhandledHint: "Inhaltsblock noch ohne Design",
  },
  fr: {
    solutions: "Solutions",
    allSolutions: "Toutes les solutions",
    solutionsIndexLede:
      "Solutions flotte, capteurs et télématique adaptées à votre activité.",
    backToSolutions: "Retour aux solutions",
    requestDemo: "Demander une démo",
    learnMore: "En savoir plus",
    unhandledHint: "Bloc en attente de design",
  },
  nl: {
    solutions: "Oplossingen",
    allSolutions: "Alle oplossingen",
    solutionsIndexLede:
      "Vloot-, sensor- en telematica-oplossingen afgestemd op uw operatie.",
    backToSolutions: "Terug naar oplossingen",
    requestDemo: "Demo aanvragen",
    learnMore: "Meer informatie",
    unhandledHint: "Contentblok wacht op ontwerp",
  },
  nb: {
    solutions: "Løsninger",
    allSolutions: "Alle løsninger",
    solutionsIndexLede:
      "Flåte-, sensor- og telematikkløsninger tilpasset driften din.",
    backToSolutions: "Tilbake til løsninger",
    requestDemo: "Be om en demo",
    learnMore: "Les mer",
    unhandledHint: "Innholdsblokk venter på design",
  },
  sv: {
    solutions: "Lösningar",
    allSolutions: "Alla lösningar",
    solutionsIndexLede:
      "Fordons-, sensor- och telematiklösningar anpassade för er drift.",
    backToSolutions: "Tillbaka till lösningar",
    requestDemo: "Begär en demo",
    learnMore: "Läs mer",
    unhandledHint: "Innehållsblock väntar på design",
  },
  tr: {
    solutions: "Çözümler",
    allSolutions: "Tüm çözümler",
    solutionsIndexLede:
      "Operasyonunuza göre uyarlanmış filo, sensör ve telematik çözümleri.",
    backToSolutions: "Çözümlere dön",
    requestDemo: "Demo talep et",
    learnMore: "Daha fazla",
    unhandledHint: "İçerik bloğu tasarım bekliyor",
  },
};
