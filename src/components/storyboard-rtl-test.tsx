import { useLanguage } from "../lib/i18n";

export default function StoryboardRTLTest() {
  const { t, language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: "en" | "fr" | "ar") => {
    setLanguage(lang);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        {t("rtlTest.title", { defaultValue: "RTL Layout Test" })}
      </h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleLanguageChange("en")}
          className={`px-4 py-2 rounded ${language === "en" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange("fr")}
          className={`px-4 py-2 rounded ${language === "fr" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          Français
        </button>
        <button
          onClick={() => handleLanguageChange("ar")}
          className={`px-4 py-2 rounded ${language === "ar" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          العربية
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🏠</span>
            {t("rtlTest.section1.title", {
              defaultValue: "Text Direction Test",
            })}
          </h2>
          <p className="mb-4">
            {t("rtlTest.section1.paragraph1", {
              defaultValue:
                "This paragraph tests how text flows in different languages. The text should flow from left to right in English and French, but from right to left in Arabic.",
            })}
          </p>
          <p>
            {t("rtlTest.section1.paragraph2", {
              defaultValue:
                "Icons and elements should also adjust their positions based on the text direction. For example, this list:",
            })}
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              {t("rtlTest.section1.listItem1", {
                defaultValue:
                  "First item with icon on the left (or right in RTL)",
              })}
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              {t("rtlTest.section1.listItem2", {
                defaultValue: "Second item with proper alignment",
              })}
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              {t("rtlTest.section1.listItem3", {
                defaultValue: "Third item showing correct flow",
              })}
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            {t("rtlTest.section2.title", {
              defaultValue: "Layout Direction Test",
            })}
          </h2>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <h3 className="font-medium">
                {t("rtlTest.section2.item1.title", {
                  defaultValue: "Left/Right Positioning",
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {t("rtlTest.section2.item1.description", {
                  defaultValue:
                    "This circle should be on the left in LTR and right in RTL",
                })}
              </p>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <p>
              {t("rtlTest.section2.quote", {
                defaultValue:
                  "This is a blockquote with a left border in LTR, which should become a right border in RTL.",
              })}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button className="bg-gray-200 px-3 py-1 rounded">
              {t("rtlTest.section2.prevButton", { defaultValue: "Previous" })}
            </button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              {t("rtlTest.section2.nextButton", { defaultValue: "Next" })}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {t("rtlTest.formSection.title", {
            defaultValue: "Form Elements Test",
          })}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-1">
              {t("rtlTest.formSection.nameLabel", { defaultValue: "Name" })}
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder={t("rtlTest.formSection.namePlaceholder", {
                defaultValue: "Enter your name",
              })}
            />
          </div>
          <div>
            <label className="block mb-1">
              {t("rtlTest.formSection.emailLabel", { defaultValue: "Email" })}
            </label>
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder={t("rtlTest.formSection.emailPlaceholder", {
                defaultValue: "Enter your email",
              })}
            />
          </div>
          <div>
            <label className="block mb-1">
              {t("rtlTest.formSection.messageLabel", {
                defaultValue: "Message",
              })}
            </label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder={t("rtlTest.formSection.messagePlaceholder", {
                defaultValue: "Enter your message",
              })}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {t("rtlTest.formSection.submitButton", {
                defaultValue: "Submit",
              })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
