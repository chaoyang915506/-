<template>
  <div class="coolselectbox">
    <select
      ref="self"
      class="selectpicker form-control"
      :class="{ 'is-invalid': isInvalid }"
      :data-live-search="liveSearch"
      :data-max-options="maxOptions"
      :title="title"
      :multiple="multiple"
      :disabled="disabled"
      @change="$emit('change', $event.target.value)"
      v-model="val"
      :data-style="btnStyle"
    >
      <slot></slot>
    </select>
    <span v-show="isInvalid" class="error">{{ title }}</span>
  </div>
</template>

<script>
import $ from "jquery/dist/jquery.js";
import "@/plugins/bootstrap-select/bootstrap-select.js";
import "@/plugins/bootstrap-select/bootstrap-select.min.css";

export default {
  name: "CoolSelect",
  data() {
    return {
      isInvalid: false,
      val: ""
    };
  },
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
    },
    handleValid: function() {
      if (this.val === "") {
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
      this.$nextTick(() => {
        $(this.$refs.self).selectpicker("refresh");
      });
    },
    refresh: function(val) {
      this.isInvalid = false;
      this.$nextTick(() => {
        $(this.$refs.self).selectpicker("destroy");
        $(this.$refs.self).selectpicker("val", val);
      });
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
.error {
  color: #d10e3f;
}
</style>
