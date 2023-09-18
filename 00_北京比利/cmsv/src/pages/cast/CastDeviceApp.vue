<template>
    <div>
        <div class="row">
            <div class="col-12">
                <cool-table
                    ref="castDeviceTable"
                    :data="tableData"
                    :columns="columns"
                    @update-row="update"
                    @del-row="deleteDevice"
                >
                    <button
                        class="btn btn-primary"
                        @click="openFileReader"
                    >
                        导入
                        <input
                            id="file"
                            type="file"
                            style="display: none"
                            accept=".xls,.xlsx"
                            @click.stop
                            @change="importDevices"
                        />
                    </button>
                    <button class="btn btn-primary ml-1" @click="exportDevices">
                        导出
                    </button>
                    <button class="btn btn-primary ml-1" @click="create">
                        添加
                    </button>
                    <button class="btn btn-danger ml-1" @click="deleteDevices">
                        删除
                    </button>
                </cool-table>
            </div>
        </div>
        <cool-modal
            title="投屏设备"
            :visible="modalVisible"
            :footer="{ visible: false }"
            @hidden="modalVisible = false"
        >
            <cast-device-form
                v-if="modalVisible"
                :value="castDeviceModel"
                @change="refresh"
                @close="modalVisible = false"
            />
        </cool-modal>
    </div>
</template>

<script>
import { CastDevice } from './CastDevice'
import CoolModal from '@/components/CoolModal.vue'
import CoolTable from '@/components/CoolTable.vue'
import env from '@/env'
import { mapState } from 'vuex'
import xlsx from 'xlsx'
import CastDeviceForm from './CastDeviceForm.vue'
import CastApi from '@/api/CastApi'

export default {
    name: 'CastDeviceApp',
    components: { CoolModal, CoolTable, CastDeviceForm },
    data() {
        return {
            columns: [{
                checkbox: true
            }, {
                field: 'roomNumber', title: '房间号'
            }, {
                field: 'type', title: '设备类型',
                formatter: (val, row, idx) => {
                    switch (val) {
                        case 0:
                            return 'Apple TV'
                        case 1:
                            return 'Chromecast'
                        case 2:
                            return 'TV Guo'
                        default:
                            return '-'
                    }
                }
            }, {
                field: 'ip', title: '设备IP'
            }, {
                field: 'mac', title: '设备MAC'
            }, {
                field: 'location', title: '所在位置',
                formatter: (val, row, idx) => {
                    switch (val) {
                        case 0:
                            return '设备池'
                        case 1:
                            return '房间内'
                        default:
                            return '-'
                    }
                }
            }, {
                field: 'id', title: '操作',
                formatter: (val, row, idx) => {
                    return `<button class="btn btn-primary btn-sm" data-val=${val} data-emit=update-row>修改</button>
                        <button class="btn btn-danger btn-sm" data-val=${val} data-emit=del-row>删除</button>`
                }
            }],
            modalVisible: false,
            castDeviceModel: new CastDevice,
        }
    },
    computed: {
        ...mapState({
            rooms: 'rooms', castDevices: 'castDevices',
        }),
        tableData() {
            return this.castDevices.map(castDevice => {
                const room = this.rooms.find(room => room.roomId === castDevice.roomId)
                if (room) {
                    return { ...castDevice, roomNumber: room.roomNumber }
                } else {
                    return { ...castDevice, roomNumber: '-'}
                }
            }).sort((a, b) => a.roomNumber - b.roomNumber);
        }
    },
    methods: {
        create() {
            this.castDeviceModel = new CastDevice()

            this.modalVisible = true
        },
        update(_id) {
            this.castDeviceModel = this.tableData.find(v => v.id === _id)

            this.modalVisible = true
        },
        async deleteDevice(_id) {
            try {
                const ok = await this.$confirm('删除投屏设备')
                if (!ok) {
                    return;
                }

                await CastApi.delete([_id])
                this.$info('删除投屏设备成功')
                this.refresh()
            } catch (error) {
                this.$error('删除投屏设备失败')
            }
        },
        async deleteDevices() {
            const selections = this.$refs.castDeviceTable.getSelections()
            if (selections.length === 0) {
                return
            }

            try {
                const ok = await this.$confirm('删除')
                if (!ok) {
                    return
                }

                await CastApi.delete(selections.map(castDevice => castDevice.id))
                this.$info('删除投屏设备成功')
                this.refresh()
            } catch (error) {
                this.$error('删除投屏设备失败')
            }
        },
        refresh() {
            this.$store.dispatch('getCastDevices')
        },
        async openFileReader() {
            const ok = await this.$confirm('导入会清除已有的代理服务器和继电器关联')
            if (!ok) {
                return
            }

            document.getElementById('file').click()
        },
        importDevices(ev0) {
            if (ev0.target.files.length < 1) {
                return
            }

            const reader = new FileReader()
            reader.onloadend = async ev => {
                const wb = xlsx.read(ev.target.result, {
                    type: 'binary'
                })

                let dataSheet
                for (let sheet in wb.Sheets) {
                    if (!wb.Sheets.hasOwnProperty(sheet)) {
                        continue
                    }

                    dataSheet = wb.Sheets[sheet]
                    break
                }

                let payload = []

                let ipreg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/
                let macreg = /(([a-f]|[A-F]|\d){2}:){5}([a-f]|[A-F]|\d){2}/

                const range = xlsx.utils.decode_range(dataSheet['!ref'])
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    let castDevice = new CastDevice()

                    for (let col = range.s.c; col <= range.e.c; col++) {
                        let cell = dataSheet[xlsx.utils.encode_cell({ r: row, c: col })]
                        let text = cell.w
                        switch (col) {
                            case 0:
                                // id
                                break;
                            case 1:
                                // hotelId
                                if (text == null || text.trim() === '') {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n酒店输入错误!请输入' + env.hotelId)
                                    return
                                }
                                castDevice.hotelId = env.hotelId
                                break
                            case 2:
                                // ip
                                if (text == null || text.trim() === '') {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + 'ip不能为空!\n')
                                    return
                                }
                                if (!ipreg.test(text)) {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + 'ip为' + text + ',格式不正确!\n')
                                    return
                                }

                                castDevice.ip = text
                                break
                            case 3:
                                // mac
                                if (text == null || text.trim() === '') {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + 'mac值不可以为空')
                                    return
                                } else if (!macreg.test(text)) {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + 'mac为' + text + ',格式不正确!\n')
                                    return
                                }

                                castDevice.mac = text
                                break
                            case 4:
                                // type
                                if (text === null || text.trim() === '' || (text !== '0' && text !== '1' && text !== '2')) {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '类型有误！\n请输入' + '\n' +
                                        '0(Apple TV)\n' +
                                        '1(ChromeCast)\n' +
                                        '2(Android Dongle)')
                                    return
                                }

                                castDevice.type = parseInt(text)
                                break
                            case 5:
                                // location
                                if (text == null || text.trim() === '' || (text !== '0' && text !== '1')) {
                                    this.$warn('导入投屏列表第' + (row + 2) + '行' + '设备位置有误！' + '\n' + '请填写' + '0(池子)' + '1(房间)')
                                    return
                                }

                                castDevice.location = parseInt(text);
                                break
                            case 6:
                                if (castDevice.location === 1) {
                                    if (text == null || text.trim() === '') {
                                        this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + '房间号不可为空！')
                                        return
                                    } else {
                                        let room = this.rooms.find(room => room.roomNumber === text)
                                        if (!room) {
                                            this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + '请输入正确的房间号！')
                                            return
                                        }

                                        castDevice.roomId = room.roomId
                                    }
                                } else {
                                    if (text != null && text.trim() !== '') {
                                        this.$warn('导入投屏列表第' + (row + 2) + '行' + '\n' + '不可填写房间号！')
                                        return
                                    }
                                }

                                break
                            case 7:
                                if (text != null) {
                                    castDevice.castAddr = text
                                }
                                break
                            case 8:
                                if (text != null) {
                                    castDevice.devLocation = text
                                }
                                break
                            default:
                                console.warn('Unknown Cell: ', cell)
                        }
                    }

                    payload.push(castDevice)
                }

                try {
                    await CastApi.importXlsx(payload)
                    await this.$info('导入投屏列表成功')
                    this.refresh()
                } catch (error) {
                    console.error(error)
                    this.$error('导入投屏列表失败')
                }
            }
            reader.readAsBinaryString(ev0.target.files[0])
        },
        exportDevices() {
            let aoa = [
                ['投屏设备id', '酒店id', 'ip', 'mac', '类型(0:appleTV;1:chromeCast;2:myCast)', '地址类型(0-池子1-房间)', '房间号', '视频流', '设备位置']
            ]
            for (let i = 0; i < this.tableData.length; i++) {
                let castDevice = this.tableData[i]
                aoa.push([
                    castDevice.id,
                    castDevice.hotelId,
                    castDevice.ip,
                    castDevice.mac,
                    castDevice.type,
                    castDevice.location,
                    castDevice.roomNumber,
                    castDevice.castAddr,
                    castDevice.devLocation
                ])
            }

            const sheet = xlsx.utils.aoa_to_sheet(aoa)
            const wb = {
                SheetNames: ['sheet1'],
                Sheets: {
                    'sheet1': sheet,
                }
            }

            xlsx.writeFile(wb, '投屏设备列表.xlsx', {
                bookType: 'xlsx', bookSST: false, type: 'file'
            })
        }
    },
}
</script>