module.exports = {
  root: true,
  extends: '@react-native-community',
  globals: {
    // codecept
    actor: false,
    After: false,
    Before: false,
    Feature: false,
    Helper: false,
    Scenario: false,

    __DEV__: true,
    __dirname: false,
    XMLHttpRequest: false,
    location: false,
  },
};
