import React, { ReactNode } from "react";
import { useLanguage } from "../lib/i18n";

interface TranslationWrapperProps {
  children: ReactNode;
  translationKey: string;
  defaultValue?: string;
}

/**
 * A component that wraps content and translates it based on the current language
 */
export function TranslationWrapper({
  children,
  translationKey,
  defaultValue,
}: TranslationWrapperProps) {
  const { t } = useLanguage();

  // If the translation key is provided, use it, otherwise render children
  if (translationKey) {
    return (
      <>
        {t(translationKey, { defaultValue: defaultValue || String(children) })}
      </>
    );
  }

  return <>{children}</>;
}
