<template>
    <div
        class="container-fluid"
        style="overflow: auto; width: 100%; height: 100%"
    >
        <div class="row-fluid">
            <!-- <div class="col-md-offset-2 col-md-8" style="margin-bottom: 20px"> -->
            <!-- <div style="float: left;"><label class="font20">移动设备(跨酒店或同酒店)</label></div> -->

            <!-- <div class="line"></div> -->
            <!-- </div> -->

            <div class="col-md-6 margin-style">
                <h2>移动设备(跨酒店或同酒店)</h2>
                <form>
                    <div class="form-group mt-3">
                        <label class="control-label" for="oriHotel"
                            >设备从此酒店移出</label
                        >
                        <multiselect
                            v-model="hotelModel"
                            placeholder="Nothing selected"
                            :options="hotelList"
                            label="hotelName"
                            track-by="hotelId"
                            noResult="dfasdfkjadkjf"
                            noOptions="dfasdfkjadkjf"
                        >
                            <template v-slot:noResult>找不到数据</template>
                            <template #noOptions>没有数据了</template>
                        </multiselect>
                    </div>
                    <div class="form-group">
                        <label for="oriRoom">设备从此房间移出(可选)</label>
                        <multiselect
                            v-model="roomModel"
                            placeholder="选择房间"
                            :options="rommList"
                            label="roomNumber"
                            track-by="roomId"
                            noResult="dfasdfkjadkjf"
                            noOptions="dfasdfkjadkjf"
                        >
                            <template v-slot:noResult>找不到数据</template>
                            <template #noOptions>没有数据了</template>
                        </multiselect>
                    </div>
                    <div class="form-group">
                        <label for="device">要移动的设备</label>
                        <multiselect
                            v-model="device"
                            placeholder="选择房间"
                            :options="deviceList"
                            :custom-label="nameWithLang"
                            track-by="roomId"
                        >
                            <template v-slot:noResult>找不到数据</template>
                            <template #noOptions>没有数据了</template>
                        </multiselect>
                    </div>
                    <div class="form-group">
                        <label for="dstHotel">移动到此酒店</label>
                        <multiselect
                            v-model="goHotel"
                            placeholder="Nothing selected"
                            :options="hotelList"
                            label="hotelName"
                            track-by="hotelId"
                        >
                            <template v-slot:noResult>找不到数据</template>
                            <template #noOptions>没有数据了</template>
                        </multiselect>
                    </div>
                    <div class="form-group">
                        <label for="dstRoom">移动到此房间</label>
                        <multiselect
                            v-model="chooseRoom"
                            placeholder="选择房间"
                            :options="goSeledRoom"
                            label="roomNumber"
                            track-by="roomId"
                        >
                            <template v-slot:noResult>找不到数据</template>
                            <template #noOptions>没有数据了</template>
                        </multiselect>
                    </div>
                    <div class="form-group align-right">
                        <button
                            style="float: right"
                            type="button"
                            @click="Onsubmit"
                            class="btn btn-dark d-flex justify-content-end"
                        >
                            确定
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import MoveEngineApi from '@/api/MoveEngineApi'
export default {
    data () {
        return {
            noOptions: '没有更多数据了',
            hotelList: [],
            rommList: [],
            deviceList: [],//移动的设备
            goSeledRoom: [],

            hotelModel: null,//双向绑定的酒店
            roomModel: null,//房间
            device: null,//移动的设备
            goHotel: null,//要移动到的酒店
            chooseRoom: null,//要移动到的房间


            deviceStore: []
        }
    },
    created () {
        this.gethotel()
    },
    methods: {
        async Onsubmit () {
            if (this.hotelModel == null | this.roomModel == null | this.device == null | this.goHotel == null | this.chooseRoom == null) {
                return this.$error('输入信息不完全，请选择源设备和目标房间')
            } else if (
                this.hotelModel.hotelId == this.goHotel.hotelId && this.roomModel.roomId == this.chooseRoom.roomId
            ) {
                return this.$error('源房间与目的房间相同')
            }
            try {
                let body = { oriHotelId: this.hotelModel.hotelId, dstHotelId: this.goHotel.hotelId, oriRoomId: this.roomModel.roomId, dstRoomId: this.chooseRoom.roomId, deviceId: this.device.deviceId }
                await MoveEngineApi.cmsDeviceMove(body)

                // console.log(`${this.hotelModel.hotelName}的${this.roomModel.roomNumber}房间的设备${this.device.deviceSerial} | ${this.device.IPAddress}成功移机到${this.goHotel.hotelName}的${this.chooseRoom.roomNumber}房间`)

                await this.$info(`${this.hotelModel.hotelName}的${this.roomModel.roomNumber}房间的设备${this.device.deviceSerial} | ${this.device.IPAddress}成功移机到${this.goHotel.hotelName}的${this.chooseRoom.roomNumber}房间`)
                this.hotelModel = null,//双向绑定的酒店
                    this.roomModel = null,//房间
                    this.device = null,//移动的设备
                    this.goHotel = null,//要移动到的酒店
                    this.chooseRoom = null
                await this.gethotel()

            } catch (error) {
                console.log(error)
            }

        },
        nameWithLang ({ deviceSerial, IPAddress }) {
            return `${deviceSerial} | ${IPAddress}`
        },
        //获取全部酒店
        async gethotel () {
            try {
                const hotel = await MoveEngineApi.getHotelList()
                this.hotelList = hotel
            } catch (error) {
                console.log(error)
            }
        },
        async getRoomDevice (val) {
            try {
                const room = await MoveEngineApi.getRoomlist(val)
                // console.log(room, 'room')
                this.rommList = room
                const device = await MoveEngineApi.getDevicelist(val)
                this.deviceStore = device
                // console.log(device, 'device')
                // this.deviceList = device
            } catch (error) {
                console.log(error)
            }
        }
    },
    watch: {
        'hotelModel.hotelId' (val) {
            this.roomModel = null
            this.getRoomDevice(val)

        },
        'roomModel.roomId' (val) {
            // console.log(val, 'val')
            this.device = null
            this.deviceList = this.deviceStore.filter(item => item.roomId == val)
        },
        async 'goHotel.hotelId' (val) {
            try {
                this.chooseRoom = null
                let data = await MoveEngineApi.getRoomlist(val)
                this.goSeledRoom = data
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: {
        Multiselect,
    },

}
</script>

<style lang="scss" scoped>
h2 {
    border-bottom: 1px solid #898989;
}
@media screen and (min-width: 858px) {
    .margin-style {
        margin-left: 25%;
    }
}
</style>