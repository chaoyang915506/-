<template>
  <div>
    <input
      :placeholder="[required ? placeholder : '']"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': isInvalid }"
      v-model="val"
      @change="handleChange"
    />
    <span v-show="isInvalid" class="error">{{ tips }}</span>
  </div>
</template>

<script>
import regTool from "@/utils/RegTool";

export default {
  name: "CoolInput",
  data() {
    return {
      isInvalid: false,
      val: ""
    };
  },
  props: {
    tips: {
      type: String,
      default: "数据有误",
      required: false
    },
    required: {
      type: Boolean,
      default: false,
      required: false
    },
    rules: {
      type: String,
      required: false,
      default: "isNull"
    },
    value: String | Number,
    placeholder: {
      type: String,
      required: false,
      default: "必填"
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    value: function(val) {
      this.val = val;
    }
  },
  methods: {
    handleChange: function() {
      this.$emit("change", this.val);
      if (!this.required) return;
      if (this.rules === "isNull" && this.val.length === 0) {
        this.isInvalid = true;
        return false;
      }

      if (this.rules === "ip" && !regTool.isIP(this.val)) {
        this.isInvalid = true;
        return false;
      }

      if (this.rules === "mail" && !regTool.isIP(this.val)) {
        this.isInvalid = true;
        return false;
      }

      if (this.rules === "limitNumber") {
        if (this.val < 111 || this.val > 129) {
          this.isInvalid = true;
          return false;
        }
      }

      this.isInvalid = false;
    }
  }
};
</script>

<style scoped>
.error {
  color: #d10e3f;
}
</style>
