import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Check for saved theme preference and apply it immediately to prevent flash
const savedTheme = localStorage.getItem("vite-ui-theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.add("light");
}

// Apply language class to body
const savedLang = localStorage.getItem("language") as "en" | "fr" | "ar" | null;
// Check URL for language parameter first
const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get("lang") as "en" | "fr" | "ar" | null;

// URL parameter takes precedence over localStorage
const currentLang = langParam || savedLang || "en";

// Save to localStorage if it came from URL
if (langParam) {
  localStorage.setItem("language", langParam);
  // Remove the parameter from URL to avoid issues with reloads
  if (history.pushState) {
    const newUrl = window.location.pathname + window.location.hash;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
}

// Apply language settings
console.log("Applying language:", currentLang);
document.body.classList.add(`lang-${currentLang}`);
document.documentElement.lang = currentLang;

if (currentLang === "ar") {
  document.documentElement.dir = "rtl";
  document.body.classList.add("rtl-layout");
  document.documentElement.style.setProperty(
    "--font-family",
    '"Tajawal", sans-serif',
  );
} else {
  document.documentElement.dir = "ltr";
  document.body.classList.remove("rtl-layout");
  document.documentElement.style.removeProperty("--font-family");
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
