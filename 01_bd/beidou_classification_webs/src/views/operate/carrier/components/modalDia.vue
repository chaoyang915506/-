<template>
    <el-dialog :title="form.id ? '新增载体信息' : '编辑载体信息'" v-model="open" width="40%" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rulesCarrier" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <el-form-item label="载体名称" prop="carrierName">
                        <el-input v-model="form.carrierName" placeholder="请输入载体名称" />
                    </el-form-item>
                    <el-form-item label="频度" prop="">
                        <el-input v-model="form.xxxx" placeholder="请输入频度" />
                    </el-form-item>
                    <el-form-item label="租用/协管" prop="rent">
                        <el-input v-model="form.rent" placeholder="请输入租用/协管" />
                    </el-form-item>
                    <el-form-item label="联系人" prop="">
                        <el-input v-model="form.xxxx" placeholder="请输入联系人" />
                    </el-form-item>
                    <el-form-item label="邮编" prop="postcode">
                        <el-input v-model="form.postcode" placeholder="请输入邮编" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :offset="0">
                    <el-form-item label="载体类型" prop="carrierType">
                        <el-select
                            v-model="form.carrierType"
                            placeholder="请选择载体类型"
                            clearable
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in carrier_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="负责人" prop="carrierPrincipal">
                        <el-input v-model="form.carrierPrincipal" placeholder="请输入负责人" />
                    </el-form-item>
                    <el-form-item label="行业协议" prop="">
                        <el-select
                            v-model="form.carrierType"
                            placeholder="请选择行业协议"
                            clearable
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in carrier_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="tel">
                        <el-input v-model="form.tel" placeholder="请输入联系电话" />
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="form.address" placeholder="请输入地址" />
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
import { 新增, 编辑 } from '@/api/carrier/index.js'
const { proxy } = getCurrentInstance()
const { carrier_type } = proxy.useDict('carrier_type')
const emit = defineEmits(['getList', 'goNotBound'])
const props = defineProps({
    dataFrom: {
        type: Object,
        default: {},
    },
})
const open = ref(false)
const data = reactive({
    form: {},
    rulesCarrier: {
        carrierName: [{ required: true, message: '载体名称不能为空', trigger: 'blur' }],
        carrierType: [{ required: true, message: '载体类型不能为空', trigger: 'blur' }],
        carrierPrincipal: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        rent: [{ required: true, message: '租用/协管不能为空', trigger: 'blur' }],
        terminalId: [{ required: true, message: '绑定终端序列号不能为空', trigger: 'change' }],
        carrierPrincipal: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],

        hangye: [{ required: true, message: '行业协议不能为空', trigger: 'change' }],
        pindu: [{ required: true, message: '频度不能为空', trigger: 'blur' }],
        联系人: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    },
})
const { rulesCarrier, form } = toRefs(data)

function show() {
    open.value = true
    proxy.resetForm('formRef')
}

// 提交
watch(
    () => props.dataFrom,
    (val) => {
        if (val) {
            data.form = val
        }
    },
    {
        deep: true,
        immediate: true,
    }
)
const submitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            let res
            if (data.form.id) {
                res = await 编辑(data.form)
            } else {
                res = await 新增(data.form)
                emit('goNotBound')
            }
            if (res.code === 200) {
                proxy.$modal.msgSuccess('操作成功')
                emit('getList')
                open.value = false
            } else {
                proxy.$modal.msgWarning('操作失败')
            }
        }
    })
}

defineExpose({
    show,
})
</script>

<style lang="scss" scoped></style>
