<template>
  <vo v-slot="{ handleSubmit }">
    <form novalidate @submit.prevent="handleSubmit(submit)">
      <div v-if="editData.langId || editData.langId == 0" class="form-group">
        <label>ID</label>
        <input
          v-model="model.langId"
          class="form-control"
          disabled
          maxlength="18"
        />
      </div>
      <vp class="form-group" tag="div" v-slot="v">
        <label>语言名称(*)</label>

        <input
          class="form-control"
          v-model="model.langDesc"
          v-validate="v"
          required
          maxlength="34"
        />
      </vp>
      <vp class="form-group" tag="div" v-slot="v">
        <label>简写(*)</label>
        <input
          class="form-control"
          v-model="model.guestLanguage"
          v-validate="v"
          required
          maxlength="32"
        />
      </vp>
      <vp class="form-group" tag="div" v-slot="v">
        <label>标签(*)</label>
        <input
          class="form-control"
          v-model="model.langLabel"
          v-validate="v"
          required
          maxlength="13"
        />
      </vp>
      <vp class="form-group" tag="div" v-slot="v">
        <label>语言tag(*)</label>
        <input
          v-model="model.tag"
          class="form-control"
          v-validate="v"
          required
          maxlength="13"
        />
      </vp>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">确定</button>
        <button type="button" class="btn btn-secondary ml-1" @click="close">
          返回
        </button>
      </div>
    </form>
  </vo>
</template>

<script>
import LanguageApi from '@/api/LanguageApi'
export default {
  props: {
    editData: {
      type: Object,
      default: () => ({})
    },
    // langugeAll: {
    //   type: Array,
    //   default: () => ([])
    // }
  },
  data () {
    return {
      //双向绑定的数据
      model: JSON.parse(JSON.stringify(this.editData)),
      gardenList: []//option园区数据
    }
  },
  methods: {
    // 关闭当前页面
    close () {
      this.model = null
      this.$emit('close', 'table')
    },

    async submit () {
      try {
        // let length = this.langugeAll.find(it => it == this.model.langLabel)
        if (this.editData.langId || this.model.langId == 0) {
          //修改
          // console.log(length,'length');
          // if (length !== undefined) {
          //   this.model.langLabel = ''
          //   this.$error('语言设置重复')
          //   return
          // } else {

          await LanguageApi.changedData(this.model)
          await this.$info('修改成功')
          this.close()
          // }
        } else {
          // console.log('新增')
          // if (length !== undefined) {
          //   this.model.langLabel = ''
          //   this.$error('语言设置重复')
          //   return
          // } else {

          await LanguageApi.addShowCount(this.model)
          await this.$info('新增成功')
          this.close()
          // }
        }

      } catch (error) {
        console.log(error)
        this.$emit('close', 'table')
        this.$error('操作失败')
      }

    }
  },
}
</script>

<style scoped lang="scss">
</style>