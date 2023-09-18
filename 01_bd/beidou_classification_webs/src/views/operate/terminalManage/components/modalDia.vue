<template>
    <el-dialog :title="form.id ? '编辑终端信息' : '新增终端信息'" v-model="open" width="60%" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rulesFrom" label-width="160px">
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <el-form-item label="终端类型" prop="terminalType">
                        <el-select
                            v-model="form.terminalType"
                            placeholder="请输入终端类型"
                            clearable
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in terminal_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入网序列号" prop="netInSerial">
                        <el-input v-model="form.netInSerial" placeholder="入网序列号" />
                    </el-form-item>
                    <el-form-item label="报警功能" prop="warning">
                        <el-select v-model="form.warning" placeholder="请选择报警功能" clearable filterable>
                            <el-option
                                v-for="item in function_status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备序列号" prop="facilitySerial">
                        <el-input v-model="form.facilitySerial" placeholder="请输入设备序列号" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :offset="0">
                    <el-form-item label="终端号" prop="terminalCardNum">
                        <el-input v-model="form.terminalCardNum" placeholder="请输入终端卡号" />
                    </el-form-item>
                    <el-form-item label="通信功能" prop="communication">
                        <el-select v-model="form.communication" placeholder="请选择通信功能" clearable filterable>
                            <el-option
                                v-for="item in function_status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="终端最小报位频数(秒)" prop="minFrequency">
                        <el-input v-model="form.minFrequency" placeholder="请输入报终端最小报位频数" />
                    </el-form-item>

                    <el-form-item label="终端协议版本号" prop="terminalVersion">
                        <el-input v-model="form.terminalVersion" placeholder="请输入终端协议版本号" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="open = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { 新增, 编辑 } from '@/api/terminalManage/index.js'
import { reactive, toRefs } from '@vue/reactivity'
const { proxy } = getCurrentInstance()
const emit = defineEmits(['getList', 'goNotBound'])
const { terminal_type, is_binding, relevance_state, function_status } = proxy.useDict(
    'terminal_type',
    'is_binding',
    'relevance_state',
    'function_status'
)
const props = defineProps({
    modalFrom: {
        type: Object,
        default: () => {},
    },
})
const numVadator = (rule, value, callback) => {
    const num = Number(value)
    if (isNaN(num)) {
        callback('请输入数字')
    } else {
        callback()
    }
}
const form = ref({})
const open = ref(false)
const data = reactive({
    rulesFrom: {
        terminalType: [{ required: true, message: '终端类型不能为空', trigger: 'chanage' }],
        terminalCardNum: [{ required: true, message: '终端卡号不能为空', trigger: 'blur' }],
        // terminalModel: [
        //   { required: true, message: "终端型号不能为空", trigger: "blur" },
        // ],
        terminalVersion: [{ required: true, message: '终端协议版本号不能为空', trigger: 'blur' }],
        facilitySerial: [{ required: true, message: '设备序列号不能为空', trigger: 'blur' }],
        netInSerial: [{ required: true, message: '入网序列号不能为空', trigger: 'blur' }],
        minFrequency: [
            { required: true, message: '终端最小报位频数不能为空', trigger: 'blur' },
            { validator: numVadator, trigger: 'blur' },
        ],
        warning: [{ required: true, message: '报警功能不能为空', trigger: 'blur' }],
        communication: [{ required: true, message: '通信功能不能为空', trigger: 'blur' }],
    },
})
const { rulesFrom } = toRefs(data)
watch(
    () => props.modalFrom,
    (val) => {
        if (val) {
            form.value = val
        }
    },
    {
        immdiate: true,
        deep: true,
    }
)
// 提交
const submitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            let res
            if (form.value.id) {
                res = await 编辑(form.value)
            } else {
                res = await 新增(form.value)
                emit('goNotBound')
            }
            if (res.code === 200) {
                proxy.$modal.msgSuccess('操作成功')
                emit('getList')
                open.value = false
            } else {
                proxy.$modal.msgSuccess('操作失败')
            }
        }
    })
}

function show() {
    open.value = true
    proxy.resetForm('formRef')
}
defineExpose({
    show,
})
</script>

<style lang="scss" scoped></style>
