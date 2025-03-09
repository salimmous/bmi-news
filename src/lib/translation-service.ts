// Translation service for AI-powered translations

/**
 * Translates text between languages using AI
 * @param text The text to translate
 * @param sourceLanguage The source language code
 * @param targetLanguage The target language code
 * @returns Promise with the translated text
 */
export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> => {
  try {
    // In a production app, this would call an actual translation API
    // For demo purposes, we'll simulate translations

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple translation examples
    if (sourceLanguage === "en" && targetLanguage === "ar") {
      if (text.includes("Hello")) return "مرحبا";
      if (text.includes("Save")) return "حفظ";
      if (text.includes("Cancel")) return "إلغاء";
      if (text.includes("Edit")) return "تعديل";
      if (text.includes("Delete")) return "حذف";
      if (text.includes("Search")) return "بحث";
      return `[ترجمة: ${text}]`;
    }

    if (sourceLanguage === "en" && targetLanguage === "fr") {
      if (text.includes("Hello")) return "Bonjour";
      if (text.includes("Save")) return "Enregistrer";
      if (text.includes("Cancel")) return "Annuler";
      if (text.includes("Edit")) return "Modifier";
      if (text.includes("Delete")) return "Supprimer";
      if (text.includes("Search")) return "Rechercher";
      return `[Traduit: ${text}]`;
    }

    if (sourceLanguage === "ar" && targetLanguage === "en") {
      if (text.includes("مرحبا")) return "Hello";
      if (text.includes("حفظ")) return "Save";
      if (text.includes("إلغاء")) return "Cancel";
      if (text.includes("تعديل")) return "Edit";
      if (text.includes("حذف")) return "Delete";
      if (text.includes("بحث")) return "Search";
      return `[Translated from Arabic: ${text}]`;
    }

    if (sourceLanguage === "fr" && targetLanguage === "en") {
      if (text.includes("Bonjour")) return "Hello";
      if (text.includes("Enregistrer")) return "Save";
      if (text.includes("Annuler")) return "Cancel";
      if (text.includes("Modifier")) return "Edit";
      if (text.includes("Supprimer")) return "Delete";
      if (text.includes("Rechercher")) return "Search";
      return `[Translated from French: ${text}]`;
    }

    // Default fallback
    return `[Translation from ${sourceLanguage} to ${targetLanguage}: ${text}]`;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(
      `Failed to translate text: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Batch translate multiple texts
 * @param texts Array of texts to translate
 * @param sourceLanguage The source language code
 * @param targetLanguage The target language code
 * @returns Promise with array of translated texts
 */
export const batchTranslate = async (
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string[]> => {
  try {
    // In a real app, we would batch these for efficiency
    // For demo, we'll translate one by one
    const results = [];
    for (const text of texts) {
      const translated = await translateText(
        text,
        sourceLanguage,
        targetLanguage,
      );
      results.push(translated);
    }
    return results;
  } catch (error) {
    console.error("Batch translation error:", error);
    throw error;
  }
};

/**
 * Get language name from code
 * @param code The language code
 * @returns The language name
 */
export const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    en: "English",
    fr: "French",
    ar: "Arabic",
    es: "Spanish",
    de: "German",
    zh: "Chinese",
    ja: "Japanese",
    ru: "Russian",
  };

  return languages[code] || code;
};
