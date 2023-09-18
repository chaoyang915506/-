<template>
  <div class="coolselectbox">
    <select
      ref="self"
      class="selectpicker form-control"
      :data-live-search="liveSearch"
      :data-max-options="maxOptions"
      :title="title"
      :multiple="multiple"
      :disabled="disabled"
      @change="$emit('change', $event.target.value)"
      :data-style="btnStyle"
    >
      <option v-for="(item, idx) in opts" :value="item.value" :key="idx">{{ item.option }}</option>
    </select>
  </div>
</template>

<script>
import $ from "jquery/dist/jquery.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/plugins/bootstrap-select/bootstrap-select.js";
import "@/plugins/bootstrap-select/bootstrap-select.min.css";

export default {
  name: "CoolSelect",
  props: {
    liveSearch: {
      type: Boolean,
      required: false
    },
    maxOptions: {
      type: Number,
      required: false,
      default: 1
    },
    opts: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "请选择"
    },
    disabled: {
      type: Boolean,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false
    },
    defaultValue: {
      type: String | Number,
      required: false,
      default: "0"
    },
    btnStyle: {
      type: String,
      required: false,
      default: "btn-secondary"
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    opts: function(value) {
      this.$nextTick(function() {
        $(this.$refs.self).selectpicker("refresh");
        $(this.$refs.self).selectpicker("val", this.defaultValue);
      });
    },
    disabled: function(val) {
      this.$nextTick(function() {
        $(this.$refs.self).selectpicker("refresh");
      });
    },
    defaultValue: function(val) {
      this.$nextTick(function() {
        $(this.$refs.self).selectpicker("refresh");
        $(this.$refs.self).selectpicker("val", this.defaultValue);
      });
    }
  },
  methods: {
    init() {
      $(this.$refs.self).selectpicker("val", this.defaultValue);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="scss">
.coolselectbox {
  width: 100%;
}
</style>
