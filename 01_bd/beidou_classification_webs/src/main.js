import { createApp } from "vue";

import Cookies from "js-cookie";

import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn"; // 中文语言

import "@/assets/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive

import "echarts";
import echarts from "vue-echarts";

// 注册指令
import plugins from "./plugins"; // plugins
import { download } from "@/utils/request";

// svg图标
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon";
import elementIcons from "@/components/SvgIcon/svgicon";

import "./permission"; // permission control

import { useDict } from "@/utils/dict";
import {
  parseTime,
  resetForm,
  addDateRange,
  handleTree,
  selectDictLabel,
} from "@/utils/currency";
import {
  uploadFileData,
  downDefinedUrlFile,
} from "@/utils/uploadFileData";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 自定义树选择组件
import TreeSelect from "@/components/TreeSelect";
// 字典标签组件
import DictTag from "@/components/DictTag";
import Thepopup from "@/components/mapBox/popup.vue";

// @ts-ignore
import scroll from "vue3-seamless-scroll";
import mapBoxGl from "mapbox-gl";
const app = createApp(App);
import { filterShowMode } from "@/utils/navRouter";
// 全局方法挂载
app.config.globalProperties.uploadFileData = uploadFileData;
// app.config.globalProperties.downBizFile = downBizFile;
app.config.globalProperties.downDefinedUrlFile = downDefinedUrlFile;
// app.config.globalProperties.previewFile = previewFile;
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.filterShowMode = filterShowMode;
// 全局组件挂载
// app.component('Thepopup', Thepopup)
app.component("DictTag", DictTag);
app.component("Pagination", Pagination);
app.component("TreeSelect", TreeSelect);
app.component("RightToolbar", RightToolbar);
app.use(router);
app.use(store);
app.use(plugins);
app.use(elementIcons);
app.use(scroll);
app.component("svg-icon", SvgIcon);
app.use(mapBoxGl);

directive(app);
// 屏蔽警告信息
app.config.warnHandler = () => null;
// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  size: Cookies.get("size") || "medium",
});
app.component("echarts", echarts);
app.mount("#app");
