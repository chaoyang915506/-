<template>
    <div class="app-container app-box">
        <div class="header_picture">
            <div class="cy_title">载体统计</div>
            <div class="cy_content">
                <div class="box_color">
                    <div class="box_title">载体总数</div>
                    <div class="box_num">998998</div>
                </div>
                <div class="box_color">
                    <div class="box_title">船舶总数</div>
                    <div class="box_num">998998</div>
                </div>
                <div class="box_color">
                    <div class="box_title">航标总数</div>
                    <div class="box_num">998998</div>
                </div>
                <div class="box_color">
                    <div class="box_title">船舶在线数量</div>
                    <div class="box_num">998998</div>
                </div>
                <div class="box_color">
                    <div class="box_title">航标在线数量</div>
                    <div class="box_num">998998</div>
                </div>
            </div>
        </div>
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="88px" @submit.prevent>
            <el-form-item label="载体名称">
                <el-input
                    v-model="queryParams.carrierName"
                    @keyup.enter="getList"
                    placeholder="请输入载体名称"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="载体类型">
                <el-select v-model="queryParams.carrierType" placeholder="请输入载体类型" clearable size="small">
                    <el-option v-for="item in carrier_type" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="载体负责人">
                <el-input
                    v-model="queryParams.carrierPrincipal"
                    @keyup.enter="getList"
                    placeholder="请输入载体负责人"
                    clearable
                ></el-input>
            </el-form-item>

            <el-form-item label="绑定终端号">
                <el-input
                    v-model="queryParams.terminalCardNum"
                    @keyup.enter="getList"
                    placeholder="请输入绑定终端号"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="绑定卡号">
                <el-input
                    placeholder="请输入绑定北斗卡号"
                    @keyup.enter="getList"
                    v-model="queryParams.bdsNumber"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="所属单位">
                <el-input
                    v-model="queryParams.sdepartName"
                    @keyup.enter="getList"
                    placeholder="请输入所属单位"
                    clearable
                ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button icon="Search" type="primary" class="btn_submit" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" class="common_style" icon="Plus" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="已绑定" name="first">
                <el-table v-loading="table_loading" :data="tableList">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="载体名称" align="center" prop="carrierName" />
                    <el-table-column label="所属单位" align="center" prop="sdepartName" />
                    <el-table-column label="载体类型" align="center" prop="carrierType">
                        <template #default="scope">
                            <dict-tag :options="carrier_type" :value="scope.row.carrierType" />
                        </template>
                    </el-table-column>

                    <el-table-column label="载体编号" align="center" prop="snmbiNo" />
                    <el-table-column label="涉及经纬度" width="200" align="center" prop="snmbiJwd" />
                    <el-table-column label="绑定终端号" align="center" prop="terminalCardNum">
                        <template #default="{ row }">
                            <el-popover placement="bottom" :width="400" trigger="click">
                                <template #reference>
                                    <el-button type="text">{{ row.terminalListResult?.length || '0' }}</el-button>
                                </template>
                                <el-table :data="row.terminalListResult || []">
                                    <el-table-column type="index" label="序号" align="center" />
                                    <el-table-column label="设备序列号" prop="facilitySerial" align="center" />
                                    <el-table-column label="入网序列号" prop="netInSerial" align="center" />
                                    <el-table-column label="终端类型" prop="netInSerial" align="center">
                                        <template #default="scope">
                                            {{ selectDictLabel(terminal_type, scope.row.terminalType) }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="绑定北斗卡号" width="100" align="center" prop="bdsCards">
                        <template #default="{ row }">
                            <el-popover placement="bottom" :width="400" trigger="click">
                                <template #reference>
                                    <el-button type="text">{{ row.bdsCards?.length||'0' }}</el-button>
                                </template>
                                <el-table :data="row.bdsCards||[]">
                                    <el-table-column type="index" label="序号" align="center" />
                                    <el-table-column label="北斗卡号" prop="bdsNumber" align="center" />
                                    <el-table-column label="北斗卡类型" prop="netInSerial" align="center">
                                        <template #default="scope">
                                            {{ scope.row.bdsVersion || '无' }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="负责人" align="center" prop="carrierPrincipal" />
                    <el-table-column label="电话" align="center" prop="tel" />
                    <el-table-column label="租用/协管" align="center" prop="rent" />
                    <el-table-column label="公用/代管" align="center" prop="">无</el-table-column>
                    <el-table-column label="地址" align="center" prop="address" />
                    <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button size="mini" type="text" @click="handleBinding(scope.row)">绑定终端</el-button>

                            <el-button size="mini" type="text" @click="handleSubmit(scope.row)">注销</el-button>
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table></el-tab-pane
            >
            <el-tab-pane label="未绑定" name="second">
                <el-table v-loading="table_loading" :data="tableList">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="载体名称" align="center" prop="carrierName" />
                    <el-table-column label="所属单位" align="center" prop="sdepartName" />
                    <el-table-column label="载体类型" align="center" prop="carrierType">
                        <template #default="scope">
                            <dict-tag :options="carrier_type" :value="scope.row.carrierType" />
                        </template>
                    </el-table-column>

                    <el-table-column label="载体编号" align="center" prop="snmbiNo" />
                    <el-table-column label="涉及经纬度" width="200" align="center" prop="snmbiJwd" />
                    <el-table-column label="绑定终端号" align="center" prop="snmbiJwd">
                        <template #default="{ row }">
                            <el-popover placement="bottom" :width="400" trigger="click">
                                <template #reference>
                                    <el-button type="text">{{ row.terminalListResult?.length || '0' }}</el-button>
                                </template>
                                <el-table :data="row.terminalListResult || []">
                                    <el-table-column type="index" label="序号" align="center" />
                                    <el-table-column label="设备序列号" prop="facilitySerial" align="center" />
                                    <el-table-column label="入网序列号" prop="netInSerial" align="center" />
                                    <el-table-column label="终端类型" prop="netInSerial" align="center">
                                        <template #default="scope">
                                            {{ selectDictLabel(terminal_type, scope.row.terminalType) }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="绑定北斗卡号" width="100" align="center" prop="bdsCards">
                        <template #default="{ row }">
                            <el-popover placement="bottom" :width="400" trigger="click">
                                <template #reference>
                                    <el-button type="text">{{ row.bdsCards?.length || '0' }}</el-button>
                                </template>
                                <el-table :data="row.bdsCards || []">
                                    <el-table-column type="index" label="序号" align="center" />
                                    <el-table-column label="北斗卡号" prop="bdsNumber" align="center" />
                                    <el-table-column label="北斗卡类型" prop="netInSerial" align="center">
                                        <template #default="scope">
                                            {{ scope.row.bdsVersion || '无' }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="负责人" align="center" prop="carrierPrincipal" />
                    <el-table-column label="电话" align="center" prop="tel" />
                    <el-table-column label="租用/协管" align="center" prop="rent" />
                    <el-table-column label="公用/代管" align="center" prop="">无</el-table-column>
                    <el-table-column label="地址" align="center" prop="address" />
                    <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button size="mini" type="text" @click="handleBinding(scope.row)">绑定终端</el-button>

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
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
        <!-- 添加或者修改 -->
        <ModalDia ref="modalRef" :dataFrom="data.form" @goNotBound="goNotBound" @getList="getList" />
        <!-- 绑定终端 -->
        <WriteDia :writeId="writeId" ref="writeRef" @goHome="getList" />
        <BindingDia
            ref="bindingRef"
            @openTerminal="openTerminal"
            :terminalType="terminal_type"
            @getList="getList"
            :dataFrom="data.form"
            :stringFrom="stringFrom"
        />
        <SelectTerminalDia ref="terminalRef" @transferData="transferData" />
    </div>
</template>

<script setup>
import ModalDia from './components/modalDia.vue'
import WriteDia from './components/writeDia.vue'
const { proxy } = getCurrentInstance()
import { 列表, 删除, 解绑, 查询解绑列表 } from '@/api/carrier/index.js'
import { 查询 } from '@/api/terminalManage/index.js'
import BindingDia from './components/bindingDia.vue'
import SelectTerminalDia from './components/selectTerminalDia.vue'
const { carrier_type, is_binding, terminal_type } = proxy.useDict('carrier_type', 'is_binding', 'terminal_type')
let activeName = ref('first')
let data = reactive({
    form: {},
    total: 0,
    table_loadinxg: false,
    tableList: [],
    tableData: [],
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        isBinding: 1, //绑定
    },
})
const { tableData, table_loading, total, queryParams, form, tableList } = toRefs(data)

const stringFrom = ref({})
//绑定数据传递
function transferData(res) {
    // console.log(data, '接收')
    stringFrom.value = {
        ...res,
    }
}

function goNotBound() {
    queryParams.value.isBinding = 0
    getList()
}
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
// 获取列表
const getList = async () => {
    let res = await 列表(queryParams.value)
    if (res.code === 200) {
        data.tableList = res.rows
        data.total = res.total
    } else {
        data.tableList = []
        data.total = 0
    }
}
// tab页切换
const handleClick = (e) => {
    if (e.props.label == '未绑定') {
        queryParams.value.isBinding = 0
    } else {
        queryParams.value.isBinding = 1
    }
    getList()
}
// 取消
const cancel = () => {
    data.form = {}
    data.open = false
}

const writeId = ref('')
// 注销
const handleSubmit = (val) => {
    writeId.value = val.id
    proxy.$refs['writeRef'].show()
}
// 绑定终端
const handleBinding = (val) => {
    // stringFrom.value = {
    //     id: val.id,
    //     terminalListResult: val.terminalListResult || [],
    // }
    data.form = val
    console.log(stringFrom.value, 'stringFrom')
    proxy.$refs['bindingRef'].show()
}

onMounted(() => {
    getList()
})

//打开选择终端
function openTerminal() {
    proxy.$refs['terminalRef'].show()
}
</script>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
    width: 260px;
    height: 115px;
}
:deep(.el-range-editor--medium.el-input__inner) {
    width: 220px !important;
}
.header_picture {
    height: 120px;
    width: 100%;
    margin-bottom: 10px;
    .cy_title {
        font-weight: 700;
        font-size: 15px;
        color: black;
        height: 20px;
    }
    .cy_content {
        display: flex;
        height: calc(100% - 20px);
        width: 70%;
        padding: 5px;
        .box_color {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            height: 100%;
            margin-right: 25px;
            border-radius: 4px;
            width: calc((100% / 5) - 25px);
            background-image: linear-gradient(to bottom, #ffe7e7, #db3737);
            .box_title {
                font-size: 16px;
                font-family: '微软雅黑 Bold', '微软雅黑', sans-serif;
                font-weight: 700;
                font-style: normal;
                color: rgba(51, 51, 51, 0.8);
            }
            .box_num {
                font-family: '微软雅黑', sans-serif;
                font-weight: 400;
                font-style: normal;
                font-size: 25px;
                color: rgba(0, 0, 0, 0.996078431372549);
            }
        }
        .box_color:nth-child(4) {
            background-image: linear-gradient(to bottom, #bed7fe, #4f93ed);
        }
        .box_color:nth-child(5) {
            margin-right: 25px;
            background-image: linear-gradient(to bottom, #bed7fe, #4f93ed);
        }
    }
}
</style>
