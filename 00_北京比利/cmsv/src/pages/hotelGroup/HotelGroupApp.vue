<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h2>酒店集团管理</h2>
            </div>
            <div class="col-12">
                <cool-table
                    v-if="view === 'table'"
                    :data="hotelGroups"
                    :columns="columns"
                    @update-row="update"
                    @delete-row="del"
                >
                    <button class="btn btn-primary" @click="create">
                        新增
                    </button>
                </cool-table>
                <hotel-group-form
                    v-else
                    :value="model"
                    @change="initHotelGroups"
                    @close="view = 'table'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import { HotelGroup } from './HotelGroup'
import HotelGroupApi from '@/api/HotelGroupApi'
import HotelGroupForm from './HotelGroupForm.vue'

export default {
    name: 'HotelGroupApp',
    components: { CoolTable, HotelGroupForm },
    data() {
        return {
            hotelGroups: [],
            columns: [{
                checkbox: true
            }, {
                field: 'grpName', title: '集团名称'
            }, {
                field: 'grpEnName', title: '集团英文名称'
            }, {
                field: 'grpType', title: '集团类型',
                formatter: val => {
                    switch (val) {
                        case '0':
                            return '酒店集团'
                        case '1':
                            return '业主集团'
                    }

                    return '-'
                }
            }, {
                field: 'grpContactor', title: '联系人'
            }, {
                field: 'grpStatus', title: '合作状态',
                formatter: val => val == 0 ? '正常' : '注销'
            }, {
                field: 'grpId', title: '操作',
                formatter: val => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-row>修改</button>
                        <button class="btn btn-danger btn-sm" data-val=${val} data-emit=delete-row>删除</button>`
                }
            }],
            view: 'table',
            model: null,
        }
    },
    methods: {
        create() {
            this.model = new HotelGroup();
            this.view = 'form'
        },
        update(_id) {
            this.model = this.hotelGroups.find(v => v.grpId == _id)
            this.view = 'form'
        },
        async del(_id) {
            try {
                const ok = await this.$confirm('删除', '不会删除仍有酒店的集团')
                if (!ok) {
                    return false
                }

                await HotelGroupApi.delete(_id)
                this.initHotelGroups()
            } catch (error) {
                console.error(error)

                this.$error('删除失败')
            }
        },
        initHotelGroups() {
            HotelGroupApi.list().then(data => {
                this.hotelGroups = data.list
            })
        }
    },
    created() {
        this.initHotelGroups()
    }
}
</script>
