<template>
    <div class="app-container app-box">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" @submit.prevent>
            <el-form-item label="终端类型">
                <el-select v-model="queryParams.terminalType" placeholder="请输入终端类型" clearable>
                    <el-option
                        v-for="item in terminal_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="设备序列号" label-width="90px">
                <el-input
                    v-model="queryParams.facilitySerial"
                    @keyup.enter="getList"
                    placeholder="请输入设备序列号"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="入网序列号" label-width="90px">
                <el-input
                    v-model="queryParams.netInSerial"
                    @keyup.enter="getList"
                    placeholder="请输入入网序列号"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="绑定北斗卡" label-width="90px">
                <el-input
                    v-model="queryParams.cardNum"
                    @keyup.enter="getList"
                    placeholder="请输入北斗卡号"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="绑定载体名称" label-width="100px">
                <el-input
                    v-model="queryParams.carrierName"
                    @keyup.enter="getList"
                    placeholder="请输入绑定载体名称"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" type="primary" class="btn_submit" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style" icon="Plus" @click="handleAdd">新增</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style">分配使用人</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="已绑定" name="first">
                <el-table v-loading="table_loading" :data="tableList" @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="终端类型" align="center" prop="terminalType">
                        <template #default="scope">
                            <dict-tag :options="terminal_type" :value="scope.row.terminalType" />
                        </template>
                    </el-table-column>
                    <el-table-column label="设备序列号" align="center" prop="facilitySerial" />
                    <el-table-column label="入网序列号" align="center" prop="netInSerial" />
                    <el-table-column label="终端协议版本号" align="center" prop="terminalVersion" />
                    <el-table-column label="安装日期" align="center" prop="install_time" />
                    <el-table-column label="通信功能" align="center" prop="communication">
                        <template #default="{ row }">
                            {{ selectDictLabel(function_status, row.communication) }}
                        </template></el-table-column
                    >
                    <el-table-column label="报警功能" align="center" prop="warning">
                        <template #default="{ row }">
                            {{ selectDictLabel(function_status, row.warning) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="绑定北斗卡号" align="center" prop="cardNum"> </el-table-column>
                    <el-table-column label="绑定载体名称" align="center" prop="carrierName"> </el-table-column>
                    <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button size="mini" type="text" @click="handlePeople(scope.row)">分配使用人</el-button>
                            <el-button size="mini" type="text" @click="handleSubmit(scope.row)">注销</el-button>
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table></el-tab-pane
            >
            <el-tab-pane label="未绑定" name="second">
                <el-table v-loading="table_loading" :data="tableList" @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="终端类型" align="center" prop="terminalType">
                        <template #default="scope">
                            <dict-tag :options="terminal_type" :value="scope.row.terminalType" />
                        </template>
                    </el-table-column>
                    <el-table-column label="设备序列号" align="center" prop="facilitySerial" />
                    <el-table-column label="入网序列号" align="center" prop="netInSerial" />
                    <el-table-column label="终端协议版本号" align="center" prop="terminalVersion" />
                    <el-table-column label="安装日期" align="center" prop="bindingTime" />
                    <el-table-column label="通信功能" align="center" prop="communication">
                        <template #default="{ row }">
                            {{ selectDictLabel(function_status, row.communication) }}
                        </template></el-table-column
                    >
                    <el-table-column label="报警功能" align="center" prop="warning">
                        <template #default="{ row }">
                            {{ selectDictLabel(function_status, row.warning) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="绑定北斗卡号" align="center" prop="cardNum"> </el-table-column>
                    <el-table-column label="绑定载体名称" align="center" prop="carrierName"> </el-table-column>
                    <el-table-column label="关联状态" align="center" prop="isBinding">
                        <template #default="{ row }">
                            {{ selectDictLabel(relevance_state, row.relevanceState) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button size="mini" type="text" @click="handlePeople(scope.row)">分配使用人</el-button>
                            <el-button size="mini" type="text" @click="handleSubmit(scope.row)">注销</el-button>
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table></el-tab-pane
            >
        </el-tabs>

        <pagination
            v-show="total > 0"
            :total="total"
            style="position: relative"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
        <!-- 分配使用人弹框 -->
        <el-dialog :title="titlePeo" v-model="openPeople" width="40%" append-to-body>
            <el-form
                :model="usePeople"
                ref="formPoeple"
                :rules="rulesPeople"
                label-width="80px"
                :inline="false"
                size="normal"
            >
                <el-form-item label="使用人" prop="userId" v-if="titlePeo == '分配使用人'">
                    <el-select v-model="usePeople.userId" placeholder="" clearable filterable>
                        <el-option v-for="item in peopleList" :key="item.value" :label="item.userName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注销原因" prop="cause" v-else>
                    <el-input v-model="usePeople.cause" placeholder="" size="normal" clearable></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormPeople">确 定</el-button>
                    <el-button @click="openPeople = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 添加或者修改 -->
        <ModalDia ref="modalRef" :modalFrom="data.form" @getList="getList" @goNotBound="goNotBound" />
    </div>
</template>

<script setup>
import { 查询, 删除, 新增, 编辑, 注销, 查询使用人, 分配使用人 } from '@/api/terminalManage/index.js'
const { proxy } = getCurrentInstance()
const { terminal_type, is_binding, relevance_state, function_status } = proxy.useDict(
    'terminal_type',
    'is_binding',
    'relevance_state',
    'function_status'
)
import ModalDia from './components/modalDia.vue'
let activeName = ref('first')
let usePeople = ref({})
let openPeople = ref(false)
let titlePeo = ref('')
let data = reactive({
    open: false,
    form: {},

    rulesPeople: {
        userId: [{ required: true, message: '分配使用人不能为空', trigger: 'change' }],
        cause: [{ required: true, message: '注销原因不能为空', trigger: 'change' }],
    },
    title: null,
    timePicker: null,
    total: 0,
    table_loading: false,
    tableList: [],
    tableData: [],
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        bindOrNot: 1, //未绑定
    },
})
const { title, open, tableData, table_loading, total, queryParams, timePicker, form, tableList, rulesPeople } =
    toRefs(data)
//go未绑定
function goNotBound() {
    queryParams.value.bindOrNot = 0
    activeName.value = 'second'
}
onMounted(() => {
    getList()
    getAllPeople()
})
const peopleList = ref([])
const peopleId = ref('')
function handlePeople(row) {
    reset()
    titlePeo.value = '分配使用人'
    peopleId.value = row.id
    openPeople.value = true
}
// 表格勾选
const handleSelectionChange = () => {}
// 添加
const handleAdd = () => {
    data.form = {}
    proxy.$refs['modalRef'].show()
}
// 编辑
const handleUpdate = (val) => {
    data.form = val
    proxy.$refs['modalRef'].show()
}
// 删除
const handleDelete = (val) => {
    proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
        删除(val.id).then(() => {
            getList()
            proxy.$modal.msgSuccess('删除成功')
        })
    })
}

//清空
function reset() {
    proxy.resetForm('formPoeple')
}
// 获取列表
const getList = async () => {
    let res = await 查询(data.queryParams)
    if (res.code === 200) {
        data.tableList = res.rows
        data.total = res.total
    } else {
        data.tableList = []
        data.total = 0
    }
}
async function getAllPeople() {
    const res = await 查询使用人()
    // console.log(res, '使用人')
    peopleList.value = res.rows
}
// 提交
const submitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            let res
            if (data.title === '编辑终端信息') {
                res = await 编辑(data.form)
            } else {
                res = await 新增(data.form)
            }
            if (res.code === 200) {
                proxy.$modal.msgSuccess('操作成功')
                getList()
                cancel()
            } else {
                proxy.$modal.msgSuccess('操作失败')
            }
        }
    })
}

function submitFormPeople() {
    proxy.$refs['formPoeple'].validate(async (valid) => {
        if (valid) {
            if (titlePeo.value == '分配使用人') {
                await 分配使用人({ id: peopleId.value, userId: usePeople.value.userId })
                proxy.$modal.msgSuccess('分配使用人成功')
            } else {
                await 注销({ id: peopleId.value, cause: usePeople.value.cause })
                proxy.$modal.msgSuccess('注销成功')
            }
            getList()
            openPeople.value = false
        }
    })
}
//切换绑定和未绑定
const handleClick = (e) => {
    if (e.props.label == '未绑定') {
        queryParams.value.bindOrNot = 0
    } else {
        queryParams.value.bindOrNot = 1
    }
    getList()
}
// 取消
const cancel = () => {
    data.form = {}
    data.open = false
}
// 注销终端
const handleSubmit = (row) => {
    reset()
    titlePeo.value = '注销终端'
    peopleId.value = row.id
    openPeople.value = true
}
</script>

<style scoped>
::v-deep .el-upload-dragger {
    width: 260px;
    height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
    width: 220px !important;
}
</style>
