<template>
  <div class="app-container">
    <div class="back" @click="back">返回</div>

    <div class="topcart">
      <!-- 基地 -->
      <div class="jdcss">
        <div class="tilte_css">基地</div>
        <div class="all_tit_content">
          <div @click="alljd(mugangdata, 1)" class="everyoneinfo">全部</div>
          <div
            :class="[
              getcss(i.harborId, army) ? 'activeinfo' : '',
              'everyoneinfo',
            ]"
            v-for="i in mugangdata"
            :key="i.harborId"
            @click="additem(i.harborId, 1, army)"
          >
            {{ i.harborNameZh }}
          </div>
        </div>
      </div>

      <div class="bd_css1">
        <div class="tilte_css">部队</div>
        <div class="border_css">
          <!-- 部队一级 -->
          <div class="bd_css">
            <div @click="alljd(troops1, 2)" class="everyoneinfo">全部</div>
            <div
              :class="[
                getcss(i.id, troopsdata1) ? 'activeinfo' : '',
                'everyoneinfo',
              ]"
              v-for="i in troops1"
              :key="i.id"
              @click="additem(i.id, 2, troopsdata1)"
            >
              {{ i.name }}
            </div>
          </div>

          <!-- 部队二级 -->
          <div class="bd_css" v-if="troops2.length > 0">
            <div @click="alljd(troops2, 3)" class="everyoneinfo">全部</div>
            <div
              :class="[
                getcss(i.id, troopsdata2) ? 'activeinfo' : '',
                'everyoneinfo',
              ]"
              v-for="i in troops2"
              :key="i.id"
              @click="additem(i.id, 3, troopsdata2)"
            >
              {{ i.name }}
            </div>
          </div>
          <!-- 部队三级 -->
          <div class="bd_css" v-if="troops3.length > 0">
            <div @click="alljd(troops3, 4)" class="everyoneinfo">全部</div>
            <div
              :class="[
                getcss(i.id, troopsdata3) ? 'activeinfo' : '',
                'everyoneinfo',
              ]"
              v-for="i in troops3"
              :key="i.id"
              @click="additem(i.id, 4, troopsdata3)"
            >
              {{ i.name }}
            </div>
          </div>
          <!-- 潜艇 -->
          <div class="bd_css" v-if="troops8.length > 0">
            <div @click="alljd(troops8, 8)" class="everyoneinfo">全部</div>
            <div
              :class="[
                getcss(i.name, troopsdata8) ? 'activeinfo' : '',
                'everyoneinfo',
              ]"
              v-for="i in troops8"
              :key="i.id"
              @click="additem(i.name, 8, troopsdata8)"
            >
              {{ i.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="jdcss">
        <div class="tilte_css">职位</div>
        <div class="all_tit_content">
          <div @click="alljd(position, 5)" class="everyoneinfo">全部</div>
          <div
            :class="[
              getcss(i, positionlist) ? 'activeinfo' : '',
              'everyoneinfo',
            ]"
            v-for="i in position"
            :key="i"
            @click="additem(i, 5, positionlist)"
          >
            {{ i }}
          </div>
        </div>
      </div>
    </div>
    <!-- 人物关系 -->
    <div class="presonage_content" id="concern">
      <div class="ittle_info">
        <span></span>&emsp;人物列表({{ zzrydata.length }}人)
        <div class="clearnames" @click="clearnames">清空条件</div>
      </div>
      <div class="info_content">
        <!-- <div class="title_ab">同事(26)</div> -->
        <div class="character">
          <div
            class="relation"
            @click="addinfo(it)"
            v-for="(it, j) in zzrydata"
            :key="j"
          >
            <div class="pic_ba">
              <img
                :src="imgurl + it.imagePath"
                alt=""
                onerror="this.src='/img/ui/u1635.svg'"
                class="pic_cl"
              />
            </div>
            <div class="poeple_css">
              <div class="info">{{ it.zhName }}</div>
              <div class="desc">{{ it.zw }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  查询母港信息,
  查询组织机构,
  组织人员列表,
} from "@/api/institutional/institutional.js";
import { 查询图片服务器地址 } from "@/api/situation/situation";
import bus from "@/utils/bus.js";
export default {
  props: {
    imgurl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      params: null, //要转存的参数
      imgurl: "",
      img: "/img/ui/u1635.svg",
      jdlistmodel: [],
      mugangdata: [],
      treeData: [],
      zzrydata: [], //人员数据
      army: [], //基地
      troopsdata1: [], //部队一
      troopsdata2: [], //部队二
      troopsdata3: [], //部队三
      positionlist: [], //职位
      troopsdata8: [], //舰艇
      position: [
        "司令",
        "副司令",
        "军士长",
        "司令助理",
        "联队长",
        "副联队长",
        "大队长",
        "副大队长",
        "中队长",
        "副中队长",
        "艇长",
        "其他",
      ],
    };
  },
  computed: {
    // getcss() {
    //   return (i, j, resdata) => {
    //     // if (j == 1) {
    //     let resuts;
    //     if (this.army.length !== 0) {
    //       resuts = this.army.findIndex((idx) => idx == i);
    //       return resuts != -1 ? true : false;
    //     } else {
    //       return false;
    //     }
    // }

    // console.log(i, resdata, "shenm");
    // let resuts;
    // if (resdata != undefined) {
    //   resuts = resdata.findIndex((idx) => idx == i);
    //   return resuts != -1 ? true : false;
    // } else {
    //   return false;
    // }
    //   };
    // },
    troops1() {
      return this.treeData;
    },
    troops2() {
      let arr = [];
      this.troopsdata1.forEach((i) => {
        let result = this.troops1.find((d) => d.id == i);
        if (result) {
          arr.push(...result.children);
        }
      });
      return arr;
    },
    troops3() {
      let arr = [];
      let reg1 = RegExp("中队", "i");
      let reg2 = RegExp("大队", "i");

      this.troopsdata2.forEach((i) => {
        let result = this.troops2.find((d) => d.id == i);
        let datar = result.children.filter((i) => {
          return reg1.test(i.name) || reg2.test(i.name);
        });
        if (datar.length > 0) {
          arr.push(...datar);
        }
      });
      return arr;
    },
    troops8() {
      let arr = [];
      let reg1 = RegExp("中队", "i");
      let reg2 = RegExp("大队", "i");
      let datar;
      this.troopsdata2.forEach((i) => {
        let result = this.troops2.find((d) => d.id == i);
        datar = result.children.filter((i) => {
          return reg1.test(i.name) == false && reg2.test(i.name) == false;
        });
        if (datar.length > 0) {
          arr.push(...datar);
        }
      });
      this.troopsdata3.forEach((item) => {
        let result = this.troops3.find((d) => d.id == item);
        let datar = result.children.filter((i) => {
          return !reg1.test(i.name) && !reg2.test(i.name);
        });
        if (datar.length > 0) {
          arr.push(...datar);
        }
      });
      return arr;
    },
  },
  mounted() {
    // console.log(this.$parent.tags, "this");
    // this.$nextTick(() => {
    查询图片服务器地址().then((res) => {
      // console.log(res.data.imageServerUri);
      this.imgurl = res.data.imageServerUri;
      // console.log(this.imgurl, "rrrr");
    });

    查询母港信息().then((res) => {
      //   console.log(res.rows, "母港");
      this.mugangdata = res.rows.map((i) => {
        return {
          ...i,
          harborNameZh: i.harborNameZh.split("，")[0],
        };
      });
    });
    查询组织机构().then((res) => {
      //   console.log(res.rows);
      this.treeData = res.rows[0].children;
    });
    this.getzzsize();
  },

  methods: {
    // 组织人员筛选
    async getzzsize() {
      let r = localStorage.getItem("peoplelist");
      // console.log(newdata, "newdata");
      if (r) {
        // console.log(newdata, "right");
        // this.$nextTick(() => {
        let lastdata = JSON.parse(r);
        // let r = JS ON.parse(newdata);
        // console.log(r);
        this.army = lastdata.army;
        this.troopsdata1 = lastdata.troopsdata1;
        this.troopsdata2 = lastdata.troopsdata2;
        this.troopsdata3 = lastdata.troopsdata3;
        this.positionlist = lastdata.positionlist;
        this.troopsdata8 = lastdata.troopsdata8;
        // });
        localStorage.removeItem("peoplelist");
      }
      this.params = {
        harborIds: this.army ? this.army.join(",") : "",
        zws: this.positionlist ? this.positionlist.join(",") : "",
        orgIds:
          [...this.troopsdata1, ...this.troopsdata2, ...this.troopsdata3]
            .length > 0
            ? [
                ...this.troopsdata1,
                ...this.troopsdata2,
                ...this.troopsdata3,
              ].join(",")
            : "",
        sideNums: this.troopsdata8.join(","),
      };
      // }
      // console.log(params, "red");
      let res = await 组织人员列表(this.params);
      // console.log(res, "结构");
      this.zzrydata = res.rows;
    },
    // 清空条件
    clearnames() {
      this.army = [];
      this.troopsdata1 = [];
      this.troopsdata2 = [];
      this.troopsdata3 = [];
      this.positionlist = [];
      this.getzzsize();
    },
    // 点全部 valuelist取的值 datachange是双向绑定的数据
    alljd(valuelist, index) {
      if (index == 1) {
        if (this.army.length == valuelist.length) {
          this.army = [];
        } else {
          this.army = valuelist.map((i) => i.harborId);
        }
      } else if (index == 2) {
        if (this.troopsdata1.length == valuelist.length) {
          this.troopsdata1 = [];
        } else {
          this.troopsdata1 = valuelist.map((i) => i.id);
        }
      } else if (index == 3) {
        if (this.troopsdata2.length == valuelist.length) {
          this.troopsdata2 = [];
        } else {
          this.troopsdata2 = valuelist.map((i) => i.id);
        }
      } else if (index == 4) {
        if (this.troopsdata3.length == valuelist.length) {
          this.troopsdata3 = [];
        } else {
          this.troopsdata3 = valuelist.map((i) => i.id);
        }
      } else if (index == 5) {
        if (this.positionlist.length == valuelist.length) {
          this.positionlist = [];
        } else {
          this.positionlist = valuelist;
        }
      } else if (index == 8) {
        // console.log(valuelist, "下");
        if (this.troopsdata8.length == valuelist.length) {
          this.troopsdata8 = [];
        } else {
          this.troopsdata8 = valuelist.map((i) => i.name);
        }
      }
      this.getzzsize();
    },
    //新增或者删除
    additem(i, index, data) {
      let resuts;

      if (index == 1) {
        resuts = this.army.findIndex((id) => id == i);
        // console.log(resuts, "make", i);
        if (resuts == -1) {
          this.army = [...this.army, i];
        } else {
          this.army = this.army.filter((idx) => idx != i);
        }
      } else if (index == 2) {
        resuts = this.troopsdata1.findIndex((id) => id == i);
        if (resuts == -1) {
          this.troopsdata1.push(i);
          // console.log(this.troopsdata2, "-1er");
        } else {
          this.troopsdata1 = this.troopsdata1.filter((idx) => idx != i);
        }
      } else if (index == 3) {
        resuts = this.troopsdata2.findIndex((id) => id == i);
        if (resuts == -1) {
          this.troopsdata2.push(i);
        } else {
          this.troopsdata2 = this.troopsdata2.filter((idx) => idx != i);
        }
      } else if (index == 4) {
        resuts = this.troopsdata3.findIndex((id) => id == i);
        if (resuts == -1) {
          this.troopsdata3.push(i);
        } else {
          this.troopsdata3 = this.troopsdata3.filter((idx) => idx != i);
        }
      } else if (index == 5) {
        resuts = this.positionlist.findIndex((id) => id == i);
        if (resuts == -1) {
          this.positionlist.push(i);
        } else {
          this.positionlist = this.positionlist.filter((idx) => idx != i);
        }
      } else if (index == 8) {
        resuts = this.troopsdata8.findIndex((id) => id == i);
        if (resuts == -1) {
          this.troopsdata8.push(i);
        } else {
          this.troopsdata8 = this.troopsdata8.filter((idx) => idx != i);
        }
      }
      this.getzzsize();
      console.log(this.army, "加完后");
      // console.log(this.troopsdata1, "rsed");
    },
    //查询是否包含显示高亮
    getcss(i, resdata) {
      let resuts;
      if (resdata != undefined) {
        resuts = resdata.findIndex((idx) => idx == i);
        return resuts != -1 ? true : false;
      } else {
        return false;
      }
    },
    addinfo(i) {
      // this.$router.back();
      bus.$emit("updateid", i.orgUserId);
      localStorage.setItem(
        "peoplelist",
        JSON.stringify({
          army: this.army,
          troopsdata1: this.troopsdata1,
          troopsdata2: this.troopsdata2,
          troopsdata3: this.troopsdata3,
          positionlist: this.positionlist,
          troopsdata8: this.troopsdata8,
        })
      );
      // console.log(i.orgUserId, "red");
    },
    back() {
      // this.clearnames();
      window.localStorage.removeItem("peoplelist");
      this.$parent.$data.tags = false;
      this.$parent.$data.page = "home";
    },
  },
};
</script>

<style lang="scss" scoped>
.poeple_css {
  width: 80%;
}
.pic_ba {
  width: 20%;
  height: 100%;
  border: 1px solid transparent;
  display: table-cell;
  vertical-align: middle;
}
.pic_cl {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
.everyoneinfo {
  cursor: pointer;
  font-size: 14px;
}
.activeinfo {
  color: #148dd0;
}
.border_css {
  width: calc(100% - 80px);
  // border-bottom: 1px solid #797979;
}
.bd_css {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  align-content: center;
  margin-bottom: 10px;
  div {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
.bd_css1 {
  display: flex;

  margin-bottom: 10px;
}

.topcart {
  border-radius: 10px;
  background-color: #243051;
  padding: 1%;
  color: #fff;
}
.jdcss {
  display: flex;
  //   height: 50px;
  margin-bottom: 10px;
  //   align-content: center;
}
.tilte_css {
  width: 80px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
}
.all_tit_content {
  // border-bottom: 1px solid #797979;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  font-size: 14px;
  flex-wrap: wrap;
  word-break: break-all;
  padding-bottom: 10px;
  div {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}

.presonage_content {
  width: 100%;
  margin-top: 1%;
  //   min-height: 150px;
  min-height: 400px;
  padding: 5px;
  // display: flex;
  color: #fff;
  font-size: 14px;

  .ittle_info {
    // flex: 1;
    position: relative;
    width: 100%;
    background-color: #243051;
    padding: 5px;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1c284a;
    border-radius: 5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 1px solid #1c294a;

    span {
      display: inline-block;
      width: 4px;
      height: 100%;
      margin-right: 5px;
      background-color: #1487c8;
    }
  }

  .info_content {
    padding: 10px;
    height: 700px;
    overflow: auto;
    width: 100%;
    background-color: #243051;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    .perinfo {
      width: 50%;
    }

    .alas_message {
      // background-image: url();
    }
  }
}
.character {
  display: flex;
  flex-wrap: wrap;

  .relation {
    position: relative;
    border: 1px solid #4f4f4f;
    display: flex;
    margin: auto 0;
    padding: 10px;
    height: 100px;
    width: calc((100% - 40px) / 5);
    margin-top: 10px;
    margin-right: 10px;

    .pic_cl {
      // width: 25%;
      height: 100%;
    }
    .desc {
      position: absolute;
      top: 47%;
      left: 34%;
    }

    .info {
      position: absolute;
      top: 25%;
      left: 34%;
      word-break: break-all;
      //   margin-left: 10%;
    }
  }
}
.relation:nth-child(5n) {
  margin-right: 0;
}
.clearnames {
  cursor: pointer;
  position: absolute;
  bottom: 12%;
  right: 1%;
  color: #148dd0;
}
.back {
  position: absolute;
  left: 10px;
  top: 26px;
  z-index: 999;
  color: #0d9cb4;
  font-weight: 700;
  font-size: 17px;
}
</style>