<template>
  <el-timeline :reverse="true">
    <el-timeline-item
      v-for="item in timelinedata"
      :key="item.id"
      :timestamp="item.timestamp"
      type="primary"
      size="normal"
    >
      {{ item.content }}
      <img
        :src="imgurl + item.imagePath"
        class="imgcss2"
        alt=""
        onerror="this.src='/img/ui/u1635.svg'"
      />
      <!-- content -->
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  props: {
    zldata: {
      type: Array,
      default: () => [],
    },
    imgurl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      img: "/img/ui/u1635.svg",
      activceName: "first",
      // timelinedata: [
      //   {
      //     content: "活动按期开始",
      //     timestamp: "2020-1-22",
      //     id: 1,
      //   },
      //   {
      //     content: "活动按期开始",
      //     timestamp: "2020-1-22 - 2022-8-6 | 美国",
      //     id: 11,
      //   },
      // ],
    };
  },
  computed: {
    timelinedata() {
      return this.zldata.map((i) => {
        return {
          ...i,
          timestamp: i.begintime + "|" + i.endtime,
          content: i.event,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-timeline-item {
  padding-bottom: 70px;
}
.imgcss2 {
  float: right;
  height: 80px;
  margin-right: 10px;
}
::v-deep .el-timeline-item__content {
  color: #fff;
}
::v-deep .el-timeline-item__wrapper {
  top: 0;
}
</style>