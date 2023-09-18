<template>
  <div>
    <div class="popup" ref="popup" v-if="massage && !massage.single">
      <h3
        style="margin: 0; text-align: center"
        v-if="!store.state.mapbox.isShowSelectTimer"
      >
        {{ massage.carrierType === "2" ? "航标信息" : "船舶信息" }}
        <div class="icon" :style="massage.bdsCardState === 3 ? 'background:red':'background:green'"></div>
      </h3>
      <hr v-if="!store.state.mapbox.isShowSelectTimer" />
      <div class="popup-message" v-if="!store.state.mapbox.isShowSelectTimer">
        <div class="left">
          <div class="item-div">
            <span class="item-span">单位名称：</span>
            <span class="item-span">{{
              massage.deptName ? massage.deptName : "暂无"
            }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">名称：</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="massage.carrierName"
              placement="bottom"
            >
              <span class="item-span">{{
                massage.carrierName
              }}</span></el-tooltip
            >
          </div>
          <div class="item-div">
            <span class="item-span">北斗卡号：</span>
            <span class="item-span">{{ massage.bdsNumber }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">经度：</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="massage.lon"
              placement="bottom"
            >
              <span class="item-span">{{ massage.lon }}</span></el-tooltip
            >
          </div>
          <div class="item-div">
            <span class="item-span">纬度：</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="massage.lat"
              placement="bottom"
            >
              <span class="item-span">{{ massage.lat }}</span></el-tooltip
            >
          </div>
          <div class="item-div">
            <span class="item-span">蓄电池电压：</span>
            <span class="item-span">{{ massage.batterVoltage + "v" }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">负载电压：</span>
            <span class="item-span">{{
              massage.batteryLoadVoltage + "v"
            }}</span>
          </div>
        </div>
        <div class="right">
          <div class="item-div">
            <span class="item-span">充电电池：</span>
            <span class="item-span">{{ massage.sunCurrent }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">灯器亮度：</span>
            <span class="item-span">{{ massage.light }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">负载电池：</span>
            <span class="item-span">{{ massage.loadCurrent }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">环境温度：</span>
            <span class="item-span">{{ massage.temperature + "℃" }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">时间：</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="massage.sendTime"
              placement="bottom"
            >
              <span class="item-span">{{ massage.sendTime }}</span></el-tooltip
            >
          </div>
          <div class="item-div">
            <span class="item-span">北斗版本：</span>
            <span class="item-span">{{ massage.bdsVersion }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">速度：</span>
            <span class="item-span">{{ "暂无" }}</span>
          </div>
          <div class="item-div">
            <span class="item-span">航向：</span>
            <span class="item-span">{{ "暂无" }}</span>
          </div>
        </div>
      </div>
      <!-- 载体类型区分航标和船舶 区分功能按钮 1船舶 2航标 -->
      <!-- carrierType 1 -->
      <el-button
        v-if="
          massage.carrierType === '2' && !store.state.mapbox.isShowSelectTimer
        "
        type="primary"
        plain
        size="mini"
        @click="SendMessageHandle()"
        >航标状态召测</el-button
      >
      <el-button
        type="primary"
        plain
        size="mini"
        style="float: right"
        @click="lightHandle()"
        v-if="
          massage.carrierType === '2' && !store.state.mapbox.isShowSelectTimer
        "
        >灯器亮度设置</el-button
      >
      <el-button
        type="primary"
        plain
        size="mini"
        style="margin-left: 0; margin-top: 4px"
        @click="lightHandle('com')"
        v-if="
          massage.carrierType === '2' && !store.state.mapbox.isShowSelectTimer
        "
        >通信参数变更</el-button
      >
      <el-button type="primary" plain size="mini" @click="SendMessageHandle()"
        >&nbsp发送短报文&nbsp &nbsp
      </el-button>
      <el-button
        type="primary"
        plain
        size="mini"
        style="float: right"
        @click="queryTrackHandle()"
        >&nbsp &nbsp 查询轨迹&nbsp &nbsp
      </el-button>
      <el-button
        type="primary"
        plain
        size="mini"
        style="margin-top: 4px; margin-left: 0"
        v-if="!store.state.mapbox.isShowSelectTimer"
        >&nbsp短报文查询 &nbsp</el-button
      >
      <!--  弹出框 -->
      <el-card class="box-card" v-if="open">
        <div class="clearfix">
          <span>时间选择</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="queryTrackHandle"
            >关闭</el-button
          >
        </div>
        <el-date-picker
          v-model="pickerValue"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-card>
      <el-card class="box-card" v-if="isShowMessage">
        <el-form :model="form" label-width="83px" size="mini">
          <el-form-item label="发送类型">
            <el-select
              v-model="form.发送类型"
              placeholder="请输入发送类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in msg_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接收发类型">
            <el-select
              v-model="form.接收发类型"
              placeholder="请输入接收发类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in msg_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接发ID">
            <el-input
              v-model="form.接发ID"
              placeholder="请输入接发ID"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="消息内容">
            <el-input
              v-model="form.消息内容"
              placeholder="请输入消息内容"
              clearable
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="isShowMessage = false" size="mini"
            >取 消</el-button
          >
          <el-button @click="submitForm()" size="mini" style="float: right"
            >确 定</el-button
          >
        </div>
      </el-card>
      <!-- 灯器亮度设置 -->
      <el-card class="box-card" v-if="isShowLight">
        <h3 style="margin: 0; text-align: center">
          {{ showType == "com" ? "航标通信参数变更" : "灯器亮度设置" }}
        </h3>
        <hr />
        <el-form :model="form" label-width="83px" size="mini">
          <el-form-item label="发送类型" v-if="showType !== 'com'">
            <el-input
              v-model="form.发送类型"
              placeholder="请输入发送类型"
              clearable
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="回报频度" v-if="showType === 'com'">
           <el-input
              v-model="form.回报频度"
              placeholder="请输入回报频度"
              clearable
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间偏移" v-if="showType === 'com'">
           <el-input
              v-model="form.时间偏移"
              placeholder="请输入时间偏移"
              clearable
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="isShowLight = false;showType=null" size="mini">取 消</el-button>
          <el-button
            @click="isShowLight = false"
            size="mini"
            style="float: right"
            >确 定</el-button
          >
        </div>
      </el-card>
    </div>
    <!-- 多个样式 -->
    <div class="popup" ref="popup" v-if="massage && massage.single">
      <h3
        style="margin: 0; text-align: center"
        v-if="!store.state.mapbox.isShowSelectTimer && activeName === ''"
      >
        {{ carrierName }}
      </h3>
      <el-button
        type="primary"
        plain
        size="mini"
        style="margin-left: 78px; margin-top: 6px"
        @click="queryTrackHandle()"
         v-if="!store.state.mapbox.isShowSelectTimer && activeName === ''"
        >&nbsp &nbsp 查询轨迹&nbsp &nbsp
      </el-button>
      <div class="collapse" v-if="massage">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="item in massage.carrierArr"
            :key="item.id"
            :name="item.id"
            :title="item.bdsNumber"
          >
          {{item.bdsNumber}}
           <div class="icon" :style="item.bdsCardState === 3 ? 'background:red':'background:green'"></div>
            <div class="left">
              <div class="item-div">
                <span class="item-span">单位名称：</span>
                <span class="item-span">{{
                  item.deptName ? item.deptName : "暂无"
                }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">名称：</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.carrierName"
                  placement="bottom"
                >
                  <span class="item-span">{{
                    item.carrierName
                  }}</span></el-tooltip
                >
              </div>
              <div class="item-div">
                <span class="item-span">北斗卡号：</span>
                <span class="item-span">{{ item.bdsNumber }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">经度：</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.lon"
                  placement="bottom"
                >
                  <span class="item-span">{{ item.lon }}</span></el-tooltip
                >
              </div>
              <div class="item-div">
                <span class="item-span">纬度：</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.lat"
                  placement="bottom"
                >
                  <span class="item-span">{{ item.lat }}</span></el-tooltip
                >
              </div>
              <div class="item-div">
                <span class="item-span">蓄电池电压：</span>
                <span class="item-span">{{ item.batterVoltage + "v" }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">负载电压：</span>
                <span class="item-span">{{
                  item.batteryLoadVoltage + "v"
                }}</span>
              </div>
            </div>
            <div class="right">
              <div class="item-div">
                <span class="item-span">充电电池：</span>
                <span class="item-span">{{ item.sunCurrent }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">灯器亮度：</span>
                <span class="item-span">{{ item.light }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">负载电池：</span>
                <span class="item-span">{{ item.loadCurrent }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">环境温度：</span>
                <span class="item-span">{{ item.temperature + "℃" }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">时间：</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.sendTime"
                  placement="bottom"
                >
                  <span class="item-span">{{ item.sendTime }}</span></el-tooltip
                >
              </div>
              <div class="item-div">
                <span class="item-span">北斗版本：</span>
                <span class="item-span">{{ item.bdsVersion }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">速度：</span>
                <span class="item-span">{{ "暂无" }}</span>
              </div>
              <div class="item-div">
                <span class="item-span">航向：</span>
                <span class="item-span">{{ "暂无" }}</span>
              </div>
            </div>
            <div>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="SendMessageHandle()"
                style="margin-right: 10px"
                >&nbsp发送短报文&nbsp &nbsp
              </el-button>

              <el-button
                type="primary"
                plain
                size="mini"
                style="margin-top: 4px; margin-left: 0"
                v-if="!store.state.mapbox.isShowSelectTimer"
                >&nbsp短报文查询 &nbsp</el-button
              >
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 弹出层 -->
      <el-card class="box-card" v-if="open">
        <div class="clearfix">
          <span>时间选择</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="queryTrackHandle"
            >关闭</el-button
          >
        </div>
        <el-date-picker
          v-model="pickerValue"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-card>
      <el-card class="box-card" v-if="isShowMessage">
        <el-form :model="form" label-width="83px" size="mini">
          <el-form-item label="发送类型">
            <el-select
              v-model="form.发送类型"
              placeholder="请输入发送类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in msg_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接收发类型">
            <el-select
              v-model="form.接收发类型"
              placeholder="请输入接收发类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in msg_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接发ID">
            <el-input
              v-model="form.接发ID"
              placeholder="请输入接发ID"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="消息内容">
            <el-input
              v-model="form.消息内容"
              placeholder="请输入消息内容"
              clearable
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="isShowMessage = false" size="mini"
            >取 消</el-button
          >
          <el-button @click="submitForm()" size="mini" style="float: right"
            >确 定</el-button
          >
        </div>
      </el-card>
    </div>
    <!-- 框选样式 -->
    <div class="popup" ref="popup" v-if="!massage">
      <el-button
        type="primary"
        plain
        size="mini"
        @click="queryTrackHandle()"
        >&nbsp &nbsp 查询轨迹&nbsp &nbsp
      </el-button>
      <el-button style="float: right;" type="primary" plain size="mini" @click="SendMessageHandle()"
        >&nbsp发送短报文&nbsp &nbsp
      </el-button>
            <!--  弹出框 -->
      <el-card class="box-card" v-if="open">
        <div class="clearfix">
          <span>时间选择</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="queryTrackHandle"
            >关闭</el-button
          >
        </div>
        <el-date-picker
          v-model="pickerValue"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-card>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
import { useDict } from "@/utils/dict";
const { msg_type, carrier_type } = useDict("msg_type", "carrier_type");
import { useStore } from "vuex";
const store = useStore();
let open = ref(false);
let isShowMessage = ref(false);
let isShowLight = ref(false);
let massage = ref({});
let pickerValue = ref(null);
let carrierName = ref(null);
let showType = ref(null);
const activeName = ref("");
let form = ref({});
onMounted(() => {
  setTimeout(() => {
    massage.value = proxy.$.appContext.app.popupMassage;
    console.log(massage.value,'massage.value')
    if (massage.value) {
      // 多个终端
    if(massage.value.carrierArr.length)  carrierName.value = massage.value.carrierArr[0].carrierName;
    }
  }, 0);
});
const queryTrackHandle = () => {
  open.value = !open.value;
};
const SendMessageHandle = () => {
  isShowMessage.value = !isShowMessage.value;
};
const lightHandle = (val) => {
  isShowLight.value = !isShowLight.value;
  showType.value = val;
};
const submitForm = () => {
  ElMessage({
    message: "发送成功！",
    type: "success",
  });
  isShowMessage.value = !isShowMessage.value;
};
watch(
  () => pickerValue.value,
  (val) => {
    store.commit("SET_CARRIERTIMER", val);
    // 时间弹窗关闭
    open.value = !open.value;
  }
);
</script>
<style scoped>
.popup {
  position: relative;
}
.box-card {
  position: absolute;
  bottom: 0;
  left: 0px;
}
.popup-message {
  display: flex;
  justify-content: space-between;
}
.popup-message .left {
  margin-right: 30px;
}
.popup-message .left,
.popup-message .right {
  height: 100%;
  width: 50%;
}
.item-div {
  display: flex;
  justify-content: space-between;
}
::v-deep .el-range-editor--mini.el-input__inner {
  margin-top: 8px;
  width: 200px;
}
.timerClose {
  position: absolute;
  top: 0;
}
::v-deep .el-card__body {
  background: white;
}
.item-div .item-span:first-of-type {
  width: 140px;
}
.item-div .item-span:last-of-type {
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dialog-footer {
  padding: 0 20px;
}
.icon{
  width: 10px;
  height: 10px;
  background: black;
  border-radius: 50%;
  display: inline-block;
  /* float: right; */
}
</style>
