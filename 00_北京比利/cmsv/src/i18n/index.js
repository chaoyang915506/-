import Vue from "vue";
import VueI18n from "vue-i18n";
import Env from "@/env";

Vue.use(VueI18n);

// webpack

function loadLocaleMessages() {
  const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

// vite

// function loadLocaleMessages() {
//   if (process.env.VITE) {
//     const locales = import.meta.globEager("./locales/*.json");
//     const messages = {};
//     let i = 0;
//     for (let key in locales) {
//       messages[i] = locales[key];
//       i++;
//     }
//     return messages;
//   }
// }

export default new VueI18n({
  // locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  locale: Env.locale,
  // fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  fallbackLocale: Env.locale,
  messages: loadLocaleMessages(),
});
