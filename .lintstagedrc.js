module.exports = {
  '*.{vue,ts,js,mjs,cjs}': [
    'eslint --no-warn-ignored --fix',
    'prettier --write',
  ],
  '*.{scss,css}': ['stylelint --fix', 'prettier --write'],
};
