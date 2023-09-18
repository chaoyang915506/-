<template>
  <div class="app-container" v-loading="loading">
    <!-- 图标 -->
    <div class="icon_list_style">
      <weather-icon
        v-for="(i, j) in textureData"
        :key="j"
        :texture="i.sceneType"
        :count="i.count"
      ></weather-icon>
    </div>
    <!--搜索框 -->
    <el-form :model="form" label-width="80px" :inline="true" size="normal">
      <el-form-item label="">
        <el-select
          v-model="moldAll"
          @change="SelectChange"
          placeholder="请选择搜索类型"
        >
          <el-option label="按种类" value="1"></el-option>
          <el-option label="按添加时间" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
         class="timeline_css"
          v-if="moldAll == 2"
          v-model="timePicker"
          clearable
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
          placeholder="请选择场景种类"
          v-model="queryParams.sceneType"
          clearable
        >
          <el-option
            v-for="item in scene_type"
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
            <!-- <el-image :src="i.pic" style="width: 100%; height: 100%" /> -->
            <el-image
              :src="i.pic"
              fit="fill"
              :lazy="true"
              style="width: 100%; height: 100%"
            ></el-image>
            <div class="shade">
              <div>
                <span>场景描述: {{ i.sceneDescription }}</span>
              </div>
              <div>
                <span>数据来源: {{ i.dataSource }}</span>
              </div>
            </div>
          </div>
          <div class="info">{{ i.sceneType }}</div>
        </div>
      </div>
      <!-- 小图 -->
      <div v-if="pic_data == '1'" class="piclist_sum_small">
        <div class="list_pic_small" v-for="i in allDataList" :key="i.id">
          <div class="pic_body" @click="viewDetails(i)">
            <el-image
              :src="i.pic"
              fit="fill"
              :lazy="true"
              style="width: 100%; height: 100%"
            ></el-image>
          </div>
          <div class="info_samll">
            {{ i.sceneType }}
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
              {{ i.sceneType }}
            </span>
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
            <th>描述</th>
            <th>来源</th>
            <th>操作</th>
          </tr>
          <tbody>
            <tr v-for="i in allDataList" :key="i.id">
              <td>
                <el-icon color="white"><PictureFilled /> </el-icon>
              </td>
              <td>{{ i.sceneType }}</td>
              <td class="pic_details">
                {{ i.sceneDescription }}
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
            <el-form-item label="数据来源">
              <span class="detail_style">{{ formData.dataSource }}</span>
            </el-form-item>

            <el-form-item label="场景类型">
              <span class="detail_style">{{ formData.sceneType }} </span>
            </el-form-item>
            <el-form-item label="场景风险描述">
              <span class="detail_style">{{ formData.sceneDescription }} </span>
            </el-form-item>
            <el-form-item label="应用">
              <span class="detail_style">{{ formData.application }} </span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import { scencelist, scenceCount } from "@/api/baseinfo/scenarion.js";
const { proxy } = getCurrentInstance();
const {
  Inspectionpoint_search_type,
  facility_type,
  monitoring_route,
  scene_type,
} = proxy.useDict(
  "Inspectionpoint_search_type",
  "facility_type",
  "monitoring_route",
  "scene_type"
);
import { toflowData } from "../js/binary";

const data = reactive({
  timePicker: [],
  textureData: [], //异物数量
  moldAll: "1",
  allDataList: [], //全部的列表数据
  queryParams: {
    sceneType: "",
    beginTime: "",
    endTime: "",
  },
  pic_data: "0",
  //点击查看
  check_details: false,
  formData: {},
  loading: false,
});
const {
  weatherData,
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
} = toRefs(data);

//列表数据
function getList() {
  data.loading = true;
  scencelist({ circumstancesType: "0", ...data.queryParams })
    .then((res) => {
      // console.log(res);
      data.allDataList = res.rows.map((i) => {
        return {
          ...i,
          pic: toflowData(i.file ? i.file.fileBytes : ""),
        };
      });
      data.loading = false;
    })
    .catch((err) => {
      data.loading = false;
    });
}
getList();
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
//重新选择类型后重置
function SelectChange() {
  data.queryParams.sceneType = "";
  data.queryParams.endTime = "";
  data.queryParams.beginTime = "";
  data.timePicker = [];
}
//查询洞口等
const findscence = (val) => {
  let resul = scene_type.value.find((item) => val == item.value);
  return resul ? resul.label : "无";
};

//全部的场景数据
scenceCount().then((res) => {
  // console.log(res, "场景类型");
  let arr = res.data;
  // .map((i) => {
  //   // let resul = scene_type.value.find((item) => i.sceneType == item.value);
  //   return {
  //     ...i,
  //     sceneType: resul ? resul.label : "空",
  //   };
  // });
  arr.unshift({
    sceneType: "总数",
    count: eval(arr.map((i) => i.count).join("+")),
  });
  data.textureData = arr;
});

function formatterDict(data, key) {
  const findData = data.find((i) => i.value == key);
  return findData ? findData.label : "无";
}
// 查看、
const viewDetails = (item) => {
  console.log(item, "chakan");
  data.formData = item;
  data.check_details = true;
};
</script>

<style scoped>
@import url("../css/same.css");
.icon_list_style {
  display: flex;
  margin-bottom: 10px;
}
.detail_style {
  color: white;
}
</style>