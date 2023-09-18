<template>
  <vo v-slot="{ handleSubmit }">
    <form
      novalidate
      @submit.prevent="handleSubmit(submit)"
    >
      <vp
        class="form-group"
        tag="div"
        v-slot="v"
      >
        <label>ID</label>
        <input
          :disabled="editData.vendorId"
          v-model="model.vendorId"
          class="form-control"
          type="text"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-validate="v"
          required
        />
      </vp>
      <vp
        class="form-group"
        tag="div"
        v-slot="v"
      >
        <label>制作厂商</label>
        <input
          v-model="model.vendorName"
          class="form-control"
          type="text"
          v-validate="v"
          required
        />
      </vp>
      <vp
        class="form-group"
        tag="div"
        v-slot="v"
      >
        <label>描述</label>
        <!-- <input
          v-model="model.desc"
          class="form-control"
          v-validate="v"
          required
          maxlength="34"
        /> -->
        <textarea
          class="form-control"
          v-model="model.vendorDesc"
          v-validate="v"
          rows="2"
        >

        </textarea>
      </vp>

      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary"
        >确定</button>
        <button
          type="button"
          class="btn btn-secondary ml-1"
          @click="close"
        >
          返回
        </button>
      </div>
    </form>
  </vo>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import DeviceFirmApi from '@/api/DeviceFirmApi'

export default {
  data () {
    return {
      firmlist: [],
      model: JSON.parse(JSON.stringify(this.editData))
    }
  },
  props: {
    editData: {
      type: Object,
      default: () => ({})
    },
    allid: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    close () {
      this.$emit('close', 'table')
    },
    async submit () {
      try {
        if (this.editData.vendorId) {
          //修改

          await DeviceFirmApi.changedData(this.model)
          await this.$info('修改成功')

        } else {
          let msg = this.allid.find(item => item == this.model.vendorId)
          console.log(msg, this.allid, this.model.vendorId)
          if (msg !== undefined) {
            this.model.vendorId = ''
            this.$error('id重复')
            return
          }
          await DeviceFirmApi.addShowCount(this.model)
          await this.$info('新增成功')
        }
        // window.location.reload()
        this.close()

      } catch (error) {
        console.log(error)
        // this.$error('操作失败')
      }

    },
  },
  computed: {
    ...mapState(['frim'])
  },
}
</script>

<style lang="scss" scoped>
</style>