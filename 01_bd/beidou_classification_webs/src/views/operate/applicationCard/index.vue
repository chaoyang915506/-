<template>
    <div class="app-container app-box">
        <div v-if="!open">
            <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
                <el-form-item label="申请人">
                    <el-input clearable v-model="queryParams.userName" placeholder="请输入申请人"></el-input>
                </el-form-item>
                <el-form-item label="申请部门">
                    <el-input clearable v-model="queryParams.deptName" placeholder="请输入申请部门"></el-input>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker
                        v-model="timePicker"
                        type="datetimerange"
                        @change="getDate"
                        clearable
                        class="timeline_css"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 350px"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
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
                <el-table-column label="申请人" align="center" prop="userName" />
                <el-table-column label="申请部门" align="center" prop="deptName" />
                <el-table-column label="北斗卡类型" align="center" prop="applyCardVers" />
                <el-table-column label="申请数量" align="center" prop="applyNumber" />
                <el-table-column label="用途" align="center" prop="use" />
                <el-table-column label="申请时间" align="center" prop="createTime" />
                <el-table-column label="状态" align="center" prop="applyState">
                    <template #default="scope">
                        <dict-tag :options="apply_state" :value="scope.row.applyState" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button
                            size="mini"
                            type="text"
                            :disabled="scope.row.applyState === '0' ? false : true"
                            v-hasPermi="['operate:applicationCard:submit']"
                            @click="handleSubmit(scope.row)"
                            >提交</el-button
                        >
                        <el-button  :disabled="scope.row.applyState === '0' ? false : true" size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button  :disabled="scope.row.applyState === '0' ? false : true" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                             <el-button  :disabled="scope.row.applyState === '2' ? false : true" size="mini" type="text" @click="handleDelete(scope.row)">撤回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"
            />
        </div>
        <div v-else style="padding: 20px">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申请人" prop="userName">
                            <el-select
                                v-model="form.userId"
                                placeholder="请选择申请人"
                                clearable
                                style="width: 100%"
                                size="small"
                            >
                                <el-option
                                    v-for="item in userNameList"
                                    :key="item.userId"
                                    :label="item.userName"
                                    :value="item.userId"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="北斗卡类别" prop="useItem">
                            <el-input v-model="data.aform.北斗卡类别" placeholder="请输入北斗卡类别" />
                        </el-form-item>

                        <el-form-item label="用途" prop="use">
                            <el-input v-model="form.use" placeholder="请输入用途" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请单位" prop="deptName">
                            <tree-select
                                v-model:value="form.deptId"
                                :options="deptOptions"
                                placeholder="请选择申请单位"
                                :objMap="{ value: 'id', label: 'label', children: 'children' }"
                                clearable
                            />
                        </el-form-item>
                        <el-form-item label="申请数量" prop="applyNumber">
                            <el-input v-model="form.applyNumber" placeholder="请输入申请数量" />
                        </el-form-item>
                        <el-form-item label="附件" prop="fileList" ref="fileRef">
                            <el-upload
                                class="upload-demo"
                                :on-change="handleChange"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                :auto-upload="false"
                                action=""
                            >
                                <el-button type="primary">上传</el-button>
                                <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon> -->
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="相关终端" prop="" ref="">
                    <el-button type="primary" icon="Plus" @click="addRelHandle()">新增终端</el-button>
                    <el-table :data="terminalList">
                        <el-table-column type="index" label="序号" width="55" align="center" />
                        <el-table-column label="设备序列号" align="center" prop="facilitySerial" />
                        <el-table-column label="入网序列号" align="center" prop="netInSerial" />
                      <el-table-column label="终端类型" align="center" prop="terminalType">
                        <template #default="scope">
                            <dict-tag :options="terminal_type" :value="scope.row.terminaltype" />
                        </template>
                    </el-table-column>
                        <el-table-column label="关联载体名称" align="center" prop="carriername" />
                        <el-table-column label="载体类型" align="center" prop="carriertype">
                            <template #default="scope">
                                <dict-tag :options="carrier_type" :value="scope.row.carriertype" />
                            </template>
                        </el-table-column>
                        <el-table-column label="使用人" align="center" prop="username" />

                        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                            <template #default="scope">
                                <el-button icon="Delete" size="mini" type="text" @click="handleRelDelete(scope.row)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <el-button @click="cancel()" style="float:right">取 消</el-button>
            <el-button type="primary" @click="submitForm()" style="float:right;margin-right:4px">确 定</el-button>
        </div>
        <!-- 添加或者修改 -->
        <el-dialog title="选择终端" v-model="relOpen" width="80%" append-to-body @close="relcancel()">
            <el-card class="box-card">
                <!-- relSelectTable -->
                <!-- terminal_type -->
                <el-input
                    style="width: 30%; margin-right: 4px"
                    clearable
                    v-model="relqueryParams.facilitySerial"
                    placeholder="请输入设备序列号"
                ></el-input>
                <!-- <el-input clearable v-model="relqueryParams.terminalType" placeholder="请选择类型"></el-input> -->
                <el-select
                    style="width: 30%; margin: 0 4px 4px 0"
                    v-model="relqueryParams.terminalType"
                    placeholder="请选择类型"
                    clearable
                >
                    <el-option
                        v-for="item in terminal_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-button icon="Search" type="primary" class="btn_submit" @click="getTerminalList">查询</el-button>
                <el-table :data="relSelectTableList" @selection-change="handleSelectionChange" ref="multipleTable">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="设备序列号" align="center" prop="facilityserial" />
                    <el-table-column label="入网序列号" align="center" prop="netInSerial" />
                    <el-table-column label="终端类型" align="center" prop="terminalType">
                        <template #default="scope">
                            <dict-tag :options="terminal_type" :value="scope.row.terminaltype" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <!-- relResultTable -->
                <el-table :data="relResultTableList">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="设备序列号" align="center" prop="facilityserial" />
                    <el-table-column label="入网序列号" align="center" prop="netInSerial" />
                    <el-table-column label="终端类型" align="center" prop="terminalType">
                        <template #default="scope">
                            <dict-tag :options="terminal_type" :value="scope.row.terminaltype" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button icon="Delete" size="mini" type="text" @click="handlerelResultDelete(scope.row)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="relsubmitForm()">确 定</el-button>
                    <el-button @click="relcancel()">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
const { proxy } = getCurrentInstance()

import {
    查询人员列表,
    查询部门列表,
    添加,
    提交,
    删除,
    通用上传,
    查询,
    编辑,
    根据id查询列表,
    查询终端集合,
} from '@/api/applicationCard/index.js'
import { listUser } from '@/api/system/user.js'
import { treeselect } from '@/api/system/dept'
const { approval_status, apply_state, terminal_type ,carrier_type} = proxy.useDict('approval_status', 'apply_state', 'terminal_type','carrier_type')
const deptOptions = ref(undefined)
let data = reactive({
    terminalList:[],//相关终端列表
    relqueryParams: {},
    relOpen: false,
    relSelectTableList: [], //选择终端类别
    relResultTableList: [], //已选择终端
    depclearValue: false,
    fileList: [],
    userNameList: [],
    depNameList: [],
    open: false,
    form: {},
    aform: {},
    rules: {
        userId: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
        deptId: [{ required: true, message: '申请部门不能为空', trigger: 'blur' }],
        applyNumber: [{ required: true, message: '申请数量不能为空', trigger: 'blur' }],
        use: [{ required: true, message: '用途不能为空', trigger: 'blur' }],
        // useItem: [{ required: true, message: '所用项目不能为空', trigger: 'blur' }],
        fileList: [
            // { required: true, validator: validateAttach, trigger: "change" },
        ],
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
const {
    terminalList,
    fileList,
    title,
    open,
    tableData,
    table_loading,
    total,
    queryParams,
    timePicker,
    form,
    rules,
    tableList,
    userNameList,
    depNameList,
    relOpen,
    relSelectTableList,
    relResultTableList,
    relqueryParams,
} = toRefs(data)
onMounted(() => {
    getList()
    getUserDepList()
    getTerminalList()
})
const relsubmitForm = () => {
    // relResultTableList
    data.relOpen = false
    data.open = true
     data.terminalList =  data.relResultTableList
}
const relcancel = () => {
    // data.relResultTableList = []
    data.relOpen = false
    data.open = true
    data.relqueryParams = {}
}
const getTerminalList = () => {
    查询终端集合(data.relqueryParams).then((res) => {
        if (res.code === 200) {
            data.relSelectTableList = res.rows
        }
    })
}
function validateAttach(rule, value, callback) {
    if (data.fileList.length == 0) {
        callback(new Error('请选择文件'))
    } else {
        callback()
    }
}
// 成功
const handleChange = (file, fileList) => {
    data.fileList = [fileList[fileList.length - 1]]
    proxy.$refs['fileRef'].clearValidate()
}
// 删除文件
const handleRemove = (file, fileList) => {
    data.fileList = fileList
}
const getUserDepList = () => {
    listUser().then((res) => {
        if (res.code === 200) data.userNameList = res.rows
    })
    treeselect().then((response) => {
        deptOptions.value = response.data
    })
}
function formatter(row, column, columnIndex) {
    let result = biz_source.value.find((item) => item.value == columnIndex)
    if (result) {
        return result.label
    } else {
        return ''
    }
}
// 表格勾选
const handleSelectionChange = (val) => {
    // 取消左侧表格勾选
    data.relResultTableList = val
}
// 选择终端列表删除
const handlerelResultDelete = (val) => {
    let result = []
    data.relResultTableList.map((item, index) => {
        if (val.id !== item.id) {
            result.push(item)
        } else {
            proxy.$refs.multipleTable.toggleRowSelection(data.relResultTableList[index])
        }
    })
    data.relResultTableList = result
}
// 添加
const handleAdd = () => {
    data.title = '申请北斗卡'
    data.open = true
}
// 编辑
const handleUpdate = async (val) => {
    let res = await 根据id查询列表(val.id)
    if (res.code === 200) data.form = res.data
    data.title = '编辑北斗卡'
    data.open = true
    data.fileList = [{ name: data.form.fileName }]
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
// 相关终端列表删除
const handleRelDelete = (val) => {
   data.terminalList =  data.terminalList.filter((item, index) => {return val.id !== item.id})
   handlerelResultDelete(val)
}
// 新增相关终端
const addRelHandle = () => {
    data.relOpen = true
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
const submitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            let fileData
            if (data.fileList.length) {
                let formData = new FormData()
                formData.append('file', data.fileList[0].raw)
                fileData = await 通用上传(formData)
                if (fileData.code === 200) {
                    data.form.file = fileData.fileName
                    proxy.$modal.msgSuccess('附件上传成功')
                } else {
                    proxy.$modal.msgWarning('附件上传失败')
                }
            }
            if (data.title === '编辑北斗卡') {
                if (data.fileList[0].raw) {
                    data.form.fileName = data.fileList[0].name
                }
                let ret = 编辑(data.form)
                if (ret.code === 200) proxy.$modal.msgSuccess('编辑成功')
                proxy.$modal.msgSuccess('编辑成功')
            } else {
                data.form.fileName = data.fileList[0].name
                data.form.terminalList = data.terminalList.map((item)=>{return item.id})
                console.log(data.form.terminalList ,'data.form.terminalList ')
                let ret = 添加(data.form)
                if (ret.code === 200) proxy.$modal.msgSuccess('新增成功')
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
    data.fileList = []
    data.relResultTableList = []
    proxy.$refs.multipleTable.clearSelection();
    data.terminalList = []
    data.form.deptId = null
}
// 获取时间
const getDate = (val) => {
    if (val) {
        data.queryParams.startTime = val[0]
        data.queryParams.endTime = val[1]
    } else {
        data.queryParams.startTime = ''
        data.queryParams.endTime = ''
    }
}
// 单条提交
const handleSubmit = (val) => {
    proxy.$modal.confirm('是否确认提交选中的数据项？').then(async function () {
        let res = await 提交({ id: val.id, applyNumber: val.applyNumber })
        if (res.code === 200) {
            proxy.$modal.msgSuccess('提交成功')
        } else {
            proxy.$modal.msgSuccess('提交失败')
        }
        getList()
    })
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
.box-card {
    width: 49%;
    height: 100%;
    display: inline-block;
}
.box-card:last-child {
    float: right;
}
</style>
