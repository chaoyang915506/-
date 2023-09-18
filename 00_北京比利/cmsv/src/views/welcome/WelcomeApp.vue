<template>
  <div class="container-fluid" style="min-width: 1000px" v-if="views == 'have'">
    <div class="row">
      <div class="col-12" style="position: relative">
        <h2><span v-if="groupGuest !== null && groupGuest !== undefined">团客-</span>欢迎页管理</h2>
        <h4
          style="position: absolute; left: 24%; bottom: 1%"
          v-if="groupGuest !== null && groupGuest !== undefined"
        >
          {{ groupGuest.groupGuestName }}
        </h4>
      </div>
      <div class="col-8">
        <ul class="nav nav-tabs">
          <li v-for="l in langList" :key="l.langId" class="nav-item">
            <a
              class="nav-link"
              :class="{ active: curLang === l.langId }"
              @click="curLang = l.langId"
              >{{ l.label }}</a
            >
          </li>
        </ul>
        <div class="tab-content mt-3">
          <div
            v-for="welcome in welcomeList"
            :key="welcome.welcomeId"
            class="tab-pane fade show"
            :class="{ active: curLang === welcome.langId }"
          >
            <welcome-form
              :ref="'welcomeForm' + welcome.welcomeId"
              :value="welcome"
            
            />
          </div>
        </div>
        <div class="row" style="justify-content: left; margin: 0 0 1% 1%">
          <button class="btn btn-secondary" @click="returnhotel">返回</button>
          <button class="btn btn-primary ml-2" @click="update">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LangApi from "@/api/LangApi";
import WelcomeApi from "@/api/WelcomeApi";
import WelcomeForm from "./WelcomeForm.vue";
import Api from "@/api/Api";
import env from "@/env";
import Axios from "axios";
export default {
  name: "WelcomeApp",
  components: { WelcomeForm },
  data() {
    return {
      views: "have",
      langList: [],
      curLang: 0,
      welcomeList: [],
    };
  },
  props: {
    groupGuest: {
      type: Object,
      default: null,
    },
    tranfer: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async update() {
      const welcomeList = this.welcomeList
        .map((welcome) => {
          console.log(this.$refs["welcomeForm" + welcome.welcomeId][0].model, "for");
          return this.$refs["welcomeForm" + welcome.welcomeId][0].model;
        })
        .map((welcome) => {
          return {
            ...welcome,
            welcomeLogo: welcome.logo,
            strategyType: this.groupGuest !== null ? 1 : 0,
            groupGuestId: this.groupGuest !== null ? this.groupGuest.groupGuestId : 0,
          };
        });
      try {
        if (
          (this.groupGuest && this.groupGuest.groupGuestId == this.welcomeList[0].groupGuestId) ||
          this.groupGuest == null ||
          (this.groupGuest == null && !this.groupGuest.groupGuestId)
        ) {
          await WelcomeApi.updateMoreLang({ list: welcomeList });
        } else {
          let welcomeList1 = welcomeList.map((item) => {
            delete item.welcomeLogo;
            return item;
          });
          await WelcomeApi.addWelcome(welcomeList1);
        }
        await this.$info("更新成功");
        await this.getAllData();
        await this.returnhotel();
      } catch (error) {
        console.error(error);
        this.$error("更新欢迎页失败");
      }
    },
    returnhotel() {
      if (this.groupGuest !== null) {
        this.$emit("goBack");
      } else if (this.tranfer !== null && this.tranfer !== undefined) {
        this.$emit("goBack");
      } else {
        // location.href =
        //   '/cms/cmsItemHotelController/itemList?langId=' +
        //   common.getParameter('langId') +
        //   '&token=' +
        //   env.token
      }
    },
    getAllData() {
      let group = {
        strategyType: this.groupGuest !== null ? 1 : 0,
        priority: 0,
        groupGuestId: this.groupGuest !== null ? this.groupGuest.groupGuestId : 0,
      };
      this.getAllWeclome(group);
      LangApi.list().then((data) => {
        this.curLang = data[0].langId;
        this.langList = data;
      });
    },
    getAllWeclome(data) {
      Axios.get(
        `${env.cms}/cms/welcome/initwelcome?hotelId=${env.hotelId}&strategyType=${data.strategyType}&priority=${data.priority}&groupGuestId=${data.groupGuestId}&token=${env.token}`
      ).then((res) => {
        if (res.data.data !== null && res.data.data.list) {
          this.welcomeList = res.data.data.list;
          this.views = "have";
        } else if (res.data.data == null && res.data.code == "0x0017") {
          this.views = "none";
          this.returnhotel();
          this.$error(res.data.msg);
        }
      });
    },
  },
  created() {
    this.getAllData();
  },
};
</script>

<style scoped lang="scss">
::v-deep .fileinput-remove-button {
  display: block;
}
</style>
