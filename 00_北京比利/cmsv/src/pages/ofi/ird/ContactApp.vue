<template>
    <div class="container-fluid">
        <div class="row p-3">
            <div class="col-12">
                <h1>通讯录</h1>
            </div>
            <div class="col-12">
                <cool-table
                    ref="contactTable"
                    :data="contacts"
                    :columns="columns"
                    :pageSize="5"
                    @edit="edit"
                    @delete="del"
                >
                    <div class="btn btn-primary" @click="create">新建</div>
                    <div class="btn btn-primary ml-1" @click="multiOnDuty">
                        上值
                    </div>
                    <div class="btn btn-primary ml-1" @click="multiOffDuty">
                        下值
                    </div>
                    <div class="btn btn-danger ml-1" @click="multiDel">
                        删除
                    </div>
                    <i class="m-auto text-mute col">选择后进行批量操作</i>
                </cool-table>
                <cool-modal
                    :visible="modalVisible"
                    :footer="{ visible: false }"
                    @hidden="modalVisible = false"
                >
                    <h4 slot="header">通讯方式</h4>
                    <contact-form
                        class="px-3"
                        :contact="contactModel"
                        :key="contactModel._vkey"
                        @submit="refresh"
                        @close="modalVisible = false"
                    />
                </cool-modal>
            </div>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import ContactForm from './ContactForm.vue'
import { mapState } from 'vuex'
import OfiApi, { IrdContact } from '../OfiApi'

export default {
    name: 'ContactApp',
    components: { CoolTable, ContactForm, CoolModal },
    data() {
        return {
            modalVisible: false,
            columns: [{
                checkbox: true, align: 'center',
            }, {
                field: 'name', title: '名称', align: 'center',
            }, {
                field: 'phone', title: '联系方式', align: 'center',
            }, {
                field: 'onDuty', title: '是否在值', align: 'center',
                formatter: val => `<div class="${val ? 'text-success' : 'text-danger'}">${val ? '是' : '否'}</div>`
            }, {
                field: 'id', title: '操作', align: 'center',
                formatter: val => `<button class="btn btn-primary btn-sm" data-val="${val}" data-emit="edit">编辑</button>
<button class="btn btn-danger btn-sm" data-val="${val}" data-emit="delete">删除</button>`
            }],
            contactModel: {},
        }
    },
    computed: {
        ...mapState({
            contacts: s => s.contacts,
        }),
    },
    methods: {
        refresh() {
            OfiApi.contacts().then(data => {
                this.$store.commit('setContacts', data.list);
            })
        },
        create() {
            this.contactModel = new IrdContact;

            this.modalVisible = true
        },
        edit(_id) {
            this.contactModel = this.contacts.find(c => c.id === _id);
            this.contactModel._vkey = Date.now();

            this.modalVisible = true
        },
        del(_id) {
            this.$confirm('删除', '').then(ok => {
                if (ok) {
                    return OfiApi.deleteContact([_id]).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.refresh()
                        return Promise.resolve();
                    })
                }
            }).catch(err => this.$error('删除失败'));
        },
        multiOnDuty() {
            const idArr = this.$refs.contactTable.getSelections().map(c => c.id)
            if (idArr.length === 0) {
                return;
            }

            this.$confirm('批量上值', '').then(ok => {
                if (ok) {
                    return OfiApi.contactOnDuty(idArr).then(() => {
                        return this.$info('批量上值成功')
                    }).then(() => {
                        this.refresh()
                        return Promise.resolve()
                    })
                }
            }).catch(err => this.$error('批量上值失败'))
        },
        multiOffDuty() {
            const idArr = this.$refs.contactTable.getSelections().map(c => c.id)
            if (idArr.length === 0) {
                return
            }

            this.$confirm('批量下值', '').then(ok => {
                if (ok) {
                    return OfiApi.contactOffDuty(idArr).then(() => {
                        return this.$info('批量下值成功')
                    }).then(() => {
                        this.refresh()
                        return Promise.resolve()
                    })
                }
            }).catch(err => this.$error('批量下值失败'))
        },
        multiDel() {
            const idArr = this.$refs.contactTable.getSelections().map(c => c.id);
            if (idArr.length === 0) {
                return;
            }

            this.$confirm('删除所选', '').then(ok => {
                if (ok) {
                    return OfiApi.deleteContact(idArr).then(() => {
                        return this.$info('删除成功')
                    }).then(() => {
                        this.refresh()
                        return Promise.resolve()
                    })
                }
            }).catch(err => this.$error('删除失败'))

        }
    },
}
</script>

<style>
</style>