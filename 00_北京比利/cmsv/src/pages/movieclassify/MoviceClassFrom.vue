<template>
  <transition name="fade">
    <div v-show="dragstate">
      <div class="modal" v-on:click.self="dragstate">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">排序</h4>
              <button type="button" class="close" v-on:click="close">×</button>
            </div>
            <vo v-slot="{ handleSubmit }">
              <form
                v-if="dragstate"
                novalidate
                @submit.prevent="handleSubmit(subsure)"
                style="padding: 2%"
              >
                <vp class="form-group ml-2 mb-3" tag="div" v-slot="v" name="排序" rules="required">
                  <label class="control-label" style="font-size: 14px; color: f8f8f8"
                    >请输入要排序到的位置</label
                  >
                  <div style="width: 100%">
                    <input
                      v-focus
                      class="form-control"
                      min="1"
                      type="number"
                      :max="metas.length"
                      v-validate="v"
                      v-model="num"
                      placeholder="输入序号将排序到指定序号位置"
                    />
                  </div>
                  <span class="err">{{ v.errors[0] }}</span>
                </vp>
                <div class="form-group mt-4" style="float: right">
                  <button type="button" class="btn btn-secondary" @click="close">关闭</button>
                  <button @click="subsure" type="submit" class="btn btn-primary ml-1">确定</button>
                </div>
              </form>
            </vo>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
  </transition>
</template>

<script>
import MoviceClassifyApi from "@/api/MoviceClassifyApi";
export default {
  props: {
    dragstate: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: Number,
      default: 0,
    },
    metas: {
      type: Array,
      default: [],
    },
    editId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    sort: {
      deep: true,
      immediate: true,
      handler(val) {
        this.num = JSON.parse(JSON.stringify(val)) + 1;
      },
    },
  },
  data() {
    return {
      num: 0,
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
      update: (el) => {
        el.focus();
      },
    },
  },
  methods: {
    close() {
      this.$emit("change", false);
    },
    async subsure() {
      if (this.num - 1 == this.sort) return this.$error("拖动位置没有发生变化");
      //向下拖拽
      let everydata, ids, first;
      let data = this.metas.map((i) => {
        return { id: i.id, sort: i.sort };
      });
      //sort 老值  num 新值
      if (this.sort > this.num - 1) {
        everydata = data.slice(this.num - 1, this.sort + 1);
        // console.log(everydata, "老大于新");
        ids = everydata.map((i) => i.id);
        first = ids.splice(everydata.length - 1, 1)[0];
        ids.unshift(first);
        // console.log(ids, "all");
      } else {
        // 向上拖拽
        everydata = data.slice(this.sort, this.num);
        ids = everydata.map((i) => i.id);
        first = ids.splice(0, 1)[0];
        // console.log(first, "first");
        ids.push(first);
        // console.log(everydata, "新大于老");
      }
      await MoviceClassifyApi.movicesort(
        everydata.map((i, j) => {
          return {
            id: ids[j],
            sort: i.sort,
          };
        }),
        this.editId
      );
      // await this.$refs.messageTable.refresh();
      // await this.$refs.sonTable.refresh();
      await this.$parent.$refs.messageTable.refresh();
      await this.close();
      await this.$info("排序成功");
         this.$nextTick(() => {
              this.$parent.rowDrop();
            });
    },
  },
};
</script>

<style lang="scss" scoped>
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
/* 让模态框显示 */
.modal {
  display: block;
}

/* 如果不使用vue的transition的话可以不设置 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
::v-deep .modal-content {
  margin-top: 40%;
}
.bi-pencil::before {
  font-size: 13px;
}
</style>
