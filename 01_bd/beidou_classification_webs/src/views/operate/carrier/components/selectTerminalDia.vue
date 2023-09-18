<template>
    <el-dialog title="选择终端" v-model="bindingOpen" width="80%" append-to-body>
        <div class="table_box">
            <div class="left_table">
                <el-input
                    v-model="queryParams.facilitySerial"
                    placeholder="设备序列号"
                    size="small"
                    style="width: 6.25rem; margin-right: 0.625rem"
                    clearable
                ></el-input>
                <el-select
                    v-model="queryParams.terminalType"
                    placeholder=""
                    clearable
                    style="width: 6.25rem"
                    size="small"
                    filterable
                >
                    <el-option v-for="item in terminal_type" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" style="margin-left: 10px" @click="getAllTerminal">查询</el-button>

                <el-table
                    :data="tableList"
                    border
                    stripe
                    v-loading="table_loading"
                    ref="leftTabRef"
                    @selection-change="handleSelectionChange"
                    style="margin: 10px 0"
                >
                    <el-table-column type="selection"> </el-table-column>
                    <el-table-column label="设备序列号" prop="facilitySerial" align="center"> </el-table-column>
                    <el-table-column label="入网序列号" prop="netInSerial" align="center"> </el-table-column>
                    <el-table-column label="终端类型" prop="netInSerial" align="center">
                        <template #default="scope">
                            {{ selectDictLabel(terminal_type, scope.row.terminalType) }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="total > 0"
                    v-model:current-page="queryParams.pageNum"
                    v-model:page-size="queryParams.pageSize"
                    :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
                    :small="small"
                    layout="sizes, prev, pager, next"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
            <div class="right_table">
                <el-table :data="newTableList" border stripe>
                    <el-table-column type="index" label="序号"> </el-table-column>
                    <el-table-column label="设备序列号" prop="facilitySerial" align="center"> </el-table-column>
                    <el-table-column label="入网序列号" prop="netInSerial" align="center"> </el-table-column>
                    <el-table-column label="终端类型" prop="netInSerial" align="center">
                        <template #default="scope">
                            {{ selectDictLabel(terminal_type, scope.row.terminalType) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="i" align="center">
                        <template #default="{ row }" style="text-align: center">
                            <div class="icon_del" @click="delHanlde(row)"></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="terminalSubmitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { 查询终端设备 } from '@/api/carrier/index.js'
const { proxy } = getCurrentInstance()
const table_loading = ref(false)
const { terminal_type } = proxy.useDict('terminal_type')
const emit = defineEmits(['transferData'])
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
})
const total = ref(0)
const bindingOpen = ref(false)
const tableList = ref([])
const terminalList = ref([])
function cancel() {
    // console.log('关闭了')
    bindingOpen.value = false
}
const newTableList = ref([])
function terminalSubmitForm() {
    let facilitySerial = newTableList.value
        .map((i) => {
            return i.facilitySerial ? i.facilitySerial : '无'
        })
        .join(',')
    emit('transferData', {
        terminalId: facilitySerial,
    })
    bindingOpen.value = false
}
function show() {
    newTableList.value = []
    getAllTerminal()
    bindingOpen.value = true
}

function delHanlde(row) {
    newTableList.value = newTableList.value.filter((i) => i.facilitySerial != row.facilitySerial)
    // proxy.$refs.leftTabRef.toggleRowSelection(row, undefined)
}

function handleSelectionChange(e) {
    for (let i = 0; i < e.length; i++) {
        let res = newTableList.value.find((d) => d.facilitySerial == e[i].facilitySerial)
        if (!res) {
            newTableList.value.push(e[i])
        }
    }
}

async function getAllTerminal() {
    try {
        table_loading.value = true
        const res = await 查询终端设备(queryParams.value)
        total.value = res.total
        tableList.value = res.rows
        table_loading.value = false
    } catch (error) {
        table_loading.value = false
        proxy.$modal.msgWarning('查询失败')
    }
}

function handleSizeChange(val) {
    queryParams.value.pageSize = val
    getAllTerminal()
}
function handleCurrentChange(val) {
    queryParams.value.pageNum = val
    getAllTerminal()
}

defineExpose({
    show,
})
</script>

<style lang="scss" scoped>
.table_box {
    width: 100%;
    height: 100%;
    display: flex;
    .left_table,
    .right_table {
        width: 48%;
        height: 100%;
    }
    .left_table {
        margin-right: 4%;
    }
}
.icon_del {
    display: flex;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    background: url('@/assets/icons/svg/del.svg') no-repeat;
}
</style>
