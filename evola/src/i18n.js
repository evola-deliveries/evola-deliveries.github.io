import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';
import ru from './locales/ru/translation.json';

const timezoneLanguageMap = {
  'Moscow': 'ru',
  'Shanghai': 'zh',
  'Beijing': 'zh',
  'Hong Kong': 'zh',
  'Irkutsk': 'zh',
  'Vladivostok': 'zh',
  'Moscow Standard Time': 'ru',
  'China Standard Time': 'zh',
  'Eastern European Standard Time': 'ru',
  'Russian Standard Time': 'ru'
};

const getLanguageFromTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezoneLanguageMap[timezone] || null;
  } catch (e) {
    return null;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ru: { translation: ru }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'cookie'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      cookieMinutes: 10080
    }
  });

const lng = i18n.language || getLanguageFromTimezone();
if (lng && !i18n.hasResourceBundle(lng, 'translation')) {
  i18n.changeLanguage(lng);
}

export default i18n;
