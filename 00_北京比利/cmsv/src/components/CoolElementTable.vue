<template>
  <div>
    <div class="all_table">
      <el-table
        :data="tableData"
        :border="objcontent.border"
        :stripe="objcontent.stripe"
        v-loading="objcontent.loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="objcontent.changeselect ? objcontent.changeselect : false"
          type="selection"
          style="width: 50px"
          :align="objcontent.alignselect"
        >
        </el-table-column>
        <el-table-column
          v-if="objcontent.number ? objcontent.number : false"
          type="index"
          style="width: 50px"
          :align="objcontent.alignindex"
        >
        </el-table-column>
        <template v-for="(column, index) in tableColumns">
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :align="column.align"
            :width="column.width"
          >
            <template slot-scope="scope">
              <!-- <template v-if="!column.render"> -->
              <template v-if="column.formatter">
                <span v-html="column.formatter(scope.row, column)"></span>
              </template>
              <template v-else>
                <span>{{ scope.row[column.prop] }}</span>
              </template>
              <!-- </template> -->
              <!-- <template v-else>
                <ex-slot
                  :column="column"
                  :row="scope.row"
                  :render="column.render"
                  :index="index"
                ></ex-slot>
              </template> -->
            </template>
          </el-table-column>
        </template>

        <el-table-column
          :min-width="operations.width"
          :fixed="operations.fixed"
          :label="operations.label"
          :align="operations.align"
          v-if="operations.list.length > 0"
        >
          <template slot-scope="scope">
            <div class="operations">
              <template v-for="(item, key) in operations.list">
                <el-button
                  :type="item.type ? item.type : 'text'"
                  :size="item.size"
                  :icon="item.icon"
                  :disabled="item.disabled"
                  @click="item.method(key, scope.row)"
                  >{{ item.label }}
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-if="total > 0">
      <div class="info">
        {{ info }}
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="text-align: center; margin-top: 20px"
        :current-page="pageIndex"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="pager_layout"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      multipleSelection: [],
    };
  },
  methods: {
    // 切换每页显示的数量
    handleSizeChange(val) {
      // console.log("每页显示个数", val);
      // this.$emit('update:limit',val)
      this.$emit("handleSizeChange", val);
    },
    // 切换页码
    handleCurrentChange(val) {
      // console.log("显示第几页", val);
      // this.$emit('update:pageIndex',val)
      this.$emit("handleCurrentChange", val);
    },
    //选择多条
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
  },
  computed: {
    info() {
      let str = this.$t("confirm.page");
      str = str
        .replace("#", (this.pageIndex - 1) * this.pageSize + 1)
        .replace("*", this.total)
        .replace(
          "+",
          (this.pageIndex - 1) * this.pageSize + this.pageSize > this.total
            ? this.total
            : (this.pageIndex - 1) * this.pageSize + this.pageSize
        );
      return str;
    },
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    }, //table
    total: {
      type: Number,
      required: true,
    }, //总条数
    pager_layout: {
      type: String,
      default: "total,sizes,prev, pager, next, jumper",
    }, //组件布局
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40],
    }, //每页显示个数选择器
    pageSize: {
      type: Number,
      default: 10,
      required: true,
    }, //每页显示个数
    pageIndex: {
      type: Number,
      default: 1,
      required: true,
    }, //当前页码
    tableColumns: {
      type: Array,
      default: () => [],
      required: true,
    }, //每列标题名字
    objcontent: {
      type: Object,
      default: () => ({
        border: true, //是否带有纵向边框
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        changeselect: false, //是否有多选项列
        number: false, //是否有序号
        size: "mini",
        changeselect: true,
      }),
    }, //一些表格样式
    operations: {
      type: Object,
      default() {
        return {};
      }, //操作按钮
    },
  },
};
</script>
<style>
.pagination {
  display: flex;
  min-width: 1030px;
  max-width: 100%;
  margin-top: 10px;
  align-items: center;
}
.pagination .info {
  flex: 1;
  font-size: 13px;
  min-width: 35.5px;
  height: 28px;
  line-height: 28px;
  vertical-align: top;
  box-sizing: border-box;
  /* padding-left: 1%; */
}
.pagination >>> .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #026cd2;
  color: #ffffff;
  border: 1px solid #026cd2;
  border-radius: 50% !important;
}
.pagination >>> .el-pagination {
  flex: 1;
  text-align: right;
}
.all_table {
  margin-top: 1%;
}
</style>
