<template>
  <div class="container-fluid">
    <div>
      <div class="row">
        <div class="col-12" v-if="view === 'table'">
          <h2>{{ $t("Imsstrategy.title") }}</h2>
          <cool-table
            @edit-row="editTable"
            :columns="columns"
            :data="tableData"
            :pageSize="10"
            :options="options"
            @del-row="delMessage"
            ref="messageTable"
          >
            <button class="btn btn-primary" @click="add">
              {{ $t("confirm.add") }}
            </button>
            <button class="btn btn-danger ml-1" @click="delMessages">
              {{ $t("confirm.delete") }}
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

            <!-- hotelId -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ vendor + $t("confirm.name") }}</label>
              <select
                class="custom-select"
                v-validate="v"
                v-model="model.hotelId"
                required
                disabled
              >
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in hotelList" :value="item.hotelId" :key="item.hotelId">
                  {{ item.hotelName }}
                </option>
              </select>
            </vp>

            <!-- roomId -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("confirm.roomnumber") }}</label>
              <cool-select
                btnStyle="btn-light"
                :defaultValue="model.roomId"
                v-model="model.roomId"
                :liveSearch="true"
                :opts="typeinfo"
              >
              </cool-select>
            </vp>

            <!-- deviceId -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imsstrategy.device") }}</label>
              <cool-select
                btnStyle="btn-light"
                :defaultValue="model.deviceId"
                v-model="model.deviceId"
                :liveSearch="true"
                :opts="devicetype"
              >
              </cool-select>
            </vp>

            <!-- 触发点ID -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imsstrategy.trigger") }}</label>
              <select class="custom-select" v-validate="v" v-model="model.trigger" required>
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in triggerList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </option>
              </select>
            </vp>

            <!-- 执行规则 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imsstrategy.executionrules") }}</label>
              <select class="custom-select" v-validate="v" v-model="model.triggerType" required>
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in triggerTypeList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </option>
              </select>
            </vp>

            <!-- 命令 -->
            <vp class="form-group" tag="div" v-slot="v">
              <label>{{ $t("Imsstrategy.order") }}</label>
              <select class="custom-select" v-validate="v" v-model="model.cmd" required>
                <option disabled selected value="">
                  {{ $t("confirm.pleasechoose") }}
                </option>
                <option v-for="item in cmdList" :value="item.id" :key="item.id">
                  {{ item.name }}
                </option>
              </select>
            </vp>
            <!-- 操作 -->
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                {{ keyCount }}
              </button>
              <button class="btn btn-secondary ml-1" @click="close">
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
import CoolTable from "@/components/CoolTable.vue";
import CoolSelect from "@/components/CoolSelect.vue";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
class formD {
  constructor() {
    this.hotelId = env.hotelId;
    this.deviceId = "-1";
    this.roomId = "-1";
    this.cmd = "";
    this.trigger = "";
    this.triggerType = "";
  }
}
import { TriggerApi, TriggerTypeApi, StrategyApi, CmdApi, DeviceApi } from "../LmsApi";
import RoomApi from "@/api/RoomApi";
import env from "@/env";
import HotelApi from "@/api/HotelApi";
export default {
  data() {
    return {
      options: {},
      view: "table",
      vendor: env.vendor,
      keyCount: this.$t("confirm.add"),
      columns: [
        {
          checkbox: true
        },
        {
          field: "hotelId",
          title: `${env.vendor + this.$t("confirm.name")}`,
          align: "center",
          formatter: val => {
            const hot = this.hotelList.find(it => it.hotelId == val);
            if (!hot) {
              return "-";
            }
            return hot.hotelName;
          }
        },
        {
          field: "roomId",
          title: this.$t("confirm.roomnumber"),
          align: "center",
          formatter: val => {
            const room = this.typeinfo.find(it => it.value == val);
            if (!room) {
              return "-";
            }
            return room.option;
          }
        },
        {
          field: "deviceId",
          title: this.$t("Imsstrategy.device"),
          align: "center",
          formatter: (val, row) => {
            const dev = this.alldevice.find(it => it.deviceId == val);
            if (!dev) {
              return "-";
            }
            return dev.deviceSerial;
          }
        },
        {
          field: "trigger",
          title: this.$t("Imsstrategy.trigger"),
          align: "center",
          formatter: val => {
            const tri = this.triggerList.find(it => it.id == val);
            if (!tri) {
              return "-";
            }
            return tri.name;
          }
        },
        {
          field: "triggerType",
          title: this.$t("Imsdevicetriggertype.triggertype"),
          align: "center",
          formatter: val => {
            const tr = this.triggerTypeList.find(it => it.id == val);
            if (!tr) {
              return "-";
            }
            return tr.name;
          }
        },
        {
          field: "cmd",
          title: this.$t("confirm.commandname"),
          align: "center",

          formatter: val => {
            const cmd = this.cmdList.find(it => it.id == val);
            if (!cmd) {
              return "-";
            }
            return cmd.name;
          }
        },
        {
          field: "id",
          title: this.$t("confirm.operate"),
          align: "center",
          width: 300,
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">${this.$t(
              "confirm.edit"
            )}</button>
                            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >${this.$t(
              "confirm.delete"
            )}</button>`;
          }
        }
      ],
      tableList: [],
      cmdList: [],
      triggerList: [],
      triggerTypeList: [],
      deviceList: [],
      hotelList: [],
      roomList: [],
      model: null,
      typeinfo: [], //设备房间号,
      alldevice: []
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
  computed: {
    tableData() {
      return this.tableList;
    },
    devicetype() {
      let arr = [];
      let data;
      if (this.model.roomId == -1) {
        this.typeinfo.forEach((item, index) => {
          if (item.deviceList) {
            arr.push(
              ...item.deviceList.map(i => {
                return {
                  value: i.deviceId,
                  option: i.deviceSerial
                };
              })
            );
          }
        });
        arr.unshift({ value: "-1", option: "全部设备" });
      } else {
        data = this.typeinfo.find(i => i.value == this.model.roomId);
        if (data) {
          arr = data.deviceList.map(i => {
            return {
              value: i.deviceId,
              option: i.deviceSerial
            };
          });
        }
      }
      return arr;
    }
  },
  methods: {
    add() {
      let data = JSON.parse(JSON.stringify(env.hotelId));
      if (data == "null" || data == "") {
        return this.$error(this.$t("confirm.pleasechoose") + `${this.vendor}`);
      } else {
        this.keyCount = this.$t("confirm.add");
        this.model = new formD();
        this.view = "form";
      }
    },
    //获取全部数据
    async getallData() {
      try {
        let res = await StrategyApi.gettype();
        this.typeinfo = res.list.map(i => {
          return {
            ...i,
            value: i.roomId,
            option: i.roomNumber
          };
        });
        this.typeinfo.unshift({ value: "-1", option: "所有房间" });

        this.alldevice.unshift({ deviceId: "-1", deviceSerial: "全部设备" });
        res.list.forEach(i => {
          this.alldevice.push(
            ...i.deviceList.map(idx => {
              return {
                ...idx
              };
            })
          );
        });

        const data4 = await HotelApi.list();
        this.hotelList = data4;
        const data = await CmdApi.list();
        this.cmdList = data.list;

        const data1 = await TriggerApi.list();
        this.triggerList = data1.list;

        const data2 = await TriggerTypeApi.list();
        this.triggerTypeList = data2.list;

        // const data3 = await DeviceApi.list();
        // this.deviceList = data3;

        const data5 = await RoomApi.list();
        this.roomList = data5;

        const data6 = await StrategyApi.list();
        this.tableList = data6.list;
      } catch (error) {
        console.log(error);
      }
    },
    async submit() {
      try {
        if (!this.model.id) {
          await StrategyApi.stategyCreate(this.model);
          await this.close();
          await this.$info(this.$t("confirm.addsuccess"));
        } else {
          await StrategyApi.update(this.model);
          await this.close();
          await this.$info(this.$t("confirm.editsuccess"));
        }
      } catch (error) {
        console.log(error);
        if (error == "has same strategy") {
          this.$error(this.$t("confirm.hassomestrategy"));
        } else {
          this.$error(this.$t("confirm.fail"));
        }
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
      let editdata = this.tableData.find(item => item.id == val);

      if (editdata) {
        this.model = editdata;
      }
      this.view = "form";
    },
    // 删除单个
    async delMessage(id) {
      try {
        const ok = await this.$confirm(this.$t("confirm.AreyousureDeletIDkey").replace("*", id));
        if (!ok) {
          return;
        }
        // 调用接口
        await StrategyApi.delete([id]);
        await this.$info(this.$t("confirm.success"));
        this.getallData();
      } catch (error) {
        this.$error(this.$t("confirm.fail"));
      }
    },
    // 删除多个
    async delMessages() {
      const selections = this.$refs.messageTable.getSelections();
      if (selections.length === 0) return;
      try {
        const ok = await this.$confirm(
          this.$t("confirm.AreyousureDelet").replace("*", selections.length)
        );
        if (!ok) return;
        await StrategyApi.delete(selections.map(v => v.id));
        await this.$info(this.$t("confirm.success"));
        this.getallData();
      } catch (error) {
        console.error(error);
        this.$error(this.$t("confirm.fail"));
      }
    }
  },
  components: {
    CoolTable,
    CoolSelect
  }
};
</script>

<style lang="scss" scoped>
.centerbox {
  display: flex;
  // justify-items: center;
  justify-content: center;
}
::v-deep .bootstrap-select > .dropdown-toggle.bs-placeholder,
.bootstrap-select > .dropdown-toggle.bs-placeholder:active,
.bootstrap-select > .dropdown-toggle.bs-placeholder:focus,
.bootstrap-select > .dropdown-toggle.bs-placeholder:hover {
  border: 1px solid #ced4da;
}
::v-deep .bootstrap-select .dropdown-toggle:focus,
.bootstrap-select > select.mobile-device:focus + .dropdown-toggle {
  outline: none !important;
}
::v-deep .btn:not(:disabled):not(.disabled) {
  border: 1px solid #ced4da;
}
</style>
