import { defineConfig, loadEnv } from "vite";
import path from "path";
import createVitePlugins from "./vite/plugins";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const port = process.env.port || process.env.npm_config_port || 80; // 端口
  return {
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
        "/assets": path.resolve(__dirname, "src/assets"),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // vite 相关配置
    server: {
      host: "0.0.0.0",
      port: port,
      open: true,
      proxy: {
        "/dev-api": {
          target: `http://192.168.1.243:19006`,
          // target: `http://119.57.142.30:43000`,
          // target: `http://172.16.15.14:8080`,//蒋文博
          // target: 'http://172.16.9.119:8080',//白金权
          // target: "http://172.16.15.17:8080", //常青
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
      },
    },
  };
});
