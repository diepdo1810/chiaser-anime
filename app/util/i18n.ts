import i18n, { Callback } from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../../locales/en/translation.json";
import viTranslation from "../../locales/vi/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const languageMap: { [key: string]: string } = {
  English: "en",
  Vietnamese: "vi",
};

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);

i18n.changeLanguage = (
  language?: string | undefined,
  callback?: Callback | undefined
) => {
  const lng = languageMap[language ?? ""] || "en";
  return originalChangeLanguage(lng, callback);
};

export default i18n;
