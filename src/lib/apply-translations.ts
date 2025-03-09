/**
 * Utility functions to apply translations throughout the application
 */

import { Language } from "./i18n";

/**
 * Apply language-specific styles to the document
 * @param language The current language
 */
export function applyLanguageStyles(language: Language) {
  // Set document direction for RTL support
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;

  // Add language-specific class to body
  document.body.className = document.body.className
    .replace(/lang-\w+/g, "")
    .trim();
  document.body.classList.add(`lang-${language}`);

  // Apply font for Arabic
  if (language === "ar") {
    document.documentElement.style.setProperty(
      "--font-family",
      '"Tajawal", sans-serif',
    );
  } else {
    document.documentElement.style.removeProperty("--font-family");
  }
}

/**
 * Preload translation files for faster switching
 */
export function preloadTranslations() {
  const timestamp = new Date().getTime();
  const languages: Language[] = ["en", "fr", "ar"];

  languages.forEach((lang) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `/locales/${lang}.json?t=${timestamp}`;
    link.as = "fetch";
    document.head.appendChild(link);
  });
}
