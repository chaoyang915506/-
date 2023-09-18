<template>
  <form novalidate @submit.prevent>
    <!-- //电影名称 -->
    <vp class="form-group" tag="div" v-slot="v" name="电影名称" rules="required|max:100">
      <label class="control-label">电影名称</label>
      <input type="text" v-model="model.name" v-validate="v" class="form-control" />
      <span class="err">{{ v.errors[0] }}</span>
    </vp>
    <vp class="form-group" tag="div" v-slot="v" :rules="{ required: true, max: total }" name="简介">
      <label class="control-label">简介</label>
      <div class="textclass">
        <textarea v-model="model.desc" v-validate="v" class="form-control" placeholder="请输入内容">
        </textarea>

        <span class="tips"
          ><i style="font-style: normal" :class="[model.desc.length > total ? 'now' : 'black']">{{
            model.desc.length
          }}</i
          >/{{ total }}</span
        >
      </div>
      <span class="err">{{ v.errors[0] }}</span>
    </vp>
    <!-- 导演 -->
    <vp class="form-group" tag="div" v-slot="v" name="导演" rules="required">
      <label class="control-label"
        >导演
        <span class="directSty"
          ><i class="bi bi-exclamation-circle"></i>&nbsp;输入时请以/区分人名,例如：王一/王二</span
        ></label
      >
      <input type="text" class="form-control" v-model="model.author" v-validate="v" />
      <span class="err">{{ v.errors[0] }}</span>
    </vp>
    <!-- 主演 -->
    <vp class="form-group" tag="div" v-slot="v" rules="required" name="主演">
      <label class="control-label"
        >主演
        <span class="directSty"
          ><i class="bi bi-exclamation-circle"></i>&nbsp;输入时请以/区分人名,例如：王一/王二</span
        ></label
      >
      <input type="text" v-model="model.starring" class="form-control" v-validate="v" />
      <span class="err">{{ v.errors[0] }}</span>
    </vp>
  </form>
</template>

<script>
import MoviceListApi from "@/api/MoviceListApi";
export default {
  data() {
    return {
      model: this.value,
      lanuagelist: [],
    };
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  created() {
    this.getlanguage();
  },
  methods: {
    async getlanguage() {
      let data = await MoviceListApi.getlanguage();
      this.lanuagelist = data;
    },
  },
  computed: {
    total() {
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let lang = this.lanuagelist.find((i) => i.langId == this.value.langId);
      if (lang) {
        return reg.test(lang.langLabel) ? 180 : 330;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep textarea {
  padding-bottom: 5%;
  max-height: 300px;
  min-height: 140px;
}
.tips {
  position: absolute;
  right: 7%;
  bottom: 4%;
}
.now {
  color: red;
}
.black {
  color: #0069d9;
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
.textclass {
  position: relative;
}
.directSty {
  color: darkgray;
  font-size: 12px;
}
.control-label:before {
  color: red;
  content: "*";
  position: absolute;
  margin-left: -10px;
}
::v-deep .bi-exclamation-circle::before {
  color: red;
}
</style>
