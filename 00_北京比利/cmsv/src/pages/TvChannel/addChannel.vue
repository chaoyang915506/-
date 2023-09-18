<template>
  <div class="formStyle">
    <h2>{{ $t("addChannelView.title") }}</h2>
    <div class="container-fluid">
      <vo ref="vo" v-slot="{ handleSubmit }">
        <!-- <form @submit.prevent="test(handleSubmit, valid)"> -->
        <form @submit.prevent="handleSubmit(submit)">
          <div class="row">
            <vp class="form-group col-4" v-if="isEdit" tag="div" v-slot="v" rules="required">
              <label class="labelStyle">{{ $t("addChannelView.chId") }}</label>
              <div class="input-class">
                <input
                  class="inputWidth form-control"
                  v-validate="v"
                  type="text"
                  v-bind:disabled="disabled"
                  v-model="formData.chId"
                />
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("addChannelView.v-choose") }}</span>
            </vp>
            <vp class="form-group col-4" tag="div" v-slot="v" rules="required">
              <label class="labelStyle">{{ $t("addChannelView.isDomestic") }}</label>
              <div class="input-class">
                <select
                  class="form-control inputWidth"
                  v-validate="v"
                  v-model="formData.isDomestic"
                  
                >
                  <option value="" disabled>{{ $t("addChannelView.choose") }}</option>
                  <option value="1">{{ $t("addChannelView.yes") }}</option>
                  <option value="0">{{ $t("addChannelView.no") }}</option>
                </select>
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("addChannelView.v-choose") }}</span>
            </vp>
            <vp class="form-group col-4" tag="div" v-slot="v" rules="required">
              <label class="labelStyle">{{ $t("addChannelView.type") }}</label>
              <div class="input-class">
                <select class="form-control inputWidth" v-validate="v" v-model="formData.chType">
                  <option value="">{{ $t("addChannelView.choose") }}</option>
                  <option value="0">{{ $t("tvChannel.type0") }}</option>
                  <option value="1">{{ $t("tvChannel.type1") }}</option>
                  <option value="2">{{ $t("tvChannel.type2") }}</option>
                  <option value="3">{{ $t("tvChannel.type3") }}</option>
                  <option value="4">{{ $t("tvChannel.type4") }}</option>
                  <option value="5">{{ $t("tvChannel.type5") }}</option>
                  <option value="6">{{ $t("tvChannel.type6") }}</option>
                  <option value="7">{{ $t("tvChannel.type7") }}</option>
                  <option value="8">{{ $t("tvChannel.type8") }}</option>
                  <option value="9">{{ $t("tvChannel.type9") }}</option>
                  <option value="10">{{ $t("tvChannel.type10") }}</option>
                  <option value="11">{{ $t("tvChannel.type11") }}</option>
                  <option value="12">{{ $t("tvChannel.type12") }}</option>
                  <option value="1000">{{ $t("tvChannel.type1000") }}</option>
                </select>
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("addChannelView.v-choose") }}</span>
            </vp>
            <vp class="form-group col-4" v-if="isEdit" tag="div" v-slot="v" rules="required">
              <label class="labelStyle">{{ $t("addChannelView.sort") }}</label>
              <div class="input-class">
                <input
                  class="inputWidth form-control"
                  v-validate="v"
                  type="text"
                  v-model="formData.sort"
                />
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("addChannelView.v-write") }}</span>
            </vp>
            <vp class="form-group col-4" tag="div" v-slot="v" rules="required">
              <label class="labelStyle">{{ $t("addChannelView.code") }}</label>
              <div class="input-class">
                <input
                  class="inputWidth form-control"
                  v-validate="v"
                  type="text"
                  v-bind:disabled="disabled"
                  v-model="formData.code"
                />
              </div>
              <span class="err" v-if="v.errors[0]">{{ $t("addChannelView.v-write") }}</span>
            </vp>

            <div class="form-group col-4" v-for="item in langList" :key="item.langId">
              <label class="labelStyle">{{ item.langLabel }}</label>
              <div class="input-class">
                <input
                  class="inputWidth form-control"
                  type="text"
                  v-model="langName['l' + item.langId]"
                  :placeholder="please"
                />
              </div>
            </div>
            <!-- </vp> -->
          </div>

          <div class="btnStyle">
            <button type="submit" class="btn btn-primary mr-1">
              {{ $t("addChannelView.ok") }}
            </button>
            <button type="button" class="btn btn-light" @click="$emit('update:isShow', true)">
              {{ $t("addChannelView.back") }}
            </button>
          </div>
        </form>
      </vo>
    </div>
  </div>
</template>

<script>
class form {
    constructor() {
      this.chType= ""
        this.code= ""
       this.isDomestic= ""
        this.sort=""
  }
}
import TvChannelApi from "@/api/hotelTv/TvChannelApi";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    langList: {
      type: Array,
      default: []
    },
    currChannel: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      please: this.$t("addChannelView.please"),
      isEdit: false,
      formData: new form(),
      langName: {},
      disabled: false
    };
  },
  created() {
    if (this.currChannel) {
      this.formData = this.currChannel.channel;
      this.langName = this.currChannel.name;
      this.isEdit = true;
      this.disabled = true;
    } else {
      this.disabled = false;
      this.isEdit = false;
      this.formData = new form();
      this.langName = {};
    }
  },
  methods: {
    // test(handleSubmit, valid) {
    //   console.log(valid)
    //   console.log(this.$refs.vo, this.$refs.vo.valid)
    // },
    // 添加/编辑频道
    async submit() {
      // console.log(55);
      try {
        const list = {};
        list.channel = { ...this.formData };
        list.name = { ...this.langName };
        // console.log(list);
        let arr = Object.keys(this.langName);
        let flag = false;
        for (let i = 0; i < arr.length; i++) {
          let str = arr[i];
          // console.log(str);
          if (
            str !== "id" &&
            str.startsWith("l") &&
            this.langName[str] !== null &&
            this.langName[str] !== ""
          ) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          return this.$message({ message: `${this.$t("addChannelView.confirm.ChName")}`, type: "warning" });
        }
        if (!this.currChannel) {
          // console.log("add");

          await TvChannelApi.addChannelApi(list);
        } else {
          await TvChannelApi.updateChannelApi(list);
        }
        await this.$info(`${this.$t("confirm.success")}`)
        this.$parent.getList();
        this.$emit("update:isShow", true);
      } catch (error) {
        console.log(error);
        swal({
          title: `${this.$t("confirm.fail")}`,
          icon: "error",
          buttons: `${this.$t("confirm.ok")}`
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .formStyle {
//   position: fixed;
//   left: 25%;
// }
.form-control {
  width: 300px !important;
  display: inline;
}
.input-class {
  display: inline;
  width: 95%;
}
::v-deep .el-input__inner {
  width: 300px;
}
.inputWidth {
  width: 100%;
  margin-bottom: 8px;
}
.labelStyle {
  margin-right: 30px;
  display: inline-block;
  width: 130px;
  text-align: right;
}
.labelStyle ::before {
  content: "*";
  position: relative;
  color: red;
}
.btnStyle {
  position: fixed;
  right: 9%;
}
.btnStyle .btn:nth-child(2) {
  background: #d3d3d3;
}
.err {
  display: block;
  font-size: 12px;
  position: absolute;
  left: 145px;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
  margin-top: -5px;
}
</style>
