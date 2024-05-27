module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    indent: ['warn', 4],
    'react/jsx-indent': ['warn', 4, {checkAttributes: true}],
    'react/react-in-jsx-scope': 'off',
    'react/destructuring-assignment': 'off',
    'no-nested-ternary': 'warn',
    'react/prop-types': 'warn',
  },
};
