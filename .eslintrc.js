module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    "plugin:@typescript-eslint/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
  ],
  settings: {
    "import/resolver": {
      "typescript": {}
      }
  },
  rules: {
    "radix": "off",
    "react/prop-types": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/jsx-filename-extension": [ "warn", {"extensions": [".tsx"]} ],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ],
      "react/no-children-prop": ["warn", {
        "allowFunctions": true
      }],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["off"],
      "react/jsx-props-no-spreading": ["off"],
      "react/destructuring-assignment": ["off"]
  },
};
