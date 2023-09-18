<template>
  <div class="app-container" v-loading="loading">
    <!-- 图标 -->
    <div class="elcard_display">
      <div class="box_plane">
        <div class="title_header">气象库统计</div>
        <weather-icon
          v-for="(i, j) in weatherData"
          :key="j"
          :texture="i.name"
          :count="i.count"
        ></weather-icon>
      </div>
      <!-- 自然环境库统计 -->
      <echartsPictorialBar
        class="box_plane"
        :echartData="WeatherDisaster"
      ></echartsPictorialBar>
    </div>

    <!--搜索框 -->
    <el-form :inline="true" size="normal">
      <el-form-item>
        <el-select placeholder="" v-model="moldAll" @change="SelectChange">
          <el-option label="按种类" value="1"></el-option>
          <el-option label="按添加时间" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker class="timeline_css"
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
          clearable
        />
        <el-select
          v-if="moldAll == 1"
          placeholder=""
          v-model="queryParams.type"
          clearable
        >
          <el-option label="雨数据集" value="rain"> </el-option>
          <el-option label="雾数据集" value="fog"> </el-option>
          <el-option label="雪数据集" value="snow"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn_submit" @click="getList"
          >确定</el-button
        ></el-form-item
      >
      <el-form-item style="float: right; width: 130px">
        <el-select v-model="pic_data" filterable>
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
                  style="width: 30px"
                  src="../../../../assets/icons/svg/heavyfog.svg"
                  alt=""
                />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span> {{ i.weatherState }}</span>
                <!-- <span
                  v-if="formatterDict(FogStatus, i.rainStatus) != '空'"
                  style="margin: 0 0 0 10px; color: #27a8a4"
                  >{{ formatterDict(RainStatus, i.rainStatus) }}
                </span>
                <span
                  v-if="formatterDict(FogStatus, i.fogStatus) != '空'"
                  style="margin: 0 0 0 10px; color: #27a8a4"
                  >{{ formatterDict(FogStatus, i.fogStatus) }}</span
                >
                <span
                  v-if="formatterDict(WindStatus, i.windStatus) != '空'"
                  style="margin: 0 0 0 10px; color: #27a8a4"
                  >{{ formatterDict(WindStatus, i.windStatus) }}</span
                >
                <span
                  v-if="formatterDict(SnowStatus, i.snowStatus) != '空'"
                  style="margin: 0 0 0 10px; color: #27a8a4"
                  >{{ formatterDict(SnowStatus, i.snowStatus) }}</span
                > -->
              </div>
              <div>
                <span>能见度: {{ i.visibility }}</span>
              </div>
              <div>
                <span>数据来源: {{ i.dataSource }}</span>
              </div>
            </div>
          </div>
          <div class="info">
            <span>{{ i.weatherState }}</span>
            <!-- <span v-if="formatterDict(FogStatus, i.rainStatus) != '空'"
              >{{ formatterDict(RainStatus, i.rainStatus) }}
            </span>
            <span v-if="formatterDict(FogStatus, i.fogStatus) != '空'">{{
              formatterDict(FogStatus, i.fogStatus)
            }}</span>
            <span v-if="formatterDict(WindStatus, i.windStatus) != '空'">{{
              formatterDict(WindStatus, i.windStatus)
            }}</span>
            <span v-if="formatterDict(SnowStatus, i.snowStatus) != '空'">{{
              formatterDict(SnowStatus, i.snowStatus)
            }}</span> -->
          </div>
        </div>
      </div>
      <!-- 小图 -->
      <div v-if="pic_data == '1'" class="piclist_sum_small">
        <div class="list_pic_small" v-for="i in allDataList" :key="i.id">
          <div class="pic_body" @click="viewDetails(i)">
            <el-image :src="i.image" fit="contain" :lazy="true"></el-image>
          </div>
          <div class="info_samll">
            <span>{{ i.weatherState }}</span>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div v-if="pic_data == '2'">
        <div class="list_pic_list" v-for="i in allDataList" :key="i.id">
          <div class="pic_body_list" @click="viewDetails(i)">
            <el-icon color="white"><PictureFilled /></el-icon>
            &nbsp;
            <span class="name_list">
              <span>{{ i.weatherState }}</span>
            </span>
            <div class="info_list">
              <el-button type="text" @click="viewDetails">查看</el-button>
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
            <th>描述</th>
            <th>来源</th>
            <th>操作</th>
          </tr>
          <tbody>
            <tr v-for="i in allDataList" :key="i.id">
              <td>
                <el-icon color="white"><PictureFilled /> </el-icon>
              </td>
              <td>
                <span>{{ i.weatherState }}</span>
              </td>
              <td class="pic_details">
                {{ i.environmentDescription }}
              </td>
              <td>{{ i.dataSource }}</td>
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
            <el-form-item label="图片ID">
              <span class="detail_style">{{ formData.id }}</span>
            </el-form-item>
            <el-form-item label="数据来源">
              <span class="detail_style">{{ formData.dataSource }}</span>
            </el-form-item>
            <el-form-item label="气象状态">
              <span class="detail_style">{{ formData.dataSource }}</span>
            </el-form-item>
            <el-form-item label="能见度">
              <span class="detail_style">{{ formData.visibility }} </span>
            </el-form-item>
            <el-form-item label="大气参数">
              <span class="detail_style">{{ formData.atmosphereParam }} </span>
            </el-form-item>
            <el-form-item label="环境风险描述">
              <span class="detail_style">{{
                formData.environmentDescription
              }}</span>
            </el-form-item>
            <el-form-item label="应用">
              <span class="detail_style">{{ formData.application }}</span>
            </el-form-item>

            <!-- 雨级别 -->
            <!-- <el-form-item
              label="天气"
              v-if="formatterDict(RainStatus, formData.rainStatus) != '空'"
            >
              <span class="detail_style"
                >{{ formatterDict(RainStatus, formData.rainStatus) }}
              </span>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
// import { Picture as IconPicture } from "@element-plus/icons-vue";
import { toflowData } from "../js/binary";
import echartsPictorialBar from "@/components/EchartsPictorialBar/index.vue";
import { fomatterenv } from "./environment.js";

import {
  getenvironment,
  getweatherCount,
  getenvironmentCount,
} from "@/api/baseinfo/scenarion.js";
const { proxy } = getCurrentInstance();
const { facility_type, RainStatus, WindStatus, FogStatus, SnowStatus } =
  proxy.useDict(
    "SnowStatus",
    "FogStatus",
    "RainStatus",
    "WindStatus",
    "facility_type"
  );
const data = reactive({
  timePicker: [],
  WeatherDisaster: {
    axisLine: true,
    xAxisData: [],
    seriesData: [],
    title: "自然环境库统计",
  },
  textureData: [], //异物数量
  moldAll: "1",
  allDataList: [], //全部的列表数据
  queryParams: {
    type: "",
    beginTime: "",
    endTime: "",
  },
  pic_data: "0",
  //点击查看
  check_details: false,
  formData: {},
  //气象表
  weatherData: [],
  //下拉
  SelectWeatherData: [],
  weatherState: "",
  loading: false,
});
const {
  weatherData,
  weatherState,
  pic_data,
  datalist_pic,
  formData,
  check_details,
  moldAll,
  loading,
  textureData,
  queryParams,
  allDataList,
  timePicker,
  WeatherDisaster,
} = toRefs(data);
const getDate = (e) => {
  if (!e) {
    data.queryParams.beginTime = "";
    data.queryParams.endTime = "";
  } else {
    data.queryParams.beginTime = e[0];
    data.queryParams.endTime = e[1];
  }
};

//环境统计
getenvironmentCount().then((res) => {
  // console.log(res, "环境数据集");l
  // const objweather = {
  //   RainStatus: RainStatus.value,
  //   WindStatus: WindStatus.value,
  //   FogStatus: FogStatus.value,
  //   SnowStatus: SnowStatus.value,
  // };
  // let results = fomatterenv(res.data, objweather);
  data.WeatherDisaster.xAxisData = res.data.map((i) => i.weather_state);
  data.WeatherDisaster.seriesData = res.data.map((i) => i.count);
});
//列表数据
function getList() {
  data.loading = true;
  let copyparams = JSON.parse(JSON.stringify(data.queryParams));
  if (copyparams.windStatus >= 7) {
    copyparams.windStatus = 6;
  }
  getenvironment(copyparams)
    .then((res) => {
      data.loading = false;
      // console.log(JSON.stringify(res));
      data.allDataList = res.rows.map((i) => {
        return {
          ...i,
          image: toflowData(i.file ? i.file.fileBytes : ""),
        };
      });
    })
    .catch((err) => {
      data.loading = false;
    });
}
getList();
function SelectChange() {
  data.queryParams.type = "";
  data.queryParams.endTime = "";
  data.queryParams.beginTime = "";
  data.timePicker = [];
  data.weatherState = "";
}
//气象统计
getweatherCount().then((res) => {
  // console.log(JSON.stringify(res), "气象");
  let arrlist = [];
  for (let key in res.data) {
    let kv = res.data[key];
    if (key == "fog") {
      arrlist.push({ name: "雾数据集", count: kv });
    } else if (key == "rain") {
      arrlist.push({ name: "雨数据集", count: kv });
    } else if (key == "snow") {
      arrlist.push({ name: "雪数据集", count: kv });
    } else if (key == "total") {
      arrlist.push({ name: "总数", count: kv });
    }
  }
  data.weatherData = arrlist.sort((a, b) => b.count - a.count);
  // data.weatherData = plusfn(res);
});

// function plusfn(res) {
//   let arr = [];
//   for (let key in res.data) {
//     let keyvalue = res.data[key];
//     if (key == "fogStatus") {
//       arr.push({ name: "雾数据集", count: keyvalue });
//     } else if (key == "rainStatus") {
//       arr.push({ name: "雨数据集", count: keyvalue });
//     } else if (key == "snowStatus") {
//       arr.push({ name: "雪数据集", count: keyvalue });
//     } else if (key == "windStatus") {
//       arr.push({ name: "风数据集", count: keyvalue });
//     }
//   }
//   arr.unshift({ name: "总数", count: eval(arr.map((i) => i.count).join("+")) });
//   return arr;
// }
//处理气象统计的数据
// function forttartData() {
//   let arrlist = [];
//   for (let key in res.data) {
//     if (key == "fogStatus") {
//       arrlist.push({ name: "雾", count: res.data[key] });
//     } else if (key == "rainStatus") {
//       arrlist.push({ name: "雨", count: res.data[key] });
//     } else if (key == "snowStatus") {
//       arrlist.push({ name: "雪", count: res.data[key] });
//     } else if (key == "windStatus") {
//       arrlist.push({ name: "风", count: res.data[key] });
//     }
//   }
//   arrlist.unshift({
//     name: "总数",
//     count: eval(arrlist.map((i) => i.count).join("+")),
//   });
//   return arrlist;
// }

function formatterDict(data, key) {
  const findData = data.find((i) => i.value == key);
  return findData ? findData.label : "空";
}
// 编辑查看、
const viewDetails = (item) => {
  // console.log(item);
  data.formData = item;
  data.check_details = true;
};
</script>


<style scoped>
@import url("../css/same.css");

.elcard_display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
:deep(.box-card) {
  flex: 0.5;
  margin-right: 10px;
}
.box_plane {
  position: relative;
  display: flex;
  justify-content: center;
  /* display: inline-block; */
  width: 48%;
  box-shadow: 3px 3px 5px #bbb, -3px -3px 7px #bbb;
  height: 200px;
  align-items: center;
  padding: 0 10px;
}
.box_plane:nth-child(1) {
  justify-content: space-around;
}
.detail_style {
  color: white;
}
.title_header {
  position: absolute;
  color: #b6bdbf;
  font-size: 14px;
  left: 3%;
  top: 1%;
  font-weight: 700;
}

.icon_list_style {
  width: 98%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1%;
}
.mr-1 {
  margin-right: 10px;
}
</style>