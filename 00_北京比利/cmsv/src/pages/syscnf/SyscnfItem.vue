<template>
    <div class="position-relative">
        <div class="action-item text-center">
            <div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="glyphicon glyphicon-cog"></i>
            </div>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button class="dropdown-item" @click="reset">重置此配置</button>
                <!-- <div class="dropdown-divider"></div> -->
                <!-- <button class="dropdown-item" @click="undo">恢复上次修改</button> -->
            </div>
            <div v-show="changed" @click="submit">
                <svg
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 16 16"
                    class="bi bi-check text-danger"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
                    />
                </svg>
            </div>
        </div>
        <div class="cnf-item">
            <div>
                <h3>{{ syscnf.name }}</h3>
                <!-- <h3 :class="{'text-primary': syscnf.cnfValue && syscnf.cnfValue !== syscnf.defaultValue}">{{ syscnf.name }}</h3> -->
                <p>
                    <i>{{ syscnf.key }}</i>
                </p>
            </div>
            <p class="lead text-justify">{{ syscnf.desc }}</p>
            <select v-if="syscnf.inputType === 'select'" class="custom-select form-control" v-model="value">
                <option v-for="(opt, i) in JSON.parse(syscnf.options)" :key="i" :value="opt.value">{{ opt.desc }}</option>
            </select>
            <input v-else :type="inputType" class="form-control" :placeholder="syscnf.defaultValue" v-model="value" />
        </div>
    </div>
</template>

<script>
import { SyscnfApi } from '@/api/SyscnfApi'

export default {
    name: 'SyscnfItem',
    props: {
        syscnf: Object,
    },
    data() {
        return {
            value: this.syscnf.cnfValue ? this.syscnf.cnfValue : this.syscnf.defaultValue,
            changed: false,
        }
    },
    computed: {
        inputType() {
            switch (this.syscnf.type) {
                case 'int':
                    return 'number'
                case 'string':
                case 'json':
                default:
                    return 'text'
            }
        }
    },
    watch: {
        value() {
            this.changed = this.syscnf.cnfValue !== undefined && this.syscnf.cnfValue != this.value
        }
    },
    methods: {
        reset() {
            this.value = this.syscnf.defaultValue;
        },
        undo() {
            this.value = this.latestValue;
        },
        submit() {
            let action;

            if (!this.syscnf.cnfId) {
                action = SyscnfApi.create({
                    cnfId: 0, cnfName: this.syscnf.key, cnfValue: this.value
                })
            } else {
                action = SyscnfApi.update({
                    cnfId: this.syscnf.cnfId, cnfName: this.syscnf.key, cnfValue: this.value
                })
            }

            action.then(data => {
                this.$emit('change');

                this.changed = false;
            }).catch(err => this.$error(err))
        }
    }
}
</script>

<style scoped lang="scss">
.action-item {
    position: absolute;
    left: -2rem;
    top: 0.1rem;
    width: 2rem;
    font-size: 1.4rem;

    &:hover {
        cursor: pointer;
    }
}
</style>