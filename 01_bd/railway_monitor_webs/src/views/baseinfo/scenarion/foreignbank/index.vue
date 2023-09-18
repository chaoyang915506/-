<template>
  <div class="app-container" v-loading="loading">
    <!-- 图标 -->
    <div class="icon_list_style">
      <weather-icon
        v-for="(i, j) in textureData"
        :key="j"
        :texture="i.texture"
        :count="i.count"
      ></weather-icon>
    </div>
    <!--搜索框 -->
    <el-form label-width="80px" :inline="true" size="normal">
      <el-form-item label="">
        <el-select placeholder="" v-model="moldAll" @change="SelectChange">
          <el-option label="按种类" value="1"></el-option>
          <el-option label="按添加时间" value="2"></el-option>
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
          clearable
        />

        <el-select
          v-if="moldAll == 1"
          clearable
          placeholder="请选择异物类型"
          v-model="queryParams.foreignMatterType"
        >
          <el-option
            v-for="item in texture"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary" class="btn_submit"
          @click="getList"
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
            <el-image
              :src="i.image"
              fit="contain"
              :lazy="true"
            ></el-image>

            <div class="shade">
              <div>
                <span>材质类别: {{ i.foreignMatterType }}</span>
              </div>
              <div>
                <span>异物描述: {{ i.foreignMatterDescription }}</span>
              </div>
              <div>
                <span>数据来源: {{ i.dataSource }}</span>
              </div>
            </div>
          </div>
          <div class="info">{{ i.foreignMatterType }}</div>
        </div>
      </div>
      <!-- 小图 -->
      <div v-if="pic_data == '1'" class="piclist_sum_small">
        <div class="list_pic_small" v-for="i in allDataList" :key="i.id">
          <div class="pic_body" @click="viewDetails(i)">
             <el-image
              :src="i.image"
              fit="contain"
              :lazy="true"
            ></el-image>
          </div>
          <div class="info_samll">
            {{ i.foreignMatterType }}
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div v-if="pic_data == '2'">
        <div class="list_pic_list" v-for="i in allDataList" :key="i.id">
          <div class="pic_body_list" @click="viewDetails(i)">
            <el-icon color="white"><PictureFilled /></el-icon>
            &nbsp;
            <span class="name_list"> {{ i.foreignMatterType }}</span>
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
              <td>{{ i.foreignMatterType }}</td>
              <td class="pic_details">
                {{ i.foreignMatterDescription }}
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
            <el-form-item label="异物类型">
              <span class="detail_style"
                >{{ formData.foreignMatterType }}
              </span>
            </el-form-item>
            <el-form-item label="异物来源">
              <span class="detail_style"
                >{{ formData.foreignMatterSource }}
              </span>
            </el-form-item>
            <el-form-item label="尺寸">
              <span class="detail_style">{{ formData.volume }} </span>
            </el-form-item>
            <el-form-item label="侵限区域">
              <span class="detail_style">{{ formData.conLimitArea }} </span>
            </el-form-item>
            <el-form-item label="异物风险描述">
              <span class="detail_style"
                >{{ formData.foreignMatterDescription }}
              </span>
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
import { getCurrentInstance, toRefs } from "vue";
import { toflowData } from "../js/binary";
import {
  getforeign,
  addforeign,
  textureCount,
} from "@/api/baseinfo/scenarion.js";
const { proxy } = getCurrentInstance();
const { texture, monitoring_route } = proxy.useDict(
  "texture",
  "monitoring_route"
);

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
  timePicker: [],
  // errorImg: true, //出错的时候触发
  textureData: [], //异物数量
  moldAll: "1",
  allDataList: [], //全部的列表数据
  queryParams: {
    foreignMatterType: "",
    beginTime: "",
    endTime: "",
  },
  loading: false,
  pic_data: "0",
  //点击查看
  check_details: false,
  formData: {},
  //测试二进制流图片
  testimg: "",
});
const {
  testimg,
  loading,
  weatherData,
  pic_data,
  formData,
  check_details,
  moldAll,
  textureData,
  queryParams,
  allDataList,
  timePicker,
} = toRefs(data);

//获取列表数据
function getList() {
  data.loading = true;
  getforeign({ ...data.queryParams, circumstancesType: 1 })
    .then((res) => {
      // console.log(res, "全部列表数据");

      data.allDataList = res.rows.map((i) => {
        return {
          ...i,
          image: toflowData(i.file ? i.file.fileBytes : ""),
        };
      });
      data.loading = false;
    })
    .catch((err) => {
      data.loading = false;
    });
}

function SelectChange() {
  data.queryParams.foreignMatterType = "";
  data.queryParams.endTime = "";
  data.queryParams.beginTime = "";
  data.timePicker = [];
}

//全部的异物数据
textureCount().then((res) => {
  // console.log(res, "全部icon数据");
  // console.log(texture.value, "全部异物")
  let resdata = res.data.map((i) => {
    return {
      texture: i.foreign_matter_type,
      count: i.count,
    };
  });
  resdata.unshift({
    texture: "总数",
    count: eval(resdata.map((i) => i.count).join("+")),
  });
  data.textureData = resdata;
});
//查数据
function formatterDict(data, key) {
  const findData = data.find((i) => i.value == key);
  return findData ? findData.label : "无";
}
// 查看、
const viewDetails = (item) => {
  data.formData = item;
  data.check_details = true;
};
getList();
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