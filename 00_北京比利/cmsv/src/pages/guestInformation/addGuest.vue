<template>
  <div class="formStyle">
    <h2>{{ $t("guestInfo.look") }}</h2>
    <div class="container-fluid">
      <vo v-slot="{ handleSubmit }">
        <!-- novalidate表单校验 -->
        <form novalidate role="form" class="form-horizontal" @submit.prevent="handleSubmit(submit)">
          <vp class="form-group col-xs-6" tag="div" v-slot="v" rules="required">
            <label class="labelStyle col-xs-4">{{ $t("guestInfo.room") }}</label>
            <div class="input-class col-xs-8">
              <select class="form-control" v-validate="v" v-model="formData.roomId">
                <option value="">{{ $t("guestInfo.addGuestInfo.option") }}</option>
                <option v-for="room in roomList" :key="room.roomId" :value="room.roomId">{{
                  room.roomNumber
                }}</option>
              </select>
            </div>
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-choose") }}</span>
          </vp>
          <vp class="form-group col-xs-6" tag="div" v-slot="v" rules="required">
            <label class="labelStyle col-xs-4"> {{ $t("guestInfo.sex") }}</label>
            <div class="input-class col-xs-8">
              <select v-model="formData.gender" v-validate="v" class="form-control">
                <!-- <option value="" disabled>请选择</option> -->
                <option value="F" selected>Female</option>
                <option value="M">Male</option>
              </select>
            </div>
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-choose") }}</span>
          </vp>
          <div v-for="item in langList" :key="item.langId">
            <vp class="form-group col-xs-6" tag="div" v-slot="v" rules="required">
              <label class="labelStyle col-xs-4">{{ item.label }}</label>
              <div class="input-class col-xs-8">
                <input
                  class="inputWidth form-control"
                  v-validate="v"
                  type="text"
                  v-model="nameArr['l' + item.langId]"
                />
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-write") }}</span>
            </vp>
          </div>
          <!-- <vp class="form-group col-xs-6" tag="div" v-slot="v" rules="required">
              <label class="labelStyle col-xs-4">英文姓名</label>
              <div class="input-class col-xs-8">
                <input class="inputWidth form-control" v-validate="v" type="text" v-model="formData.nameEn">
              </div>
              <span class="err" v-if="v.errors[0]">必填项</span>
            </vp> -->
          <vp class="form-group" tag="div" v-slot="v" rules="required">
            <label class="labelStyle"> {{ $t("guestInfo.defaultLang") }}</label>
            <div class="input-class">
              <select class="form-control" v-validate="v" v-model="formData.defaultLangId">
                <option v-for="lang in langList" :key="lang.langId" :value="lang.langId">{{
                  lang.label
                }}</option>
                <!-- <option value="0">中文</option> -->
                <!-- <option value="1">English</option> -->
              </select>
            </div>
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-choose") }}</span>
          </vp>
          <vp class="form-group" tag="div" v-slot="v" rules="required" vid="checkInDate">
            <label class="labelStyle">{{ $t("guestInfo.checkInDate") }}</label>
            <!-- 日历 -->
            <div class="block">
              <el-date-picker
                name="checkInDate"
                v-validate="v"
                v-model="formData.checkInDate"
                type="datetime"
                :placeholder="tip1"
                align="right"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </div>
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-choose") }}</span>
            <!-- <span class="err" v-if="v.errors[0]">入住时间应早于退房时间</span> -->
          </vp>
          <vp class="form-group" tag="div" v-slot="v" rules="required|checkTime:@checkInDate">
            <!-- <label class="labelStyle">退房时间</label> -->
            <span class="labelStyle">{{ $t("guestInfo.checkOutDate") }}</span>
            <div class="block">
              <el-date-picker
                v-validate="v"
                v-model="formData.checkOutDate"
                type="datetime"
                ref="checkInDate" 
                :placeholder="tip2"
                align="right"
                required
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </div>
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.v-choose") }}</span><br /><br />
            <span class="err" v-if="v.errors[0]">{{ $t("guestInfo.addGuestInfo.validate") }}</span>
          </vp>
          <div class="btnStyle">
            <button type="submit" class="btn btn-primary mr-1">{{ $t("guestInfo.addGuestInfo.ok") }}</button>
            <button
              type="button"
              class="btn btn-light"
              @click="$emit('update:isShowAddGuest', true)"
            >
              {{ $t("guestInfo.return") }}
            </button>
          </div>
        </form>
      </vo>
    </div>
  </div>
</template>

<script>
import GuestInfoApi from "@/api/guestInfo/guestInfoApi";
import Env from "@/env/index";

export default {
  name: "AddGuest",
  props: {
    roomList: {
      type: Array,
      default: () => []
    },
    langList: {
      type: Array,
      default: () => []
    },
    isShowAddGuest: {
      type: Boolean,
      default: true
    },
    currGuestInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tip1: this.$t("guestInfo.addGuestInfo.inTime"),
      tip2: this.$t("guestInfo.addGuestInfo.outTime"),
      // 时间选择器的快捷数据
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      // formData: {
      //   hotelId: '8',
      //   roomId: '',
      //   roomNumber: '',
      //   gender: '',
      //   name: '',
      //   nameEn: '',
      //   defaultLangId: '',
      //   checkInDate: '', // 入住时间
      //   checkOutDate: '' // 退房时间
      // },
      formData: JSON.parse(JSON.stringify(this.currGuestInfo)),
      nameArr: {}
    };
  },
  created() {
    // console.log('编辑数据',this.currGuestInfo);
    // console.log(JSON.stringify(this.currGuestInfo));
    if (this.formData.id) {
      this.nameArr = JSON.parse(JSON.stringify(this.currGuestInfo.name));
    }
  },
  methods: {
    // 添加|编辑客人信息
    async submit() {
      try {
        if (this.formData.checkInDate !== "" || this.formData.checkOutDate !== "") {
          this.formData.checkInDate = new Date(this.formData.checkInDate).format(
            "yyyy-MM-dd hh:mm:ss"
          );
          this.formData.checkOutDate = new Date(this.formData.checkOutDate).format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        var res = this.roomList.filter(item => item.roomId === this.formData.roomId);
        this.formData.roomNumber = res[0].roomNumber;

        // console.log(res);
        // this.langList.forEach(lang => {
        //   if (lang.langId == 0) {
        //     this.formData.name = this.name[l0]
        //   }
        //   if (lang.langId == 1) {
        //     this.formData.nameEn = this.name[l1]
        //   }
        // })

        // console.log(guest);
        // 客人姓名数据
        // this.name.id = this.formData.nameId

        // this.langList.forEach(item => {
        //   this.nameList['l'+item.langId] = this.nameArr['l'+ item.langId]
        // })
        // console.log('添加/编辑name处理', this.nameList);
        // var name = { ...this.nameList }

        // let list = {};
        // list.guest = guest
        // list.name = this.nameArr
        // console.log('传递的客人数据', list);
        if (this.formData.id) {
          let list = {};
          list.name = this.formData.name;
          delete this.formData.name;
          this.formData.name = null;
          this.formData.nameEn = null;
          Object.keys(this.nameArr).forEach(item => {
            // console.log('语言姓名的key值',item)
            // console.log(item !== 'l0');
            if (item == "l0") {
              this.formData.name = this.nameArr.l0;
            }
            if (item == "l1") {
              this.formData.nameEn = this.nameArr.l1;
            }
          });
          let guest = { ...this.formData, hotelId: Env.hotelId };
          // let guest = { ...this.formData, hotelId: 8 };

          list.guest = guest;

          await GuestInfoApi.updateGuestInfoApi(list);
          await this.$info(this.$t("confirm.editSuccess"));
        } else {
          this.formData.id = null;

          Object.keys(this.nameArr).forEach(item => {
            // console.log('语言姓名的key值',item)
            if (item == "l0") {
              this.formData.name = this.nameArr[item];
            }
            if (item == "l1") {
              this.formData.nameEn = this.nameArr[item];
            }
          });
          let guest = { ...this.formData, hotelId: Env.hotelId };
          let list = {};
          list.guest = guest;
          list.name = this.nameArr;
          await GuestInfoApi.addGuestInfoApi(list);
          await this.$info(this.$t("confirm.addSuccess"));
        }
        this.formData = {};
        this.$emit("update:isShowAddGuest", true);
        this.$emit("update:gender", "");
        this.$emit("update:roomCord", "");
        this.$parent.getGuestList();
      } catch (error) {
        this.$error(this.$t("confirm.fail"));
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.formStyle {
  position: fixed;
  left: 27%;
}
.input-class {
  display: inline;
  width: 100%;
}
.inputWidth {
  width: 100%;
  margin-bottom: 8px;
}
::v-deep .el-input__inner {
  width: 300px;
}
.labelStyle ::before {
  content: "*";
  position: relative;
  color: red;
}
.labelStyle {
  margin-right: 30px;
  display: inline-block;
  width: 130px;
  text-align: right;
}
.err {
  display: block;
  font-size: 12px;
  position: absolute;
  left: 173px;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
  margin-top: -1px;
}
.btnStyle {
  position: fixed;
  left: 47%;
}
.btn {
  margin-top: 20px;
}
.btnStyle .btn:nth-child(2) {
  background: #d3d3d3;
}
.form-control {
  width: 300px !important;
  display: inline;
}
.form-group {
  // width: 500px;
  // display: block;
  margin: 22px 0;
}
.block {
  display: inline;
}
</style>
