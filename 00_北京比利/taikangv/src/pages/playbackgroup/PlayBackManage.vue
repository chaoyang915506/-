<template>
  <div>
    <div class="mt-2">
      <button
        style=" border: 0;background: 0;"
        @click="$emit('close', 'group')"
      >
        返回</button
      >&nbsp;|&nbsp;<span style="font-weight: 600;">直播回放-分组管理</span>
    </div>
    <cool-table
      ref="tablesort"
      :columns="columns"
      :data="groupList"
      @edit-row="editRow"
      @del-row="delRow"
      @look-row="lookRow"
      class="cool_table"
    >
      <div class="btn-group mr-2" role="group" aria-label="First group">
        <button class="btn btn-secondary" @click="addgroup">
          新增
        </button>
        <button class="btn btn-danger" @click="batchdelete">
          批量删除
        </button>
      </div>
    </cool-table>

    <cool-modal
      class="addform"
      :visible="visibled"
      :title="formData.id ? '编辑' : '新增'"
      @hidden="visibled = false"
      :footer="{ visible: false }"
    >
      <vo
        v-slot="{ handleSubmit }"
        v-if="visibled"
        style="height:100%;padding: 0 10%;justify-content: center;"
      >
        <form
          ref="form"
          id="form"
          novalidate
          @submit.prevent="handleSubmit(submit)"
        >
          <vp
            class="form-group row"
            style="align-items: center;"
            tag="div"
            rules="required|max:20"
            v-slot="v"
            name="栏目标题"
          >
            <label class="col-4 label_right label_required">栏目标题</label>
            <div class="col-8" style="align-items: center;">
              <input
                type="text"
                class="form-control"
                v-model="formData.name"
                @keyup.enter="submit()"
                v-validate="v"
              />
              <div class="error">{{ v.errors[0] }}</div>
            </div>
          </vp>
          <div name="footer" style="text-align: right;" class="mr-2 mt-4">
            <button
              class="btn-secondary btn mr-2"
              type="button"
              @click="closefrom"
            >
              返回
            </button>
            <button type="submit" class="btn btn-primary">
              确定
            </button>
          </div>
        </form>
      </vo>
    </cool-modal>

    <cool-modal
      class="details_modal"
      :visible="details"
      title="分组下排序"
      @hidden="details = false"
      :footer="{ visible: false }"
    >
      <div style="height:100%;justify-content: center;padding: 1%;">
        <table class="table  table-bordered ">
          <thead class="thead-light">
            <tr>
              <th id="sorttable">
                拖拽排序
              </th>
              <th scope="col">直播/回放标题</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in lookgrouplive" :key="i.id">
              <td id="sorttable">
                <i class="my-handle bi bi-arrows-move"></i>
              </td>
              <td>{{ i.title }}</td>
            </tr>
          </tbody>
        </table>

        <div name="footer" style="text-align: right;" class="mr-2 mt-4">
          <h6 style="padding-left: 1%;float: left;">
            共计 {{ lookgrouplive.length }} 条数据
          </h6>
          <button class="btn-secondary btn mr-2" @click="details = false">
            返回
          </button>
          <button @click="detailsSubmit" class="btn btn-primary">
            确定
          </button>
        </div>
      </div>
    </cool-modal>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import PlayBackGroupApi from '@/api/PlayBackGroupApi'
class Dataform {
  constructor() {
    this.name = ''
    this.desc = ''
    this.enable = 1
    this.id = ''
  }
}
export default {
  data() {
    return {
      columns: [
        { checkbox: true },
        {
          field: 'type',
          title: '拖拽排序',
          align: 'center',
          width: 10,
          formatter: function(val) {
            return `<i class="my-handle bi bi-arrows-move"></i>`
          },
        },
        {
          field: 'name',
          title: '分组标题',
          align: 'center',
        },
        {
          field: 'id',
          title: '操作',
          align: 'center',
          width: 300,
          formatter: (val, row, idx) => {
            let data = this.table.filter((idx) => idx.categoryId == val)
            let btn = `<button class="btn btn-primary btn-sm mr-1" data-val=${val} data-emit="look-row">查看详情</button>`
            let btn1 = ` <button class="btn btn-info btn-sm" data-val=${val} data-emit="edit-row" >编辑</button>
                             <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`
            if (data.length == 0) {
              return btn1
            }
            return btn + btn1
          },
        },
      ],
      visibled: false,
      details: false,
      formData: new Dataform(),
      list: JSON.parse(JSON.stringify(this.groupList)),
      lookgrouplive: [], //分组下的直播流
      sortlist: [], //分组详情的数据
    }
  },
  props: {
    groupList: {
      type: Array,
      default: () => [],
    },
    table: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    addgroup() {
      this.formData = new Dataform()
      this.visibled = true
    },
    closefrom() {
      this.$emit('close', 'father')
      this.visibled = false
    },
    editRow(val) {
      this.formData = this.groupList.find((i) => val == i.id)
      this.visibled = true
    },
    detailsSubmit() {
      let max = this.lookgrouplive
        .slice()
        .sort((a, b) => b.categorySort - a.categorySort)
        .map((i) => i.categorySort)
      PlayBackGroupApi.groupsortdetil(
        this.lookgrouplive.map((idx, j) => {
          return {
            id: idx.id,
            categorySort: max[j],
          }
        })
      ).then((res) => {
        this.$parent.getAllData()
        this.details = false
        this.$info('排序成功')
      })
    },
    submit() {
      PlayBackGroupApi.addgoup(this.formData).then((res) => {
        this.$parent.getgroup()
        this.visibled = false
        this.$info(this.formData.id ? '编辑成功' : '新增成功')
        this.formData = new Dataform()
      })
    },
    //分组管理拖拽
    rowDrop() {
      const tbody = document.querySelector(' .cool_table table tbody')
      const _this = this
      Sortable.create(tbody, {
        draggable: 'tr',
        handle: '.my-handle',
        onEnd({ newIndex, oldIndex }) {
          let data, first, ids
          if (oldIndex < newIndex) {
            data = _this.groupList.slice(oldIndex, newIndex + 1)
            ids = data.map((i) => i.id)
            first = ids.splice(0, 1)[0]
            ids.push(first)
          } else {
            data = _this.groupList.slice(newIndex, oldIndex + 1)
            ids = data.map((i) => i.id)
            first = ids.splice(data.length - 1, 1)[0]
            ids.unshift(first)
          }
          PlayBackGroupApi.groupsort(
            data.map((i, j) => {
              return {
                id: ids[j],
                sort: i.sort,
              }
            })
          ).then((res) => {
            _this.$parent.getgroup()
            _this.$info('排序成功')
          })
        },
      })
    },
    // 删除这个分组
    delRow(val) {
      this.$confirm('提示', '确定删除这个分组吗？').then((res) => {
        if (res == 'ok') {
          PlayBackGroupApi.delgroup([val]).then((da) => {
            this.$parent.getgroup()
            this.$info('删除成功')
          })
        }
      })
    },
    // 批量删除
    batchdelete() {
      const batch = this.$refs.tablesort.getSelections()
      if (batch.length == 0) return this.$error('请选择要删除的分组')
      this.$confirm('提示', '确定删除选中分组吗？').then((res) => {
        if (res == 'ok') {
          PlayBackGroupApi.delgroup(batch.map((i) => i.id)).then((da) => {
            this.$parent.getgroup()
            this.$info('删除成功')
          })
        }
      })
    },
    // 查看分组下的直播
    lookRow(val) {
      this.lookgrouplive = this.table
        .filter((idx) => idx.categoryId == val)
        .sort((a, b) => b.categorySort - a.categorySort)
      this.details = true
    },
  },
  mounted() {
    const _this = this
    _this.rowDrop()
    const details_table = document.querySelector('.details_modal table tbody')
    Sortable.create(details_table, {
      draggable: 'tr',
      handle: '.my-handle',
      onEnd({ newIndex, oldIndex }) {
        let first = _this.lookgrouplive.splice(oldIndex, 1)[0]
        _this.lookgrouplive.splice(newIndex, 0, first)
      },
    })
  },
  components: {
    CoolTable,
    CoolModal,
    Sortable,
  },
}
</script>
<style lang="scss" scoped>
/deep/.addform .modal.show .modal-dialog {
  width: 50%;
  transform: translate(0, 130%);
}
/deep/.addform .modal .fade .show {
  justify-content: center;
}
.label_required::before {
  content: '* ';
  color: red;
}
.error {
  font-size: 12px;
  position: absolute;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
/deep/.details_modal .modal-open .modal {
  overflow: hidden;
}
/deep/ .details_modal .modal-dialog .modal-xl {
  height: 100%;
}
/deep/.details_modal .modal.show .modal-dialog {
  height: 100%;
}
/deep/.details_modal .modal-content {
  min-height: 10%;
  max-height: 90%;
}
/deep/.details_modal .modal-body {
  height: 100%;
  padding: 0;
  overflow: auto;
}
th,
td {
  text-align: center;
}
#sorttable {
  max-width: 30px;
}
</style>
