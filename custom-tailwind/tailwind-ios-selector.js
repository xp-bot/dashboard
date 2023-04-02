// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require('tailwindcss/plugin');

const iosSelector = plugin(({ addVariant }) => {
  addVariant('ios', '@supports (-webkit-touch-callout: none)');
  addVariant('android', '@supports not (-webkit-touch-callout: none)');
});

module.exports = iosSelector;
