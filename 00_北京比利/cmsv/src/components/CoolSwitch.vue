<template>
  <div>
    <input type="checkbox" ref="inputref" v-model="checked" />
  </div>
</template>

<script>
import $ from "jquery/dist/jquery.js";
import "@/plugins/bootstrap-switch";

export default {
  name: "CoolSwitch",
  props: {
    checked: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  model: {
    prop: "checked",
    event: "change"
  },
  watch: {
    checked: function(val) {
      this.$nextTick(() => {
        this.refresh(val);
      });
    }
  },
  methods: {
    init: function() {
      let _this = this;
      $(this.$refs.inputref).bootstrapSwitch({
        onText: "开",
        offText: "关",
        size: "middle",
        onColor: "primary",
        offColor: "secondary2",
        onSwitchChange: function(event, state) {
          _this.$emit("change", state);
        }
      });
    },
    refresh: function(val) {
      $(this.$refs.inputref).bootstrapSwitch("state", val);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
