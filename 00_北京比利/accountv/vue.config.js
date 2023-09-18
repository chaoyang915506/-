const { ProvidePlugin } = require("webpack");

module.exports = {
  publicPath: "/accountv",
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
    menu: {
      entry: "src/pages/menu/main.js",
      template: "public/index.html",
      filename: "menu.html",
    },
    role: {
      entry: "src/pages/role/main.js",
      template: "public/index.html",
      filename: "role.html",
    },
    manager: {
      entry: "src/pages/manager/main.js",
      template: "public/index.html",
      filename: "manager.html",
    },
    access: {
      entry: "src/pages/access/main.js",
      template: "public/index.html",
      filename: "access.html",
    },
    // 管理员列表
    newManager: {
      entry: "src/pages/newManager/main.js",
      template: "public/index.html",
      filename: "newManager.html",
    },
    // 访问记录
    newAccess: {
      entry: "src/pages/newAccess/main.js",
      template: "public/index.html",
      filename: "newAccess.html",
    },
  },
  devServer: {
    contentBase: "./dist",
    port: 58091,
  },
  configureWebpack: {
    plugins: [
      new ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
    ],
  },
  pluginOptions: {
    i18n: {
      locale: "0",
      fallbackLocale: "0",
      localeDir: "i18n/locales",
      enableInSFC: false,
    },
  },
};
