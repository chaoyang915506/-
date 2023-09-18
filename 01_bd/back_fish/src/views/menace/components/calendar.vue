<template>
  <div class="calendar_css">
    <div class="legend">
      <div>部署</div>
      <div>维修</div>
      <div>返港</div>
    </div>
    <el-calendar v-model="value">
      <template #dateCell="{ data }" class="budge">
        <span :class="[getcss(data.day) ? 'infocharacter' : '']">{{
          data.day.split("-").slice(2).join()
        }}</span>
        <br />
        <div
          v-for="(i, index) in calendarList.wxCalendars"
          :key="index"
          :class="[data.day == i ? 'actice_css' : '']"
        >
          {{ data.day }}
        </div>
        <div
          v-for="(i, index) in calendarList.bsCalendars"
          :key="index"
          :class="[data.day == i ? 'actice_css_bs' : '']"
        ></div>
        <div
          v-for="(i, index) in calendarList.fgCalendars"
          :key="index"
          :class="[data.day == i ? 'actice_css_bs' : '']"
        ></div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    calendarList: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      value: new Date(),
      dayTime: ["2022/09/01", "2022/09/05"],
      bsTime: ["2022-09-06", "2022-09-09"],
      // calendarList: {},
    };
  },
  created() {
    this.$nextTick(() => {
      // console.log();
      // console.log(this.calendarList, "redfsafdf ");
    });
  },
  mounted() {
    // console.log(this.calendarList, "rersfsdafsadf");
  },
  methods: {
    getcss(val) {
      let res = [
        ...this.calendarList.wxCalendars,
        ...this.calendarList.bsCalendars,
        ...this.calendarList.fgCalendars,
      ].findIndex((i) => i == val);
      return res != -1 ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
.legend {
  display: flex;
  color: #fff;
  font-size: 14px;
  margin: 10px 0;
  div:nth-child(1) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    text-align: center;
    height: 20px;
    background-color: #78521a;
    width: calc(100% / 3);
  }
  div:nth-child(2) {
    text-align: center;
    height: 20px;
    width: calc(100% / 3);
    background-color: red;
  }
  div:nth-child(3) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    height: 20px;
    text-align: center;
    width: calc(100% / 3);
    background-color: #0eaac0;
  }
}
.infocharacter {
  color: black !important;
}
.actice_css {
  width: 100%;
  z-index: -1;
  height: 40px;
  background-color: red;
  position: absolute;
  top: 0px;
  color: black !important;
}
.actice_css_fg {
  width: 100%;
  z-index: -1;
  height: 40px;
  background-color: #0eaac0;
  position: absolute;
  top: 0px;
  color: black !important;
}
.actice_css_bs {
  width: 100%;
  z-index: -1;
  height: 40px;
  background-color: #78521a;
  position: absolute;
  top: 0px;
  color: black !important;
}
/* ::v-deep .el-calendar-table .el-calendar-day {
  height: 20px !important;
} */
.calendar_css ::v-deep .el-calendar-table .el-calendar-day {
  height: 40px !important;
  padding: 0;
  line-height: 40px;
  text-align: center;
  position: relative;
  z-index: 1;
}
.budge {
  padding: 10px;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  background-color: red;
  color: black !important;
  font-weight: 700;
  //   border-radius: 50%;
  //   margin: 0 auto;
  //   margin-top: 10px;
}
::v-deep .is-selected {
  // background-color: red !important;
}
.noselect {
  padding: 20px;

  color: black;
  text-align: center;
}
</style>