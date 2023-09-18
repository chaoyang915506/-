<template>
    <el-dialog title="绑定终端" v-model="bindingOpen" width="40%" append-to-body>
        <el-form ref="formRef" :model="form" :rules="data.rules" label-width="160px">
            <el-form-item label="已绑定终端序列号">
                <!-- <el-input v-model="form.terminalCardNum" placeholder="请输入已绑定终端序列号" /> -->
                <el-table :data="tableList" border stripe @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号"> </el-table-column>
                    <el-table-column label="设备序列号" prop="facilitySerial" align="center"> </el-table-column>
                    <el-table-column label="入网序列号" prop="netInSerial" align="center"> </el-table-column>
                    <el-table-column label="终端类型" prop="terminalType" align="center"
                        ><template #default="{ row }"> {{ selectDictLabel(terminal_type, row.terminalType) }}</template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="绑定终端序列号" prop="terminalId">
                <el-input
                    v-model="form.terminalId"
                    @focus="inputBlur"
                    ref="inputRef"
                    placeholder=""
                    clearable
                    size="normal"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="bindingSubmitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { 查询 } from '@/api/terminalManage/index.js'
import { 绑定终端 } from '@/api/carrier/index.js'

const { proxy } = getCurrentInstance()
const { terminal_type } = proxy.useDict('terminal_type')
const tableList = ref([])
const bindingOpen = ref(false)
const emit = defineEmits(['openTerminal', 'getList'])
const props = defineProps({
    dataFrom: {
        type: Object,
        default: {},
    },
    stringFrom: {
        type: Object,
        default: {},
    },
})
const terminalType = ref([])
const data = reactive({
    rules: {
        terminalId: [{ required: true, message: '绑定终端序列号不能为空', trigger: 'change' }],
    },
    form: {},
    terminalList: [],
})
const { form } = toRefs(data)
watch(
    () => props.dataFrom,
    (val) => {
        if (val) {
            tableList.value = val.terminalListResult
            form.value = { id: val.id }
        }
    },
    {
        immdiate: true,
        deep: true,
    }
)
watch(
    () => props.stringFrom,
    (val) => {
        if (val) {
            form.value.terminalId = val.terminalId
        }
    },
    {
        deep: true,
        immdiate: true,
    }
)

const bindingSubmitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            绑定终端(form.value).then((res) => {
                if (res.code === 200) {
                    proxy.$modal.msgSuccess('绑定终端成功')
                    bindingOpen.value = false
                    emit('getList')
                }
                if (res.code !== 200) proxy.$modal.msgWarning('绑定终端失败')
            })
        }
    })
}

// 取消
const cancel = () => {
    bindingOpen.value = false
}
function show() {
    bindingOpen.value = true
    proxy.resetForm('formRef')
}
function handleSelectionChange(e) {}

function inputBlur() {
    emit('openTerminal')
    proxy.$refs['inputRef'].blur()
}

defineExpose({
    show,
})
</script>

<style lang="scss" scoped></style>
