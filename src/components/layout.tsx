import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { useLanguage } from "../lib/i18n";

export default function Layout() {
  const { language, dir } = useLanguage();

  return (
    <div
      className={`flex flex-col min-h-screen ${language === "ar" ? "font-['Tajawal']" : ""}`}
      dir={dir}
    >
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
