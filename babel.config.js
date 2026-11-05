module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo (SDK 58) configures Reanimated / worklets automatically.
  return {
    presets: ["babel-preset-expo"],
  };
};
