<template>
    <div class="app-container app-box">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="100px">
            <el-form-item label="审批流名称">
                <el-input v-model="queryParams.flowName" placeholder="请输入审批流名称" clearable @clear="getList"></el-input>
            </el-form-item>
                       <el-form-item label="适用单位">
                <el-input v-model="data.formm.a" placeholder="请输入适用单位" clearable @clear="getList"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" type="primary" class="btn_submit" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style" icon="Plus" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="table_loading" :data="tableList" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="审批流名称" align="center" prop="flowName" />
            <el-table-column label="适用单位" align="center" prop="" />
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button :disabled="scope.row.注销 ? true : false" size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button :disabled="scope.row.注销 ? true : false" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        <!-- 添加或者修改 -->
        <el-dialog :title="title" v-model="open" width="40%" append-to-body @close="cancel()">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="审批名称" prop="flowName">
                    <el-input v-model="form.flowName" placeholder="请输入审批名称" />
                </el-form-item>
                <el-form-item label="适用单位" prop="flowName">
                    <el-input v-model="data.formm.a" placeholder="请输入适用单位" />
                </el-form-item>
                <el-form-item label="审批节点" prop="flowNode">
                    <el-input v-model="form.flowNode" placeholder="请输入审批节点" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <!-- <el-button @click="cancel">取 消</el-button> -->
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { uuid } from '@/utils/uuid.js'
import { getTimeStr } from '@/utils/time.js'
const { proxy } = getCurrentInstance()
import { 查询, 新增 } from '@/api/approvalProcess/index.js'
let data = reactive({
    open: false,
    form: {},
    formm:{},
    rules: {
        flowName: [{ required: true, message: '审批流名称不能为空', trigger: 'blur' }],
        flowNode: [{ required: true, message: '审批节点不能为空', trigger: 'blur' }],
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
    },
})
const { title, open, tableData, table_loading, total, queryParams, timePicker, form, rules, tableList } = toRefs(data)
onMounted(() => {
    getList()
})
// 表格勾选
const handleSelectionChange = () => {}
// 添加
const handleAdd = () => {
    data.title = '新增审批流'
    data.open = true
}
// 编辑
const handleUpdate = val => {
    data.title = '编辑审批流'
    data.open = true
    data.form = val
}
// 删除
const handleDelete = val => {
    proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
        data.tableData.map((item, index) => {
            if (val.id === item.id) data.tableData.splice(index, 1)
        })
        getList()
        proxy.$modal.msgSuccess('删除成功')
    })
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
// 提交
const submitForm = () => {
    proxy.$refs['formRef'].validate(valid => {
        if (valid) {
            if (data.title === '编辑审批流') {
                proxy.$modal.msgSuccess('编辑成功')
            } else {
                新增()
                proxy.$modal.msgSuccess('新增成功')
            }
            getList()
            cancel()
        }
    })
}
// 取消
const cancel = () => {
    data.form = {}
    data.open = false
}
// 获取时间
const getDate = () => {}
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
