<template>
  <el-dialog
    title="查看详情"
    v-model="open"
    width="50%"
    :before-close="handleClose"
  >
    <ul class="ul-class">
      <li
        @click="handleClick(item, index)"
        v-for="(item, index) in tabData"
        :key="index"
        :class="item.tabName == activeIndex ? 'active-li' : ''"
      >
        {{ item.tabKey }}
      </li>
    </ul>
    <div class="tab-content">
      <div v-if="tabContentData[0] && tabContentData[0].fileList">
        <div class="img-title">取证图片</div>
        <!-- <img :src="formatterImg(item.img)" /> -->
        <div class="banner-content">
          <div class="swiper-container gallery-top">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                style="margin-right: 0; width: 100%"
                v-for="(item, index) of tabContentData[0].fileList"
                :key="index"
              >
                <img class="img" :src="formatterImg(item)" />
              </div>
            </div>
            <div class="swiper-button-next swiper-button-white"></div>
            <div class="swiper-button-prev swiper-button-white"></div>
          </div>
          <!-- <div style="height: 15px;width: 400px;"></div> -->
          <!-- tabContentData[0].fileList -->
          <div class="swiper-container gallery-thumbs">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide swiper-bottom"
                v-for="(item, index) of tabContentData[0].fileList"
                :key="index"
              >
                <img class="img" :src="formatterImg(item)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 异物侵限 -->
      <div v-if="activeIndex == 'formatter'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData"
          :key="index"
        >
          <div>
            <span class="tab-key-class">事件编号</span>
            <span class="tab-value-class">{{ item.eventNumber }}</span>
          </div>
          <div>
            <span class="tab-key-class">建议启动预案名称</span>
            <span class="tab-value-class">{{ item.plan_name }}</span>
          </div>
          <div>
            <span class="tab-key-class">模型名称</span>
            <span class="tab-value-class">{{ item.modelName }}</span>
          </div>
          <div>
            <span class="tab-key-class">事件位置</span>
            <span class="tab-value-class"
              >E {{ pointToString(item.lon) }} &nbsp;&nbsp;N&nbsp;&nbsp;{{
                pointToString(item.lat)
              }}</span
            >
          </div>
          <div>
            <span class="tab-key-class">事件记录时间</span>
            <span class="tab-value-class">{{
              timeToSplit(item.begin_time)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">尺寸</span>
            <span class="tab-value-class">{{ item.volume }}&nbsp;立方米</span>
          </div>
          <div>
            <span class="tab-key-class">异物位置</span>
            <span class="tab-value-class">{{ item.location }}</span>
          </div>
          <div>
            <span class="tab-key-class">材质</span>
            <span class="tab-value-class">{{ item.texture }}</span>
          </div>
          <div>
            <span class="tab-key-class">速度</span>
            <span class="tab-value-class">{{ item.speed }}&nbsp;km/h</span>
          </div>
          <div>
            <span class="tab-key-class">侵限时长</span>
            <span class="tab-value-class">{{ item.duration }}&nbsp;min</span>
          </div>
          <div>
            <span class="tab-key-class">报警次数</span>
            <span class="tab-value-class">{{ item.warnNumber }}</span>
          </div>
          <div>
            <!-- formatterRiskGrade(item.risk) -->
            <span class="tab-key-class">风险预警等级</span>
            <span class="tab-value-class">{{ item.riskGrade }}</span>
          </div>
        </div>
      </div>
      <!-- 恶劣天气 -->
      <div v-if="activeIndex == 'weather'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData"
          :key="index"
        >
          <div>
            <span class="tab-key-class">事件编号</span>
            <span class="tab-value-class">{{ item.eventNumber }}</span>
          </div>
          <div>
            <span class="tab-key-class">建议启动预案名称</span>
            <span class="tab-value-class">{{ item.plan_name }}</span>
          </div>
          <div>
            <span class="tab-key-class">模型名称</span>
            <span class="tab-value-class">{{ item.modelName }}</span>
          </div>
          <div>
            <span class="tab-key-class">风险预警等级</span>
            <span class="tab-value-class">{{ item.riskGrade }}</span>
          </div>
          <!-- formatterRiskGrade(item.risk) -->
          <div>
            <span class="tab-key-class">气温</span>
            <span class="tab-value-class">{{ item.airTemp }} ℃</span>
          </div>
          <div>
            <span class="tab-key-class">相对湿度</span>
            <span class="tab-value-class">{{ item.humidity }}</span>
          </div>
          <div>
            <span class="tab-key-class">大气压强</span>
            <span class="tab-value-class">{{ item.atmoPres }}</span>
          </div>
          <div>
            <span class="tab-key-class">风向</span>
            <span class="tab-value-class">{{ item.windDire }}</span>
          </div>
          <div>
            <span class="tab-key-class">风速</span>
            <span class="tab-value-class">{{ item.windSpeed }} km/h</span>
          </div>
          <div>
            <span class="tab-key-class">能见度</span>
            <span class="tab-value-class">{{ item.visibility }}</span>
          </div>
          <div>
            <span class="tab-key-class">雨量</span>
            <span class="tab-value-class">{{ item.rainfall }}</span>
          </div>
          <div>
            <span class="tab-key-class">雪深</span>
            <span class="tab-value-class">{{ item.snowsDepth }}</span>
          </div>
          <div>
            <span class="tab-key-class">风级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.windStatus, "wind")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雨级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.rainStatus, "rain")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雾级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.fogStatus, "fog")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雪级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.snowStatus, "snow")
            }}</span>
          </div>
        </div>
      </div>
      <!-- 综合风险 -->
      <div v-if="activeIndex == 'synthesize'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData"
          :key="index"
        >
          <div>
            <span class="tab-key-class">事件编号</span>
            <span class="tab-value-class">{{ item.eventNumber }}</span>
          </div>
          <div>
            <span class="tab-key-class">建议启动预案名称</span>
            <span class="tab-value-class">{{ item.plan_name }}</span>
          </div>
          <div>
            <span class="tab-key-class">模型名称</span>
            <span class="tab-value-class">{{ item.modelName }}</span>
          </div>
          <div>
            <span class="tab-key-class">风险预警等级</span>
            <span class="tab-value-class">{{ item.riskGrade }}</span>
          </div>
          <div>
            <span class="tab-key-class">气温</span>
            <span class="tab-value-class">{{ item.airTemp }} ℃</span>
          </div>
          <div>
            <span class="tab-key-class">相对湿度</span>
            <span class="tab-value-class">{{ item.humidity }}</span>
          </div>
          <div>
            <span class="tab-key-class">大气压强</span>
            <span class="tab-value-class">{{ item.atmoPres }}</span>
          </div>
          <div>
            <span class="tab-key-class">风向</span>
            <span class="tab-value-class">{{ item.windDire }}</span>
          </div>
          <div>
            <span class="tab-key-class">风速</span>
            <span class="tab-value-class">{{ item.windSpeed }} km/h</span>
          </div>
          <div>
            <span class="tab-key-class">能见度</span>
            <span class="tab-value-class">{{ item.visibility }}</span>
          </div>
          <div>
            <span class="tab-key-class">雨量</span>
            <span class="tab-value-class">{{ item.rainfall }}</span>
          </div>
          <div>
            <span class="tab-key-class">雪深</span>
            <span class="tab-value-class">{{ item.snowsDepth }}</span>
          </div>
          <div>
            <span class="tab-key-class">风级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.windStatus, "wind")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雨级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.rainStatus, "rain")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雾级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.fogStatus, "fog")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">雪级别</span>
            <span class="tab-value-class">{{
              formatterWeather(item.snowStatus, "snow")
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">流域面积</span>
            <span class="tab-value-class"
              >{{ item.wa }}<span v-if="item.wa">km²</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">岩土类型</span>
            <span class="tab-value-class">{{
              finddict(item.rocksoil, gt)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">松散物质储量</span>
            <span class="tab-value-class"
              >{{ item.lmsc }}<span v-if="item.lmsc">m³</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">平均坡度</span>
            <span class="tab-value-class"
              ><sup></sup>{{ item.aves }}<span v-if="item.aves">°</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">植物覆盖率</span>
            <span class="tab-value-class"
              >{{ item.pc }}<span v-if="item.pc">％</span></span
            >
          </div>
        </div>
      </div>
      <!-- 设备异常 -->
      <div v-if="activeIndex == 'abnormal'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData[0]"
          :key="index"
        >
          <!-- <div>
            <span class="tab-key-class">事件编号</span>
            <span class="tab-value-class">{{ item.eventNumber }}</span>
          </div> -->
          <div>
            <span class="tab-key-class">监测点名称</span>
            <span class="tab-value-class">{{ item.monitorName }}</span>
          </div>
          <div>
            <span class="tab-key-class">设备名称</span>
            <span class="tab-value-class">{{ item.facility_name }}</span>
          </div>
          <div>
            <span class="tab-key-class">线路名称</span>
            <span class="tab-value-class">{{ item.line_name }}</span>
          </div>
          <div>
            <span class="tab-key-class">设备类型</span>
            <span class="tab-value-class">{{
              finddict(item.facility_type, facility_type)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">设备状态</span>
            <span class="tab-value-class">{{
              finddict(item.facility_state, facility_state)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">位置</span>
            <span class="tab-value-class"
              >经度&nbsp;&nbsp;{{ item.lon }}&nbsp;&nbsp;
              &nbsp;&nbsp;纬度&nbsp;&nbsp;{{ item.lat }}</span
            >
          </div>
        </div>
      </div>
      <!-- 正常监测点 -->
      <div v-if="activeIndex == 'normal'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData[0]"
          :key="index"
        >
          <div>
            <span class="tab-key-class">监测点名称</span>
            <span class="tab-value-class">{{ item.monitorName }}</span>
          </div>
          <div>
            <span class="tab-key-class">位置</span>
            <span class="tab-value-class"
              >E {{ pointToString(item.lon) }} &nbsp;&nbsp;N&nbsp;&nbsp;{{
                pointToString(item.lat)
              }}</span
            >
          </div>
          <div>
            <span class="tab-key-class">监测点等级</span>
            <span class="tab-value-class">{{
              formatterRiskGrade(item.grade)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">线路名称</span>
            <span class="tab-value-class">{{ item.lineName }}</span>
          </div>
          <div>
            <span class="tab-key-class">设备数量</span>
            <span class="tab-value-class">{{ item.facilityCount }}</span>
          </div>
          <div>
            <span class="tab-key-class">流域面积</span>
            <span class="tab-value-class"
              >{{ item.wa }}<span v-if="item.wa">km²</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">岩土类型</span>
            <span class="tab-value-class">{{
              finddict(item.rocksoil, gt)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">松散物质储量</span>
            <span class="tab-value-class"
              >{{ item.lmsc }}<span v-if="item.lmsc">m³</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">平均坡度</span>
            <span class="tab-value-class"
              >{{ item.aves }}<span v-if="item.aves">°</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">植物覆盖率</span>
            <span class="tab-value-class"
              >{{ item.pc }}<span v-if="item.pc">％</span></span
            >
          </div>
        </div>
      </div>
      <!-- 关键监测点 -->
      <div v-if="activeIndex == 'grade'">
        <div
          class="tab-content-class"
          v-for="(item, index) in tabContentData"
          :key="index"
        >
          <div>
            <span class="tab-key-class">监测点名称</span>
            <span class="tab-value-class">{{ item.monitor_name }}</span>
            <!-- <span class="tab-value-class">{{ item.monitorName }}</span> -->
          </div>
          <div>
            <span class="tab-key-class">位置</span>
            <span class="tab-value-class"
              >E {{ pointToString(item.lon) }} &nbsp;&nbsp;N&nbsp;&nbsp;{{
                pointToString(item.lat)
              }}</span
            >
            <!-- <span class="tab-value-class"
              >经度&nbsp;&nbsp;{{ item.lon }}&nbsp;&nbsp;
              &nbsp;&nbsp;纬度&nbsp;&nbsp;{{ item.lat }}</span
            > -->
          </div>
          <div>
            <span class="tab-key-class">监测点等级</span>
            <span class="tab-value-class">{{
              formatterRiskGrade(item.grade)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">线路名称</span>
            <span class="tab-value-class">{{ item.line_name }}</span>
            <!-- <span class="tab-value-class">{{ item.lineName }}</span> -->
          </div>
          <div>
            <span class="tab-key-class">流域面积</span>
            <span class="tab-value-class"
              >{{ item.wa }}<span v-if="item.wa">km²</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">岩土类型</span>
            <span class="tab-value-class">{{
              finddict(item.rocksoil, gt)
            }}</span>
          </div>
          <div>
            <span class="tab-key-class">松散物质储量</span>
            <span class="tab-value-class"
              >{{ item.lmsc }}<span v-if="item.lmsc">m³</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">平均坡度</span>
            <span class="tab-value-class"
              >{{ item.aves }}<span v-if="item.aves">°</span></span
            >
          </div>
          <div>
            <span class="tab-key-class">植物覆盖率</span>
            <span class="tab-value-class"
              >{{ item.pc }}<span v-if="item.pc">％</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 误报、核实 -->
    <div
      class="btn-class-warn"
      v-if="
        activeIndex == 'formatter' ||
        activeIndex == 'weather' ||
        activeIndex == 'synthesize'
      "
    >
      <span @click="handleClickWarn('1')">误报</span>
      <span @click="handleClickWarn('2')">核实</span>
    </div>
    <div class="warn-measure-class">
      <div v-show="warnBtn == '1'">
        <span>风险等级错误</span>
        <div style="margin-left: 10%">
          <span>风险等级调整</span>
          <el-select
            v-model="riskGrade"
            placeholder="请选择风险等级"
            clearable
            filterable
            size="mini"
            class="select-position-class"
          >
            <el-option
              v-for="dict in event_grade"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </div>
      </div>
      <div style="margin: 20px 0; text-align: center" v-show="warnBtn == '2'">
        建议启动《{{ tabContentData[0] ? tabContentData[0].plan_name : "" }}》
      </div>
      <div
        class="emplan-btn-class"
        v-show="warnBtn == '1' || warnBtn == '2'"
        @click="hanleToEmPlan"
      >
        <span>启动应急预案</span>
      </div>
      <div v-show="warnBtn == '1'">
        <span>图片判断错误</span>
        <div class="confirm-btn" @click="confirmBtn">
          <span>确定</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { getMonitorParticulars, insertFailure } from "@/api/display/display.js";
import "swiper/swiper-bundle.css";
import Swiper, { Navigation, Autoplay, Thumbs } from "swiper"; //相关组件
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//查字典
function finddict(val, dictv) {
  let result = dictv.find((i) => i.value == val);
  return result?.label ? result.label : "";
}
Swiper.use([Navigation, Autoplay, Thumbs]);
let props = defineProps({
  isShowInfoWindow: {
    type: Boolean,
    default: false,
  },
  infoWindowData: {
    type: Object,
    default: {},
  },
});
let { proxy } = getCurrentInstance();
let router = useRouter();
let store = useStore();
const pointToString = (val) => {
  let str = val.toString();
  let result = str.split(".");
  // console.log(result[0], "--", result[1] ? result[1] : "啥事");
  let resultwto = result[1] ? result[1] : " ";
  return result[0] + "°" + resultwto + "′";
};
const {
  monitoring_point_grade,
  WindStatus,
  RainStatus,
  FogStatus,
  SnowStatus,
  event_grade,
  facility_type,
  facility_state,
  gt,
} = proxy.useDict(
  "monitoring_point_grade",
  "WindStatus",
  "RainStatus",
  "FogStatus",
  "SnowStatus",
  "event_grade",
  "facility_type",
  "facility_state",
  "gt"
);
let emit = defineEmits(["handleCloseDialog", "goBack"]);
let open = ref(false);
let activeIndex = ref("");
let tabData = ref([]);
let tabContentData = ref([]);
let riskGrade = ref("");
let galleryThumbs = ref(null);
let warnBtn = ref("0");
watch(
  () => props.isShowInfoWindow,
  (val) => {
    activeIndex.value = "";
    warnBtn.value = "0";
    tabContentData.value = [];
    getCheckData();
    open.value = val;
  }
);
function galleryTopLunbo() {
  new Swiper(".gallery-top", {
    // loop: true,
    spaceBetween: 10,
    // 左右按钮
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      //thumbs组件专门用于制作带缩略图的swiper
      swiper: galleryThumbs.value,
      slideThumbActiveClass: "swiper-slide-thumb-active",
    },
  });
}
function galleryThumbsLunbo() {
  galleryThumbs.value = new Swiper(".gallery-thumbs", {
    // loop: true,
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
  });
}
function getCheckData() {
  // props.infoWindowData.facilityState = 'warn'
  tabData.value = [];
  getMonitorParticulars(props.infoWindowData).then((res) => {
    if (res.code == 200) {
      // console.log(res, 'chajkan')
      for (let key in res.data) {
        // console.log(res.data[key])
        let tabKey = "";
        if (key == "formatter") {
          tabKey = "异物侵限预警";
        } else if (key == "weather") {
          tabKey = "恶劣天气预警";
        } else if (key == "synthesize") {
          tabKey = "情景综合预警";
        } else if (key == "normal") {
          tabKey = "普通监测点";
        } else if (key == "abnormal") {
          tabKey = "设备异常";
        } else if (key == "grade") {
          tabKey = "关键监测点";
        }
        res.data[key].tabName = key;
        tabData.value.push({
          tabName: key,
          tabKey: tabKey,
          data: res.data[key],
        });
      }
      // console.log(tabData.value, "arr");
      activeIndex.value = tabData.value[0].tabName;
      tabContentData.value = [tabData.value[0].data];
      nextTick(() => {
        galleryThumbsLunbo();
        galleryTopLunbo();
      });
      // console.log(tabData.value, ';tabData.value', tabContentData.value)
    }
  });
}
// fomatter图片路径
const formatterImg = (item) => {
  // console.log(item.file.fileBytes, "imgurl");
  return item ? proxy.$arrayBufferToBlob(item.fileBytes) : "";
  // return new URL(imgUrl, import.meta.url).href;
};
const handleClose = () => {
  emit("handleCloseDialog");
};
// 进入应急预案
const hanleToEmPlan = () => {
  let sendData;
  // console.log();
  tabContentData.value.forEach((item) => {
    if (item.tabName == activeIndex.value) {
      console.log(item, "item", riskGrade.value);
      sendData = {
        eventType: item.tabName,
        conLimitType: item.tabName == "weather" ? 0 : 1,
        responseLevel: riskGrade.value ? riskGrade.value : item.riskGrade,
        eventNumber: item.eventNumber,
        // planType:
        //   item.tabName == "formatter" ||
        //   item.tabName == "synthesize" ||
        //   item.tabName == "weather"
        //     ? 0
        //     : 1,
        id: item.id,
        planType: item.tabName == "weather" ? 0 : 1,
      };
    }
  });
  // return;
  store.dispatch("app/setShowMenu", true);
  router.push({ path: "/baseinfo/emergencyplan1", query: sendData });
  emit("handleCloseDialog");
  // emit("getInitList", []);
  // emit("expcloseInfoWindow");
  emit("goBack");
};
// 误报确定
const confirmBtn = () => {
  let eventNumber;
  tabContentData.value.forEach((item) => {
    if (item.tabName == activeIndex.value) {
      eventNumber = item.eventNumber;
    }
  });
  insertFailure({ eventNumber }).then((res) => {
    if (res.code == 200) {
      emit("handleCloseDialog");
      proxy.$modal.msgSuccess("添加成功");
    }
  });
  // console.log(activeIndex.value, tabContentData.value)
};
const handleClick = (data, val) => {
  // console.log(data, val);
  tabContentData.value = [data.data];
  activeIndex.value = data.tabName;
  warnBtn.value = 0;
  nextTick(() => {
    galleryThumbsLunbo();
    galleryTopLunbo();
  });
};
const handleClickWarn = (val) => {
  riskGrade.value = "";
  warnBtn.value = val;
};
// 格式化风险等级
const formatterRiskGrade = (val) => {
  // console.log(risk_grade.value, "alljiancedian");
  let result = monitoring_point_grade.value.find((item) => item.value == val);
  // console.log(result, "jiancedian ");
  if (result) {
    return result.label;
  } else {
    return "";
  }
};
// 格式化天气
const formatterWeather = (val, type) => {
  // 风
  if (type == "wind") {
    let result = WindStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雨
  if (type == "rain") {
    let result = RainStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雾
  if (type == "fog") {
    let result = FogStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
  // 雪
  if (type == "snow") {
    let result = SnowStatus.value.find((item) => item.value == val);
    if (result) {
      return result.label;
    } else {
      return "";
    }
  }
};
const timeToSplit = (val) => {
  if (val) {
    let result = val.split("T");
    return result[0] + " " + result[1];
  } else {
    return "";
  }
};
</script>
<style scoped lang="scss">
* {
  margin: 0;
  // padding: 0;
  list-style: none;
}
.ul-class {
  display: flex;
}
.ul-class li {
  min-width: 150px;
  white-space: nowrap;
  padding: 8px;
  margin-right: 10px;
  box-shadow: 2px 2px 6px #909399, -2px -2px 6px #909399;
  background: #353535;
  color: #feffff;
  cursor: pointer;
  text-align: center;
}
.ul-class .active-li {
  background: #058e8a;
}
.tab-content {
  margin-top: 30px;
  display: flex;
  width: 100%;
}
.tab-content > div {
  width: 50%;
  margin-left: 20px;
}
.img-title {
  text-align: center;
  color: #feffff;
  font-size: 13px;
  margin-bottom: 10px;
}
.tab-content-class {
  color: #ddd;
  font-size: 13px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tab-value-class {
  margin-left: 20px;
  width: 100%;
  // flex-wrap: nowrap;
  word-break: break-all;
  // white-space: nowrap;
  // display: inline-block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
}
.tab-key-class {
  // min-width: 100px;
  display: inline-block;
  white-space: nowrap;
  width: 200px;
  text-align: right;
  // margin-bottom: 10px;
  font-weight: 700;
  // margin-bottom: 15px;
}
.banner-content {
  margin-top: 10px;
  width: 100%;
  height: 450px;
}
.banner-content .img {
  width: 100%;
  height: 100%;
}
.banner-content .gallery-top {
  width: 100%;
  height: 250px;
  border: 1px solid #ccd2e7;
  border-radius: 8px;
}
.banner-content .gallery-thumbs {
  margin-top: 10px;
  width: 100%;
  height: 100px;
}
.banner-content .gallery-thumbs img {
  border: 1px solid #ccd2e7;
  border-radius: 4px;
  width: 100%;
  height: 100%;
}
.banner-content .swiper-slide-thumb-active {
  border: 2px solid #284198;
  border-radius: 4px;
  opacity: 1;
  width: 100%;
  height: 100%;
}
.swiper-bottom {
  background: #000;
  opacity: 0.4;
  height: 100%;
  box-sizing: border-box;
}
.swiper-button-white::after {
  font-size: 24px !important;
}
.btn-class-warn {
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.btn-class-warn span {
  padding: 6px 20px;
  display: inline-block;
  background: #04bcc6;
  color: #fff;
  border-radius: 6px;
}
.btn-class-warn span:nth-child(2) {
  margin-left: 20px;
}
.btn-class-warn span:hover,
.confirm-btn span:hover,
.warn-measure-class .emplan-btn-class span:hover {
  opacity: 0.8;
}
.warn-measure-class {
  width: 50%;
  margin: 20px auto;
  color: #ddd;
  font-size: 13px;
}
.warn-measure-class > div:nth-child(1) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.warn-measure-class .emplan-btn-class {
  // text-align: center;
  margin: 10px auto;
  width: 35%;
}
.warn-measure-class .emplan-btn-class span {
  padding: 6px 30px;
  display: inline-block;
  background: #d7d7d7;
  white-space: nowrap;
  color: #008080;
  cursor: pointer;
  border-radius: 6px;
}
.confirm-btn {
  width: 20%;
  margin: 10px auto;
}
.confirm-btn span {
  padding: 6px 20px;
  display: inline-block;
  background: #d7d7d7;
  color: #008080;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px;
}
.tab-content-class div {
  margin-bottom: 10px;
  display: flex;
  align-content: center;
}
:deep(.swiper-slide) {
  margin-right: 0 !important;
}
</style>