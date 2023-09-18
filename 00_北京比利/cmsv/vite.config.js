import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { resolve } from "path";

export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "development",
      VUE_APP_CMS: "http://cms.dev.mycool.tv",
      VUE_APP_LMS: "http://lms.dev.mycool.tv",
      VUE_APP_IMS: "http://ims.dev.mycool.tv",
      VUE_APP_SYNC: "http://sync.dev.mycool.tv",
      VITE: "yes",
    },
    "require.context": {
      0: resolve(__dirname, "./src/i18n/locales/0.json"),
      1: resolve(__dirname, "./src/i18n/locales/1.json"),
    },
  },
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      "@/components": resolve(__dirname, "./src/components"),
      "@/api": resolve(__dirname, "./src/api"),
      "@/env": resolve(__dirname, "./src/env"),
      "@/common": resolve(__dirname, "./src/common.js"),
      "@/plugins": resolve(__dirname, "./src/plugins"),
      "@/": resolve(__dirname, "./src"),
      "@/i18n": resolve(__dirname, "./src/i18n"),
      "@/utils": resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        ui: resolve(__dirname, "src/pages/ui/index.html"),
        cooliooConfig: resolve(__dirname, "src/pages/cooliooConfig/index.html"),
        cooliooGroup: resolve(__dirname, "src/pages/cooliooGroup/index.html"),
        cooliooAssociated: resolve(__dirname, "src/pages/cooliooAssociated/index.html"),
        cooliooCopyright: resolve(__dirname, "src/pages/cooliooCopyright/index.html"),
        toairportlist: resolve(__dirname, "src/pages/toairportlist/index.html"),
      },
    },
  },
});
