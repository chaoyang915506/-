<template>
  <div class="container-fluid">
    <Search
      @zhNameChange="handleZhName"
      @enNameChange="handleEnName"
      @icaoCodeChange="handleIcaoCode"
      @iataCodeChange="handleIataCode"
    />
    <cool-table
      ref="tables"
      :columns="columns"
      :data="datas"
      :options="options"
      @del="handleDel"
      @edit="handleEdit"
    >
      <div class="btn-group" role="group" aria-label="Basic example">
        <button @click="goAdd" type="button" class="btn btn-primary">
          新增
        </button>
        <!-- <button @click="handleMultipleDel" type="button" class="btn btn-danger">
          删除
        </button> -->
        <button @click="handleImport" type="button" class="btn btn-info">导入</button>
        <input type="file" ref="files" @change="uploadFile" style="display: none" />
        <button :disabled="exportDisable" @click="handleExport" type="button" class="btn btn-info">
          导出
        </button>
      </div>
    </cool-table>
    <CoolLoading :loading="loading" />
  </div>
</template>

<script>
import Search from "./search.vue";
import CoolTable from "@/components/CoolTable.vue";
import AirlinesApi from "@/api/Airlines";
import env from "@/env";
import CoolModal from "@/components/CoolModal.vue";
import swal from "@/plugins/sweetalert";
import common from "@/common";
import CoolLoading from "@/components/CoolLoading.vue";
import XLSX, { read } from 'xlsx'
import { export_json_to_excel } from '@/utils/Export2Excel'

export default {
  name: "Airlines",
  components: { Search, CoolTable, CoolModal, CoolLoading },
  data() {
    return {
      exportDisable: false,
      loading: false,
      zhName: "",
      enName: "",
      icaoCode: "",
      iataCode: "",
      datas: [],
      columns: [
        { checkbox: true },
        { field: "id", title: "id", align: "center" },
        { field: "name", title: "名称", align: "center" },
        { field: "nameEn", title: "英文名称", align: "center" },
        { field: "code", title: "ICAO code", align: "center" },
        { field: "iataCode", title: "IATA code", align: "center" },
        { field: "source", title: "来源", align: "center",
        formatter:(val)=>{
          if(val === 0) return "香港国际机场"
          if(val === 1) return "新加坡国际机场"
          return "未知"
        } },
        {
          field: "id",
          title: "操作",
          align: "center",
          formatter: (val, row, idx) => {
            return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit="edit">编辑</button>
            <button class="btn btn-danger btn-sm" data-val=${val} data-emit="del">删除</button>`;
          },
        },
      ],
      options: {
        url: `${env.cms}/cms/airline/getByPage?token=${env.token}`,
        method: "get",
        pageNumber: 1, //初始化加载第一页
        sidePagination: "server", //服务端
        pageSize: 10, //单页记录数
        pageList: [5, 10, 20], //可选择单页记录数
        search: false,
        pagination: true, //分页
        strictSearch: true,
        showColumns: true, //是否显示所有的列
        showRefresh: true, //刷新按钮
        queryParams: (params) => {
          return {
            metaType: "14",
            offset: params.offset + 0, // SQL语句起始索引
            limit: params.limit, // 每页显示数量
            name: this.zhName,
            nameEn: this.enName,
            icaoCode: this.icaoCode,
            iataCode: this.iataCode,
          };
        },
        responseHandler: (res) => {
          this.tableList = res.data.rows;
          return {
            rows: res.data.rows,
            total: res.data.total,
          };
        },
        iconsPrefix: 'glyphicon',
        icons: {
          paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
          paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
          refresh: 'glyphicon-refresh icon-refresh',
          toggleOff: 'glyphicon-list-alt icon-list-alt',
          toggleOn: 'glyphicon-list-alt icon-list-alt',
          columns: 'glyphicon-th icon-th',
          detailOpen: 'glyphicon-plus icon-plus',
          detailClose: 'glyphicon-minus icon-minus',
          fullscreen: 'glyphicon-fullscreen',
          search: 'glyphicon-search',
          clearSearch: 'glyphicon-trash'
        },
      },
      id: "",
    };
  },
  mounted() {},
  methods: {
    handleZhName: function(v) {
      this.zhName = v;
      this.$refs.tables.refresh();
    },

    handleEnName: function(v) {
      this.enName = v;
      this.$refs.tables.refresh();
    },

    handleIcaoCode: function(v) {
      this.icaoCode = v;
      this.$refs.tables.refresh();
    },

    handleIataCode: function(v) {
      this.iataCode = v;
      this.$refs.tables.refresh();
    },
    handleDel: function(v) {
      this.id = v;
      common.confirm(
        "关联该航空公司数据一并删除",
        "确定删除id: " + v + " 的航空公司吗？",
        async function() {
          try {
            await AirlinesApi.del(this.id, env.token);
            swal.info("删除成功");
            this.$refs.tables.refresh();
          } catch (e) {
            swal.error(e);
          }
        }.bind(this)
      );
    },
    handleEdit: function(val) {
      let url = "/cmsv/airlines/add.html";
      this.$router.push({
        path: url,
        query: {
          token: env.token,
          id: val,
        },
      });
    },
    goAdd: function() {
      let url = "/cmsv/airlines/add.html";
      this.$router.push({
        path: url,
        query: {
          token: env.token,
        },
      });
    },
    handleMultipleDel: function() {
      let selections = this.$refs.tables.getSelections();
      let ids = [];
      selections.forEach(function(item) {
        ids.push(item.id);
      });
      common.confirm(
        "删除后无法恢复！",
        "关联航空公司的数据一并删除，您确定要删除这些航空公司吗？",
        async function() {
          try {
            await AirlinesApi.multipleDel(ids, env.token);
            swal.info("删除成功");
            this.$refs.tables.refresh();
          } catch (e) {
            swal.error(e);
          }
        }.bind(this)
      );
    },
    handleExport: async function() {
      this.loading = true;
      this.exportDisable = true;
      let params = {
        name: this.zhName,
        nameEn: this.enName,
        icaoCode: this.icaoCode,
        iataCode: this.iataCode,
      };
      const datas = await AirlinesApi.export(env.token, params);
      const ships = {
        ICAO_code: "",
        IATA_code: "",
        source: "",
        icon: "",
        "中文": "",
        "English": "",
        "日本語":"",
        "한국어":"",
        "Español":"",
        "Deutsch":"",
        "Français":"",
        "Italian":"",
        "中文(香港)":"",
        "中文(台灣)":"",
        " عربي ، ":"",
        "Русский язык":"",
        "Português":"",
      };
      let data = [];
      Object.values(datas).map(function(item) {
        if (item.name === null) {
          item.name = {
            l0: "",
            l1: "",
            l2: "",
            l3: "",
            l4: "",
            l5: "",
            l6: "",
            l7: "",
            l8: "",
            l9: "",
            l10: "",
            l11: "",
            l12: "",
            l13: "",
            l14: "",
            l15: "",
            l16: "",
            l17: "",
            l18: "",
            l19: "",
            l20: "",
          };
        }
        let node = [
          item.airline.code,
          item.airline.iataCode,
          item.airline.source,
          item.airline.icon,
          item.name.l0,
          item.name.l1,
          item.name.l2,
          item.name.l3,
          item.name.l4,
          item.name.l5,
          item.name.l6,
          item.name.l7,
          item.name.l8,
          item.name.l9,
          item.name.l10,
          item.name.l11,
          item.name.l12
        ];
        data.push(node);
      });

      const header = Object.keys(ships);
      export_json_to_excel({
        header,
        data,
        filename: "航空公司列表",
        autoWidth: true,
        bookType: "xlsx",
      });
      let _this = this
      setTimeout(() => {
        _this.loading = false;
        _this.exportDisable = false;
        // _this.$refs.tables.refresh();
      }, 2000);
      
    },

    handleImport: function() {
      this.$refs.files.click();
    },

    uploadFile: function(e) {
      let data = this.$refs.files.files[0];
      let suffix = data.name.substring(data.name.lastIndexOf('.') + 1, data.name.length);
      if (suffix !== 'xlsx' && suffix !== 'xls') {
          this.$error('文件格式不正确');
      }
      this.loading = true;
      const reader = new FileReader();
      reader.onload = async function handleRead() {
        var workbook = XLSX.read(reader.result, { type: "binary" });
          let xlsJson = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          try {
            let postdata = this.handleUploadJson(xlsJson);
            await AirlinesApi.import(env.token,{list: postdata});
            swal.info("上传成功")
            this.$refs.tables.refresh();
          } catch(e) {
            swal.error(e)
          }
          
          
      }.bind(this);
      reader.readAsBinaryString(this.$refs.files.files[0])
      this.loading = false;
      this.$refs.files.value = ""
    },
    handleUploadJson:function(data) {
      let postdata = [];
      console.log(data);
      data.map(function (item) {
        let airline = {
          code: item["ICAO_code"] || "",
          iataCode: item["IATA_code"] || "",
          icon: item["icon"] || "",
          name: item["中文"] || "",
          nameEn: item["English"] || "",
          source: item["source"] || 0,
          traditionalName: "1",
        };
        let name = {
          l0: item["中文"] || "",
          l1: item["English"] || "",
          l2: item["日本語"] || "",
          l3: item["한국어"] || "",
          l4: item["Español"] || "",
          l5: item["Deutsch"] || "",
          l6: item["Français"] || "",
          l7: item["Italian"] || "",
          l8: item["中文(香港)"] || "",
          l9: item["中文(台灣)"] || "",
          l10: item[" عربي ، "] || "",
          l11: item["Русский язык"] || "",
          l12: item["Português"] || "",
        };
        let n = {
          airline: airline,
          name: name,
        };
        postdata.push(n);
      });
      this.checkUploadJson(postdata);

      return postdata;

    },
    checkUploadJson:function(data) {
      let icaoCodeList = []
      for(let i=0; i < data.length; i++) {
        let line = i + 2

        if(icaoCodeList.includes(data[i]['airline']['code'])){
          throw new Error(`第${line}行，ICAO code重复`);
        }

        if(data[i]['airline']['source'] === "") {
          throw new Error(`第${line}行，source不可为空`);
        }

        if(data[i]['airline']['code'] === "") {
          throw new Error(`第${line}行，icao code不可为空`);
        }

        if(data[i]['airline']['l1'] === "") {
          throw new Error(`第${line}行，英文名称不可为空`);
        }

        icaoCodeList.push(data[i]['airline']['code'])
      }
    }
  },
};
</script>

<style scoped lang="scss">
// ::v-deep .btn-secondary {
//   background-color: #eee;
// }
</style>
