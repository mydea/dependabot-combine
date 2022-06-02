module.exports = {
  root: true,
  ...require('fabscale-eslint-config/lib/node'),

  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
  },
};
