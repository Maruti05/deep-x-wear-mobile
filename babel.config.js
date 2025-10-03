module.exports = function (api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo"], "nativewind/babel"],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      [
        "react-native-reanimated/plugin",
        {
          /* options */
        },
      ],
      [
        "react-native-worklets/plugin",
        {},
        "worklets", // 👈 unique name to avoid duplicate conflict
      ],
    ],
  };
};
