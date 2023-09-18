<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div>
      <div class="row">
        <div class="col-12" v-show="view === 'table'">
          <h2>{{ $t("Imsdevicetriggertype.title") }}</h2>
          <cool-table @edit-row="editTable" :columns="columns" :data="tableList" :options="options">
            <button class="btn btn-primary" @click="addfile">
              {{ $t("confirm.add") }}
            </button>
          </cool-table>
        </div>
      </div>
    </div>
    <div v-if="view === 'form'" class="centerbox mt-4">
      <!-- DaviceFirmFrom -->
      <div class="col-sm-6">
        <vo v-slot="{ handleSubmit }">
          <form novalidate @submit.prevent="handleSubmit(submit)">
            <!-- Id -->
            <!-- <vp class="form-group" tag="div" v-slot="v" v-if="model.id">
              <label>ID</label>
              <input
                type="text"
                disabled
                v-model="model.id"
                class="form-control"
                v-validate="v"
                required
              />
            </vp> -->
            <!-- deviceType -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imsdevicetriggertype.devicetype") }}</label>
              <select class="custom-select" v-validate="v" v-model="model.deviceType" required>
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in deviceList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </option>
              </select>
            </vp>

            <!-- 触发类型ID -->
            <vp class="form-group" tag="div" v-slot="v" rules="required|no_One" name="触发类型">
              <label>{{ $t("Imsdevicetriggertype.triggertype") }}</label>
              <select v-model="model.type" class="custom-select" v-validate="v">
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option value="0">由设备控制执行 </option>
                <option value="1">由客户端执行</option>
                <option value="-1">未指定执行方</option>
              </select>
              <!-- <span class="err">{{ v.errors[0] }}</span> -->
            </vp>

            <!-- 控制命令 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imscmd.title") }}</label>
              <select class="custom-select" v-validate="v" v-model="model.cmd" required>
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in orderlist" :value="item.id" :key="item.id">
                  {{ item.name }}
                </option>
              </select>
            </vp>
            <!-- 操作 -->
            <div class="form-group">
              <button type="submit" class="btn mr-1 btn-primary">
                {{ keyCount }}
              </button>
              <button class="btn btn-secondary " @click="close">
                {{ $t("confirm.return") }}
              </button>
            </div>
          </form>
        </vo>
      </div>
    </div>
  </div>
</template>

<script>
class fromD {
  constructor() {
    this.type = "";
    this.cmd = "";
    this.deviceType = "";
  }
}
import CoolTable from "@/components/CoolTable.vue";
import { DeviceTriggerTypeApi, StrategyApi } from "../LmsApi";
import DeviceTypeApi from "@/api/DeviceTypeApi";
import env from "@/env";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  data() {
    return {
      view: "table",
      options: {},
      vendor: env.vendor,
      keyCount: this.$t("confirm.add"),
      columns: [
        {
          field: "deviceType",
          title: this.$t("Imsdevicetriggertype.devicetype"),
          align: "center",
          formatter: val => {
            let data = this.deviceList.find(i => i.id == val);
            if (data) {
              return data.name;
            } else {
              return "-";
            }
          }
        },
        {
          field: "type",
          title: this.$t("Imsdevicetriggertype.triggertype"),
          align: "center",
          formatter: val => {
            if (val == 0) {
              return "由设备控制执行";
            } else if (val == 1) {
              return "由客户端执行";
            } else if (val == -1) {
              return "未指定执行方";
            } else {
              return "-";
            }
          }
        },
        {
          field: "cmd",
          title: this.$t("Imsdevicetriggertype.order"),
          align: "center",
          formatter: val => {
            let data = this.orderlist.find(i => i.id == val);
            if (data) {
              return data.name;
            } else {
              return "-";
            }
          }
        },
        {
          field: "idx",
          title: this.$t("confirm.operate"),
          align: "center",
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">${this.$t(
              "confirm.edit"
            )}</button>`;
          }
        }
      ],
      tableList: [],
      deviceList: [],
      model: new fromD(),
      orderlist: [] //命令
    };
  },
  created() {
    this.getallData();
    if (env.locale == 0) {
      this.options = {};
    } else {
      this.options = optionsUS;
    }
  },
  methods: {
    addfile() {
      if (env.hotelId == "null" || env.hotelId == "") {
        return this.$error(`${this.$t("confirm.pleasechoose") + " " + this.vendor}`);
      } else {
        this.keyCount = this.$t("confirm.add");
        this.model = new fromD();
        this.view = "form";
      }
    },
    //获取全部数据
    async getallData() {
      try {
        const order = await DeviceTriggerTypeApi.getorder();
        this.orderlist = order.list;

        const data = await DeviceTypeApi.getAllDevice();
        this.deviceList = data.list;

        const data1 = await DeviceTriggerTypeApi.list();
        this.tableList = data1.list.map((i, j) => {
          return { idx: j + 1, ...i };
        });
      } catch (error) {
        this.$error(this.$t("confirm.failedData"));
      }
    },
    backPage() {
      this.getallData();
      this.view = "table";
    },
    async submit() {
      try {
        if (!this.model.id) {
          await StrategyApi.create({ ...this.model, id: "-1" });
          await this.backPage();
          this.$info(this.$t("confirm.addsuccess"));
        } else {
          let data = JSON.parse(JSON.stringify(this.model));
          delete data.idx;
          await StrategyApi.create(data);
          await this.backPage();
          this.$info(this.$t("confirm.editsuccess"));
        }
      } catch (error) {
        console.log(error);
        this.$error(this.$t("confirm.fail"));
      }
    },
    //头层表格返回
    close() {
      this.view = "table";
      this.model = {};
      this.getallData();
    },
    //修改按钮
    editTable(val) {
      this.keyCount = this.$t("confirm.update");
      this.model = this.tableList.find(item => item.idx == val);
      this.view = "form";
    }
  },
  components: {
    CoolTable
  }
};
</script>

<style lang="scss" scoped>
.centerbox {
  display: flex;
  justify-content: center;
}
//错误样式
.err {
  font-size: 12px;
  width: 100%;
  color: #dc3545;
  left: 0;
}
</style>
