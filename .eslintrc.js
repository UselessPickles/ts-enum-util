module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },

  rules: {
    // your rules
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'one-var': 'off',
    'no-confusing-arrow': 'off',
    'no-shadow': 'off',
    'no-unused-expressions': 'off',
    'react/button-has-type': 'off',
    eqeqeq: 'off',
    'one-var-declaration-per-line': 'off',
  },
};
