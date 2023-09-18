<template>
  <div>
    <div v-if="isShowAddGuest">
      <!-- <div style="font-size: 20px;font-weight: bold">酒店客人信息（新）</div> -->
      <h2>{{ $t("guestInfo.title") }}</h2>
      <div class="card">
        <div class="card-header">{{ $t("guestInfo.look") }}</div>
        <div class="card-body row">
          <div class="col-4 mb-3">
            <label class="col-sm-4 labelStyle"> {{ $t("guestInfo.room") }} </label>
            <div class="col-sm-8" style="display: inline-block">
              <select class="form-control" v-model="roomCord" @change="seachGuest()">
                <option value="">{{ $t("guestInfo.noSel") }}</option>
                <option v-for="room in roomList" :key="room.roomId" :value="room.roomNumber">
                  {{ room.roomNumber }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-4">
            <label class="col-sm-4 labelStyle"> {{ $t("guestInfo.sex") }} </label>
            <div class="col-sm-8" style="display: inline-block">
              <select class="form-control" v-model="gender" @change="seachGuest()">
                <option value="">{{ $t("guestInfo.noSel") }}</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <cool-table
        v-if="columns.length > 0"
        ref="guestInfoTable"
        :columns="columns"
        @edit-row="submitInfo"
        @del-row="delInfo"
        :data="guestList"
        :options="options"
      >
        <button class="btn btn-primary mr-1" @click="submitInfo">{{ $t("guestInfo.add") }}</button>
        <button class="btn btn-danger mr-1" @click="delGuestInfos">{{ $t("guestInfo.del") }}</button>
        <button class="btn btn-danger mr-1" @click="delCheckOutInfos">{{ $t("guestInfo.delPast") }}</button>
        <button class="btn btn-primary mr-1" v-if="isShow == false" @click="back()">{{ $t("guestInfo.return") }}</button>
      </cool-table>
    </div>
    <!-- 添加客人组件 -->
    <AddGuest
      v-else
      :isShowAddGuest.sync="isShowAddGuest"
      :roomList="roomList"
      :currGuestInfo="currGuestInfo"
      :langList="langList"
      :gender.sync="gender"
      :roomCord.sync="roomCord"
    />
  </div>
</template>

<script>
import CoolTable from "@/components/CoolTable.vue";
import CoolModal from "@/components/CoolModal.vue";
import Env from "@/env/index";
import GuestInfoApi from "@/api/guestInfo/guestInfoApi";
import AddGuest from "./addGuest.vue";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  components: { CoolTable, CoolModal, AddGuest },
  name: "guestInfoApp",
  props: {
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columns: [],
      column0: [],
      options: {},
      guestList: [], // 客人信息列表
      roomList: [], // 房间列表
      isShowAddGuest: true, // 控制添加组件显示隐藏
      ids: [], // 删除数据的id
      gender: "", // 性别
      roomCord: "", // 房间号
      guestInfoData: [], // 备份数据
      currGuestInfo: {}, // 当前操作客人信息
      langList: [], // 酒店语言
      nameList: []
    };
  },
  created() {
    this.setApi();
    if (Env.locale == "1") {
      this.options = optionsUS
    } else {
      return
    }
  },
  methods: {
    back() {
      this.$emit("update:isShow", true);
      // history.back(1)
    },
    async setApi() {
      try {
        // 获取酒店房间
        this.roomList = await GuestInfoApi.getRoomListApi();

        // 获取语言列表
        this.langList = await GuestInfoApi.getLangApi();
        this.getGuestList();
        this.loadHtml();
        // console.log('酒店语言',this.langList);
        // console.log('酒店客人信息',this.guestList);
        this.columns = [
          {
            checkbox: true
          },
          {
            field: "roomNumber",
            title: `${this.$t("guestInfo.room")}`,
            align: "center"
          },
          ...this.column0,
          // {
          // 	field: 'name', title: '中文',align: 'center'
          // },
          // {
          // 	field: 'nameEn', title: 'English',align: 'center'
          // },
          {
            field: "defaultLangId",
            title: `${this.$t("guestInfo.defaultLang")}`,
            align: "center",
            formatter: (val, row, idx) => {
              let res = "";
              this.langList.forEach(item => {
                // console.log('语言id',item.langId, val);
                // console.log('比较',item.langId == val);
                if (item.langId == val) {
                  res = item.label;
                }
              });
              return res;
              // for (let i = 0; i < this.langList.length; i++) {
              // 	if (this.langList[i].langId == val) {
              // 		return this.langList[i].label
              // 	}
              // }
            }
          },
          {
            field: "checkInDate",
            title: `${this.$t("guestInfo.checkInDate")}`,
            align: "center"
          },
          {
            field: "checkOutDate",
            title: `${this.$t("guestInfo.checkOutDate")}`,
            align: "center"
          },
          {
            field: "gender",
            title: `${this.$t("guestInfo.sex")}`,
            align: "center",
            formatter: (val, row, idx) => {
              return val === "F" ? "FEMALE" : "MALE";
            }
          },
          {
            field: "id",
            title: `${this.$t("guestInfo.operate")}`,
            align: "center",
            formatter: (val, row, idx) => {
              return `<button class="btn btn-primary btn-sm" data-val="${val}" data-emit="edit-row">${this.$t("guestInfo.edit")}</button>
										<button class="btn btn-danger btn-sm" data-val="${val}" data-emit="del-row">${this.$t("guestInfo.del")}</button>`;
            }
          }
        ];
      } catch (error) {
        console.log(error);
      }
    },
    loadHtml() {
      this.column0 = [];
      this.langList.forEach(v => {
        let col = {
          field: "name.l" + v.langId,
          title: v.label,
          algin: "center"
        };
        this.column0.push(col);
      });
    },
    async getGuestList() {
      // 获取客人信息列表以及数据处理
      const data = await GuestInfoApi.getGuestListApi();
      // console.log('客人信息列表',data);
      this.guestList = [];
      this.guestInfoData = [];
      data.forEach(item => {
        let list = {};
        list.hotelId = Env.hotelId;
        // list.hotelId = 8
        list.roomId = item.guest.roomId;
        list.id = item.guest.id;
        list.roomNumber = item.guest.roomNumber;
        list.gender = item.guest.gender;
        list.name = item.guest.name;
        list.nameEn = item.guest.nameEn;
        list.nameId = item.name.id;
        list.name = {};
        delete item.name.id;
        let arr = Object.keys(item.name);
        let res = Object.values(item.name);
        for (let i = 0; i < arr.length; i++) {
          list.name[arr[i]] = res[i];
        }

        list.defaultLangId = item.guest.defaultLangId;
        list.checkInDate = item.guest.checkInDate;
        list.checkOutDate = item.guest.checkOutDate;
        // console.log('信息', list);
        // this.nameList.push(item.name)
        this.guestList.push(list);
        this.guestInfoData.push(list);
      });
      // console.log(this.nameList);
    },
    // 添加和编辑
    submitInfo(_id) {
      this.isShowAddGuest = false;
      // console.log('当前编辑的id',_id);
      this.currGuestInfo = { ...this.guestList.find(item => item.id === _id) };
      // console.log('编辑', this.currGuestInfo);
    },
    // 删除客人信息
    async delInfo(id) {
      try {
        this.ids.push(id);
        const del = await this.$confirm(`${this.$t("confirm.delTitle")}`, `${this.$t("guestInfo.confirm.delMsg0")}`+` ${this.ids.length} `+`${this.$t("guestInfo.confirm.delMsg")}`);
        if (del) {
          await GuestInfoApi.delGuestInfoApi(this.ids);
          await this.$info(`${this.$t("confirm.delSuccess")}`).then(() => this.getGuestList());
        } else {
          return;
        }
      } catch (error) {
        this.$error(this.$t("confirm.delFail"))
        console.log(error);
      }
    },
    // 删除多个客人信息
    async delGuestInfos() {
      const selected = this.$refs.guestInfoTable.getSelections();
      // console.log(selected);
      this.ids = [];
      selected.forEach(item => {
        this.ids.push(item.id);
      });
      // console.log('要删除的ids', this.ids);
      if (selected.length === 0) {
        return;
      } else {
        try {
          const dels = await this.$confirm(`${this.$t("confirm.delTitle")}`, `${this.$t("guestInfo.confirm.delMsg0")}`+` ${this.ids.length} `+`${this.$t("guestInfo.confirm.delMsg")}`);
          if (dels) {
            await GuestInfoApi.delGuestInfoApi(this.ids);
            await this.$info(`${this.$t("confirm.delSuccess")}`).then(() => this.getGuestList());
          } else {
            return;
          }
        } catch (error) {
          this.$error(this.$t("confirm.delFail"))
        }
      }
    },
    // 删除已退房客人
    async delCheckOutInfos() {
      this.ids = [];
      this.guestList.forEach(item => {
        let res = new Date();
        let time = new Date(res).format("yyyy-MM-dd hh:mm:ss");
        if (time > item.checkOutDate) {
          // 已退房客人
          this.ids.push(item.id);
          // console.log('outRoom', this.ids);
        } else {
          // 未退房客人
          return;
        }
      });
      try {
        const dels = await this.$confirm(`${this.$t("confirm.delTitle")}`, `${this.$t("guestInfo.confirm.delMsg0")}`+` ${this.ids.length} `+`${this.$t("guestInfo.confirm.delMsg")}`);
        if (dels) {
          await GuestInfoApi.delGuestInfoApi(this.ids);
          await this.$info(`${this.$t("confirm.delSuccess")}`).then(() => this.getGuestList());
        } else {
          return;
        }
      } catch (error) {
        this.$error(this.$t("confirm.delFail"))
      }
    },
    // 搜索功能
    seachGuest() {
      this.guestList = this.guestInfoData;
      if (this.roomCord && this.gender) {
        return (this.guestList = this.guestList.filter(
          item => item.roomNumber == this.roomCord && item.gender == this.gender
        ));
      }
      if (this.roomCord) {
        // 房间搜索
        // console.log(this.roomCord);
        this.guestList = this.guestList.filter(item => item.roomNumber == this.roomCord);
      }
      if (this.gender) {
        // 性别搜索
        this.guestList = this.guestList.filter(item => item.gender == this.gender);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep  .float-right .form-control {
  display: none;
}
body {
  overflow: hidden;
}
// .labelStyle {
  // margin-right: 30px;
  // display: inline-block;
  // width: 130px;
  // text-align: right;
// }
.form-control {
  margin-left: -14.67%;
}
::v-deep .bootstrap-table .fixed-table-container .table thead th .th-inner {
  text-align: center;
}
::v-deep .bootstrap-table .fixed-table-container .table td {
  text-align: center;
}
</style>
