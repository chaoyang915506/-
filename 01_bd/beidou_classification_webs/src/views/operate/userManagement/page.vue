<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" @submit.prevent>
            <div>
                <el-form-item label="使用人">
                    <el-input
                        v-model="queryParams.userName"
                        placeholder="请输入使用人"
                        clearable
                        @keyup.enter="getList"
                    ></el-input>
                </el-form-item>
                <el-form-item label="北斗卡号">
                    <el-input
                        v-model="queryParams.bdsNumber"
                        @keyup.enter="getList"
                        placeholder="请输入北斗卡号"
                        clearable
                    ></el-input>
                </el-form-item>
            </div>

            <el-form-item label="载体名称">
                <el-input
                    v-model="queryParams.carrierName"
                    @keyup.enter="getList"
                    placeholder="请输入载体名称"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
                <el-input
                    v-model="queryParams.deptName"
                    @keyup.enter="getList"
                    placeholder="请输入所属部门"
                    clearable
                ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button icon="Search" type="primary" class="btn_submit" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style" @click="handleExport">导出</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="table_loading" :data="tableList" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="使用人" align="center" prop="userName" />
            <el-table-column label="所属部门" align="center" prop="deptName" />
            <el-table-column label="保管卡数" align="center" prop="deptName">
                <template #default="{ row }">
                    {{ getbdsNumber(row.bdsNumber) }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作时间" align="center" prop="bindingTime" /> -->
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="mini" type="text" @click="handleCheck(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- total_bound -->
        <pagination
            v-show="tab === '未绑定' ? total > 0 : total_bound > 0"
            :total="tab === '未绑定' ? total : total_bound"
            v-model:page="queryParams.pageNum"
            style="position: relative"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或者修改 -->
        <el-dialog
            :title="title"
            v-model="open"
            width="45%"
            append-to-body
            :close-on-press-escape="false"
            :close-on-click-modal="false"
        >
            <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-show="title !== '北斗卡变更'">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="0">
                        <el-form-item label="使用人：" prop="userName">
                            <el-input
                                v-model="form.userName"
                                placeholder="请输入使用人"
                                v-show="title !== '查看使用人'"
                            />
                            <span v-show="title === '查看使用人'">{{ form.userName ? form.userName : '暂无' }}</span>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="tel">
                            <el-input v-model="form.tel" placeholder="请输入联系电话" v-show="title !== '查看使用人'" />
                            <span v-show="title === '查看使用人'">{{ form.tel ? form.tel : '暂无' }}</span>
                        </el-form-item>
                        <el-form-item
                            label="北斗卡号："
                            prop="bdsNumber"
                            class="elFormItem"
                            v-if="title === '查看使用人'"
                        >
                            <span>{{ form.bdsNumber ? form.bdsNumber : '暂无' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-form-item label="身份证：" prop="idCard">
                            <el-input
                                v-model="form.idCard"
                                placeholder="请输入身份证"
                                v-show="title !== '查看使用人'"
                            />
                            <span v-show="title === '查看使用人'">{{ form.idCard ? form.idCard : '暂无' }}</span>
                        </el-form-item>

                        <!-- <el-form-item label="所属部门：" prop="deptId" v-if="title !== '新增使用人'">
                            <tree-select
                                v-show="title !== '查看使用人'"
                                v-model:value="form.deptId"
                                :options="deptOptions"
                                placeholder="请输入所属部门"
                                :objMap="{ value: 'id', label: 'label', children: 'children' }"
                            />
                            <span v-show="title === '查看使用人'">{{ form.deptName ? form.deptName : '暂无' }}</span>
                        </el-form-item> -->
                        <el-form-item label="所属载体：" prop="carrierName" v-if="title === '查看使用人'">
                            <span>{{ form.carrierName ? form.carrierName : '暂无' }}</span>
                        </el-form-item>
                        <el-form-item label="绑卡时间：" v-if="title === '查看使用人'">
                            <span>{{ form.carrierName ? form.carrierName : '暂无' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer" v-if="title !== '查看使用人'">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <!-- <el-button @click="cancel">取 消</el-button> -->
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
const { proxy } = getCurrentInstance()
import { 查询, 新增, 删除, 编辑, 查询人员 } from '@/api/userManagement/index.js'
import { 查询部门列表 } from '@/api/applicationCard/index.js'
import { treeselect } from '@/api/system/dept'
// const deptOptions = ref(undefined)

const telVadiate = (rule, value, callback) => {
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if (reg.test(value)) {
        callback()
    } else {
        callback('请输入标准手机号')
    }
}
const idCardVadiate = (rule, value, callback) => {
    let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
    if (_IDRe18.test(value) || _IDre15.test(value)) {
        callback()
    } else {
        callback('请输入标准身份证号')
    }
}

let data = reactive({
    depNameList: [],
    tab: '未绑定',
    open: false,
    form: {},
    rules: {
        userName: [{ required: true, message: '使用人不能为空', trigger: 'blur' }],
        idCard: [
            { required: true, message: '身份证不能为空', trigger: 'blur' },
            { validator: idCardVadiate, trigger: 'blur' },
        ],
        tel: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
            { validator: telVadiate, trigger: 'blur' },
        ],
        deptId: [{ required: true, message: '所属部门不能为空', trigger: 'chanage' }],
        useItem: [{ required: true, message: '使用项目不能为空', trigger: 'blur' }],
    },
    title: null,
    total: 0,
    table_loading: false,
    tableList: [],
    tableList_bound: [],
    queryParams: {
        pageNum: 1,
        pageSize: 10,
    },
})
const { tableList_bound, tab, title, open, tableData, table_loading, total, queryParams, form, rules, tableList } =
    toRefs(data)
onMounted(() => {
    // getDepList()
    getList()
})
let props = defineProps(['tab'])
// watch(
//     () => props.tab,
//     (val) => {
//         data.tab = val
//         getList()
//     }
// )
/** 导出按钮操作 */
const handleExport = () => {
    proxy.download('/app/users/export', {}, `使用人信息.xlsx`)
}
// const getDepList = () => {
//     treeselect().then((response) => {
//         deptOptions.value = response.data
//     })
// }
// 添加
const handleAdd = () => {
    reset()
    data.title = '新增使用人'
    data.form = {}
    data.open = true
}
// 编辑
const handleUpdate = (val) => {
    data.title = '编辑使用人'
    data.open = true
    查询人员(val.id).then((res) => {
        if (res.code === 200) data.form = res.data
        data.form.deptId = data.form.deptName
    })
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
// 获取列表
const getList = async () => {
    let res = await 查询(data.queryParams)
    if (res.code === 200) {
        data.tableList = res.rows
        data.total = res.total

        data.total = res.total
    } else {
        data.tableList = []
        data.total = 0
    }
}
function reset() {
    proxy.resetForm('formRef')
}

// 提交
const submitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            let res
            if (data.title === '编辑使用人') {
                res = await 编辑(data.form)
            }
            if (data.title === '新增使用人') {
                res = await 新增(data.form)
            }
            if (res.code === 200) {
                getList()
                data.open = false
                proxy.$modal.msgSuccess('操作成功！')
            } else {
                proxy.$modal.msgWarning('操作失败，请联系管理员！')
            }
        }
    })
}
// 取消
const cancel = () => {
    data.form = {}
    data.open = false
}

//获取保管次数
function getbdsNumber(row) {
    const res = row.split(',')
    return res.length
}

// 查看
const handleCheck = (val) => {
    reset()
    查询人员(val.id).then((res) => {
        if (res.code === 200) data.form = res.data
        data.open = true
        data.title = '查看使用人'
    })
}
</script>

<style scoped lang="scss">
::v-deep .el-upload-dragger {
    width: 260px;
    height: 115px;
}
::v-deep .el-range-editor--medium.el-input__inner {
    width: 220px !important;
}
::v-deep .el-input span {
    margin-left: 20px;
}
::v-deep .elFormItem {
    /* height: 200px !important; */
    overflow-y: scroll;
}
</style>
