<template>
  <div class="padding">
    <div v-show="view === 'table'">
      <div
        style="margin-bottom: 12px;display: flex; justify-content: space-between;"
      >
        <div>
          <el-button class="add" @click="add">{{
            $t("common.Added")
          }}</el-button>
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
      <CoolEmTable
        ref="table"
        :tableList="roles"
        :columns="columns"
        :currentPage="currentPage"
        @SelectionChange="(value) => (selected = value)"
      >
        <el-table-column slot="btn" align="center" :label="$t('common.operate')" prop="id">
          <template #default="{row}">
            <div v-if="row.id == '1'"></div>
            <div v-else>
              <el-button type="text" @click="goUser(row.id)">
                {{$t('role.user')}}
              </el-button>
              <el-button type="text" @click="goAuth(row.id)">
                {{$t('role.permissions')}}
              </el-button>
              <el-button type="text" @click="edit(row)">
                 {{$t('common.modification')}}
              </el-button>
              <el-button type="text" @click="del(row.id)">
                 {{$t('common.delete')}}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </CoolEmTable>
    </div>
    <RoleForm v-if="showDialog" :showDialog.sync="showDialog" :currData="currData" />
    <!-- <RoleAuth v-if="view === 'role'" :role="currData" @close="view = 'table'" />
    <ManagerApp
      :roleId="roleId"
      @close="view = 'table'"
      v-if="view === 'manager'"
    /> -->
    <div v-if="view === 'auth'" class="row">
      <RoleAuth
        v-if="user === 'role'"
        :role="currData"
        @close="view = 'table'"
      />
      <!-- <ManagerApp
        :roleId="roleId"
        @close="view = 'table'"
        v-if="user === 'manager'"
      /> -->
    </div>
  </div>
</template>

<script>
import RoleApi from "@/api/RoleApi";
import CoolEmTable from "@/components/CoolEmTable.vue";
import RoleForm from "./RoleForm.vue";
import RoleAuth from "./RoleAuth.vue";
// import ManagerApp from "../newManager/ManagerApp.vue";
import { Role } from "./role";
export default {
  components: {
    CoolEmTable,
    RoleForm,
    // ManagerApp,
    RoleAuth,
  },
  data() {
    return {
      view: "table",
      user: "",
      currentPage: 1, // 当前页
      // pageSize: 15,
      roles: [], // 全部列表数据
      list: [],
      selected: [], // 被选中的数据
      searchKey: "", // 关键字
      roleId: "", // 角色id
      showDialog: false, // 控制新增/编辑弹层
      currData: new Role(), // 当前操作的数据
      columns: [
        {
          prop: "id",
          label: "ID",
          align: "center",
          width: "150px",
        },
        {
          prop: "roleName",
          label: this.$t('role.roleName'),
          align: "center",
          width: "200px",
        },
        {
          prop: "roleType",
          label: this.$t('role.roleType'),
          align: "center",
          width: "230px",
        },
        {
          prop: "roleDesc",
          label: this.$t('role.roleDesc'),
          align: "center",
        },
      ],
    };
  },
  watch: {
    searchKey() {
      this.roles = this.list;
      if (this.searchKey === "") return (this.currentPage = 1);
      let reg = RegExp(this.searchKey, "i");
      this.roles = this.roles.filter((item) => {
        if (
          reg.test(item.id) ||
          reg.test(item.roleName) ||
          reg.test(item.roleType) ||
          reg.test(item.roleDesc)
        ) {
          return item;
        }
      });
    },
  },
  methods: {
    refresh() {
      RoleApi.list()
        .then((data) => {
          this.roles = data.list;
          this.list = data.list;
          this.roles.forEach((item) => {
            if (item.roleType == "1") {
              item.roleType = this.$t('role.roleType1');
            } else if (item.roleType == "2") {
              item.roleType = this.$t('role.roleType2');
            } else if (item.roleType == "3") {
              item.roleType = this.$t('role.roleType3');
            } else {
              item.roleType = this.$t('role.roleType4');
            }
          });
        })
        .catch((err) => this.$error(this.$t('role.error')));
    },
    add() {
      this.showDialog = true;
      this.currData = new Role();
    },
    edit(row) {
      this.currData = row;
      this.showDialog = true;
      // console.log(row);
    },
    del(_id) {
      this.$confirm(this.$t('role.confirm.delMsg'), this.$t('common.prompt'), {
        type: "warning",
      })
        .then(async () => {
          try {
            await RoleApi.delete([_id]);
            await this.$info(this.$t('common.delSuccess'));
            // this.currentPage = 1;
            this.refresh();
            // this.$refs.table.handleCurrentChange(1)
          } catch (error) {
            this.$error(this.$t('common.delFail'));
          }
        })
        .catch((e) => e);
    },
    delAll() {
      // console.log(this.selected);
      if (this.selected.length == 0) return;
      this.$confirm(this.$t('role.confirm.delMsg'), this.$t('common.prompt'), {
        type: "warning",
      })
        .then(async () => {
          try {
            await RoleApi.delete(this.selected.map((sel) => sel.id));
            await this.$info(this.$t('common.delSuccess'));
            this.refresh();
          } catch (error) {
            this.$error(this.$t('common.delFail'));
          }
        })
        .catch((e) => e);
    },
    goUser(_id) {
      // console.log('点击用户事件执行了');
      this.roleId = _id;
      parent.postMessage(
        {
          type: "manager",
          roleId: this.roleId,
        },
        parent.origin
      );
      // console.log(this.roleId, "当前角色id");
      // this.view = "manager";
    },
    goAuth(_id) {
      this.user = "role"
      this.currData = this.roles.find((role) => role.id === _id);
      // console.log('当前数据',this.currData);
      // this.view = "role";
      this.view = "auth";
    },
  },
  created() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
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
/deep/ .el-table .el-table__cell {
  padding: 6px 0;
}
/deep/ button:focus {
  outline: 0;
}
</style>
