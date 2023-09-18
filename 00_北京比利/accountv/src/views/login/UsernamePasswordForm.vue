<template>
    <form @submit.prevent="submit" novalidate>
        <div class="form-group">
            <label class="control-label">
                {{ $t("login.username") }}
            </label>
            <input
                class="form-control"
                required
                maxlength="32"
                v-model="username"
            />
        </div>
        <div class="form-group">
            <label class="control-label">
                {{ $t("login.password") }}
            </label>
            <input
                type="password"
                class="form-control"
                required
                minlength="7"
                maxlength="32"
                v-model="password"
            />
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

export default {
    name: 'UsernamePasswordForm',
    data() {
        return {
            username: '', password: '',
        }
    },
    methods: {
        async submit() {
            // 检查账号密码
            if (!common.isLegalAccountPassword(this.username, this.password)) {
                this.$emit('error', 'Password must begin with English characters, and at least have 1 digit or english character, it must not contain the user\'s account name.')
                return false
            }

            try {
                // username & password login
                const data = await AccountApi.login(this.username, this.password)

                this.$store.commit('setUsername', this.username)
                this.$store.commit('setPassword', this.password)

                const user = data.manager
                if (user.mode === 0) {
                    this.$emit('logged-in', data)
                } else if (user.mode === 1) {
                    // phone verification login
                    this.$emit('next', user)
                } else {
                    this.$emit('error', 'Unknown mode: ' + mode)
                }
            } catch (error) {
                console.error(error)

                this.$emit('error', '登录失败')
            }

            return false
        }
    }
}
</script>
