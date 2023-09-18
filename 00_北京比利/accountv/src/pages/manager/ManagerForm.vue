<template>
    <vo v-slot="{ handleSubmit }">
        <form novalidate @submit.prevent="handleSubmit(submit)">
            <vp tag="div" v-slot="v" rules="min_value:1" class="form-group">
                <label>所属角色</label>
                <select
                    class="custom-select"
                    v-model="model.roleId"
                    v-validate="v"
                    required
                >
                    <option :value="0" disabled>请选择</option>
                    <option
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.id"
                    >
                        {{ role.roleName }}
                    </option>
                </select>
            </vp>
            <vp tag="div" v-slot="v" class="form-group">
                <label>账号名称</label>
                <input
                    class="form-control"
                    v-model="model.managerAccount"
                    v-validate="v"
                    required
                    maxlength="64"
                />
            </vp>
            <fieldset v-if="model.id < 1">
                <vp tag="div" v-slot="v" vid="managerPwd" class="form-group">
                    <label>密码</label>
                    <input
                        type="password"
                        name="managerPwd"
                        class="form-control"
                        v-model="pwd"
                        v-validate="v"
                        required
                        minlength="10"
                        maxlength="16"
                        pattern="^[a-zA-Z](?=.+\d)(?=.*\w).*$"
                    />
                    <div class="invalid-feedback">
                        字母开头，至少包含一个数字，不能包含用户名
                        {{ v.errors[0] }}
                        <!-- Password must
                    begin with English characters, and at least have 1 digit or
                    english character, it must not contain the user's account
                    name -->
                    </div>
                </vp>
                <vp
                    tag="div"
                    v-slot="v"
                    rules="equals_to:@managerPwd"
                    class="form-group"
                >
                    <label>确认密码</label>
                    <input
                        type="password"
                        name="confirmPwd"
                        class="form-control"
                        v-model="confirmPwd"
                        v-validate="v"
                        required
                        minlength="10"
                        maxlength="16"
                    />
                    <div class="invalid-feedback">
                        {{ v.errors[0] }}
                    </div>
                </vp>
            </fieldset>
            <vp tag="div" v-slot="v" class="form-group">
                <label>用户名称</label>
                <input
                    class="form-control"
                    v-model="model.managerName"
                    v-validate="v"
                    required
                    maxlength="32"
                />
            </vp>
            <vp tag="div" v-slot="v" class="form-group">
                <label>登录模式</label>
                <select
                    class="form-control"
                    v-model="model.mode"
                    v-validate="v"
                    required
                >
                    <option :value="0">用户名密码登录</option>
                    <option :value="1">手机验证码登录</option>
                </select>
            </vp>
            <fieldset v-if="model.id < 1">
                <vp tag="div" v-slot="v" class="form-group">
                    <label>手机号</label>
                    <input
                        class="form-control"
                        v-model="model.phoneNumber"
                        v-validate="v"
                        :required="model.mode === 1"
                        maxlength="32"
                    />
                </vp>
            </fieldset>
            <vp tag="div" v-slot="v" class="form-group">
                <label>所属集团</label>
                <select
                    class="custom-select"
                    v-model="model.hotelGroupId"
                    v-validate="v"
                    required
                >
                    <option :value="0">非酒店集团管理员</option>
                    <option
                        v-for="group in hotelGroups"
                        :key="group.grpId"
                        :value="group.grpId"
                    >
                        {{ group.grpName }}
                    </option>
                </select>
            </vp>
            <vp tag="div" v-slot="v" class="form-group">
                <label>所属酒店</label>
                <select
                    class="custom-select"
                    v-model="model.hotelId"
                    v-validate="v"
                    required
                >
                    <option :value="0">非酒店管理员</option>
                    <option
                        v-for="hotel in hotels"
                        :key="hotel.hotelId"
                        :value="hotel.hotelId"
                    >
                        {{ hotel.hotelName }}
                    </option>
                </select>
            </vp>
            <vp tag="div" v-slot="v" class="form-group">
                <label>用户状态</label>
                <select
                    class="custom-select"
                    v-model="model.managerStatus"
                    v-validate="v"
                    required
                >
                    <option :value="0">禁用</option>
                    <option :value="1">启用</option>
                    <option :value="2">锁定</option>
                </select>
            </vp>
            <button type="submit" class="btn btn-primary">确定</button>
            <button type="button" class="btn btn-secondary ml-1" @click="close">
                返回
            </button>
        </form>
    </vo>
</template>

<script>
import md5 from 'md5';
import { mapState } from 'vuex';
import { Manager } from "./manager";
import ManagerApi from '@/api/ManagerApi';

export default {
    name: 'ManagerForm',
    props: {
        value: {
            type: Object, default() {
                return new Manager()
            }
        }
    },
    data() {
        return {
            model: JSON.parse(JSON.stringify(this.value)),
            pwd: '',
            confirmPwd: '',
        }
    },
    computed: {
        ...mapState({
            roles: 'roles',
            hotelGroups: 'hotelGroups'
        }),
        hotels() {
            return this.$store.state.hotels.filter(hotel => this.model.hotelId === 0 || this.model.hotelId === hotel.hotelId)
        }
    },
    methods: {
        async submit() {
            if (this.model.id < 1) {
                // create
                this.model.managerPwd = md5(this.pwd)

                try {
                    await ManagerApi.create(this.model)
                    await this.$info('新增管理员成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('新增管理员失败')
                }
            } else {
                // 不能修改密码
                this.model.managerPwd = null;

                try {
                    await ManagerApi.update(this.model)
                    await this.$info('修改管理员成功')
                    this.$emit('change')
                    this.close()
                } catch (error) {
                    this.$error('修改管理员失败')
                }
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>
