<template>
  <div class="fz-container">
    <div class="fullscreen-app-container">
      <!-- --搜索框 -->
      <div class="search-class">
        <el-input
          style="width: 200px"
          placeholder="请输入监测点"
          v-model="searchValue"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="handleSearch"
              ><search
            /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="display-center">
        <!-- 真实设备 仿真设备统计 -->
        <div class="equipment-warning-class">
          <div>
            <span>真实设备</span>
            <span ref="realEquipment">{{
              EquipmentStatistics && EquipmentStatistics[0]
                ? getAnimateValue("realEquipment", EquipmentStatistics[0].count)
                : 0
            }}</span>
            <!-- <span>{{ item.isShow }}</span> -->
          </div>
          <div>
            <span>仿真设备</span>

            <span ref="fzEquipment">{{
              EquipmentStatistics && EquipmentStatistics[1]
                ? getAnimateValue("fzEquipment", EquipmentStatistics[1].count)
                : 0
            }}</span>
            <!-- <span>{{ item.isShow }}</span> -->
          </div>
        </div>
        <div>
          <echartsMap
            ref="echartmap"
            @handleIsShowLenged="handleIsShowLenged"
            :isMapOrSiteMap="isMapOrSiteMap"
            :sendSearchValue="sendSearchValue"
            @getAllLinesData="getAllLinesData"
            @getSelectLineData="getSelectLineData"
            :checkedLines="checkedLines"
          ></echartsMap>
        </div>

        <div class="back-class" @click="goBack" v-show="isShowLenged">返回</div>
        <!-- 地图切换容器 -->
        <div class="map-switch-class">
          <img
            src="./../../assets/images/display/map-switch.svg"
            @click="isMapChange = !isMapChange"
            alt=""
          />
          <transition name="el-zoom-in-center">
            <div class="map-sitemap" v-show="isMapChange">
              <div @click="handleChangeMap(true)">
                <img
                  src="./../../assets/images/display/u140.png"
                  alt=""
                  srcset=""
                />
                <span>电子地图</span>
              </div>
              <div @click="handleChangeMap(false)">
                <img
                  src="./../../assets/images/display/u139.png"
                  alt=""
                  srcset=""
                />
                <span>影像图</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- 筛选容器 -->
        <div class="map-filter-class">
          <img
            src="../../../assets/images/overview/filter-class.svg"
            alt=""
            @click="isFilterMapChange = !isFilterMapChange"
          />
          <transition name="el-zoom-in-center">
            <div class="filter-sitemap" v-show="isFilterMapChange">
              <div class="filter-sitemap-title">路线筛选</div>
              <div>
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >全部</el-checkbox
                >
                <el-checkbox-group
                  v-model="checkedLines"
                  class="check-class-vertical"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox
                    v-for="item in allLinesData"
                    :key="item.id"
                    :label="item.id"
                    >{{ item.lineName }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import echartsMap from "./handle/echartsMap.vue";
// import { onMounted, ref, reactive } from "vue";
import { getEquipmentCount } from "@/api/simulationOverview/Overview.js";

let { proxy } = getCurrentInstance();

let isMapOrSiteMap = ref(true);
let isMapChange = ref(false);
let isShowLenged = ref(false);
let isFilterMapChange = ref(false);
let isCollesBanner = ref(true);
const isIndeterminate = ref(false);
const allLinesData = ref([]);
const EquipmentStatistics = ref([]);
const searchValue = ref("");
const sendSearchValue = ref("");
const checkedLines = ref([]);
const checkAll = ref(false);
let currentMoniter = ref(null);
const handleCheckAllChange = (val) => {
  checkedLines.value = val ? allLinesData.value.map((item) => item.id) : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allLinesData.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allLinesData.value.length;
};
// 地图切换
const handleChangeMap = (val) => {
  isMapOrSiteMap.value = val;
};
// 获取选中线路
function getSelectLineData(val) {
  checkedLines.value = [val];
  handleCheckedCitiesChange(checkedLines.value);
}
// 获取所有路线
const getAllLinesData = (val) => {
  checkedLines.value = [];
  allLinesData.value = val;
  if (val && val.length) {
    val.forEach((item) => {
      checkedLines.value.push(item.id);
    });
    handleCheckedCitiesChange(val);
  }
  // let res = await getAllLines();
  // if (res.code == 200) {
  // }
};
// 搜索监测点
const handleSearch = (e) => {
  // console.log("触发", e);
  sendSearchValue.value = searchValue.value;
};
// 设备总数和报警监测点
const getFacAndWarnMonitorData = async () => {
  let res = await getEquipmentCount();
  if (res.code == 200) {
    EquipmentStatistics.value = res.data;
  }
};
// 自增数字动画
function getAnimateValue(dom, value) {
  nextTick(() => {
    return proxy.animateValue(proxy.$refs[dom], 0, value, 3000);
  });
}
// 是否展示图例
const handleIsShowLenged = (val) => {
  isShowLenged.value = val;
};

onMounted(() => {
  getFacAndWarnMonitorData();
});
const echartmap = ref(null); //地图
const goBack = () => {
  echartmap.value.getInitList();
  echartmap.value.expcloseInfoWindow();
};
</script>
<style scoped>
@import "css/index.css";
</style>