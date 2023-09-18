<template>
  <div class="jggcontainer">
    <div class="jggbody">
      <div class="bodytitle">
        {{ showName(info.styleId) }}
        <span @click="$emit('hookDeleteStyle', info.styleId)"><i class="el-icon-delete"></i></span>
      </div>
      <multiple-lang v-on:hookRefreshLang="refreshLang" :lists="lists" />

      <multiple-lang-card :lens="len" :lists="lists" />
    </div>
  </div>
</template>
<script>
import MultipleLang from "./MultipleLang.vue";
import MultipleLangCard from "./MultipleLangCard.vue";

export default {
  name: "JggTemplate",
  components: {
    MultipleLang,
    MultipleLangCard,
  },
  props: {
    lists: Array,
    info: {},
    stylenames: Array,
  },
  data() {
    return {
      len: 0,
    };
  },
  methods: {
    showName(val) {
      let r = this.stylenames.find((item) => item.id === val);
      return r.name;
    },
    refreshLang() {
      let len = 0;
      this.lists.map((item) => {
        if (item.status === true) {
          len += 1;
        }
      });
      this.len = len;
    },
  },
  mounted() {
    this.refreshLang();
  },
};
</script>

<style scoped lang="scss">
.jggcontainer {
  width: 100%;
  padding: 20px 0 20px 0;
}
.jggtitle {
  font-size: 16px;
  font-weight: bold;
  padding-right: 10px;
}
.jggbody {
  width: 96%;
  // height: 370px;
  background-color: #ebeef5;
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
}
.bodytitle {
  width: 100%;
  font-size: 16px;
  color: #1f2e4d;
  height: 40px;
  line-height: 40px;
  border-bottom: solid 1px #e6e9f0;
}
.bodytitle span {
  cursor: pointer;
  padding-left: 10px;
}
</style>
