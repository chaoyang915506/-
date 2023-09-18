<template>
  <div class="padding">
    <div
      style="margin-bottom: 12px;display: flex; justify-content: space-between;"
    >
      <div>
        <el-button class="add" @click="add">{{ $t("common.Added") }}</el-button>
        <el-button class="del" @click="delAll">{{
          $t("common.delete")
        }}</el-button>
      </div>
      <el-input
        :clearable="true"
        :autofocus="true"
        :placeholder="$t('common.search')"
        prefix-icon="el-icon-search"
        v-model="searchKey"
      >
      </el-input>
    </div>
    <el-table
      @select="select"
      @select-all="selectAll"
      ref="table"
      :data="
        filteredManagers.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      "
      border
      :empty-text="$t('common.notData')"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="roleName"
        :label="$t('manager.roleName')"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="managerAccount"
        :label="$t('manager.userName')"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="managerName"
        :label="$t('manager.managerName')"
        width="170"
      >
      </el-table-column>
      <el-table-column prop="mode" :label="$t('manager.mode')" width="280">
        <template #default="{ row }">
          {{ tarnsformMode(row.mode) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        :label="$t('manager.phoneNumber')"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="managerStatus"
        :label="$t('manager.managerStatus')"
        width="105"
      >
        <template #default="{ row }">
          {{ tarnsformSattus(row.managerStatus) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operate')">
        <template #default="{ row }">
          <div v-if="row.id === 1"></div>
          <div v-else>
            <el-button type="text" @click="edit(row)">{{
              $t("common.modification")
            }}</el-button>
            <el-button type="text" @click="updatePwd(row)">{{
              $t("manager.modificationPwd")
            }}</el-button>
            <el-button type="text" @click="updatePhone(row)">{{
              $t("manager.bindPhone")
            }}</el-button>
            <el-button type="text" @click="del(row.id)">{{
              $t("common.delete")
            }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <div>
        {{ $t("common.footMsg") }}{{ currentPage * pageSize - pageSize + 1
        }}{{ $t("common.footMsg0")
        }}{{ total &lt; currentPage * pageSize ? total : currentPage * pageSize





        }}{{ $t("common.footMsg1") }}，{{ $t("common.footTotal") }}{{ total
        }}{{ $t("common.footMsg1") }}
      </div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <UpdateManager
      v-if="showDialog"
      style="z-index: 9999"
      :showDialog.sync="showDialog"
      :currData="currData"
      :currentRoleId.sync="currentRoleId"
    />
    <!-- 修改密码 -->
    <UpdatePwd :showPwd.sync="showPwd" :currData="currData" />
    <!-- 绑定手机号 -->
    <UpdatePhone :showPhone.sync="showPhone" :currData="currData" />
  </div>
</template>

<script>
class currData {
  constructor() {
    this.id = "";
    this.mode = 1; // 登录方式
    this.hotelId = 0;
    this.roleId = "";
    this.managerAccount = "";
    this.managerName = "";
    this.managerPwd = "";
    this.comfirmPwd = "";
    this.phoneNumber = "";
    this.hotelGroupId = 0; // 所属集团
    this.managerStatus = 1; // 用户状态
  }
}
import ManagerApi from "@/api/ManagerApi";
import UpdateManager from "./UpdateManager.vue";
import UpdatePwd from "./UpdatePwd.vue";
import UpdatePhone from "./UpdatePhone.vue";
import CmsApi from "@/api/CmsApi";
import RoleApi from "@/api/RoleApi";
import Api from "@/api/Api";
export default {
  name: "ManagerApp",
  components: {
    UpdateManager,
    UpdatePwd,
    UpdatePhone,
  },
  // props: {
  //   roleId: {
  //     type: Number,
  //     default: 0,
  //   },
  // },
  data() {
    return {
      managers: [],
      list: [],
      searchKey: "", // 搜索关键字
      currentPage: 1,
      pageSize: 10,
      pagesizes: [5, 10, 20, 30],
      showDialog: false, // 控制新增编辑弹层
      currData: {},
      selected: [], // 选中数据
      showPwd: false, // 控制密码弹层
      showPhone: false, // 控制绑定手机号弹层
      ids: [],
      currentRoleId: 0,
    };
  },
  computed: {
    total() {
      return this.filteredManagers.length;
    },
    filteredManagers() {
      let reg = RegExp(this.searchKey, "i");
      return this.managers
        .filter((i) => {
          return this.currentRoleId == 0 ? i : i.roleId == this.currentRoleId;
        })
        .filter((item) => {
          if (
            reg.test(item.roleName) ||
            reg.test(item.managerAccount) ||
            reg.test(item.managerName) ||
            reg.test(item.phoneNumber) ||
            reg.test(this.tarnsformMode(item.mode)) ||
            reg.test(this.tarnsformSattus(item.managerStatus))
          ) {
            return item;
          }
        });
    },
  },
  created() {
    this.refresh();
    // console.log(this.roleId, '接收的id')
    let href = window.location.href;
    if (href.indexOf("roleId") > -1) {
      this.currentRoleId = parseInt(
        window.location.href
          .split("?")[1]
          .split("&")[0]
          .split("=")[1]
      );
    }
    // console.log("角色id", this.currentRoleId);
    Api.all(
      [RoleApi.list(), CmsApi.hotels(), CmsApi.hotelGroups()],
      (role, hotel, hotelGroup) => {
        this.$store.commit("setRoles", role.list);
        this.$store.commit("setHotels", hotel.list);
        this.$store.commit("setHotelGroups", hotelGroup.list);
      }
    ).catch((err) => {
      console.error(err);
    });
  },
  methods: {
    // filteredManagers() {
    //   console.log(123);
    //   this.managers = this.managers.filter((i) => {
    //     return this.currentRoleId == 0 ? i : i.roleId == this.currentRoleId;
    //   });
    // },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    refresh() {
      ManagerApi.list()
        .then((data) => {
          // console.log(data.list);
          this.managers = data.list;
          this.list = data.list;
          // this.filteredManagers();
        })
        .catch((err) => this.$error(this.$t('manager.confirm.getData')));
    },
    tarnsformMode(val) {
      switch (val) {
        case 0:
          return this.$t("manager.mode0");
        case 1:
          return this.$t("manager.mode1");
        case 2:
          return this.$t("manager.mode2");
        default:
          return "-";
      }
    },
    tarnsformSattus(val) {
      switch (val) {
        case 0:
          return this.$t("manager.status0");
        case 1:
          return this.$t("manager.status1");
        case 2:
          return this.$t("manager.status2");
        default:
          return "Error";
      }
    },
    select(sel, row) {
      this.ids = [];
      // console.log("选中的数据", sel, "行数据", row);
      sel.forEach((item) => {
        this.ids.push(item.id);
      });
    },
    selectAll(ids) {
      this.ids = [];
      // console.log(ids);
      ids.forEach((_id) => {
        this.ids.push(_id.id);
      });
    },
    delAll() {
      if (this.ids.length === 0) return;
      this.$confirm(this.$t("common.delTitle"), this.$t("common.prompt"), {
        type: "warning",
      })
        .then(async () => {
          try {
            await ManagerApi.delete(this.ids);
            await this.$info(this.$t("manager.confirm.delS"));
            this.refresh();
            this.currentPage = 1;
          } catch (error) {
            this.$error(this.$t("manager.confirm.delF"));
          }
        })
        .catch((e) => e);
    },
    add() {
      this.showDialog = true;
      this.currData = new currData();
      console.log(this.currData,'add');
    },
    del(_id) {
      // console.log(this.$t("common.delTitle"));
      this.$confirm(this.$t("common.delTitle"), this.$t("common.prompt"), {
        type: "warning",
      })
        .then(async () => {
          try {
            await ManagerApi.delete([_id]);
            await this.$info(this.$t("manager.confirm.delS"));
            this.refresh();
            this.currentPage = 1;
          } catch (error) {
            this.$error(this.$t("manager.confirm.delF"));
          }
        })
        .catch((e) => e);
    },
    edit(currData) {
      this.showDialog = true;
      // console.log("当前操作的数据", currData);
      this.currData = currData;
    },
    updatePwd(row) {
      this.showPwd = true;
      this.currData = row;
    },
    updatePhone(row) {
      this.showPhone = true;
      this.currData = row;
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  // color: #a7a8a9;
  font-size: 14px;
  // background-color: #f7f9fc;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
/deep/.el-pagination {
  padding: 6px 5px;
}
/deep/ .el-table .el-table__cell {
  text-align: center;
  padding: 5px 0;
}
/deep/ .el-table tr {
  height: 50px;
}
/deep/ .el-button--text {
  color: #3090f0;
}
/deep/ .el-icon-search:before {
  content: "\e778";
  font-weight: 700;
  font-size: 14px;
  color: #3d4966;
}
/deep/ .el-input {
  width: 230px;
}
</style>
