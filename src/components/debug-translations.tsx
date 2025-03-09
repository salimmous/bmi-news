import { useEffect } from "react";
import { useLanguage } from "../lib/i18n";

export default function DebugTranslations() {
  const { language, t } = useLanguage();

  useEffect(() => {
    console.log("Current language:", language);
    try {
      // Test some translations
      console.log("Translation test - common.save:", t("common.save"));
      console.log("Translation test - header.home:", t("header.home"));
      console.log("Translation test - settings.title:", t("settings.title"));

      // Test translations with full objects
      console.log("Translation test - common:", t("common"));
      console.log("Translation test - header:", t("header"));

      // Display all available translations for debugging
      const savedLang = localStorage.getItem("language");
      console.log("Language from localStorage:", savedLang);
      console.log(
        "Document language attribute:",
        document.documentElement.lang,
      );
      console.log("Document dir attribute:", document.documentElement.dir);
    } catch (error) {
      console.error("Translation error:", error);
    }
  }, [language, t]);

  return null; // This component doesn't render anything
}
