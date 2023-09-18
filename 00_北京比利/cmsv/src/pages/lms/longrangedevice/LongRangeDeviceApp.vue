<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div class="col-12" v-if="view === 'table'">
      <h2>{{ $t("Imslongrangedevice.title") }}</h2>
      <div class="card">
        <div class="card-header">{{ $t("confirm.querycondition") }}</div>
        <div class="card-body row">
          <div class="col-4 mb-3">
            <label class="col-sm-4"> IP </label>
            <div class="col-sm-8" style="display: inline-block">
              <input type="text" v-model="ipmodel" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <cool-table
        @row-refresh="refresh"
        @row-restart="restart"
        @row-network="network"
        @row-clone="clone"
        :options="options"
        ref="messageTable"
        :columns="columns"
        :data="tableData"
      >
        <button class="btn btn-danger ml-1" @click="viewdevice">
          {{ $t("Imslongrangedevice.viewdevice") }}
        </button>
        <select
          class="form-control inputsty ml-1 floatL"
          v-model="selectData"
          @change="alldatachange"
        >
          <option selected class="optstyle" value="" disabled>
            {{ $t("Imslongrangedevice.alldevice") }}
          </option>
          <option  value="0">{{$t('confirm.all')+" "+$t('Imslongrangedevice.refreshinfo')}}</option>
          <option  value="1">{{$t('confirm.all')+" "+$t('Imslongrangedevice.restart')}}</option>
          <option  value="2">{{$t('confirm.all')+" "+$t('Imslongrangedevice.clone')}}</option>
        </select>
        <select
          class="form-control inputsty ml-1 floatL"
          v-model="partData"
          @change="partdatachange"
        >
          <option selected value="" class="optstyle" disabled>
            {{ $t("Imslongrangedevice.Partialdevice") }}
          </option>
           <option  value="0">{{$t('confirm.portion')+" "+$t('Imslongrangedevice.refreshinfo')}}</option>
          <option  value="1">{{$t('confirm.portion')+" "+$t('Imslongrangedevice.restart')}}</option>
          <option  value="2">{{$t('confirm.portion')+" "+$t('Imslongrangedevice.clone')}}</option>
        </select>
        <!-- <button class="btn btn-danger ml-1" @click="batch(0)">
                    批量刷新
                </button>
                <button class="btn btn-danger ml-1" @click="batch(1)">
                    批量重启
                </button>
                <button class="btn btn-danger ml-1" @click="batch(2)">
                    批量克隆
                </button> -->
      </cool-table>
    </div>
    <cool-modal title="网络状态" :visible="modalVisible" @hidden="modalVisible = false">
      <!-- v-if="networkText !== ''" -->
      {{ networkText }}
      <template #footer>
        <button class="btn btn-secondary" @click="closepage">
          {{ $t("confirm.close") }}
        </button></template
      >
    </cool-modal>
  </div>
</template>
<script>
import { LmsApi } from "../LmsApi";
import CoolTable from "@/components/CoolTable.vue";
import env from "@/env";
import CoolModal from "@/components/CoolModal.vue";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  data() {
    return {
      view: "table",
      modalVisible: false,
      options: {},
      columns: [
        {
          checkbox: true
        },
        {
          field: "roomNumber",
          title: this.$t("confirm.roomnumber"),
          align: "center"
        },
        {
          field: "deviceSerial",
          title: "SN",
          align: "center"
        },
        {
          field: "ipaddress",
          title: "IP",
          align: "center"
        },
        {
          field: "deviceType",
          title: this.$t("confirm.brand"),
          align: "center",
          formatter: val => {
            let data = this.deiceList.find(item => item.id == val);
            if (data) {
              return data.name;
            } else {
              return "-";
            }
          }
        },
        {
          field: "ipaddress",
          title: this.$t("confirm.state"),
          align: "center",
          formatter: val => {
            let data = this.pinglist.find(item => item.IP == val);
            if (data !== undefined && data.IsOpen == true) {
              return `<div style="color:red">开机</div>`;
            } else if (data !== undefined && data.IsOpen == false) {
              return `<div>关机</div>`;
            } else {
              return data.IsOpen;
            }
          }
        },
        {
          field: "deviceSerial",
          title: this.$t("confirm.operate"),
          align: "center",
          width: 300,
          formatter: (val, row, idx) => {
            let data = this.pinglist.find(item => item.IP == row.ipaddress);
            if (data.IsOpen == true && row.deviceType == 3) {
              return `    <button class="btn btn-warning btn-sm" data-val=${val} data-emit="row-refresh" >刷新信息</button>
                  <button class="btn btn-primary btn-sm" data-val=${val} data-emit="row-restart">重启</button>
                      <button class="btn btn-info btn-sm" data-val=${val} data-emit="row-network" >网络状态</button>
                      <button class="btn btn-success btn-sm" data-val=${val} data-emit="row-clone" >克隆</button>
                      `;
            } else if (data.IsOpen == true) {
              return `<button class="btn btn-success btn-sm" data-val=${val} data-emit="row-refresh" >刷新信息</button>
                  <button class="btn btn-primary btn-sm" data-val=${val} data-emit="row-restart">重启</button>
                      <button class="btn btn-info btn-sm" data-val=${val} data-emit="row-network" >网络状态</button>`;
            } else {
              return `<div>请先开机后操作</div>`;
            }
          }
        }
      ],
      roomlist: {}, //房间的数据
      pinglist: [], //ping数据
      deiceList: [], //设备名称
      tableList: [],

      ipmodel: "", //ip搜索
      networkText: "",
      state: "",
      ids: "",
      selectData: "", //用户选择的操作
      partData: "", //部分的用户操作
      conent: "" //全部操作的提示
    };
  },
  computed: {
    tableData() {
      let ipmodel = RegExp(this.ipmodel, "ig");
      return this.tableList.filter(item => {
        return this.ipmodel == "" ? true : ipmodel.test(item.ipaddress);
      });
    }
  },
  created() {
    this.getHoteLangList();
      if (env.locale == 0) {
      this.options = {};
    } else {
      this.options = optionsUS;
    }
  },
  watch: {
    async modalVisible(val) {
      try {
        if (val == true) {
          this.state = setInterval(async () => {
            if (this.modalVisible == true) {
              // console.log(this.ids, 'ids')
              // console.log();
              const formdata = this.tableData.find(item => item.deviceSerial == this.ids);

              const res = await LmsApi.deviceping([formdata.ipaddress]);
              if (res[formdata.ipaddress].Result !== "") {
                this.networkText = res[formdata.ipaddress].Result;
              }
            }
          }, 2000);
        }
      } catch (error) {
        clearInterval(this.state);
        this.modalVisible = false;
        this.$error("网络状态不可用");
        // this.$error(error)
      }
    }
  },
  methods: {
    //全部数据操作
    async alldatachange(e) {
      try {
        if (e.target.value == 0) {
          this.conent = "全部刷新信息";
        } else if (e.target.value == 1) {
          this.conent = "全部重启";
        } else {
          this.conent = "全部克隆";
        }
        let res = await this.$confirm(`确定要操作${this.conent}吗？`);
        if (!res) return;
        let updata;
        if (e.target.value !== "") {
          updata = this.tableData.map(item => item.deviceSerial);
        }
        if (e.target.value == 0) {
          await LmsApi.devicestart({ ids: updata, cmd: 6 });
          // console.log(55)
          await this.$info("全部刷新成功");
          this.selectData = "";
        } else if (e.target.value == 1) {
          await LmsApi.devicestart({ ids: updata, cmd: 3 });
          await this.$info("全部重启成功");
          this.selectData = "";
        } else {
          await LmsApi.devicestart({ ids: updata, cmd: 10 });
          await this.$info("全部克隆成功");
          this.selectData = "";
        }
      } catch (error) {
        // console.log(error)
        this.$error(error);
      }
    },
    //部分数据操作
    async partdatachange(e) {
      try {
        let updata;
        if (e.target.value !== "") {
          const seled = this.$refs.messageTable.getSelections();
          updata = this.tableData.map(item => item.deviceSerial);
          if (seled.length == 0) return this.$error("请先选择要操作的设备");
          updata = seled.map(item => item.deviceSerial);
        }
        if (e.target.value == 0) {
          await LmsApi.devicestart({ ids: updata, cmd: 6 });
          // console.log(55)
          await this.$info("批量刷新成功");
          this.partData = "";
        } else if (e.target.value == 1) {
          await LmsApi.devicestart({ ids: updata, cmd: 3 });
          await this.$info("批量重启成功");
          this.partData = "";
        } else {
          await LmsApi.devicestart({ ids: updata, cmd: 10 });
          await this.$info("批量克隆成功");
          this.partData = "";
        }
      } catch (error) {
        // console.log(error)
        this.$error(error);
      }
    },
    //批量操作
    // async batch (val) {
    //     const seled = this.$refs.messageTable.getSelections()
    //     // console.log(seled, 'so')
    //     if (seled.length == 0) return this.$error('请先选择要操作的设备')
    //     const updata = seled.map(item => item.deviceSerial)
    //     try {
    //         if (val == 0) {
    //             await LmsApi.devicestart({ ids: updata, cmd: 6 })
    //             await this.$info('批量刷新成功')
    //         } else if (val == 1) {
    //             await LmsApi.devicestart({ ids: updata, cmd: 3 })
    //             await this.$info('批量重启成功')
    //         } else {
    //             await LmsApi.devicestart({ ids: updata, cmd: 10 })
    //             await this.$info('批量克隆成功')
    //         }
    //     } catch (error) {
    //         this.$error(error)
    //     }

    // },
    closepage() {
      this.modalVisible = false;
      clearInterval(this.state);
    },
    //刷新信息
    async refresh(val) {
      try {
        await LmsApi.devicestart({ ids: [val], cmd: 6 });
        await this.$info("刷新成功");
      } catch (error) {
        this.$error(error);
      }
    },
    // 网络状态
    network(val) {
      // console.log(val)
      this.ids = val;
      this.modalVisible = true;
    },
    //克隆
    async clone(val, row) {
      try {
        await LmsApi.devicestart({ ids: [val], cmd: 10 });
        await this.$info("克隆成功");
      } catch (error) {
        this.$error(error);
      }
    },
    // 重启设备
    async restart(val) {
      try {
        // console.log(val)
        await LmsApi.devicestart({ ids: [val], cmd: 3 });
        await this.getHoteLangList();
        await this.$info("重启成功");
      } catch (error) {
        this.$error(error);
      }
    },
    //获取数据
    async getHoteLangList(state) {
      try {
        // 获取设备名称
        const device = await LmsApi.getDeviceName();
        // console.log(device, 'bive')
        this.deiceList = device.list;

        //获取房间的ips[]
        const room = await LmsApi.getDeviceRoom();
        this.roomlist = room;
        // console.log(room, 'room')
        let arr = room.list[0].deviceList.map(item => item.ipaddress);

        // console.log(this.pinglist, 'list')
        let arr1 = [];
        room.list.forEach(item => {
          if (item.deviceList.length > 0) {
            item.deviceList.forEach(device => {
              arr1.push({
                ...device,
                hotelId: item.hotelId,
                roomId: item.roomId,
                roomNumber: item.roomNumber
              });
            });
          }
        });

        let getIplsit = arr1.map(item => item.ipaddress);
        // //获取ping码数据
        // let ping
        // ping = await LmsApi.deviceping(getIplsit)
        // for (let key in ping) {
        //     this.pinglist.push({ ...ping[key] })
        // }

        await this.getallping(getIplsit);

        // console.log(arr1, 'arr')

        this.tableList = arr1;
      } catch (error) {
        this.$error(error);
      }
    },
    async getallping(getIplsit) {
      try {
        //获取ping码数据
        // console.log(getIplsit, 'listdfsaf')

        let ping = await LmsApi.deviceping(getIplsit);

        for (let key in ping) {
          this.pinglist.push({ ...ping[key] });
        }
      } catch (error) {
        // console.log(error, 'err')
        this.pinglist = getIplsit.map(item => {
          return {
            IP: item,
            IsOpen: "xxx"
          };
        });
      }
    },
    //查看设备状态
    async viewdevice() {
      this.tableList = [];
      this.getHoteLangList();
    }
  },
  components: {
    CoolTable,
    CoolModal
  }
};
</script>

<style lang="scss" scoped>
::v-deep td {
  max-width: 12.5rem;
}

.mr-top {
  margin-top: 3%;
}
label {
  font-size: 0.625rem;
}

// palcehotle样式
input::placeholder {
  color: #adadad;
  display: inline-block;
  margin-bottom: 0.417rem;
  padding-top: 0.083rem;
  font-size: 0.5rem;
}
.floatL {
  float: left;
}
::v-deep .inputsty {
  width: 30%;
}
::v-deep .optstyle {
  color: #adadad;
}
</style>
