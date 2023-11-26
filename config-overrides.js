/* eslint-disable react-hooks/rules-of-hooks */
const { override, useBabelRc, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    models: path.resolve(__dirname, "src/models"),
    components: path.resolve(__dirname, "src/components"),
    services: path.resolve(__dirname, "src/services"),
    assets: path.resolve(__dirname, "src/assets"),
    __mocks__: path.resolve(__dirname, "src/__mocks__"),
    app: path.resolve(__dirname, "src/app"),
    index: path.resolve(__dirname, "src/index"),
  })
);
