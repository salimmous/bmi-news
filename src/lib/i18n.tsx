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
const LanguageContext = createContext<LanguageContextType>({
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
    Record<string, Record<string, any>>
  >({});
  const [loading, setLoading] = useState(true);

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);

    // Set document direction for RTL support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // Add language-specific class to body
    document.body.className = document.body.className
      .replace(/lang-\w+/g, "")
      .trim();
    document.body.classList.add(`lang-${lang}`);

    // Apply font for Arabic
    if (lang === "ar") {
      document.documentElement.style.setProperty(
        "--font-family",
        '"Tajawal", sans-serif',
      );
      document.body.classList.add("rtl-layout");
    } else {
      document.documentElement.style.removeProperty("--font-family");
      document.body.classList.remove("rtl-layout");
    }

    // Force reload the page to apply all translations
    window.location.reload();
  };

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        console.log(`Loading translations for language: ${language}`);

        // Load all language files with cache-busting
        const timestamp = new Date().getTime();

        // Force no-cache for translation files
        const fetchOptions = {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        };

        try {
          const enResponse = await fetch(
            `/locales/en.json?t=${timestamp}`,
            fetchOptions,
          );
          const frResponse = await fetch(
            `/locales/fr.json?t=${timestamp}`,
            fetchOptions,
          );
          const arResponse = await fetch(
            `/locales/ar.json?t=${timestamp}`,
            fetchOptions,
          );

          if (!enResponse.ok)
            throw new Error(
              `Failed to load English translations: ${enResponse.status}`,
            );
          if (!frResponse.ok)
            throw new Error(
              `Failed to load French translations: ${frResponse.status}`,
            );
          if (!arResponse.ok)
            throw new Error(
              `Failed to load Arabic translations: ${arResponse.status}`,
            );

          const enTranslations = await enResponse.json();
          const frTranslations = await frResponse.json();
          const arTranslations = await arResponse.json();

          console.log("Loaded translations successfully");
          console.log(
            "Arabic translations sample:",
            arTranslations.common?.save,
          );
          console.log(
            "French translations sample:",
            frTranslations.common?.save,
          );

          // Verify translations are loaded correctly
          if (!frTranslations.common || !frTranslations.common.save) {
            console.warn("French translations may be incomplete");
          }

          if (!arTranslations.common || !arTranslations.common.save) {
            console.warn("Arabic translations may be incomplete");
          }

          const newTranslations = {
            en: enTranslations,
            fr: frTranslations,
            ar: arTranslations,
          };

          console.log(
            `Current language translations sample:`,
            newTranslations[language]?.common?.save || "not found",
          );

          setTranslations(newTranslations);
        } catch (fetchError) {
          console.error("Error fetching translation files:", fetchError);
          throw fetchError;
        }

        // Force reload translations when language changes
        document.documentElement.lang = language;
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

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
    if (loading) {
      console.log(`Translation loading, returning default for key: ${key}`);
      return options?.defaultValue || key;
    }

    // Make sure we have translations for the current language
    if (!translations[language]) {
      console.warn(`No translations found for language: ${language}`);
      return options?.defaultValue || key;
    }

    try {
      // For debugging
      console.log(`Translating key: ${key} for language: ${language}`);
      console.log(`Available translations:`, Object.keys(translations));
      console.log(
        `Current language translations available:`,
        !!translations[language],
      );

      const keys = key.split(".");
      let current = translations[language];

      // Debug the first level of translations
      if (current) {
        console.log(`First level keys for ${language}:`, Object.keys(current));
      }

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (current === undefined || current === null) {
          console.warn(
            `Translation path broken at '${keys.slice(0, i).join(".")}'`,
          );
          return options?.defaultValue || key;
        }

        if (i === keys.length - 1) {
          // We're at the final key
          if (current[k] === undefined) {
            console.warn(
              `Translation key not found: ${key} in language: ${language}`,
            );
            return options?.defaultValue || key;
          }
          return String(current[k]);
        }

        // Move to the next level in the object
        if (typeof current[k] !== "object") {
          console.warn(
            `Expected object at '${keys.slice(0, i + 1).join(".")}'`,
          );
          return options?.defaultValue || key;
        }
        current = current[k];
      }

      // This should not happen if the key is not empty
      return options?.defaultValue || key;
    } catch (error) {
      console.error(`Error retrieving translation for key: ${key}`, error);
      return options?.defaultValue || key;
    }
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    dir: language === "ar" ? "rtl" : "ltr",
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
