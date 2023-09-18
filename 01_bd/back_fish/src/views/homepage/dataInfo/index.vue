<template>
  <div class="data_info">
    <div class="custom_title">数据源信息</div>
    <div class="custom_countent">
      <div class="statistics">
        <!-- 每一个 -->
        <div class="statistics_everyone">
          <div class="statistics_pic">
            <img src="/img/ui/satellite.png" class="pic_style" alt="" />
          </div>
          <div class="statistics_info">
            <div class="big_title">卫星图片</div>
            <div class="title_num">{{ numlist.STA }} <span>张</span></div>
          </div>
        </div>
        <!-- 每一个 -->
        <div class="statistics_everyone">
          <div class="statistics_pic">
            <img src="/img/ui/social.png" class="pic_style" alt="" />
          </div>
          <div class="statistics_info">
            <div class="big_title">社交媒体</div>
            <div class="title_num">{{ numlist.SM }} <span>张</span></div>
          </div>
        </div>
        <!-- 每一个 -->
        <div class="statistics_everyone">
          <div class="statistics_pic">
            <img src="/img/ui/camera.png" class="pic_style" alt="" />
          </div>
          <div class="statistics_info">
            <div class="big_title">Camera</div>
            <div class="title_num">{{ numlist.WC }} <span>张</span></div>
          </div>
        </div>
        <!-- 每一个 -->
        <div class="statistics_everyone">
          <div class="statistics_pic">
            <img src="/img/ui/place.png" class="pic_style" alt="" />
          </div>
          <div class="statistics_info">
            <div class="big_title">AIS数据</div>
            <div class="title_num">{{ numlist.AIS }} <span>张</span></div>
          </div>
        </div>
        <!-- 每一个 -->
        <div class="statistics_everyone">
          <div class="statistics_pic">
            <img src="/img/ui/contract.png" class="pic_style" alt="" />
          </div>
          <div class="statistics_info">
            <div class="big_title">工业合同</div>
            <div class="title_num">{{ numlist.IC }} <span>张</span></div>
          </div>
        </div>
      </div>

      <div class="data_add_num">
        <div class="num_info">今日新增数据</div>
        <div class="num_coutent">
          <div class="bg_num" v-for="(i, j) in numlistCount" :key="j">
            {{ i }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 多源数据列表统计增量数据 } from "@/api/homepage/homepage.js";
export default {
  data() {
    return {
      num: 863,
      numlist: {
        SM: 0,
        WC: 0,
        STA: 0,
        AIS: 0,
        IC: 0,
      },
    };
  },
  computed: {
    numlistCount() {
      let arr = String(this.num).split("");
      if (arr.length > 5 && this.num > 9999) {
        arr = [9, 9, 9, 9, "+"];
      } else if (arr.length != 5) {
        let num = 5 - arr.length;
        for (let i = 0; i < num; i++) {
          arr.unshift(0);
        }
      }
      return arr;
    },
  },
  created() {
    this.getAlldata();
  },
  methods: {
    async getAlldata() {
      let params = {
        startTime: new Date().setDate(new Date().getDate() - 7),
        endTime: new Date().getTime(),
      };
      let res = await 多源数据列表统计增量数据(params);
      let obj = {
        SM: 0,
        WC: 0,
        STA: 0,
        AIS: 0,
        IC: 0,
      };
      for (let key in res.rows) {
        let kv = res.rows[key];
        obj[kv.dataSource] = kv.count;
      }
      this.num = eval(Object.values(obj).join("+"));
      this.numlist = obj;
    },
  },
};
</script>

<style lang="scss" scoped>
$customTitle: 30px;
.data_info {
  // height: 60%;
  height: calc(100% / 3 * 2);
  width: calc(20% - 5px);
  margin-left: 5px;
  // margin-bottom: 5px;
  padding: 5px;
  // background-color: yellow;
}
.custom_title {
  height: $customTitle;
  // background-color: green;
  font-size: 14px;
  padding: 5px;

  font-weight: 700;
  color: #fff;
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
}
.custom_countent {
  margin-top: 5px;
  height: calc(100% - #{$customTitle} - 5px);

  .statistics {
    height: 80%;
    width: 100%;
    .statistics_everyone {
      display: flex;
      height: calc(100% / 5);
      width: 100%;
      padding: 5px;
      .statistics_pic {
        height: 100%;
        .pic_style {
          height: 100%;
          padding: 5px;
        }
      }
      .statistics_info {
        // margin-top: 5%;
        margin-left: 7%;
        font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
        .big_title {
          font-weight: 700;
          font-style: normal;
          color: #ffffff;
          font-size: 18px;
        }
        .title_num {
          font-weight: 700;
          font-style: normal;
          font-size: 36px;
          color: #35d6da;
          span {
            font-size: 16px;
            color: #ffffff;
          }
        }
      }
    }
  }
  .data_add_num {
    height: 20%;
    width: 100%;
    padding: 5px;
    .num_info {
      color: #fff;
      font-size: 14px;
      height: 20px;
    }
    .num_coutent {
      display: flex;
      height: calc(100% - 20px);
      .bg_num {
        background: url("/img/ui/bgnum.png");
        background-size: 100% 100%;
        width: calc(100% / 4);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "04b_21 ", "04b_21", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
}
</style>