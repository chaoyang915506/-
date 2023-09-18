<template>
    <div class="content app-box">
        <div class="tree-department">
            <div class="search">
                <el-input clearable v-model="tree_searchName" style="width: 60%"></el-input>
                <el-button icon="Search" type="primary" class="btn_submit" size="mini" @click="getTreeList">查询</el-button>
            </div>
            <el-tree :data="treeList" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick" />
        </div>
        <div class="table-department">
            <div class="table-header">
                <span style="display: block; font-size: 30px; margin-bottom: 10px">{{ treeClickNode.label }}</span>
                <span>负责人：</span>
                <el-button size="mini" type="primary" style="display: block; float: right" @click="handleAdd">新增</el-button>
                <el-button size="mini" v-if="level !== 1" type="primary" style="display: block; float: right; margin-right: 10px" @click="handleImport">导入</el-button>
            </div>
            <el-tabs v-show="level === 2" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="申请人" name="申请人"></el-tab-pane>
                <el-tab-pane label="分支机构" name="分支机构"></el-tab-pane>
            </el-tabs>
            <el-table v-loading="table_loading" :data="tableList">
                <el-table-column type="index" label="序号" width="55" align="center" />
                <el-table-column v-if="level === 1" label="部门名称" align="center" prop="deptName" />
                <el-table-column v-if="level === 1" label="部门负责人" align="center" prop="deptPrincipal" />
                <el-table-column v-if="level === 3 || (level === 2 && activeName === '申请人')" label="申请人姓名" align="center" prop="username" />
                <el-table-column v-if="level === 3 || (level === 2 && activeName === '分支机构')" label="分支机构" align="center" prop="deptName" />
                <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getDepList"
      /> -->
        </div>
        <!-- 添加或者修改 -->
        <el-dialog :title="title" v-model="open" width="35%" append-to-body @close="cancel()">
            <!-- 新增部门 -->
            <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-if="(level === 2 && activeName !== '申请人') || level === 1">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请输入部门名称" />
                </el-form-item>
                <el-form-item label="上级部门" prop="parentId">
                    <el-select v-model="form.parentId" clearable placeholder="请选择上级部门">
                        <el-option v-for="item in tableSelectList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门负责人" prop="deptPrincipal">
                    <el-input v-model="form.deptPrincipal" placeholder="请输入部门负责人" />
                </el-form-item>
                <el-form-item label="部门简介">
                    <el-input v-model="form.about" placeholder="请输入部门简介" />
                </el-form-item>
                <el-form-item label="关联审批" prop="flowName">
                    <el-select v-model="form.flowName" clearable placeholder="请选择关联审批">
                        <el-option v-for="item in flowSelectList" :key="item.flowName" :label="item.flowName" :value="item.flowName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 新增人员 -->
            <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-if="(level === 2 && activeName === '申请人') || level === 3">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="form.tel" placeholder="请输入联系方式" />
                </el-form-item>
                <el-form-item label="身份证号" prop="idCard">
                    <el-input v-model="form.idCard" placeholder="请输入身份证号" />
                </el-form-item>
                <el-form-item label="岗位名称">
                    <el-input v-model="form.jobName" placeholder="请输入岗位名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer" v-show="title !== '解绑'">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="导入" v-model="upload.open" width="400px" append-to-body>
            <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip text-center">
                        <span>仅允许导入xls、xlsx格式文件。</span>
                        <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
                    </div>
                </template>
            </el-upload>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm">确 定</el-button>
                    <el-button @click="upload.open = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted, watch } from '@vue/runtime-core'
import { getToken } from '@/utils/auth'
import {
    listTree,
    listDepById,
    listDep,
    applicantList,
    flowList,
    addDept,
    editDept,
    deleteDept,
    addUsers,
    editUsers,
    deleteUsers,
    // exportUsers,
    // exportDept
} from '@/api/userDepartment/index.js'
const { proxy } = getCurrentInstance()
const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: '',
    // 是否禁用上传
    isUploading: false,
    // 设置上传的请求头部
    headers: { Authorization: 'Bearer ' + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + '/app/dept/importData',
})
let data = reactive({
    flowSelectList: [],
    tableSelectList: [],
    title: null,
    open: false,
    form: {},
    activeName: '申请人',
    queryParams: {
        pageNum: 1,
        pageSize: 10,
    },
    total: 0,
    table_loading: false,
    tableList: [],
    level: 1,
    treeClickNode: { label: '国家海事局', id: null },
    tree_searchName: null,
    treeList: [],
    defaultProps: {
        children: 'children',
        label: 'label',
    },
    rules: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        parentId: [{ required: true, message: '上级部门不能为空', trigger: 'chanage' }],
        deptPrincipal: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        flowName: [{ required: true, message: '关联审批不能为空', trigger: 'chanage' }],
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        idCard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
    },
})
const { flowSelectList, tableSelectList, title, open, form, activeName, queryParams, treeList, defaultProps, tree_searchName, treeClickNode, tableList, table_loading, total, level, rules } = toRefs(data)
watch(
    () => data.activeName,
    val => {
        if (val === '申请人') {
            geApplicantList()
        }
        if (val === '分支机构') {
            getDepList()
        }
    }
)
onMounted(() => {
    getTreeList()
    getDepListSelect()
    geFlowList()
})
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true
}
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    upload.open = false
    upload.isUploading = false
    proxy.$refs['uploadRef'].clearFiles()
    proxy.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
    getDepList()
}
/** 下载模板操作 */
function importTemplate() {
    proxy.download('/app/dept/importTemplate', {}, `使用部门信息.xlsx`)
}
/** 提交上传文件 */
function submitFileForm() {
    proxy.$refs['uploadRef'].submit()
}
const getTreeList = () => {
    listTree({ deptName: data.tree_searchName }).then(res => {
        if (res.code === 200) data.treeList = res.rows
        if (res.code !== 200) proxy.$modal.msgWarning('查询失败 请联系管理员！')
        data.treeClickNode.label = res.rows[0].label
        data.treeClickNode.id = res.rows[0].id
        getDepList()
    })
}
// 查询总部门
const getDepList = () => {
    listDepById(data.treeClickNode.id).then(res => {
        data.tableList = res.data
    })
}
// 获取新增部门列表
const getDepListSelect = () => {
    listDep().then(res => {
        data.tableSelectList = res.rows
    })
}
//获取审批流
const geFlowList = () => {
    flowList().then(res => {
        data.flowSelectList = res.rows
    })
}
// 查询申请人
const geApplicantList = () => {
    applicantList({ deptId: data.treeClickNode.id }).then(res => {
        data.tableList = res.rows
    })
}
// 树节点点击
const handleNodeClick = (val, node) => {
    data.treeClickNode.label = val.label
    data.treeClickNode.id = val.id
    data.level = node.level
    getTableList()
}

// 确定
const submitForm = () => {
    proxy.$refs['formRef'].validate(async valid => {
        if (valid) {
            let res
            if (level === 1 || (data.level === 2 && data.activeName !== '申请人')) {
                if (data.title === '新增部门') {
                    res = await addDept(data.form)
                    if (res.code === 200) proxy.$modal.msgSuccess('新增部门成功！')
                } else if (data.title === '编辑部门') {
                    res = await editDept(data.form)
                    if (res.code === 200) proxy.$modal.msgSuccess('编辑部门成功！')
                }
            } else {
                if (data.title === '新增部门') {
                    res = await addDept(data.form)
                    if (res.code === 200) proxy.$modal.msgSuccess('新增部门成功！')
                }
                if (data.title === '编辑部门') {
                    res = await editDept(data.form)
                    if (res.code === 200) proxy.$modal.msgSuccess('编辑部门成功！')
                }
            }
            // 人员
            if (data.title === '新增申请人') {
                data.form.deptId = data.treeClickNode.id
                res = await addUsers(data.form)
                if (res.code === 200) proxy.$modal.msgSuccess('新增申请人成功！')
            }
            if (data.title === '编辑申请人') {
                res = await editUsers(data.form)
                if (res.code === 200) proxy.$modal.msgSuccess('编辑申请人成功！')
            }
            cancel()
            getTableList()
            // getTreeList();
        }
    })
}
const handleSearch = data => {}
const handleAdd = () => {
    if (data.level === 1) data.title = '新增部门'
    if (data.level === 2 && data.activeName === '申请人') data.title = '新增申请人'
    if (data.level === 2 && data.activeName === '分支机构') data.title = '新增部门'
    if (data.level === 3) data.title = '新增申请人'
    data.open = true
}
//   const submitFormExport = async () => {
//   state.loadingBtn = true
//   let res = await importCheckShape({
//     importSign: state.importSign
//   })
//   if (res.code == 200) {
//     proxy.$modal.msgSuccess(res.msg)
//     state.isCheckData = true
//     state.loadingBtn = false
//   }
// }

// 编辑
const handleEdit = row => {
    if (data.level === 1) data.title = '编辑部门'
    if (data.level === 2 && data.activeName === '申请人') data.title = '编辑申请人'
    if (data.level === 2 && data.activeName === '分支机构') data.title = '编辑部门'
    if (data.level === 3) data.title = '编辑申请人'
    data.open = true
    data.form = row
}
const handleDelete = row => {
    let res
    if ((data.level === 2 && data.activeName === '申请人') || data.level === 3) {
        res = deleteUsers(row.id)
    } else {
        res = deleteDept(row.id)
    }
    if (res.code === 200) proxy.$modal.msgSuccess('删除成功！')
    getTableList()
}
const handleClick = () => {}
// 取消
const cancel = () => {
    data.form = {}
    data.open = false
}
const getTableList = () => {
    if (data.level === 1) getDepList()
    if (data.level === 2 && data.activeName === '申请人') geApplicantList()
    if (data.level === 2 && data.activeName !== '申请人') getDepList()
    if (data.level === 3) geApplicantList()
}
const handleImport = () => {
    upload.open = true
}
</script>

<style scoped lang="scss">
.content {
    width: 100%;
    height: calc(100vh - 130px);
    display: flex;
    .tree-department {
        padding: 20px;
        width: 30%;
        height: calc(100vh - 126px);
        border-right: 20px solid rgb(244, 247, 252);
    }
    .btn_submit {
        margin-left: 10px;
    }
    .search {
        margin-bottom: 10px;
    }
}
.table-department {
    padding: 10px;
    width: 100%;
    .table-header {
        color: #343434;
        margin-bottom: 10px;
    }
}
::v-deep .el-select {
    width: 100%;
}
</style>
