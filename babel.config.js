module.exports = {
  presets: [
    // `npm run build-web` need it if there is webpack config `loader: 'babel-loader'` in config-overrides.js
    // ref to https://stackoverflow.com/questions/43042889/typescript-referenceerror-exports-is-not-defined
    // ['@babel/preset-env', {loose: true, modules: false}],

    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    // `npm run web` need it if there is webpack config `loader: 'babel-loader'` in config-overrides.js
    // ref to https://github.com/software-mansion/react-native-reanimated/issues/3364#issuecomment-1481031936
    // '@babel/plugin-proposal-export-namespace-from',

    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
  ],
};
