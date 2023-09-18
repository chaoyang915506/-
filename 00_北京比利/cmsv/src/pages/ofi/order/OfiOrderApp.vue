<template>
    <div class="container-fuild">
        <div class="row p-4">
            <div class="col-12">
                <h2>订单</h2>
            </div>
            <div class="col-12 mt-2">
                <form class="form-inline p-3 border rounded">
                    <label>订单类型：</label>
                    <select class="form-control mx-3" v-model="typeFilter">
                        <option value="-1">全部</option>
                        <option v-for="(v, k) in orderTypes" :key="k" :value="k">
                            {{ v }}
                        </option>
                    </select>
                    <label>选择房间号：</label>
                    <select
                        class="form-control mx-3"
                        v-model="roomNumberFilter"
                    >
                        <option value="-1">全部</option>
                        <option
                            v-for="roomNumber in roomNumbers"
                            :key="roomNumber"
                            :value="roomNumber"
                        >
                            {{ roomNumber }}
                        </option>
                    </select>
                    <label>选择时间范围：</label>
                    <input
                        type="date"
                        class="form-control"
                        v-model="leftDateFilter"
                        @change="refreshOrders"
                    />
                    <label class="mx-3"><strong>-</strong></label>
                    <input
                        type="date"
                        class="form-control"
                        v-model="rightDateFilter"
                        @change="refreshOrders"
                    />
                </form>
            </div>
            <div class="col-12">
                <cool-table
                    :data="tableData"
                    :columns="columns"
                    :pageSize="5"
                    @refund="refund"
                    @order-detail="orderDetail"
                />
                <cool-modal
                    :visible.sync="itemsVisible"
                    :footer="{ visible: false }"
                    @hide="itemsVisible = false"
                >
                    <h5 slot="header">订单详情</h5>
                    <div class="p-3">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>物品编码</th>
                                    <th>物品名称</th>
                                    <th>物品单价（元）</th>
                                    <th>下单数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in items" :key="item.id">
                                    <td>{{ item.code }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ (item.price / 100).toFixed(2) }}</td>
                                    <td>{{ item.quantity }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </cool-modal>
            </div>
        </div>
    </div>
</template>

<script>
import CoolTable from '@/components/CoolTable.vue'
import CoolModal from '@/components/CoolModal.vue'
import { mapState } from 'vuex'
import OfiApi from '../OfiApi'

export default {
    name: 'OfiOrderApp',
    components: { CoolTable, CoolModal },
    data() {
        return {
            orderTypes: { 'ird': '客房点餐', 'shopping': '客房购物', 'linen': '布草服务', 'laundry': '洗衣服务' },
            columns: [{
                checkbox: true,
            }, {
                field: 'type', title: '类型', align: 'center',
                formatter: (val, row, idx) => {
                    let ret = this.orderTypes[val]
                    return ret ? ret : 'Error'
                }
            }, {
                field: 'roomNumber', title: '房间', align: 'center'
            }, {
                field: 'orderNumber', title: '订单号', align: 'center'
            }, {
                field: 'createdAt', title: '下单时间', align: 'center',
                formatter: (val, row, idx) => new Date(val * 1000).format('yyyy-MM-dd hh:mm:ss')
            }, {
                field: 'payment.number', title: '付款单号', align: 'center'
            }, {
                field: 'payment.amount', title: '付款金额（元）', align: 'center',
                formatter: (val, row, idx) => (val / 100).toFixed(2)
            }, {
                field: 'id', title: '订单内容', align: 'center',
                formatter: (val, row, idx) => `<button class="btn btn-info btn-sm" data-val="${val}" data-emit="order-detail" >订单详情</button>`
            }, {
                field: 'paymentId', title: '退款', align: 'center',
                formatter: (val, row, idx) => {
                    let disabled = ''
                    if (row.payment.refundNumber !== '' || row.type === 'linen') {
                        disabled = 'disabled'
                    }
                    return `<button class="btn btn-danger btn-sm" ${disabled} data-val="${val}" data-emit="refund">退款</button>`
                }
            }],
            itemsVisible: false,
            items: [],
            typeFilter: '-1',
            roomNumberFilter: '-1',
            leftDateFilter: 0,
            rightDateFilter: 0,
        }
    },
    computed: {
        ...mapState({
            orders: s => s.orders.sort((a, b) => a.createdAt - b.createdAt),
        }),
        tableData() {
            return this.orders.filter(v => this.typeFilter === '-1' ? true : v.type === this.typeFilter)
                .filter(v => this.roomNumberFilter === '-1' ? true : v.roomNumber === this.roomNumberFilter)
                .sort((a, b) => b.createdAt - a.createdAt)
        },
        roomNumbers() {
            return new Set(this.orders.map(v => v.roomNumber));
        }
    },
    methods: {
        refund(_paymentId) {
            this.$confirm('确认退款吗', '').then(ok => {
                if (ok) {
                    return OfiApi.refund(_paymentId).then(() => {
                        return this.$info('退款成功')
                    }).then(() => {
                        this.refreshOrders()
                        return Promise.resolve()
                    })
                }
            }).catch(err => this.$error('退款失败'))
        },
        orderDetail(_id) {
            this.items = this.orders.find(v => v.id === _id).items

            this.itemsVisible = true
        },
        refreshOrders() {
            // 按0点开始算，结束时间按24点算
            const st = parseInt(new Date(this.leftDateFilter + ' 0:0:0').getTime() / 1000),
                et = parseInt(new Date(this.rightDateFilter + ' 24:0:0').getTime() / 1000)
            if (isNaN(st) || isNaN(et) || st >= et) {
                return;
            }
            OfiApi.orders(st, et).then(data => {
                this.$store.commit('setOrders', data.list)
            }).catch(err => this.$error(err))
        }
    },
    created() {
        this.leftDateFilter = new Date(Date.now() - 30 * 86400000).format('yyyy-MM-dd')
        this.rightDateFilter = new Date().format('yyyy-MM-dd')
        this.refreshOrders()
    }
}
</script>

<style>
</style>