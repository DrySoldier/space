module.exports = {
  root: true,
  env: {
    es6: true,
  },
  extends: ['plugin:react/recommended', 'prettier', 'airbnb', '@react-native-community'],
  plugins: ['prettier', 'react', 'react-native', 'jsx-a11y'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': [0, {}],
    'import/no-unresolved': [0, { caseSensitive: false }],
    'import/no-extraneous-dependencies': [
      0,
      { devDependencies: false, optionalDependencies: false, peerDependencies: false },
    ],
    'global-require': [0, {}],
    'object-curly-newline': [0, 'never'],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'arrow-parens': ["error", "as-needed"]
  },
};
