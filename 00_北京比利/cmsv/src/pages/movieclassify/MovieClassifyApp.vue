<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div v-show="view == 'table'">
      <div class="card">
        <div class="card-header">查询条件</div>
        <div class="card-body row">
          <div class="col-4 mb-3">
            <label class="col-sm-5"> 类型名称 </label>
            <div class="col-sm-7" style="display: inline-block">
              <input type="text" class="form-control" v-model="typename" @keyup.enter="searchKey" />
            </div>
          </div>
        </div>
      </div>
      <cool-table
        ref="messageTable"
        class="hometable"
        :options="options"
        :columns="columns"
        @edit-row="editTable"
        @lookdetails-row="lookdetails"
        @delete-row="deleteAll"
      >
        <button class="btn btn-primary ml-1" @click="addfile">新增</button>
        <button class="btn btn-danger ml-1" @click="delMessages">删除</button>
      </cool-table>
    </div>
    <div v-if="view == 'lookdetails'" class="mt-2">
      <div>
        <button class="btn btn-secondary" @click="backtable">&lt;返回</button>
        <button class="btn ml-2" style="font-size: 20px">查看详情</button>
      </div>
      <cool-table
        :columns="columnlist"
        ref="sonTable"
        @del-sort="homesort"
        class="sontable"
        :options="{ pageList: [10, 20, 40, 60, 80, 100] }"
        :data="metas"
      >
        <div class="form-group ml-2">
          <span style="font-size: 12px"> 类型名称：</span><span>{{ editData.nameCn }}</span>
        </div>
      </cool-table>
    </div>
    <cool-modal
      :visible="modelVisible"
      :title="title"
      @hidden="modelVisible = false"
      :footer="{ visible: false }"
    >
      <vo v-slot="{ handleSubmit }" class="col-sm-6" v-if="modelVisible">
        <form novalidate @submit.prevent="handleSubmit(submit)">
          <vp
            class="form-group ml-2 mb-3"
            tag="div"
            v-slot="v"
            name="中文名称"
            rules="required|max:30"
          >
            <label class="control-label">中文名称</label>
            <div style="width: 100%">
              <input class="form-control" v-validate="v" v-model="editData.nameCn" />
            </div>
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <vp class="form-group ml-2" tag="div" v-slot="v" name="英文名称" rules="required|max:30">
            <label class="control-label">英文名称</label>
            <input class="form-control" v-validate="v" v-model="editData.nameEn" />
            <span class="err">{{ v.errors[0] }}</span>
          </vp>
          <div class="form-group mt-4" style="float: right">
            <button type="button" class="btn btn-secondary" @click="modelVisible = false">
              关闭
            </button>
            <button type="submit" class="btn btn-primary ml-1">确定</button>
          </div>
        </form>
      </vo>
      <!--  -->
    </cool-modal>
    <MovieClassFrom
      :sort="sort"
      @change="(val) => (dragstate = val)"
      :metas="metas"
      :dragstate.sync="dragstate"
      :editId="editId"
    ></MovieClassFrom>
  </div>
</template>

<script>
class formda {
  constructor() {
    this.nameEn = "";
    this.nameCn = "";
    this.metaType = 14;
    this.status = 0;
    this.typeClass = 0;
  }
}
import MoviceClassifyApi from "@/api/MoviceClassifyApi";
import CoolTable from "@/components/CoolTable.vue";
import CoolModal from "@/components/CoolModal.vue";
import env from "@/env";
import Sortable from "sortablejs";

import MovieClassFrom from "./MoviceClassFrom.vue";
export default {
  data() {
    return {
      options: {
        url: `${env.cms}/cms/v2/mediaTypes?token=${env.token}`,
        method: "get",
        pageNumber: 1, //初始化加载第一页
        sidePagination: "server", //服务端
        pageList: [5, 10, 20, 40, 60, 80], //可选择单页记录数
        search: false,
        pagination: true, //分页
        strictSearch: true,
        showColumns: true, //是否显示所有的列
        showRefresh: true, //刷新按钮
        queryParams: (params) => {
          this.offset = params.offset + 1;
          return {
            metaType: "14",
            offset: params.offset + 0, // SQL语句起始索引
            limit: params.limit, // 每页显示数量
            name: this.typename,
          };
        },
        responseHandler: (res) => {
          this.tableList = res.data.rows;
          return {
            rows: res.data.rows,
            total: res.data.total,
          };
        },
      },
      offset: "",
      total: "",
      columns: [
        { checkbox: true },
        {
          field: "",
          title: "序号",
          align: "center",
          formatter: (val, row, idx) => {
            return `<i class="homedrag bi bi-arrows-move">   ${idx + this.offset}</i>`;
          },
        },
        {
          field: "nameCn",
          title: "类型名称",
          align: "center",
        },
        {
          field: "metas",
          title: "数量",
          align: "center",
          formatter: (val) => {
            return val.length;
          },
        },
        {
          field: "id",
          title: "操作",
          align: "center",
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm edit" data-val=${val} data-emit="edit-row">编辑</button>
                      <button class="btn btn-primary btn-sm" data-val=${val} data-emit="lookdetails-row" >查看详情</button>
              <button class="btn btn-danger btn-sm" data-val=${val} data-emit="delete-row" >删除</button>
                      `;
          },
        },
      ],
      columnlist: [
        // { checkbox: true },
        {
          field: "",
          title: "序号",
          align: "center",
          formatter: (val, row, idx) => {
            return `<i class="sondrag bi bi-arrows-move">   ${idx + 1}</i>`;
          },
        },
        {
          field: "name",
          title: "电影名称",
          align: "center",
        },
        {
          field: "id",
          title: "操作",
          align: "center",
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${idx} data-emit="del-sort" >排序</button>`;
          },
        },
      ],
      view: "table",
      editId: 0,
      typename: "", //类型名称
      modelVisible: false,
      tableList: [], //全部的数据
      title: "",
      editData: new formda(),
      dragstate: false,
      num: "",
      sort: 0,
    };
  },
  components: {
    CoolTable,
    CoolModal,
    MovieClassFrom,
  },
  mounted() {
    this.rowDrop();
  },
  computed: {
    metas() {
      if (this.editId) {
        let data = this.tableList.find((i) => i.id == this.editId);
        return data.metas;
      } else {
        return [];
      }
    },
  },
  methods: {
    //电影的跨页
    homesort(val) {
      // console.log(val, "idx");
      this.sort = val;
      this.dragstate = true;
    },

    //行拖拽
    rowDrop() {
      const _this = this;
      let tbody, dag;
      if (_this.view == "table") {
        dag = ".homedrag";
        tbody = document.querySelector(".hometable tbody");
      } else if (_this.view == "lookdetails") {
        dag = ".sondrag";
        tbody = document.querySelector(".sontable tbody");
      }
      Sortable.create(tbody, {
        draggable: "tr",
        handle: dag,
        async onEnd({ newIndex, oldIndex }) {
          let data, first, ids, everydata;

          if (_this.view == "table") {
            everydata = _this.tableList;
          } else {
            everydata = _this.metas;
          }
          if (oldIndex < newIndex) {
            //自下而上
            data = everydata.slice(oldIndex, newIndex + 1);
            ids = data.map((i) => i.id);
            first = ids.splice(0, 1)[0];
            ids.push(first);
          } else {
            //自上而下
            data = everydata.slice(newIndex, oldIndex + 1);
            ids = data.map((i) => i.id);
            first = ids.splice(data.length - 1, 1)[0];
            ids.unshift(first);
          }
          let red = data.map((i, j) => {
            return {
              id: ids[j],
              sort: i.sort,
            };
          });
          if (_this.view == "table") {
            await MoviceClassifyApi.movicetypesort(red)
              .then(() => {
                _this.$refs.messageTable.refresh();
                _this.$info("排序成功");
              })
              .catch((err) => {
                _this.$error(err);
              });
          } else {
            await MoviceClassifyApi.movicesort(red, _this.editId);
            await _this.$refs.messageTable.refresh();
            await _this.$refs.sonTable.refresh();
            await _this.$info("排序成功");
            _this.$nextTick(() => {
              _this.rowDrop();
            });
          }
        },
      });
    },
    //编辑
    editTable(val) {
      this.editData = this.tableList.find((item) => item.id == val);
      this.title = "电影类型编辑";
      this.modelVisible = true;
    },
    //输入后搜索
    searchKey() {
      return this.$refs.messageTable.refresh();
    },
    //关闭弹框
    closepop() {
      this.editData = {};
      this.$refs.messageTable.refresh();
      this.modelVisible = false;
    },
    backtable() {
      this.view = "table";
    },
    // 新增
    addfile() {
      this.editData = new formda();
      this.title = "电影类型新增";
      this.modelVisible = true;
    },
    // //删除多个
    async delMessages() {
      let selections = this.$refs.messageTable.getSelections();
      if (selections.length == 0) return;
      try {
        const ok = await this.$confirm("删除！", `确定删除此项吗`);
        if (!ok) return;
        await MoviceClassifyApi.deletemediaTypes( selections.map((item) => item.id) );
        await this.$refs.messageTable.refresh();
        await this.$info("删除成功");
      } catch (error) {
        console.log(error);
        this.$error("删除失败", "删除配置分组失败");
      }
    },
    //查看详情
    async lookdetails(val) {
      this.editId = val;
      this.editData = this.tableList.find((item) => item.id == val);
      this.view = "lookdetails";
      this.$nextTick(() => {
        this.rowDrop();
      });
    },
    //删除单个
    async deleteAll(val) {
      try {
        const res = await this.$confirm("提示", `确定删除此项吗？`);
        if (!res) return;
        await MoviceClassifyApi.deletemediaTypes([val]);
        await this.$refs.messageTable.refresh();
        await this.$info("删除数据成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 新建和编辑
    async submit() {
      try {
        if (this.editData.id) {
          let data = {
            id: this.editData.id,
            nameCn: this.editData.nameCn,
            nameEn: this.editData.nameEn,
            metaType: this.editData.metaType,
            status: this.editData.status,
            typeClass: this.editData.typeClass,
          };
          await MoviceClassifyApi.updatemediaTypes(data);

          await this.closepop();
          await this.$info("编辑成功");
        } else {
          await MoviceClassifyApi.addmediaTypes(this.editData);
          await this.closepop();
          await this.$info("添加成功");
        }
      } catch (error) {
        this.$error(error);
        // console.log(error)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// *号
.control-label:before {
  color: red;
  content: "*";
  position: absolute;
  margin-left: -10px;
}
//错误样式
.err {
  font-size: 12px;
  position: absolute;
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
::v-deep .form-group {
  position: relative;
  margin-bottom: 2 rem;
}
::v-deep .bootstrap-table .fixed-table-toolbar .columns-right {
  display: none;
}
::v-deep .bi-arrows-move {
  font-weight: 700;
}
</style>
