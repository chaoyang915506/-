<template>
  <div class="container-fluid" style="overflow: auto; width: 100%; height: 100%">
    <div class="row">
      <div class="col-12" v-if="view === 'table'">
        <h2>公告管理</h2>
        <hr />
        <el-button type="primary" @click="addForm">新增</el-button>
        <el-input placeholder="请输入分组" v-model="search" style="width: 20%; float: right;">
          <i class="el-icon-search el-input__icon" slot="suffix"> </i
        ></el-input>
        <el-table
          :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          border
          style="width: 100%;margin:2% 0;"
        >
          <el-table-column label="序号" align="center" :index="indexFn" type="index" width="80">
          </el-table-column>
          <el-table-column prop="groupGuestId" label="团客分组" align="center" fit>
            <template #default="{row}">
              {{ getAllGuest(row) }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="公告标题" align="center"> </el-table-column>
          <el-table-column prop="text" label="公告内容" align="center">
            <template #default="{row}">
              {{ row.text.length > 10 ? row.text.substring(0, 10) + "..." : row.text }}
            </template>
          </el-table-column>
          <el-table-column prop="isEnable" label="显示状态" align="center">
            <template #default="{row}">
              <el-switch
                v-model="row.isEnable"
                :active-value="1"
                :inactive-value="0"
                @change="e => switchState(e, row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" align="center">
            <template #default="{row}">
              <el-button type="text" @click="edit(row)" style="    font-size: 15px;"
                >编辑</el-button
              >
              <el-button type="text" @click="delRow(row)" style="color:red;font-size: 15px;"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length !== 0"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 10, 20, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 编辑的数据 -->
    <notice-form
      v-if="view == 'form'"
      :languagelist="languagelist"
      :guestList="guestList"
      :model_Tr="model_Tr"
      @back="back"
    ></notice-form>
  </div>
</template>

<script>
class form_Data {
  constructor() {
    this.langId = "";
    this.text = "";
    this.hotelId = parseInt(env.hotelId);
    this.groupGuestId = "";
    this.title = "";
    this.isEnable = 1;
  }
}
import NoticeApi from "@/api/NoticeApi";
import NoticeForm from "./NoticeForm.vue";
import CoolTable from "@/components/CoolTable.vue";
import env from "@/env";
export default {
  data() {
    return {
      view: "table",
      pageSize: 10, //每页多少条
      currentPage: 1, // 当前页
      search: "",
      languagelist: [],
      tableObject: {},
      tableList: [],
      guestList: [], //分组
      guestListAll: [], //全部分组
      model_Tr: [], //存储编辑和新增的数据
      differText: "" //区分新增还是修改
    };
  },
  created() {
    //获取酒店的语言
    NoticeApi.getHoteLang()
      .then(language => {
        this.languagelist = language;
      })
      .catch(err => {
        console.log(err);
      });
    this.getallData();
  },
  computed: {
    tableData() {
      let reg = RegExp(this.search, "ig");
      let dataTable = [];
      this.guestListAll
        .filter(item => {
          return this.search == "" ? item : reg.test(item.groupGuestName);
        })
        .forEach(idx => {
          let data = this.tableList.find(item => item.groupGuestId == idx.groupGuestId);
          if (data) {
            dataTable.push(data);
          }
        });
      return dataTable;
      // return this.search == ""
      //   ? this.tableList
      //   : this.tableList.filter(item => reg.test(item.title));
    }
  },
  methods: {
    getAllGuest(row) {
      if (row.groupGuestId == -1) return "全部房间";
      let data = this.guestListAll.find(i => i.groupGuestId == row.groupGuestId);
      if (data) return data.groupGuestName;
    },
    //删除
    async delRow(row) {
      let res = await this.$confirm("确定删除吗？");
      if (!res) return;
      let model;
      for (let key in this.tableObject) {
        if (key == row.groupGuestId) {
          model = this.tableObject[key].map(item => item.id);
        }
      }
      try {
        await NoticeApi.deldataFrom(model);
        await this.getallData();
        await this.$info("删除公告成功");
      } catch (error) {
        console.log(error);
      }
    },
    indexFn(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //修改switch的状态
    async switchState(e, row) {
      let model;
      for (let key in this.tableObject) {
        if (key == row.groupGuestId) {
          model = this.tableObject[key].map(item => {
            return {
              hotelId: item.hotelId,
              langId: item.langId,
              text: item.text,
              title: item.title,
              relType: item.groupGuestId == -1 ? 0 : 2,
              // groupGuestId: item.groupGuestId,
              id: item.id,
              isEnable: e,
              id: item.id
            };
          });
        }
      }
      try {
        await NoticeApi.updateFormData(model);
        await this.$info("切换成功");
        await this.getallData();
      } catch (error) {
        console.log(error);
      }
    },
    //编辑的数据
    async edit(row) {
      for (let key in this.tableObject) {
        if (key == row.groupGuestId) {
          this.model_Tr = this.tableObject[key];
        }
      }
      this.guestList = this.guestListAll;
      this.view = "form";
    },
    back() {
      this.view = "table";
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    async addForm() {
      this.model_Tr = this.languagelist.map(item => {
        return {
          ...new form_Data(),
          langId: item.langId
        };
      });
      this.view = "form";
    },
    //获取全部数据
    async getallData() {
      this.tableList = [];
      //查全部的分组
      let guestAll = await NoticeApi.getAllGuest();
      this.guestListAll = guestAll;
      this.guestListAll.push({
        groupGuestId: -1,
        groupGuestName: "全部房间",
        hotelId: env.hotelId
      });
      //查询所有的公告消息
      let tabledata = await NoticeApi.getAllData();
      if (tabledata !== null && tabledata !== undefined) {
        this.tableObject = tabledata;
        let arr = [];
        for (let key in tabledata) {
          arr.push(this.tableObject[key]);
        }
        arr.forEach(idx => {
          idx.forEach((data, index) => {
            if (index == 0) {
              this.tableList.push(data);
            }
          });
        });
      } else {
        this.tableList = [];
      }
      this.guestList = this.guestListAll.filter(item => {
        let data = this.tableData.findIndex(idx => idx.groupGuestId == item.groupGuestId);
        if (data == -1) {
          return item;
        }
      });
    }
  },
  components: {
    CoolTable,
    NoticeForm
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-table thead {
  color: #1f2e4d;
  font-weight: 700;
}
::v-deep tbody {
  color: #3d4966;
}
</style>
