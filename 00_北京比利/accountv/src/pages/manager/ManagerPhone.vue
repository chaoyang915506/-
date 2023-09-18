<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <vp class="form-group" tag="div" vid="text" v-slot="v">
                <label>新手机号</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="phoneNumber"
                    v-validate="v"
                    required
                    @input="onInput"
                    pattern="^[1][2-9][0-9]{9}$"
                />
                <div class="err">{{ phoneNoErr }}</div>
            </vp>
            <button type="submit" class="btn btn-primary">确定</button>
            <button type="button" class="btn btn-secondary ml-1" @click="close">
                返回
            </button>
        </form>
    </vo>
</template>

<script>
export default {
    name: "ManagerPwd",
    props: {
        value: Object,
    },
    data() {
        return {
            phoneNumber: "",
            phoneNoErr: "",
        };
    },
    methods: {
        submit() {
            this.$emit("updatePhone", this.phoneNumber);
            this.close();
        },
        onInput() {
            if (this.phoneNumber) {
                this.phoneNoErr = " ";
            }
            let reg = /^[1][23456789][0-9]{9}$/;
            if (!reg.test(this.phoneNumber)) {
                this.phoneNoErr = "手机号格式错误";
            }
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>
<style scoped>
.err {
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #dc3545;
}
</style>