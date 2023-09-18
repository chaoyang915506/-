<template>
  <div>
    <cool-switch @change="handleChange" v-model="attr"></cool-switch>
  </div>
</template>

<script>
import CoolSwitch from "@/components/CoolSwitch.vue";

export default {
  name: "StatusSwitch",
  components: { CoolSwitch },
  props: {
    title: {
      type: String,
      required: false
    },
    status: {
      type: Boolean,
      required: true
    },
    idx: {
      type: Number | String,
      required: false
    },
    module: {
      type: String,
      required: false
    }
  },
  methods: {
    handleChange: function() {
      this.$emit("change", {
        status: this.attr,
        module: this.module,
        idx: this.idx
      });
    }
  },
  data() {
    return {
      attr: this.status
    };
  },
  watch: {
    status: function(val) {
      this.attr = val;
    }
  }
};
</script>

<style scoped lang="scss">
.desc {
  min-width: 100px;
  height: 40px;
  line-height: 40px;
}
</style>
