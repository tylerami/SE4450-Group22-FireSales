/* eslint-disable react-hooks/rules-of-hooks */
const { override, useBabelRc, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    models: "src/models",
    components: "src/components",
    services: "src/services",
    assets: "src/assets",
    __mocks__: "src/__mocks__",
    app: "src/app",
    index: "src/index",
  })
);
