<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <h2 class="mb-4">酒店天气选择</h2>

        <div class="col-6">
            <vo v-slot="{ handleSubmit }">
                <form novalidate @submit.prevent="handleSubmit(submit)">
                    <vp class="form-group" tag="div" v-slot="v">
                        <label>选择酒店</label>
                        <select
                            placeholder="请选择酒店"
                            class="custom-select"
                            required
                            v-model="form.sourceHotelId"
                        >
                            <option disabled selected value="">
                                请选择酒店
                            </option>
                            <option
                                :value="item.hotelId"
                                v-for="item in gardenList"
                                :key="item.hotelId"
                            >
                                {{ item.hotelName }}
                            </option>
                        </select>
                    </vp>
                    <vp class="form-group" tag="div" v-slot="v">
                        <label>添加到新酒店</label>
                        <select
                            placeholder="请选择酒店"
                            class="custom-select"
                            required
                            v-model="form.destHotelId"
                        >
                            <option disabled selected value="">
                                请选择酒店
                            </option>
                            <option
                                :value="item.hotelId"
                                v-for="item in gardenList"
                                :key="item.hotelId"
                            >
                                {{ item.hotelName }}
                            </option>
                        </select>
                    </vp>
                    <div class="form-group">
                        <button
                            type="submit"
                            :disabled="state"
                            class="btn btn-primary"
                        >
                            确定
                        </button>
                        <!-- <button
                        type="button"
                        class="btn btn-secondary ml-1"
                        @click="close"
                    >
                        返回
                    </button> -->
                    </div>
                </form>
            </vo>
        </div>
    </div>
</template>

<script>
import GalleryApi from '@/api/GalleryApi'
import SelectHotelApi from '@/api/SelectHotelApi'
export default {
    data () {
        return {
            gardenList: [],
            form: {
                sourceHotelId: '',
                destHotelId: ''
            },
            state: false
        }
    },
    created () {
        this.getgarden()
    },
    methods: {
        //获取酒店数据
        getgarden () {
            GalleryApi.getdata().then(data => {
                this.gardenList = data.list
            }).catch((error) => {
                this.$error('获取数据失败')
            })
        },
        async submit () {
            this.state = true
            try {
                const data = await SelectHotelApi.mergeHotelApi(this.form)
                this.$info('添加成功')
                this.form.sourceHotelId = ''
                this.form.destHotelId = ''
                this.state = false

            } catch (error) {
                this.$error(error)
                this.state = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
</style>