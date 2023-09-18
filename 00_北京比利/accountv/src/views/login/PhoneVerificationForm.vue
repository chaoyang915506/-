<template>
    <form @submit.prevent="submit" novalidate>
        <label>{{ $t("login.verifyCode.info") }}</label>
        <div class="form-group">
            <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    v-cool-focus
                    :placeholder="$t('login.verifyCodePlaceHolder')"
                    maxlength="6"
                    minlength="6"
                    v-model="verifyCode"
                />
                <div class="input-group-append">
                    <button
                        v-if="btnShow === 0"
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="sendSms"
                    >
                        {{ $t("login.verifyBtn.notSend") }}
                    </button>
                    <button
                        v-else-if="btnShow === 1"
                        class="btn btn-outline-secondary"
                        type="button"
                    >
                        {{ $t("login.verifyBtn.sending") }}
                    </button>
                    <button
                        v-else
                        class="btn btn-outline-secondary"
                        type="button"
                    >
                        {{ timeCount }}{{ $t("login.verifyBtn.getCodeAgain") }}
                    </button>
                </div>
            </div>
        </div>
        <br />
        <button type="submit" class="btn btn-dark btn-block">
            {{ $t("login.login") }}
        </button>
    </form>
</template>

<script>
import common from '@/common'
import AccountApi from '@/api/AccountApi'
import { mapState } from 'vuex'

export default {
    name: 'PhoneVerificationForm',
    data() {
        return {
            btnShow: 0,
            verifyCode: '',
            timer: null,
            timeCount: 60,
        }
    },
    props: {
        phoneNumber: String,
    },
    computed: {
        ...mapState(['username', 'password'])
    },
    methods: {
        /**
         * 通过手机号和短信验证码登录
         * @returns {boolean}
         */
        async submit() {
            // 校验手机号是否正确
            if (!common.isLegalPhoneNumber(this.phoneNumber)) {
                this.$emit('error', 'Incorrect format of mobile phone number')
                return false
            }
            if (!common.isLegalVerifyCode(this.verifyCode)) {
                this.$emit('error', 'Wrong verification code')
                return false
            }
            // 登录
            try {
                const data = await AccountApi.verify(this.username, this.phoneNumber, this.verifyCode)
                this.$emit('logged-in', data)
            } catch (error) {
                console.error(error)

                this.$emit('error', error)
            }

            return false
        },
        /**
        * 调用后端接口发送短信验证码
        * @returns {boolean}
        */
        async sendSms() {
            if (!common.isLegalPhoneNumber(this.phoneNumber)) {
                this.$emit('error', 'Incorrect format of mobile phone number')
                return false
            }

            this.btnShow = 1

            try {
                await AccountApi.sendSms(this.username, this.password)
                this.sendBtnTimer()
            } catch (error) {
                console.error(error)

                this.$emit('error', error)
            }

            return true
        },
        sendBtnTimer() {
            this.btnShow = 2
            const TIME_COUNT = 60
            this.timer = setInterval(() => {
                if (this.timeCount > 0 && this.timeCount <= TIME_COUNT) {
                    this.timeCount--
                } else {
                    this.btnShow = 0
                    clearInterval(this.timer)
                    this.timer = null
                    this.timeCount = 60
                }
            }, 1000)
        },
    },
    created() {
        this.sendBtnTimer()
    }
}
</script>
