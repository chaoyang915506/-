<template>
  <div class="app-container">
    <div>
      <div class="header">
        <span class="header-title" style="color: white">
          <!-- <img :src="logo" class="sidebar-logo" />
                    <img :src="haishiLogo" class="sidebar-logo2" /> -->
          可视化平台
        </span>
        <div class="header-span">
          <hamburger
            id="hamburger-container"
            :is-active="getters.sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
          />
          <span style="font-size: 12px; float: right">{{ data.time }}</span>
        </div>
      </div>
      <!-- 左侧 -->
      <div class="short—mssage" :style="leftHide?'left:-25%':'left:0px'">
        <el-button :icon="leftHide?'CaretRight': 'CaretLeft'" class="leftHide" circle @click="leftHideHandle"/>
        <!-- 北斗卡统计 -->
        <div class="card-pie">
          <div class="title-header" style="margin-top: 4px">
            <span>北斗卡绑定统计</span>
          </div>
          <PieChart :chartData="data.pieChartData" />
        </div>
        <!-- 载体统计 -->
        <div
          :style="
            data.isShowCarrierDetails
              ? 'height:40%;position: relative;'
              : 'height: 26%;margin-top:30px'
          "
        >
          <div class="title-header">
            <span
              :style="!data.isShowCarrierDetails ? 'bottom:48%' : 'bottom:64%'"
              >载体统计</span
            >
          </div>
          <DiscountEcharts
            v-loading="carrierLoading"
            :chartData="
              !data.isShowCarrierDetails
                ? data.chartDataHistory_one
                : data.chartDataHistory_details
            "
            :style="!data.isShowCarrierDetails ? 'height:100%' : 'height:60%'"
            @echartsClickHandle="echartsClickHandle"
          />
          <div v-if="data.isShowCarrierDetails">
            <el-button
              round
              size="mini"
              @click="data.isShowCarrierDetails = false"
              >X</el-button
            >

            <div class="num">
              <div class="num-item01">
                <span style="color: #03d9eb">
                  {{ carrierCount.allLoggingCount }}
                </span>
                <span style=""> 全部录入 </span>
              </div>
              <div class="num-item02">
                <span style="color: #00c503">
                  {{ carrierCount.runningCount }}
                </span>
                <span style=""> 运行中 </span>
              </div>
              <div class="num-item03">
                <span style="color: #dd3a57">
                  {{ carrierCount.unRunningCount }}
                </span>
                <span style=""> 未运行 </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="real-rime"
          v-loading="realRimeLoading"
          element-loading-text="Loading..."
          :element-loading-spinner="svg"
          element-loading-svg-view-box="-10, -10, 50, 50"
          element-loading-background="rgba(255, 255, 255,.7);"
        >
          <div class="title-header">
            <span style="bottom: 66%">实时信息</span>
          </div>
          <div class="real-rime-header">
            <span>信息类别</span>
            <span>具体内容</span>
            <span>上报时间</span>
          </div>
          <vue3-seamless-scroll
            :list="list"
            class="scroll"
            :hover="{
              type: Boolean,
              default: false,
              required: false,
            }"
          >
            <div class="item" v-for="item in list" :key="item.message">
              <span>{{ item.msgType }}</span>
              <span :data-title="getLatlngCnvTool(item.message)">{{
                getLatlngCnvTool(item.message)
              }}</span>
              <span :data-title="item.sendTime">{{ item.sendTime }}</span>
            </div>
          </vue3-seamless-scroll>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="map-container">
        <!-- 查询 -->
        <el-form
          ref="formRef"
          :model="data.queryParams"
          label-width="70px"
          class="mapSearch"
        >
          <el-form-item label="查询内容" prop="查询内容">
            <el-input
              v-model="data.queryParams.carrierName"
              @focus="data.open = true"
              clearable
            />
          </el-form-item>
          <el-button
            icon="Search"
            type="primary"
            class="btn_submit"
            @click="secrchInfo"
            >查询</el-button
          >
        </el-form>
        <el-form
          ref="formRef"
          :model="data.queryParams"
          label-width="70px"
          class="mapSearch"
        >
          <el-form-item
            label="北斗卡状态"
            prop="北斗卡状态"
            label-width="90px"
            style="margin-left: 400px"
          >
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="未入网在线"></el-checkbox>
              <el-checkbox label="已入网离线"></el-checkbox>
              <el-checkbox label="已入网在线"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <!-- 弹框 -->
        <el-card class="box-card mapContainerList" v-show="data.open">
          <div class="clearfix">
            <!-- <span>卡片名称</span> -->
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="data.open = false"
              >关闭</el-button
            >
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            @row-click="handleTableRow"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="bdsNumber" label="北斗卡号" />
            <el-table-column prop="bdsVersion" label="北斗卡类型" />
            <el-table-column prop="carrierName" label="载体名称">
              <template #default="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.carrierName"
                  placement="top-start"
                >
                  <span class="span">{{ scope.row.carrierName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="carrierType" label="载体类型" />
            <el-table-column prop="sendTime" label="更新时间">
              <template #default="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.sendTime"
                  placement="top-start"
                >
                  <span class="span">{{ scope.row.sendTime }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="data.total > 0"
            :total="data.total"
            v-model:page="data.queryParams.pageNum"
            v-model:limit="data.queryParams.pageSize"
            @pagination="secrchInfo"
          />
        </el-card>
        <MapBox
          :mapData="data.mapPointData"
          :isToUpdate="data.isToupdate"
          :showSource="data.showSource"
          @editShowSource="editShowSource"
        ></MapBox>
        <div
          class="title-header"
          style="
            height: 6%;
            position: absolute;
            right: 0;
            bottom: 24%;
            background-color: rgba(255, 255, 255, 0.7);
          "
          :style="rightHide?'bottom: 0%;':(leftHide?'bottom: 24%;width: 100%':'bottom: 24%;width: 75%;')"
        >
        <el-button :icon="rightHide?'CaretTop': 'CaretBottom'" class="rightHide" circle @click="rightHideHandle"/>

          <span style="bottom: 37%; left: 4%" >航保机构北斗累计入网情况</span>
          <el-select
            v-model="selectDep"
            clearable
            style="
              width: 10%;
              position: absolute;
              right: 2%;
              top: 32%;
              z-index: 100;
            "
          >
            <el-option
              v-for="item,index in data.chartDataHistory_two.legendList"
              :key="item"
              :label="item"
              :value="index"
            />
          </el-select>
        </div>
        <div class="contrast" v-loading='chartDataHistory_two_loading' :style="rightHide?'display: none':(leftHide?'display: block;width: 100%':'display: block;width: 75%;')">
          <DiscountEcharts :chartData="data.chartDataHistory_two" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChart from "@/components/PieChart/index.vue";
import MapBox from "@/components/MapBox/index.vue";
import DiscountEcharts from "@/components/discountEcharts/index.vue";
import { getTimeStr } from "@/utils/time.js";
import { onMounted, ref, watch } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
import WebSocketClass from "@/utils/webSocket";
import { useStore } from "vuex";
import logo from "@/assets/logo/logo.png";
import haishiLogo from "@/assets/logo/haishiLogo.png";
import { LatlngCnvTool } from "@/utils/latlngCnvTool.js";
import Hamburger from "@/components/Hamburger";
const { msg_type, card_online_state } = proxy.useDict(
  "msg_type",
  "card_online_state "
);
import { 按北斗卡状态查询位置 } from "@/api/foundationSupport/index.js";
const store = useStore();
const getters = computed(() => store.getters);
import {
  北斗卡绑定统计,
  查询实时点信息,
  各海事局对比,
  获取实时信息列表,
  获取实时信息列表可查询,
  载体统计一级,
  载体统计二级,
} from "@/api/foundationSupport/index.js";
const route = useRoute();
const list = ref([]);
const checkList = ref([]);
let realRimeLoading = ref(false);
let carrierLoading = ref(false);
let selectDep = ref(null);
let chartDataHistory_two_loading = ref(false)
onMounted(() => {
  getInfo();
  getTime();
  getList();
  connectWebSocket();
  secrchInfo();
});
const tableData = ref([]);
let carrierCount = ref({});
const optionHover = {
  step: 30, // 数值越大速度滚动越快
  limitMoveNum: 100, // 开始无缝滚动的数据量 this.dataList.length
  hoverStop: true, // 是否开启鼠标悬停stop
  direction: 1, // 0向下 1向上 2向左 3向右
  openWatch: true, // 开启数据实时监控刷新dom
  singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
};
let data = reactive({
  showSource: {},
  queryParams: {
    pageNum: 1,
    pageSize: 6,
  },
  total: 1,
  open: false,
  form: {},
  isToupdate: false,
  goback: "< 返回",
  mapPointData: [],
  pieChartData: {},
  isShowShort: false,
  isShowCarrierDetails: false,
  time: null,
  chartDataHistory_details: {
    XYColor: "#565454", //刻度线颜色
    yAxisType: "category",
    xAxisType: "value",
    yAxisData: [],
    grid: {
      x: 70,
      y: 10,
      x2: 50,
      y2: 30,
      borderWidth: 1,
    },
    title: "",
    company: "%",
    type: "bar",
    lineColor: ["rgb(8, 139, 252)"],
    legendList: [],
    dataZoom: false,
    gridStyle: {},
    xaxisdate: [],
    seriesone: [],
  },
  chartDataHistory_one: {
    XYColor: "#565454", //刻度线颜色
    yAxisType: "category",
    xAxisType: "value",
    yAxisData: [],
    grid: {
      x: 70,
      y: 10,
      x2: 50,
      y2: 30,
      borderWidth: 1,
    },
    title: "",
    company: "%",
    type: "bar",
    lineColor: ["rgb(8, 139, 252)"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      // left: 10,
      // right: 10,
      // top: 90,
      // bottom: 10,
      // containLabel: true,
    },
    xaxisdate: [],
    seriesone: [],
  },
  chartDataHistory_two: {
    XYColor: "#565454", //刻度线颜色
    legendStyle: {
      top: 0,
      color: "#565454", //刻度线颜色
    },
    grid: {
      x: 35,
      y: 20,
      x2: 15,
      y2: "30%",
      borderWidth: 1,
    },
    title: "",
    company: "",
    type: "line",
    lineColor: ["#0066CC", "#339966", "#FFCC00"],
    legendList: [],
    dataZoom: false,
    gridStyle: {
      left: 10,
      right: 10,
      top: 100,
      bottom: 10,
      containLabel: true,
    },
    xaxisdate: [],
    seriesone: [],
  },
});
watch(
  () => selectDep.value,
  (val) => {
      chartDataHistory_two_loading.value = true
    if (val !== '') {
      各海事局对比().then((res) => {
        data.chartDataHistory_two.seriesone = res.data[val].map((item) => {
          return item.month;
        });
        data.chartDataHistory_two.xaxisdate[0] = res.data[val].map((item) => {
          return item.netInCount;
        });
        data.chartDataHistory_two.xaxisdate[1] = []
        data.chartDataHistory_two.legendList = res.data[val].map((item) => {
          return item.deptName;
        });
      chartDataHistory_two_loading.value = false
      });
    } else {
      各海事局对比().then((res) => {
        data.chartDataHistory_two.seriesone = res.data[0].map((item) => {
          return item.month;
        });
        data.chartDataHistory_two.xaxisdate[0] = res.data[0].map((item) => {
          return item.netInCount;
        });
        data.chartDataHistory_two.xaxisdate[1] = res.data[1].map((item) => {
          return item.netInCount;
        });
        data.chartDataHistory_two.legendList = res.data.map((item) => {
          return item[0].deptName;
        });
      chartDataHistory_two_loading.value = false
      });
    }
  }
);
watch(
  () => checkList.value,
  (val) => {
    if (val.length) {
      let state =
        val[val.length - 1] === "未入网在线"
          ? 4
          : val[val.length - 1] === "已入网在线"
          ? 2
          : 3;
      按北斗卡状态查询位置({ cardState: state }).then((res) => {
        data.isToupdate = true;
        data.mapPointData = res.rows;
        proxy.$modal.msgSuccess("查询成功");
      });
    }
    if (!val.length) {
      查询实时点信息().then((res) => {
        data.isToupdate = true;
        data.mapPointData = res.rows;
        proxy.$modal.msgSuccess("查询成功");
      });
    }
  }
);
const getLatlngCnvTool = (val) => {
  let sb = LatlngCnvTool([val.split(",")[0] + "", val.split(",")[1] + ""]);
  return "经度" + sb[0] + ",纬度" + sb[1];
};
const handleTableRow = (val) => {
  data.showSource = val;
};
const editShowSource = () => {
  data.showSource = { name: null };
};
const getTerminaList = () => {
  data.open = true;
};
const getInfo = () => {
  realRimeLoading.value = true;
  获取实时信息列表().then((res) => {
    if (res.code === 200)
      list.value =
        res.data.length > 110
          ? res.data.slice(res.data.length - 100, res.data.length)
          : res.data;
    realRimeLoading.value = false;
  });
  载体统计一级().then((res) => {
    if (res.code === 200 && res.data.length) {
      res.data.forEach((item) => {
        let result = msg_type.value.find((t) => t.value == item.msgType);
        data.chartDataHistory_one.yAxisData.push(result.label);
        data.chartDataHistory_one.xaxisdate.push(item.carrierCount);
      });
    }
  });
};
const secrchInfo = () => {
  获取实时信息列表可查询(data.queryParams).then((res) => {
    if (res.code === 200) {
      tableData.value = res.rows;
      data.total = res.total;
    }
  });
};
const getList = () => {
  北斗卡绑定统计().then((res) => {
    data.pieChartData.list = [
      { value: res.data.unNetworkingOnline, name: "未联网在线" },
      { value: res.data.networkingOnline, name: "已联网在线" },
      { value: res.data.networkingOffline, name: "已联网离线" },
    ];
    data.pieChartData.total = res.data.total + "";
  });
  各海事局对比().then((res) => {
    data.chartDataHistory_two.seriesone = res.data[0].map((item) => {
      return item.month;
    });
    data.chartDataHistory_two.xaxisdate[0] = res.data[0].map((item) => {
      return item.netInCount;
    });
    data.chartDataHistory_two.xaxisdate[1] = res.data[1].map((item) => {
      return item.netInCount;
    });
    data.chartDataHistory_two.legendList = res.data.map((item) => {
      return item[0].deptName;
    });
  });
};
const echartsClickHandle = (val) => {
  carrierLoading.value = true;
  let result = msg_type.value.find((t) => t.label == val.name);
  载体统计二级({ msgType: result.value }).then((res) => {
    data.chartDataHistory_details.yAxisData = [];
    data.chartDataHistory_details.xaxisdate = [];
    if (res.code === 200 && res.data.list.length) {
      res.data.list.forEach((item) => {
        let result = msg_type.value.find((t) => t.value == item.carrierType);
        data.chartDataHistory_details.yAxisData.push(result.label);
        data.chartDataHistory_details.xaxisdate.push(item.carrierCount);
      });
      carrierCount.value = {
        allLoggingCount: res.data.allLoggingCount,
        runningCount: res.data.runningCount,
        unRunningCount: res.data.unRunningCount,
      };
    }
    data.isShowCarrierDetails = true;
    carrierLoading.value = false;
  });
};
let leftHide = ref(false) 
let rightHide = ref(false) 
const leftHideHandle = ()=>{
  leftHide.value = !leftHide.value
}
const rightHideHandle = ()=>{
  rightHide.value = !rightHide.value
}
var setIntervals;
const getTime = () => {
  setIntervals = setInterval(() => {
    data.time = getTimeStr(7);
  }, 1000);
};
// 清除时间定时器
watch(
  () => route.name,
  (val) => {
    if (val !== "Index") clearTimeout(setIntervals);
  },
  { immediate: true }
);
onUnmounted(() => {
  WS.value.closeMyself();
});
let WS = ref(null);
// webSocket链接
const connectWebSocket = (socketUrl) => {
  WS.value = new WebSocketClass(
    "ws://119.57.142.30:41303/wsServer/",
    store.state.user.userId,
    websocketCallReceive
  );
  WS.value.connect();
};
// socke接收信息
const websocketCallReceive = (val) => {
  查询实时点信息().then((res) => {
    data.isToupdate = true;
    data.mapPointData = res.rows;
  });
};
function toggleSideBar() {
  store.dispatch("app/toggleSideBar");
}
</script>

<style scoped lang="scss">
// scoll 浮框样式 ----开始
.scroll .item {
  position: relative;
}
.scroll .item span[data-title]:hover:after {
  width: 180px;
  height: 20px;
  opacity: 1;
  transition: all 0.1s ease 0.5s;
  visibility: visible !important;
  text-align: center;
}
.scroll .item span[data-title]:after {
  content: attr(data-title);
  background-color: rgba(80, 79, 79, 0.8);
  color: #fff;
  font-size: 12px;
  position: absolute;
  padding: 2px;
  left: 20px;
  top: 0px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
  z-index: 99999;
  opacity: 0;
}
// ----结束
.back {
  cursor: pointer;
  color: rgb(0, 128, 255);
}
.app-container,
.container {
  cursor: pointer;
  padding: 0;
  // height: calc(100vh - 127px);
  height: calc(100vh - 0px);
  position: relative;
  .header {
    background: #4479e6;
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #565454;
    font-weight: 700;
    font-size: 17px;
    // background-image: url('../../../assets/images/foundationSupport-header.png');
    // background-size: 100%;
    // background-repeat: no-repeat;
    .header-title {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      bottom: 35px;
      font-size: 28px;
    }
    .header-span {
      margin-right: 10px;
      display: inline-block;
      width: 100%;
    }
    img {
      width: 100%;
      height: 70px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .short—mssage {
    background: rgba(255, 255, 255, 0.7);
    width: 25%;
    height: calc(100% - 54px);
    // background-color: yellow;
    position: absolute;
    left: 0;
    z-index: 100;
    .card-pie {
      height: 26%;
      // height: 180px;
      width: 100%;
      color: #565454;
    }
    .carrier {
      // height: 34%;
      // height: 200px;
      margin-top: 20px;
    }
    .real-rime {
      margin-right: 30px;
      margin-top: 50px;
      height: 40%;
      // height: 300px;
      .real-rime-header {
        display: flex;
        justify-content: space-between;
        margin-left: 10px;
        span {
          width: 30%;
          text-align: left;
          color: #565454;
          font-size: 13px;
          margin-bottom: 2px;
        }
      }
      .scroll {
        overflow: hidden;
        margin-left: 10px;
        .item {
          display: flex;
          justify-content: space-between;
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.338);
          span {
            width: 30%;
            text-align: left;
            color: #565454;
            font-size: 12px;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; // 默认不换行；
            margin-top: 6px;
          }
        }
      }
    }
  }
  .map-container {
    background: rgba(255, 255, 255, 0.7);
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    padding-right: 10px;
    .contrast {
      height: 19%;
      width: 75%;
      position: absolute;
      right: 0;
      bottom: 5%;
      background: rgba(255, 255, 255, 0.7);
    }
  }
  .title-header {
    width: 100%;
    height: 25%;
    background-image: url("../../../assets/images/header.png");
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    span {
      color: #565454;
      font-weight: 700;
      font-size: 16px;
      position: absolute;
      left: 10%;
      bottom: 48%;
    }
  }
}
.container {
  height: calc(100vh - -348px);
}
.echarts {
  width: 100%;
  height: 100%;
}
.el-button--mini.is-round {
  padding: 0 10px;
  position: absolute;
  right: 17px;
  top: 15%;
}
.num {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  div {
    width: 30%;
    height: 60px;
    display: inline-block;
    background-size: 100%;
    background-repeat: no-repeat;
    text-align: center;
    line-height: 40px;
    span:first-child {
      font-size: 22px;
      font-weight: 700;
    }
    span {
      display: block;
      color: #565454;
      font-size: 10px;
      height: 24px;
    }
  }

  .num-item01 {
    background-image: url("../../../assets/images/home-nums03.png");
  }
  .num-item02 {
    background-image: url("../../../assets/images/home-nums02.png");
  }
  .num-item03 {
    background-image: url("../../../assets/images/home-nums01.png");
  }
}
::v-deep .real-rime .el-loading-mask {
  top: 0% !important;
  bottom: -80% !important;
}
.sidebar-logo {
  margin-top: 3px;
  width: 32px !important;
  height: 32px !important;
  vertical-align: middle;
  position: absolute;
  top: 0;
  left: -44px !important;
}
.sidebar-logo2 {
  position: absolute;
  margin-top: 3px;
  width: 32px !important;
  height: 32px !important;
  vertical-align: middle;
  top: 0;
  left: 0px;
}
.mapSearch {
  position: absolute;
  top: 0;
  left: 25%;
  z-index: 1;
  margin-top: 8px;
  .btn_submit {
    position: absolute;
    top: 0;
    right: -105px;
  }
}
.mapContainerList {
  position: absolute;
  top: 56px;
  left: 5%;
  z-index: 200;
  width: 500px;
}
::v-deep .el-card,
::v-deep .el-table__header-wrapper,
::v-deep .el-card__body .el-table .el-table__header-wrapper th {
  background: rgba(255, 255, 255, 0.7) !important;
}
::v-deep .pagination-container {
  background: top;
}
::v-deep .el-table {
  opacity: 0.85;
}
.span {
  overflow: hidden; /*超出的部分隐藏起来。*/
  white-space: nowrap; /*不显示的地方用省略号...代替*/
  text-overflow: ellipsis; /* 支持 IE */
}
.hamburger-container {
  float: left;
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.pagination-container {
  padding: 0 !important;
  margin: 0 !important;
}
.leftHide{
  position: absolute;
  top: 35px;
  right: -28px;
}
.rightHide{
    position: absolute;
    top: -59%;
    right: 2%
}
.leftHide1{
  width: 100%;
}
.leftHide2{
  width: 75%;
}
</style>
