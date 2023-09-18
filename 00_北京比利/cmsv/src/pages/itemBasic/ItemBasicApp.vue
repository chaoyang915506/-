<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 p-3">
                <h2>基础栏目管理</h2>
            </div>
            <div class="col-12">
                <cool-table
                    ref="itemList"
                    :columns="columns"
                    :data="itemList"
                    @update-row="updateItem"
                    @del-row="delItem"
                >
                    <button class="btn btn-primary mr-1" @click="addItem">
                        添加
                    </button>
                    <button class="btn btn-danger invisible" @click="delItems">
                        删除
                    </button>
                </cool-table>
                <cool-modal
                    :visible="modalVisible"
                    title="基础栏目"
                    :footer="{ visible: false }"
                    @hidden="modalVisible = false"
                >
                    <edit-item
                        v-if="modalVisible"
                        :value="activeItem"
                        :method="method"
                        @change="refresh"
                        @close="modalVisible = false"
                    />
                </cool-modal>
            </div>
        </div>
    </div>
</template>
<script>
import ItemBasicApi from '@/api/ItemBasicApi'
import CoolTable from '@/components/CoolTable.vue';
import CoolModal from '@/components/CoolModal.vue';
import CoolSorter from '@/components/CoolSorter.vue';
import EditItem from './EditItem.vue';

class ItemBasic {
    constructor() {
        this.type = 0;
        this.itemBasicId = 0;
        this.itemBasicDesc = '';
        this.isEnable = 1;
    }
}

export default {
    name: "ItemBasicApp",
    components: { CoolTable, CoolModal, CoolSorter, EditItem },
    data() {
        return {
            modalVisible: false,
            itemList: [],
            activeItem: new ItemBasic(),
            method: "add",
            columns: [{
                checkbox: true,
            }, {
                field: 'itemBasicId', title: 'ID'
            }, {
                field: 'type', title: '类型'
            }, {
                field: 'itemBasicDesc', title: '标题'
            },
            {
                field: 'isEnable', title: '状态',
                formatter: (val, row, idx) => {
                    return (val == 0 ? "未激活" : "激活")
                }
            }, {
                field: 'itemBasicId', title: '操作',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val="${val}" data-emit="update-row">修改</button>
                        <button class="btn btn-danger btn-sm invisible" data-val="${val}" data-emit="del-row">删除</button>`
                }
            }],
        };
    },
    methods: {
        delItem(_itemBasicId) {
            this.activeItem = this.itemList.find(data => data.itemBasicId === _itemBasicId)
            this.$confirm(`确认删除${this.activeItem.itemBasicDesc}？`).then(ok => {
                if (ok) {
                    this.$info("成功删除!");
                    this.refresh()
                } else {
                    this.$info("取消删除!");
                }
            });
        },
        delItems() {
            const selections = this.$refs.itemList.getSelections();
            if (selections.length === 0) {
                //没有选择
                return;
            }

            const idArr = selections.map(sel => sel.id);
            swal({
                title: "确认删除？",
                text: "一旦删除，你将无法恢复！",
                icon: "warning",
                buttons: true,
                buttons: ['取消', '确定'],
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    swal("成功删除!", {
                        icon: "success",
                    });
                } else {
                    swal("取消删除!");
                }
            });
        },
        updateItem(_itemBasicId) {
            this.activeItem = this.itemList.find(data => data.itemBasicId == _itemBasicId)
            this.method = "update"
            this.modalVisible = true;
        },
        addItem() {
            this.activeItem = new ItemBasic();
            this.method = "add"
            this.modalVisible = true;
        },
        refresh() {
            ItemBasicApi.list().then(data => this.itemList = data.list)
        },
    },
    created() {
        ItemBasicApi.list()
            .then(data => this.itemList = data.list)
    }
}
</script>
