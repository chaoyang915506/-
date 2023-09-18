<template>
  <div class="box">
    <div v-if="isShow">
      <h2>{{ $t("tvChannel.title") }}</h2>
      <CoolTable
        :options="options"
        :data="TvChannelList"
        :columns="columns"
        @edit-row="openAdd"
        @del-row="delChannel"
      >
        <button class="btn btn-primary mr-1" @click="openAdd()">
          {{ $t("tvChannel.addChannel") }}
        </button>
      </CoolTable>
    </div>
    <AddChannel v-else :isShow.sync="isShow" :langList="langList" :currChannel="currChannel" />
  </div>
</template>

<script>
import CoolTable from "@/components/CoolTable.vue";
import TvChannelApi from "@/api/hotelTv/TvChannelApi";
import AddChannel from "./addChannel.vue";
import Env from "@/env";
import { optionsUS } from "@/utils/bootstrapTable-i18n";
export default {
  components: { CoolTable, AddChannel },
  data() {
    return {
      TvChannelList: [], // 频道列表
      langList: [], // 语言列表
      isShow: true,
      columns: [],
      currChannel: null,
      column: [],
      options: {},
    };
  },
  created() {
    this.getList();
    this.getLang();
    if (Env.locale == "0") {
      this.column = [
        {
          field: "channel.chName",
          title: `${this.$t("tvChannel.chNmame")}`,
          align: "center"
        }
      ];
      this.options = {};
    } else {
      this.column = [
        {
          field: "channel.chEnName",
          title: `${this.$t("tvChannel.chEnName")}`,
          align: "center"
        }
      ];
      this.options = optionsUS
    }
    this.columns = [
      {
        field: "channel.chId",
        title: `${this.$t("tvChannel.chId")}`,
        align: "center"
      },
      ...this.column,
      {
        field: "channel.code",
        title: `${this.$t("tvChannel.code")}`,
        align: "center"
      },
      {
        field: "channel.chType",
        title: `${this.$t("tvChannel.chType")}`,
        align: "center",
        formatter: (val, row, idx) => {
          if (val == "0") return `${this.$t("tvChannel.type0")}`;
          if (val == "1") return `${this.$t("tvChannel.type1")}`;
          if (val == "2") return `${this.$t("tvChannel.type1")}`;
          if (val == "3") return `${this.$t("tvChannel.type1")}`;
          if (val == "4") return `${this.$t("tvChannel.type1")}`;
          if (val == "5") return `${this.$t("tvChannel.type1")}`;
          if (val == "6") return `${this.$t("tvChannel.type1")}`;
          if (val == "7") return `${this.$t("tvChannel.type1")}`;
          if (val == "8") return `${this.$t("tvChannel.type1")}`;
          if (val == "9") return `${this.$t("tvChannel.type1")}`;
          if (val == "10") return `${this.$t("tvChannel.type1")}`;
          if (val == "11") return `${this.$t("tvChannel.type1")}`;
          if (val == "12") return `${this.$t("tvChannel.type1")}`;
          if (val == "1000") return `${this.$t("tvChannel.type1")}`;
        }
      },
      // {
      //   field: "channel.playUrl",
      //   title: `${this.$t("tvChannel.playUrl")}`,
      //   align: "center",
      //   formatter: (val, row, idx) => {
      //     return val === "" ? `${this.$t("tvChannel.url")}` : val;
      //   }
      // },
      {
        field: "channel.isDomestic",
        title: `${this.$t("tvChannel.isDomestic")}`,
        align: "center",
        formatter: (val, row, idx) => {
          return val === "1"
            ? `${this.$t("tvChannel.isDomestic1")}`
            : `${this.$t("tvChannel.isDomestic0")}`;
        }
      },
      {
        field: "channel.chIcon",
        title: `${this.$t("tvChannel.chIcon")}`,
        align: "center",
        formatter: (val, row, idx) => {
          let url = `https://images.mycool.tv/images/channelicons/${row.channel.code}.png`;
          return `<image src="${url}" />`;
        }
      },
      {
        field: "channel.chId",
        title: `${this.$t("tvChannel.operate")}`,
        align: "center",
        formatter: (val, row, idx) => {
          return `<button class="btn btn-primary btn-sm" data-val="${val}" data-emit="edit-row">${this.$t(
            "tvChannel.edit"
          )}</button>
										<button class="btn btn-danger btn-sm" data-val="${val}" data-emit="del-row">${this.$t(
            "tvChannel.del"
          )}</button>`;
        }
      }
    ];
    // console.log("国际化", Env.locale);
    // console.log(i18n);
    // console.log(this.$t);
  },
  methods: {
    // 获取电视频道数据
    async getList() {
      try {
        const { list } = await TvChannelApi.getHotelTVListApi();
        this.TvChannelList = list;
        // console.log("电视频道", this.TvChannelList);
      } catch (error) {
        console.log(error);
      }
    },
    // 获取语言
    async getLang() {
      try {
        const data = await TvChannelApi.getLangListApi();
        // console.log("语言", data);
        this.langList = data;
      } catch (error) {
        console.log(error);
      }
    },
    async openAdd(id) {
      // console.log(id);
      if (id) {
        try {
          var chId = { chId: id };
          this.currChannel = await TvChannelApi.getCurrByIdApi(chId);
          // console.log("当前编辑数据", this.currChannel);
        } catch (error) {
          console.log(error);
        }
      } else {
        // console.log('addnow');
        this.currChannel = null;
      }
      this.isShow = false;
    },
    // 删除
    async delChannel(chId) {
      // console.log(chId);
      var data = { chId: chId };
      try {
        const res = await this.$confirm(`${this.$t("confirm.delTitle")}`, `${this.$t("confirm.delMsg")}`)
        if (res) {
          await TvChannelApi.delChannelApi(data)
          await this.$info(`${this.$t("confirm.delSuccess")}`).then(() => this.getList())
        }
      } catch (error) {
        this.$error(this.$t("tvChannel.delMsg"))
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #eee;
}
</style>
