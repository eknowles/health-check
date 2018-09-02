export default {
  arrays: {
    level: 'warning',
    title: 'Arrays not allowed in language files',
    message: 'Give each item a unique key (https://phraseapp.com/docs/guides/formats/simple-json/)',
    pattern: '([a-zA-Z]*):\\s\\[',
  },
  booleans: {
    level: 'warning',
    title: 'Booleans not allowed in language files',
    message: 'Remove config from translations',
    pattern: '([a-zA-Z]*):\\s(true|false)\\,',
  },
  functions: {
    level: 'warning',
    title: 'Functions not allowed in language files',
    message: 'Switch to ICU message format (see https://formatjs.io/guides/message-syntax/)',
    pattern: '([a-zA-Z]*):\\s\\(',
  },
};
