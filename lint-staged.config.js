module.exports = {
  '*.{ts,js}': ['yarn lint:eslint', 'yarn lint:prettier'],
  'package.json': ['yarn lint:prettier'],
};
