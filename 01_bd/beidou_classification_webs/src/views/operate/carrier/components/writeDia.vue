<template>
    <el-dialog title="注销终端" v-model="writeState" width="40%" append-to-body>
        <el-form ref="formRef" :model="useWrite" :rules="data.rules" label-width="100px">
            <el-form-item label="注销原因" prop="cause">
                <el-input v-model="useWrite.cause" placeholder="" size="normal" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="writeSubmitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { 注销 } from '@/api/carrier/index.js'
const { proxy } = getCurrentInstance()
const writeState = ref(false)
const useWrite = ref({})
const props = defineProps({
    writeId: {
        type: [String, Number],
    },
})
const emit =defineEmits(['goHome'])
const data = reactive({
    rules: {
        cause: [{ required: true, message: '注销原因不能为空', trigger: 'blur' }],
    },
})
const writeSubmitForm = () => {
    proxy.$refs['formRef'].validate(async (valid) => {
        if (valid) {
            注销({ id: props.writeId, cause: useWrite.value.cause }).then((res) => {
                if (res.code === 200) {
                    proxy.$modal.msgSuccess('注销成功')
                    writeState.value = false
                    emit('goHome')
                }
            })
        }
    })
}
// 取消
const cancel = () => {
    writeState.value = false
}
function show() {
    writeState.value = true
}

defineExpose({
    show,
})
</script>

<style lang="scss" scoped></style>
