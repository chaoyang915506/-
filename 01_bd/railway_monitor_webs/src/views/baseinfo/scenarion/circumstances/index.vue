<template>
  <div class="app-container" v-loading="loading">
    <!-- 图标 -->
    <div class="elcard_display">
      <echarts-pictorial-bar
        class="box_plane"
        :echartData="sceneData"
      ></echarts-pictorial-bar>

      <echarts-pictorial-bar
        class="box_plane"
        :echartData="weatherData"
      ></echarts-pictorial-bar>
      <echarts-pictorial-bar
        class="box_plane"
        :echartData="textureData"
      ></echarts-pictorial-bar>
    </div>
    <!--搜索框 -->
    <el-form :inline="true" size="normal">
      <el-form-item>
        <el-select
          placeholder="请选择搜索类型"
          v-model="moldAll"
          @change="SelectChange"
        >
          <el-option label="按种类" value="1"></el-option>
          <el-option label="按时间" value="2"></el-option>
          <!-- <el-option label="按组态" value="3"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="timeline_css"
          v-if="moldAll == 2"
          v-model="timePicker"
          type="daterange"
          range-separator="-"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          @change="getDate"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :size="size"
        />
        <el-select
          v-if="moldAll == 1"
          v-model="config"
          @change="configChange"
          placeholder="请选择组态类型"
          clearable
        >
          <el-option label="异物组态" value="1"> </el-option>
          <el-option label="场景组态" value="2"> </el-option>
          <el-option label="气象组态" value="3"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="queryParams.simulationName"
          v-if="moldAll == 1"
        >
          <el-option
            v-for="item in configuartion"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="getList"
          >确定</el-button
        ></el-form-item
      >
      <el-form-item style="float: right">
        <el-select class="select_pic" v-model="pic_data" filterable>
          <el-option label="大图" value="0"></el-option>
          <el-option label="小图" value="1"></el-option>
          <el-option label="列表" value="2"></el-option>
          <el-option label="详细信息" value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 图片集 -->
    <div style="width: 100%">
      <!-- 大图 -->
      <div v-if="pic_data == '0'" class="piclist_sum">
        <div class="list_pic" v-for="i in allDataList" :key="i.id">
          <div class="pic_body" @click="viewDetails(i)">
            <el-image :src="i.image" fit="contain" :lazy="true"></el-image>
            <div class="shade">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <img
                  style="width: 1.875rem"
                  src="../../../../assets/icons/svg/heavyfog.svg"
                  alt=""
                />
                <span>{{ i.simulationName }}</span>
              </div>
              <div>
                <span>能见度: {{ i.visibility }}</span>
              </div>
              <!-- <div>
                <span>数据来源: {{ i.dataSources }}</span>
              </div> -->
            </div>
          </div>
          <div class="info">{{ i.simulationName }}</div>
        </div>
      </div>
      <!-- 小图 -->
      <div v-if="pic_data == '1'" class="piclist_sum_small">
        <div class="list_pic_small" v-for="i in allDataList" :key="i.id">
          <div class="pic_body" @click="viewDetails(i)">
            <el-image :src="i.image" fit="contain" :lazy="true"></el-image>
          </div>
          <div class="info_samll">
            <span>{{ i.simulationName }}</span>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div v-if="pic_data == '2'">
        <div class="list_pic_list" v-for="i in allDataList" :key="i.id">
          <div class="pic_body_list" @click="viewDetails(i)">
            <el-icon color="white"><PictureFilled /></el-icon>
            &nbsp;
            <span>{{ i.simulationName }}</span>
            <div class="info_list">
              <el-button type="text" @click="viewDetails(i)">查看</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细详细 -->
      <div v-if="pic_data == '3'">
        <table style="width: 100%">
          <tr>
            <th></th>
            <th>名称</th>
            <th>仿真结果描述</th>
            <th>检出率</th>
            <th>操作</th>
          </tr>
          <tbody>
            <tr v-for="i in allDataList" :key="i.id">
              <td>
                <el-icon color="white"><PictureFilled /> </el-icon>
              </td>
              <td>{{ i.simulationName }}</td>
              <td class="pic_details">
                {{ i.simulationDescribe }}
              </td>
              <td>{{ i.detectionRate }}</td>
              <td>
                <el-button size="small" type="text" @click="viewDetails(i)"
                  >查看</el-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 查看 -->
    <el-dialog v-model="check_details" title="查看">
      <el-row :gutter="24" justify="center">
        <el-col :span="12">
          <el-form
            :model="formData"
            ref="formDataRef"
            label-position="left"
            label-width="30%"
            :inline="false"
            size="normal"
          >
            <el-form-item label="仿真ID">
              <span class="detail_style">{{ formData.simulationId }}</span>
            </el-form-item>
            <el-form-item label="仿真名称">
              <span class="detail_style">{{ formData.simulationName }}</span>
            </el-form-item>
            <el-form-item label="情景名称">
              <span class="detail_style">{{ formData.simulationName }}</span>
            </el-form-item>
            <el-form-item label="运用算法">
              <span class="detail_style">{{ formData.algorithm }}</span>
            </el-form-item>
            <el-form-item label="检出率">
              <span class="detail_style">{{ formData.detectionRate }}</span>
            </el-form-item>
            <el-form-item label="风险阈值">
              <span class="detail_style">{{ formData.riskThreshold }}</span>
            </el-form-item>
            <el-form-item label="应急预案">
              <span class="detail_style">{{ formData.planId }}</span>
            </el-form-item>
            <el-form-item label="仿真结果描述">
              <span class="detail_style">{{
                formData.simulationDescribe
              }}</span>
            </el-form-item>
            <el-form-item label="温度">
              <span class="detail_style">{{ formData.temperature }}</span>
            </el-form-item>
            <el-form-item label="相对湿度">
              <span class="detail_style">{{ formData.relativeHumidity }}</span>
            </el-form-item>
            <el-form-item label="气压">
              <span class="detail_style">{{ formData.airPressure }} </span>
            </el-form-item>
            <el-form-item label="风向">
              <span class="detail_style">{{ formData.windDirection }} </span>
            </el-form-item>
            <el-form-item label="风速">
              <span class="detail_style">{{ formData.windSpeed }} </span>
            </el-form-item>
            <el-form-item label="雨量">
              <span class="detail_style">{{ formData.snowDepth }} </span>
            </el-form-item>
            <el-form-item label="雪深(cm)">
              <span class="detail_style">{{ formData.snowDepth }} </span>
            </el-form-item>
            <el-form-item label="能见度(m)">
              <span class="detail_style">{{ formData.visibility }} </span>
            </el-form-item>
            <el-form-item label="雨雪检测">
              <span class="detail_style"
                >{{ findrainsnow(formData.rainSnowDetect) }}
              </span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import EchartsPictorialBar from "@/components/EchartsPictorialBar/index.vue";
import { formatterWeather, fomattertexture } from "./index.js";
import { toflowData } from "../js/binary";
import {
  getenvironment,
  getweatherCount,
  getenvironmentCount,
  getsystemlist,
  getconfigurationCount,
  getWeatherconfig,
  getFormattconfig,
  getSceneconfig,
} from "@/api/baseinfo/scenarion.js";
const { proxy } = getCurrentInstance();
const {
  facility_type,
  texture,
  scene_type,
  RainStatus,
  WindStatus,
  FogStatus,
  SnowStatus,
  weather,
} = proxy.useDict(
  "facility_type",
  "scene_type",
  "SnowStatus",
  "FogStatus",
  "RainStatus",
  "WindStatus",
  "texture",
  "weather"
);

// 组态切换
const configChange = (e) => {
  data.queryParams.simulationName = "";
  if (e == 1) {
    data.configuartion = texture.value;
  } else if (e == 2) {
    data.configuartion = scene_type.value;
  } else if (e == 3) {
    data.configuartion = weather.value;
  }
};
const findrainsnow = (i) => {
  if (i == 0) {
    return "无降水";
  } else if (i == 1) {
    return "有降水";
  } else {
    return "未知";
  }
};
//日期选择器
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};
const data = reactive({
  config: "",
  // 组态信息
  configuartion: [],
  moldAll: "",
  loading: false,
  allDataList: [], //全部的列表数据
  queryParams: {
    facilityId: "",
    beginTime: "",
    endTime: "",
    simulationName: "",
  },
  //起始时间
  timePicker: [],
  pic_data: "0",
  //点击查看
  check_details: false,
  formData: {},
  //气象表
  weatherData: {
    xAxisData: [],
    seriesData: [],
    axisLine: false,
    title: "气象组态",
  },
  //异物表
  textureData: {
    xAxisData: [],
    seriesData: [],
    axisLine: false,
    title: "异物组态",
  },
  sceneData: {
    xAxisData: [],
    seriesData: [],
    axisLine: false,
    title: "场景组态",
  },
  //下拉
  SelectWeatherData: [],
  weatherState: "",
});
const {
  weatherData,
  weatherState,
  pic_data,
  formData,
  check_details,
  moldAll,
  sceneData,
  textureData,
  queryParams,
  loading,
  allDataList,
  timePicker,
  configuartion,
  config,
} = toRefs(data);

//获取列表的数据
function getList() {
  data.loading = true;
  getsystemlist({ ...data.queryParams }).then((res) => {
    // console.log(res, "查询数据");
    data.loading = false;
    data.allDataList = res.rows.map((i) => {
      return {
        ...i,
        image: toflowData(i.file ? i.file.fileBytes : ""),
      };
    });
  });
}
getList();
function SelectChange() {
  data.queryParams.facilityId = "";
  data.queryParams.endTime = "";
  data.queryParams.beginTime = "";
  data.queryParams.simulationName = "";
  data.timePicker = [];
}

function formatterDict(data, key) {
  const findData = data.find((i) => i.value == key);
  return findData ? findData.label : "空";
}
// 查看、
const viewDetails = (item) => {
  console.log(item);
  data.formData = item;
  data.check_details = true;
};

// async function getconfig(key) {
//   const res = await getconfigurationCount({ type: key });
//   // console.log(res, "count");
//   if (key == "weather") {
//     let dat = formatterWeather(res.data, objweather);
//     // console.log(dat, "最终");
//     data.weatherData.xAxisData = dat.map((i) => i.keyname);
//     data.weatherData.seriesData = dat.map((i) => i.count);
//   } else if (key == "texture") {
//     // console.log(res.data, "texture");
//     // console.log(texture.value, "texture字典");
//     const arrdata = fomattertexture(res.data, texture.value, "texture");
//     // console.log(arrdata, "处理好的数据");

//     data.textureData.xAxisData = arrdata.map((i) => i.keyname);
//     data.textureData.seriesData = arrdata.map((i) => i.count);
//   } else if (key == "scene_type") {
//     const arrdata = fomattertexture(res.data, scene_type.value, "scene_type");
//     // console.log(res, "allscene");
//     data.sceneData.xAxisData = arrdata.map((i) => i.keyname);
//     data.sceneData.seriesData = arrdata.map((i) => i.count);
//   }
// }

function formatterList(data, arr, keyname) {
  let newarr = [];
  arr.forEach((i) => {
    const findData = data.find((i) => i.value == i[keyname]);

    //为了页面好看后期改成空或者天气
    newarr.push({
      name: findData ? findData.label : i[keyname],
      count: i.count,
    });
  });
  // console.log(newarr, "newarr");
  return newarr;
}
// getconfig("weather", "weatherData");
// getconfig("texture", "textureData");
// getconfig("scene_type", "sceneData");

getWeatherconfig().then((res) => {
  // console.log(res, "气象组态", "weather_type");
  // console.log(weather.value,'allweat');
  data.weatherData.seriesData = res.data.map((i) => i.count);
  data.weatherData.xAxisData = res.data.map((i) => {
    return formatterDict(weather.value, i.weather_type);
  });
});
getFormattconfig().then((res) => {
  // console.log(res, "异物组态foreign_matter_type");
  data.textureData.xAxisData = res.data.map((i) => {
    return formatterDict(texture.value, i.foreign_matter_type);
  });
  data.textureData.seriesData = res.data.map((i) => i.count);
});
getSceneconfig().then((res) => {
  // console.log(res, "场景组态foreign_matter_type");
  data.sceneData.xAxisData = res.data.map((i) => {
    return formatterDict(scene_type.value, i.scene_type);
  });
  data.sceneData.seriesData = res.data.map((i) => i.count);
});
</script>

<style scoped>
@import url("../css/same.css");

.elcard_display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.box_plane {
  display: flex;
  justify-content: center;
  /* display: inline-block; */
  width: 30%;
  box-shadow: 3px 3px 5px #bbb, -3px -3px 7px #bbb;
  height: 12.5rem;
  margin-right: 10px;
  align-items: center;
  padding: 0 0.625rem;
}
.box_plane:nth-child(2) {
  width: 40%;
}
.box_plane:nth-child(3) {
  margin-right: 0;
}
.detail_style {
  color: white;
}
.select_pic {
  width: 100px;
  position: absolute;
  right: 2%;
}
</style>