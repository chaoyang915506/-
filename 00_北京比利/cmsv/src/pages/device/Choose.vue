<template>
  <div class="container-fluid">
    <div class="row">
      <h1>请选择酒店，然后进入酒店运营界面</h1>
    </div>
    <div class="row">
      <div class="col-sm-2">
        <div class="row">
          <div class="col-sm-3 text-left label">城市:</div>
          <div class="col-sm-8">
            <cool-slot-select @change="cityChange" v-model="city">
              <option value="">全部</option>
              <option value="北京">北京</option>
              <option value="天津">天津</option>
              <option value="天津">深圳</option>
              <option value="石家庄">石家庄</option>
              <option value="上海">上海</option>
              <option value="长沙">长沙</option>
              <option value="西安">西安</option>
              <option value="兰州">兰州</option>
              <option value="台北">台北</option>
              <option value="香港">香港</option>
              <option value="青岛">青岛</option>
              <option value="三亚">三亚</option>
              <option value="厦门">厦门</option>
              <option value="丽江">丽江</option>
            </cool-slot-select>
          </div>
        </div>
      </div>

      <div class="col-sm-2">
        <div class="row">
          <div class="col-sm-3 text-left label">名称:</div>
          <div class="col-sm-8">
            <input @change="keywordChange" v-model="keyword" class="form-control" type="text" />
          </div>
        </div>
      </div>
    </div>

    <br />
    <div class="row">
      <div v-for="(item, idx) in res" :key="idx" class="col-sm-2">
        <div @click="handleClick(item.hotelId)" class="nodes">
          <div class="img">
            <img width="100%" :src="item.hotelImage" alt="" />
          </div>
          <div class="titles">
            {{ item.hotelName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CoolSlotSelect from "@/components/CoolSlotSelect.vue";
import BasicSystem from "@/api/BasicSystem";
import env from "@/env";

export default {
  name: "Choose",
  components: {
    CoolSlotSelect
  },
  data() {
    return {
      hotellists: [],
      res: [],
      city: "",
      keyword: ""
    };
  },
  methods: {
    init: async function() {
      try {
        this.res = this.hotellists = await BasicSystem.getHotels(env.token);
      } catch (e) {
        console.log(e);
      }
    },
    handleClick: function(val) {
      this.$router.push({
        path: "/cmsv/device/index.html",
        query: {
          hotelId: val,
          token: env.token
        }
      });
    },
    keywordChange: function() {
      this.res = this.hotellists.filter(item => {
        return item["hotelName"].includes(this.keyword);
      });
    },
    cityChange: function() {
      this.res = this.hotellists.filter(item => {
        return item["city"].includes(this.city);
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.label {
  width: 100%;
  height: 38px;
  line-height: 38px;
}
.titles {
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center !important;
}
.img {
  width: 200px;
  height: 120px;
  margin: 0 auto;
}

.nodes {
  width: 200px;
  margin: 0 auto;
  border: solid 1px rgb(122, 119, 119);
  margin-top: 20px;
  cursor: pointer;
}
</style>
