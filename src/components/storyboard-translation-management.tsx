import React from "react";
import TranslationManagement from "./admin/translation-management";

export default function StoryboardTranslationManagement() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Translation Management</h1>
      <TranslationManagement />
    </div>
  );
}
