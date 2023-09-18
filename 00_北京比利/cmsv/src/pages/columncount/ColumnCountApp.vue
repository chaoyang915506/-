<template>
  <div
    class="container-fluid row"
    style="overflow: auto; width: 100%; height: 100%;display: flex;
    justify-content: center;"
  >
    <!-- 表单区域 v-if="form.itemId !== ''"-->
    <div class="col-12">
      <h2>栏目内容管理</h2>
      <div class="form-group row" style="align-items: center;">
        <label class="col-3 mt-3">栏目所属{{ vendor }}</label>
        <div class="col-9" style="font-size:18px;font-weight:700">
          {{ coluntName }}
        </div>
      </div>
      <div class="card text-center" style="padding:0">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item mr-1 mb-1" style="min-width:6%;">
              <label class="col-form-label">
                <i class="bi bi-plus-circle col-1 logo changeColor" @click="addcount"> </i>
              </label>
            </li>
            <li
              class="nav-item mr-1 mb-1"
              v-for="(item, index) in formDataA"
              :key="index"
              @mouseenter="mouseenter(item[0].itemBasicMiId)"
              @mouseleave="crossStyle = ''"
            >
              <a
                class="nav-link"
                :class="[{ 'active fontColor': langindex == item[0].itemBasicMiId }]"
                href="#"
                @click="langindex = item[0].itemBasicMiId"
                >{{ getMiname(item) }}
                <i
                  :style="[
                    { visibility: crossStyle == item[0].itemBasicMiId ? 'visible' : 'hidden' },
                    { float: 'right' }
                  ]"
                  class="bi bi-x ml-1 mr-1"
                  @click.stop="remove(item[0].itemBasicMiId, index, getMiname(item))"
                ></i
              ></a>
            </li>
          </ul>
        </div>
        <div class="card-body ">
          <vo ref="vo" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(submit)">
              <div
                v-for="(inx, index) in formDataA"
                :key="index"
                v-if="formDataA.length > 0"
                class="col-12 row"
              >
                <div
                  v-for="(item, index) in inx"
                  :key="item.count"
                  :class="[languageList.length > 1 ? 'col-6' : 'col-12']"
                  :style="[
                    { padding: '2% 0', marginBottom: ' 1%' },
                    { borderBottom: languageList.length > 2 ? '1px dashed black' : '0px' },
                    {
                      borderBottom:
                        (languageList.length % 2 == 0 && languageList.length == index + 1) ||
                        (languageList.length % 2 == 0 && languageList.length - 2 == index) ||
                        (languageList.length % 2 == 1 && languageList.length == index + 1)
                          ? '0px'
                          : '1px dashed black'
                    }
                  ]"
                  v-show="langindex == item.itemBasicMiId"
                >
                  <column-from
                    :value="item"
                    :ref="'colum' + item.count"
                    :languageList="languageList"
                  ></column-from>
                </div>
              </div>
              <div v-if="formDataA.length == 0" class="col-12">
                <h4 style="padding:3% 2%">当前栏目内容为空点击+号添加栏目内容</h4>
              </div>

              <!-- 提交 -->
              <div
                class="form-group col-12"
                ref="btn"
                style="    text-align: left;    padding-left: 6%;"
              >
                <button type="button" class="btn btn-secondary mr-1" @click="back">
                  返回
                </button>
                <button type="submit" @click="endSubmit" class="btn btn-primary mr-1">
                  确定
                </button>
              </div>
            </form>
          </vo>
        </div>
      </div>
    </div>
    <cool-loading :loading="loading"></cool-loading>
  </div>
</template>

<script>
import ColumnFrom from "./ColumnFrom.vue";
class fromDa {
  constructor() {
    this.itemId = null; //选中的id号
    this.miName = ""; //内容名称
    this.miType = ""; //0-图片 1-视频自己造的2为视频+图片
    this.miVideoType = ""; //视频文件类型
    this.miMovieType = ""; //影片类型
    this.miDefault = 0; //省数据
    this.miArea = null; //中国
    this.miCompany = null; //出票机构
    this.miYear = null; //出票年份
    this.isEnable = 1;
    this.miStatus = 0; //状态
    this.miId = "";
    this.miImage = ""; //a图片地址
    this.miImage1 = ""; //b图片地址
    this.miImage2 = ""; //c图片地址
    this.miImage3 = ""; //d图片地址
    this.miImage4 = ""; //e图片地址
    this.videoPlayUrl = null; //视频地址
    this.sort = ""; //内容排序
    this.langId = null;
    this.title = null;
    this.desc = null;
    this.itemBasicMiId = "-999";
    this.miValidEnd = null;
    this.miValidStart = null;
    this.count = (Math.random() * 1).toString().slice(10);
  }
}
import CoolFileInput from "@/components/CoolFileInput.vue";
import CoolModal from "@/components/CoolModal.vue";
import ColumnCountApi from "@/api/ColumnCountApi.js";
import UploadApi from "@/api/UploadApi";
import env from "@/env";
import CoolLoading from "@/components/CoolLoading.vue";
import Axios from "axios";
import $ from "jquery";
export default {
  data() {
    return {
      vendor: env.vendor,
      langindex: "",
      coluntName: "",
      languageList: [], //语言
      formDataA: [], //全部的数据表单
      itemIds: [], //查询itemids的数组
      itemBasicId: "", //新老页面传的itemBasicId
      crossStyle: "", //xx的显示
      timmer: "",
      loading: false,
      conditon: true //校验
    };
  },
  components: { CoolFileInput, CoolModal, CoolLoading, ColumnFrom },
  created() {
    this.getAllTData();
  },
  props: {
    tranfer: {
      type: Object,
      default: null
    }
  },
  beforeDestroy() {
    clearTimeout(this.timmer);
  },
  methods: {
    endSubmit() {
      let contain = true;
      let formDD = this.formDataA.map(idx => {
        return idx.map(itm => {
          delete this.$refs["colum" + itm.count][0].item.count;
          // delete this.$refs["colum" + itm.count][0].item.langId;
          return { ...this.$refs["colum" + itm.count][0].item, itemBasicMiId: "" };
        });
      });
      for (let i = 0; i < formDD.length; i++) {
        for (let j = 0; j < formDD[i][j].length; i++) {
          if (this.formDD[i][j].miName == "") {
            contain = false;
            this.$error("内容名称不能为空");
            break;
          } else if ((this.formDD[i][j].miType = "")) {
            contain = false;
            this.$error("媒咨内容类型为空");
            break;
          } else if ((this.formDD[i][j].sort = "")) {
            contain = false;
            this.$error("内容排序为空");
            break;
          } else {
          }
        }
      }
      if (contain == true) {
        return formDD;
      } else {
        return false;
      }
    },
    getAllTData() {
      let data;
      if (this.tranfer !== null) {
        data = this.tranfer;
        this.itemBasicId = this.tranfer.itemBasicId;
      } else {
        var reg = new RegExp("(^|&)" + "itemBasicId" + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        this.itemBasicId = r[2];
        data = { itemBasicId: r[2] };
      }
      Axios.all([ColumnCountApi.getLangHotel(), ColumnCountApi.getItemId(data)])
        .then(
          Axios.spread((language, it) => {
            this.languageList = language; //保存数据
            this.itemIds = it;
            this.getdata(it);
          })
        )
        .catch(err => {
          console.log(err);
        });
      //获取酒店名称
      ColumnCountApi.gethomepage().then(data => {
        let hotelName = data.find(i => i.hotelId == env.hotelId);
        if (hotelName) this.coluntName = hotelName.hotelName;
      });
    },
    getMiname(item) {
      let str = "";
      if (item.every(i => i.itemBasicMiId == "-999") == false) {
        item.forEach((id, j) => {
          if (j == 0) {
            str = str + id.miName;
          } else {
            str = str + "+" + id.miName;
          }
        });
      } else {
        str = "新增栏目内容页面";
      }
      return str;
    },
    mouseenter(item) {
      clearTimeout(this.timmer);
      this.timmer = setTimeout(() => {
        this.crossStyle = item;
      }, 100);
    },
    //新增栏目内容
    addcount() {
      if (this.formDataA.length > 0) {
        let data = this.formDataA.flat().find(i => i.itemBasicMiId == "-999");
        if (data) {
          return this.$error("同时只能新增一条栏目内容");
        }
      }
      this.formDataA.push(
        this.itemIds.map(item => {
          return { ...new fromDa(), langId: item.langId, itemId: item.itemId };
        })
      );

      this.langindex = "-999";
    },
    //删除一个栏目内容
    async remove(i, index, name) {
      let res = await this.$confirm(
        "谨慎操作",
        `确定删除当前第${index + 1}个,栏目内容为 ${name} 吗?`
      );
      if (!res) return;
      this.formDataA.splice(index, 1);
      if (i == this.langindex) {
        this.langindex = this.formDataA[0][0].itemBasicMiId;
      }
    },
    async getdata(it) {
      try {
        //这个是获取当前栏目内容的全部描述表
        let data = await ColumnCountApi.getcolument(it.map(it => it.itemId));
        let arr = [];
        let filterData;
        data.forEach((i, j) => {
          i["count"] = j + 1;
          // i["count"] = (Math.random() * 1).toString().slice(-10);
        });
        [...new Set(data.map(i => i.itemBasicMiId))].forEach(idx => {
          filterData = data.filter(it => it.itemBasicMiId == idx);
          if (filterData) {
            arr.push(filterData);
          }
        });
        this.formDataA = arr.map(i =>
          i.map(idx => {
            let data = this.itemIds.find(it => it.itemId == idx.itemId);
            return {
              ...idx,
              langId: data.langId
            };
          })
        );
        this.langindex = this.formDataA[0][0].itemBasicMiId;
      } catch (error) {
        console.log(error);
      }
    },
    back() {
      if (this.tranfer !== null) {
        this.$emit("clearform");
      } else {
        window.location.href = `${env.cms}/cms/cmsItemHotelController/itemList?hotelId=${env.hotelId}&token=${env.token}`;
      }
    },
    // 判断是新增还是修改
    async submit() {
      let formDD;
      this.loading = true;
      if (this.endSubmit() !== false) {
        formDD = this.endSubmit();
      }
      // let formDD = this.formDataA.map(idx => {
      //   return idx.map(itm => {
      //     delete this.$refs["colum" + itm.count][0].item.count;
      //     delete this.$refs["colum" + itm.count][0].item.langId;
      //     return { ...this.$refs["colum" + itm.count][0].item, itemBasicMiId: "" };
      //   });
      // });
      // console.log(this.endSubmit(), "why");
      await ColumnCountApi.editColument({
        itemBasicId: this.itemBasicId,
        list: formDD.flat()
      });
      this.loading = false;
      swal({
        title: "操作成功",
        icon: "success",
        buttons: true,
        buttons: ["继续查看", "返回"]
      }).then(res => {
        if (res == true) {
          this.back();
        } else {
          this.getAllTData();
          window.scrollTo(0, 0);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/public.scss"; //上传文件的样式
.borderStyle {
  border-bottom: 1px dashed black;
}
.rd {
  border: 0;
}
</style>
