module.exports = {
  env: {
    development: {
      presets: ['module:@react-native/babel-preset'],

      plugins: [
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            // "blacklist": null, // DEPRECATED
            // "whitelist": null, // DEPRECATED
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],

        [
          'babel-plugin-inline-import',
          {
            extensions: ['.svg'],
          },
        ],
        [
          'react-native-reanimated/plugin',
          {
            relativeSourceLocation: true,
          },
        ],
      ],
    },
    production: {
      presets: ['module:@react-native/babel-preset'],
      plugins: [
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            safe: false,
            allowUndefined: true,
            verbose: false,
          },
        ],

        [
          'babel-plugin-inline-import',
          {
            extensions: ['.svg'],
          },
        ],
        ['transform-remove-console'],
        [
          'react-native-reanimated/plugin',
          {
            relativeSourceLocation: true,
          },
        ],
      ],
    },
  },
  plugins: [['@babel/plugin-transform-private-methods', {loose: true}]],
  overrides: [
    {
      test: './node_modules/ethers',
      plugins: [['@babel/plugin-transform-private-methods', {loose: true}]],
    },
  ],
};
