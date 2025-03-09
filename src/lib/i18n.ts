// Internationalization (i18n) support for multiple languages
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Available languages
export type Language = "en" | "fr" | "ar";

// Language context
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { defaultValue?: string }) => string;
  dir: "ltr" | "rtl";
};

const defaultLanguage: Language = "en";

// Create language context
export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  dir: "ltr",
});

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // Get saved language from localStorage or use browser language
  const getSavedLanguage = (): Language => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      return saved;
    }

    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "fr") return "fr";
    if (browserLang === "ar") return "ar";

    return "en"; // Default to English
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());
  const [translations, setTranslations] = useState<
    Record<string, Record<string, string>>
  >({});
  const [loading, setLoading] = useState(true);

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);

    // Set document direction for RTL support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Add language-specific class to body
    document.body.className = document.body.className
      .replace(/lang-\w+/g, "")
      .trim();
    document.body.classList.add(`lang-${lang}`);
  };

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);

        // Load all language files
        const [enTranslations, frTranslations, arTranslations] =
          await Promise.all([
            fetch("/locales/en.json").then((res) => res.json()),
            fetch("/locales/fr.json").then((res) => res.json()),
            fetch("/locales/ar.json").then((res) => res.json()),
          ]);

        setTranslations({
          en: enTranslations,
          fr: frTranslations,
          ar: arTranslations,
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Set initial document direction
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.add(`lang-${language}`);

    return () => {
      document.body.classList.remove(`lang-${language}`);
    };
  }, [language]);

  // Translation function
  const t = (key: string, options?: { defaultValue?: string }): string => {
    if (loading) return options?.defaultValue || key;

    const keys = key.split(".");
    let value = translations[language] || {};

    for (const k of keys) {
      value = value[k] as any;
      if (value === undefined) {
        console.warn(
          `Translation key not found: ${key} in language: ${language}`,
        );
        return options?.defaultValue || key;
      }
    }

    return value as string;
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    dir: language === "ar" ? "rtl" : "ltr",
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    children,
  );
};

// Hook to use language context
export const useLanguage = () => useContext(LanguageContext);
