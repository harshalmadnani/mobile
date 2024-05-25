module.exports = {
  project: {
    ios: {automaticPodsInstallation: true},
    android: {},
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
  assets: ['./assets/fonts/'],
};
