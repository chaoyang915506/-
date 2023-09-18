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
          type="text"
          :disabled="editData.id"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="model.id"
          class="form-control"
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
        <select
          v-model="model.vendorId"
          placeholder="请选择制作厂商"
          class="custom-select"
          v-validate="v"
          required
        >
          <!-- <option disabled selected value="请选择园区">请选择园区</option> -->
          <option
            :value="item.vendorId"
            v-for="item in $store.state.firm"
            :key="item.hotelId"
          >
            {{ item.vendorName }}
          </option>
        </select>
      </vp>
      <vp
        class="form-group"
        tag="div"
        v-slot="v"
      >
        <label>名称</label>
        <input
          v-model="model.name"
          class="form-control"
          v-validate="v"
          required
          maxlength="32"
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
          v-model="model.desc"
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
import DeviceTypeApi from '@/api/DeviceTypeApi'
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
    }, allid: {
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
        if (this.editData.id) {
          //修改

          await DeviceTypeApi.changedData(this.model)
          await this.$info('修改成功')

        } else {
          let msg = this.allid.find(item => item == this.model.id)
          if (msg !== undefined) {
            this.model.id = ''
            this.$error('id重复')
          } else {

            const data = await DeviceTypeApi.addShowCount(this.model)
            await this.$info('新增成功')
            this.close()
          }

          // if (data.msg == 'duplicate record id') {
          //   await this.$error('id重复')
          // } else {

          //   await this.$info('新增成功')
          // }
        }
        // window.location.reload()


      } catch (error) {
        // console.log(error)
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