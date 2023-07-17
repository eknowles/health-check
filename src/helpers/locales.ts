export const supportedLocales = [
  'en',
];

export const loadMessages = () => {
  return supportedLocales.reduce((messages, locale) => {
    messages[locale] = require(`../../locales/${locale}.json`);
    return messages;
  }, {});
};
