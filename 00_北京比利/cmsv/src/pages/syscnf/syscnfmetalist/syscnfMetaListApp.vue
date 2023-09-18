<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <!-- <div class="row"> -->
    <div class="col-12"></div>
    <div class="col-12" v-if="view === 'table'">
      <h2>基础配置管理</h2>
      <div class="card">
        <div class="card-header">查询条件</div>
        <div class="card-body row" style="justify-content: space-around;">
          <div class="col-3 row center_line">
            <label class="col-4" style="text-align: right;"> 配置名称</label>
            <div class="col-8">
              <input type="text" v-model="name" @keyup.enter="refresh" class="form-control" />
            </div>
          </div>
          <div class="col-3 row center_line">
            <label class="col-4" style="text-align: right;"> 配置key </label>
            <div class="col-8">
              <input type="text" @keyup.enter="refresh" v-model="key" class="form-control" />
            </div>
          </div>

          <div class="col-3 row center_line">
            <label class="col-4" style="text-align: right;">
              前端输入类型
            </label>
            <div class="col-8">
              <select class="form-control" v-model="input" @change="refresh">
                <option value="">全部</option>
                <option value="input">input</option>
                <option value="select">select</option>
                <option value="checkbox">checkbox</option>
              </select>
            </div>
          </div>
          <div class="col-3 row center_line">
            <label class="col-4" style="text-align: right;"> 配置分组 </label>
            <div class="col-8">
              <cool-select
                btnStyle="btn-light"
                v-model="syscnfGroupId"
                @change="refresh"
                :liveSearch="true"
                :opts="classlist"
              >
              </cool-select>
              <!-- <select class="form-control" v-model="syscnfGroupId" @change="refresh">
                <option value="">全部</option>
                <option :value="i.id" v-for="i in classlist" :key="i.id">{{ i.name }}</option>
              </select> -->
            </div>
          </div>
        </div>
      </div>
      <cool-table
        @edit-row="editTable"
        @del-row="delMessage"
        ref="messageTable"
        :columns="columns"
        :options="options"
      >
        <button class="btn btn-primary ml-1" @click="addfile">
          添加
        </button>
        <button class="btn btn-danger ml-1" @click="delMessages">
          删除
        </button>
        <button class="btn btn-info ml-1" @click="iconmanager">
          分组管理
        </button>
      </cool-table>
    </div>

    <div v-if="view == 'form'" class="centerbox">
      <div class="col-sm-8 mr-top">
        <vo v-slot="{ handleSubmit }" v-if="view == 'form'">
          <form novalidate @submit.prevent="handleSubmit(submit)">
            <!-- id -->
            <vp class="form-group mb-4" tag="div" v-slot="v" rules="required" name="key">
              <label class="col-3 control-label">key(*)</label>
              <div class="col-8">
                <input v-model="editData.key" class="form-control" v-validate="v" type="text" />
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 名称(*) -->
            <vp class="form-group mb-4" tag="div" v-slot="v" rules="required" name="名称">
              <label class="col-3 control-label">名称(*)</label>
              <div class="col-8">
                <input class="form-control" v-model="editData.name" type="text" v-validate="v" />
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 类型(*) -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">类型(*)</label>
              <div class="col-8">
                <select class="form-control" v-validate="v" v-model="editData.type">
                  <option value="int">int</option>
                  <option value="long">long</option>
                  <option value="string">string</option>
                  <option value="json">json</option>
                  <option value="jsonArray">jsonArray</option>
                </select>
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 描述 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">描述</label>
              <div class="col-8">
                <textarea v-model="editData.desc" class="form-control" v-validate="v" rows="2">
                </textarea>

                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 默认值(*) -->
            <vp class="form-group mb-4" tag="div" v-slot="v" rules="required|numeric" name="默认值">
              <label class="col-3 control-label">默认值(*)</label>
              <div class="col-8">
                <input
                  v-validate="v"
                  class="form-control"
                  v-model="editData.defaultValue"
                  type="text"
                />
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 是否必须 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">是否必须</label>
              <div class="col-8">
                <input type="checkbox" value="1" v-model="editData.required" />
              </div>
            </vp>
            <!-- 是否吐给客户端 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">是否吐给客户端</label>
              <div class="col-8">
                <input type="checkbox" value="1" v-model="editData.forClient" />
              </div>
            </vp>
            <!--吐给客户端的参数名  -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">吐给客户端的参数名</label>
              <div class="col-8">
                <input
                  v-validate="v"
                  v-model="editData.clientName"
                  class="form-control"
                  type="text"
                />
              </div>
            </vp>
            <!-- 是否发送给酒店全局缓存 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">是否发送给酒店全局缓存</label>
              <div class="col-8">
                <input type="checkbox" value="1" v-model="editData.forCache" />
              </div>
            </vp>
            <!-- 前端输入类型 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">前端输入类型</label>
              <div class="col-8">
                <select v-validate="v" class="form-control" v-model="editData.inputType">
                  <option value="input">input</option>
                  <option value="select">select</option>
                  <option value="checkbox">checkbox</option>
                </select>
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 可选取值列表 -->
            <vp class="form-group mb-4" tag="div" v-slot="v">
              <label class="col-3 control-label">可选取值列表</label>
              <div class="col-8">
                <textarea v-model="editData.options" class="form-control" v-validate="v" rows="2">
                </textarea>

                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 改动时更新缓存类型 -->
            <vp class="form-group mb-4" tag="div" v-slot="v" name="类型">
              <label class="col-3 control-label">改动时更新缓存类型</label>
              <div class="col-8">
                <select v-validate="v" class="form-control" v-model="editData.updateCache">
                  <option value="none">none</option>
                  <option value="welcome">欢迎页接口</option>
                  <option value="item">栏目结构接口</option>
                  <option value="init">初始化接口</option>
                </select>
                <span class="err">{{ v.errors[0] }}</span>
              </div>
            </vp>
            <!-- 操作 -->
            <div class="form-group mt-4">
              <label class="col-3 control-label"></label>
              <div class="col-8">
                <button type="submit" class="btn btn-primary">
                  {{ buttontit }}
                </button>
                <button type="button" class="btn-secondary btn ml-1" @click="close">
                  返回
                </button>
              </div>
            </div>
          </form>
        </vo>
      </div>
    </div>
    <div v-if="view == 'grounp'">
      <syscnfMetaListGrounp @backtable="close" />
    </div>
  </div>
</template>
<script>
class formbase {
  constructor() {
    this.key = "";
    this.options =
      '[{ "value": 0, "desc": "选项一" }, { "value": 1, "desc": "选项二" }, { "value": 2, "desc": "选项三" }]';
    this.name = "";
    this.type = "int";
    this.defaultValue = "";
    this.clientName = "none";
    this.inputType = "input";
    this.updateCache = "none";
    this.required = 0;
    this.forClient = 1;
    this.forCache = 1;
  }
}
import CoolSelect from "@/components/CoolSelect.vue";
import { syscnfMetaListApi } from "@/api/SyscnfApi";
import CoolTable from "@/components/CoolTable.vue";
import env from "@/env";
import CoolFileInput from "@/components/CoolFileInput.vue";
import UploadApi from "@/api/UploadApi";
import Multiselect from "vue-multiselect";
import syscnfMetaListGrounp from "./syscnfMetaListGrounp.vue";
export default {
  data() {
    return {
      value: "",
      options: {
        url: `${env.cms}/cms/syscnfMeta/getAll?token=${env.token}`,
        method: "get",
        pageNumber: 1, //初始化加载第一页
        sidePagination: "server", //服务端
        // pageSize: 10, //单页记录数
        pageList: [5, 10, 20], //可选择单页记录数
        search: false,
        pagination: true, //分页
        strictSearch: true,
        // showColumns: true, //是否显示所有的列
        // showRefresh: true, //刷新按钮
        queryParams: params => {
          let data = {
            name: this.name,
            metaType: "14",
            key: this.key,
            offset: params.offset + 0, // SQL语句起始索引
            limit: params.limit,
            input: this.input,
            syscnfGroupId: this.syscnfGroupId
          };
          if (data.name == "") delete data.name;
          if (data.key == "") delete data.key;
          if (data.input == "") delete data.input;
          if (data.syscnfGroupId == 0) delete data.syscnfGroupId;
          return data;
        },
        responseHandler: res => {
          //   console.log(res, 'res')
          this.tableList = res.data.rows;
          return {
            rows: res.data.rows,
            total: res.data.total
          };
        }
      },
      name: "",
      key: "",
      input: "",
      configcentre: "", //配置中心
      configkey: "", //配置key
      configgroup: null, //配置风阻
      selectModel: "", //前端输入类型
      syscnfGroupId: "",
      vendor: env.vendor,
      extensions: ["jpg", "png", "jpeg"],
      view: "table",
      tableList: [],
      cityicon: UploadApi.getUrl("image"),
      columns: [
        {
          checkbox: true
        },
        {
          field: "id",
          title: "id",
          align: "center"
        },
        {
          field: "key",
          title: "配置key",
          align: "center"
        },
        {
          field: "name",
          title: "配置名称",
          align: "center"
        },
        {
          field: "desc",
          title: "详细描述",
          align: "center",
          visible: false
        },
        {
          field: "defaultValue",
          title: "默认值",
          align: "center"
        },
        {
          field: "type",
          title: "类型",
          align: "center"
        },
        {
          field: "required",
          title: "必须",
          align: "center",
          formatter: val => {
            if (val == 0) {
              return "否";
            } else {
              return "是";
            }
          }
        },
        {
          field: "forClient",
          title: "至客户端",
          align: "center",
          formatter: val => {
            switch (val) {
              case 0:
                return "否";
                break;
              case 1:
                return "是";
                break;
              default:
                return "未知";
                break;
            }
          }
        },
        {
          field: "clientName",
          title: "客户端名称",
          align: "center",
          visible: false
        },
        {
          field: "forCache",
          title: "配置下发",
          align: "center",
          formatter: val => {
            switch (val) {
              case 0:
                return "否";
                break;
              case 1:
                return "是";
                break;
              default:
                return "未知";
                break;
            }
          }
        },
        {
          field: "updateCache",
          title: "更新缓存",
          align: "center"
        },
        {
          field: "inputType",
          title: "控件类型",
          align: "center",
          visible: false
        },
        {
          field: "id",
          title: "操作",
          align: "center",
          width: 300,
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit-row">修改</button>
                      <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del-row" >删除</button>`;
          }
        }
      ],
      editData: new formbase(),

      classlist: [], //分类内容
      buttontit: ""
    };
  },
  computed: {
    //icon 的id 数组
    geticon() {
      return this.tableList.map(item => item.id);
    }
  },
  created() {
    this.getHoteLangList();
  },
  methods: {
    refresh() {
      this.$refs.messageTable.refresh();
    },
    //图标管理
    iconmanager() {
      this.view = "grounp";
    },
    //添加
    addfile() {
      this.buttontit = "添加";
      this.editData = new formbase();
      this.view = "form";
    },
    async submit() {
      try {
        if (this.editData.id) {
          const data = await syscnfMetaListApi.update({
            ...this.editData,
            required: this.editData.required == false ? "0" : "1",
            forClient: this.editData.forClient == false ? "0" : "1",
            forCache: this.editData.forCache == false ? "0" : "1"
          });
          this.$info("修改成功");
        } else {
          //新增
          const data = await syscnfMetaListApi.addsyscn({
            ...this.editData,
            required: this.editData.required == false ? "0" : "1",
            forClient: this.editData.forClient == false ? "0" : "1",
            forCache: this.editData.forCache == false ? "0" : "1"
          });
          await this.$info("添加基础配置成功");
        }
        await this.close();
      } catch (error) {
        console.log(error);
        this.$error(error);
      }
    },
    //获取数据
    async getHoteLangList() {
      try {
        const classify = await syscnfMetaListApi.getclassify();
        this.classlist = classify.list.map(idx => {
          return {
            option: idx.name,
            value: idx.id
          };
        });
        this.classlist.unshift({ value: 0, option: "全部" });
      } catch (error) {
        console.log(error);
      }
    },
    //关闭
    close(val) {
      this.editData = {};
      this.getHoteLangList();
      this.view = "table";
    },
    //编辑跳转按钮
    async editTable(val) {
      this.buttontit = "更新";
      //   try {
      const data = await syscnfMetaListApi.getOneIdit(val);

      this.editData = data;
      this.view = "form";
    },
    // // 删除单个
    async delMessage(id) {
      try {
        const ok = await this.$confirm("提示", "确定删除此项吗？");
        if (!ok) return;
        await syscnfMetaListApi.deleteApi(id);
        await this.$info("删除成功");
        await this.refresh();
        await this.close();
      } catch (error) {
        console.error(error);
        this.$error("删除失败");
      }
    },
    // // 删除多个
    async delMessages() {
      const selections = this.$refs.messageTable.getSelections();
      if (selections.length === 0) return;

      try {
        const ok = await this.$confirm(`确定删除${selections.length}项吗？`);
        if (!ok) return;

        await syscnfMetaListApi.batchDelete({
          idList: selections.map(v => v.id)
        });
        await this.$info("删除成功");
        await this.close();
      } catch (error) {
        console.error(error);
        this.$error("删除失败");
      }
    }
  },
  components: {
    CoolTable,
    CoolFileInput,
    Multiselect,
    syscnfMetaListGrounp,
    CoolSelect
    // SelectPicker,
  },
  watch: {
    configgroup(val) {
      this.getHoteLangList();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep td {
  max-width: 12.5rem;
  overflow-wrap: break-word;
}
.mr-top {
  margin-top: 3%;
}
.centerbox {
  display: flex;
  justify-content: center;
}
.col-3 .control-label {
  display: inline-block;
  font-weight: 700;
  width: 21%;
  text-align: right;
  margin-right: 4%;
}
//错误样式
.err {
  font-size: 0.5rem;
  position: absolute;
  width: 100%;
  color: #dc3545;
}
.is-block {
  border: 0.042rem solid red;
  border-radius: 0.208rem;
}
::v-deep .is-invalid {
  background-image: none;
}
// palcehotle样式
input::placeholder {
  color: #adadad;
  display: inline-block;
  margin-bottom: 0.417rem;
  padding-top: 0.083rem;
  font-size: 0.5rem;
}
::v-deep .form-group {
  margin-bottom: 1.2 rem;
  display: flex;
  justify-content: right;
  align-items: center;
}
.center_line {
  align-items: center;
}
::v-deep .bootstrap-select > .dropdown-toggle.bs-placeholder,
.bootstrap-select > .dropdown-toggle.bs-placeholder:active,
.bootstrap-select > .dropdown-toggle.bs-placeholder:focus,
.bootstrap-select > .dropdown-toggle.bs-placeholder:hover {
  border: 1px solid #ced4da;
}
::v-deep .bootstrap-select .dropdown-toggle:focus,
.bootstrap-select > select.mobile-device:focus + .dropdown-toggle {
  outline: none !important;
}
::v-deep .btn:not(:disabled):not(.disabled) {
  border: 1px solid #ced4da;
}
</style>
