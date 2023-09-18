<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h2>管理员列表</h2>
            </div>
            <div class="col-12">
                <cool-table
                    ref="managerTable"
                    :data="filteredManagers"
                    :columns="columns"
                    @update-row="updateManager"
                    @update-password="updatePassword"
                    @update-phoneNumber="updatePhoneNo"
                    @del-row="delManager"
                >
                    <button class="btn btn-primary" @click="addManager">
                        新增
                    </button>
                    <button class="btn btn-danger ml-1" @click="delManagers">
                        删除
                    </button>
                </cool-table>
                <cool-modal
                    title="管理员"
                    :visible="modalVisible"
                    :footer="{ visible: false }"
                    @hidden="modalVisible = false"
                >
                    <manager-form
                        v-if="modalVisible && modalView === 'manager'"
                        :value="managerModel"
                        @change="refresh"
                        @close="modalVisible = false"
                    />
                    <manager-pwd
                        v-if="modalVisible && modalView === 'password'"
                        :value="managerModel"
                        @updatePass="updatePass"
                        @change="refresh"
                        @close="modalVisible = false"
                    />
                    <manager-phone
                        v-if="modalVisible && modalView === 'phoneNumber'"
                        :value="managerModel"
                        @updatePhone="updatePhone"
                        @change="refresh"
                        @close="modalVisible = false"
                    />
                </cool-modal>
            </div>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import ManagerApi from "@/api/ManagerApi";
import ManagerForm from './ManagerForm.vue';
import { Manager } from './manager';
import RoleApi from '@/api/RoleApi';
import CmsApi from '@/api/CmsApi';
import md5 from "md5";
import Api from '@/api/Api';
import CoolModal from '@/components/CoolModal.vue';
import ManagerPwd from './ManagerPwd.vue';
import ManagerPhone from './ManagerPhone';

export default {
    name: 'ManagerApp',
    components: { CoolTable, ManagerForm, CoolModal, ManagerPwd, ManagerPhone },
    props: {
        roleId: {
            require: false, type: Number, default: 0
        },
    },
    data() {
        return {
            id: "",
            managers: [],
            currentRoleId: this.roleId,
            columns: [{
                checkbox: true
            }, {
                field: 'roleName', title: '所属角色'
            }, {
                field: 'managerAccount', title: '用户名'
            }, {
                field: 'managerName', title: '管理员名称'
            }, {
                field: 'mode', title: '登录模式',
                formatter: (val, row, idx) => {
                    switch (val) {
                        case 0:
                            return '用户名密码登录'
                        case 1:
                            return '手机验证码登录'
                        case 2:
                            return '图形验证码登录'
                        default:
                            return '-'
                    }
                }
            }, {
                field: 'phoneNumber', title: '手机号'
            }, {
                field: 'managerStatus', title: '状态',
                formatter: (val, row, idx) => {
                    switch (val) {
                        case 0:
                            return '禁用'
                        case 1:
                            return '启用'
                        case 2:
                            return '锁定'
                        default:
                            return 'Error'
                    }
                }
            }, {
                field: 'id', title: '操作',
                formatter: (val, row, idx) => {
                    if (val === 1) {
                        // 超级管理员
                        return;
                    }
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-row>修改</button>
                        <button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-password>修改密码</button>
                        <button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-phoneNumber>绑定手机号</button>
                        <button class="btn btn-danger btn-sm" data-val=${val} data-emit=del-row>删除</button>`
                }
            }],
            modalVisible: false,
            modalView: 'manager',
            managerModel: new Manager()
        }
    },
    computed: {
        filteredManagers() {
            if (this.currentRoleId === 0) {
                return this.managers;
            }
            return this.managers.filter(manager => manager.roleId === this.currentRoleId);
        }
    },
    methods: {
        addManager() {
            this.managerModel = new Manager()

            this.modalView = 'manager'
            this.modalVisible = true
        },
        updateManager(_id) {
            this.managerModel = this.managers.find(manager => manager.id === _id)

            this.modalView = 'manager'
            this.modalVisible = true
        },
        updatePass(pass) {
            this.managerModel.managerPwd = md5(pass)
            try {
                ManagerApi.updatePwd(this.managerModel)
                this.$info('成功')
            } catch (error) {
                this.$error('失败')
            }
        },
        updatePassword(_id) {
            this.managerModel = this.managers.find(manager => manager.id === _id)
            this.modalView = 'password'
            this.modalVisible = true
        },
        updatePhoneNo(_id) {
            this.managerModel = this.managers.find(manager => manager.id === _id)
            this.modalView = 'phoneNumber'
            this.modalVisible = true
        },
        async updatePhone(phone) {
            this.managerModel.phoneNumber = phone;
            try {
                await ManagerApi.updatePhone(this.managerModel);
                this.$info('成功')
            } catch (error) {
                this.$error('失败')
            }
        },
        async delManager(_id) {
            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return;
                }

                await ManagerApi.delete([_id])
                await this.$info('删除管理员成功')
                this.refresh()
            } catch (error) {
                this.$error('删除管理员失败')
            }
        },
        async delManagers() {
            const selections = this.$refs.managerTable.getSelections()
            if (selections.length === 0) {
                return
            }

            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }

                await ManagerApi.delete(selections.map(v => v.id))
                await this.$info('删除成功')
                this.refresh()
            } catch (error) {
                console.error(error)
                this.$error('删除失败')
            }
        },
        refresh() {
            ManagerApi.list().then(data => {
                this.managers = data.list
            }).catch(err => this.$error('获取管理员列表失败'))
        }
    },
    created() {
        this.refresh();

        let href = window.location.href;
        if (href.indexOf("roleId") > -1) {
            this.currentRoleId = parseInt(window.location.href.split("?")[1].split("&")[0].split("=")[1]);
        }

        Api.all([RoleApi.list(), CmsApi.hotels(), CmsApi.hotelGroups()], (role, hotel, hotelGroup) => {
            this.$store.commit('setRoles', role.list)
            this.$store.commit('setHotels', hotel.list)
            this.$store.commit('setHotelGroups', hotelGroup.list)
        }).catch(err => {
            console.error(err)
        })

    }
}
</script>
