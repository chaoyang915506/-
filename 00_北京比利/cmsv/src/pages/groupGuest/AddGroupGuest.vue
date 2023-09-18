<template>
    <div class="addGroupGuest">
        <h3 class="form-group row" style="margin-left:13%">{{ pageTitle }}</h3>
        <div class="form">
            <vp class="form-group row" tag="div" v-slot="v">
                <label class="required col-3">团客名称</label>
                <div class="col-9">
                    <input
                            v-model="groupGuest.groupGuestName"
                            class="form-control"
                            v-validate="v"
                            required
                            maxlength="60"
                    />
                </div>
            </vp>
            <div class="pmsRadio form-group row">
                <label class="required col-3">PMS是否支持团客</label>
                <div class="col-9">
                    <el-radio-group v-model="groupGuest.groupType" :disabled="radioDisable">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div v-if="groupGuest.groupType === 1">
                <vp class="form-group row" tag="div" v-slot="v">
                    <label class="required col-3">团客code</label>
                    <div class="col-9">
                        <input
                                v-model="groupGuest.groupGuestCode"
                                class="form-control"
                                v-validate="v"
                                required
                                maxlength="36"
                                :disabled="codeDisabled"
                        />
                    </div>
                </vp>
                <label class="col-3"></label>
                <label class="msg form-group col-9" style="text-align: left;">
                    *团客内指定的房间，生效时间范围，均由pms控制
                </label>
            </div>
            <div class="form-group row" v-if="groupGuest.groupType===0">
                <label class="required col-3 selectRoom">时间范围</label>
                <div class="col-9">
                    <el-date-picker
                            unlink-panels
                            v-model="timeRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="filterGroupRoom"
                            :default-time="['12:00:00', '12:00:00']"
                            :disabled="groupGuest.groupType===1"
                    >
                    </el-date-picker>
                    <label class="timeMsg">{{ timeMsg }}</label>
                </div>
            </div>
            <div class="form-group row" v-if="!(groupGuest.groupGuestId===null&&groupGuest.groupType===1)">
                <label class="required selectRoom col-3">房间号</label>
                <div class="col-9 mt-4">
                    <el-transfer
                            filterable
                            :titles="titles"
                            filter-placeholder="请输入房间号"
                            v-model="groupRooms"
                            :data="noGroupRooms"
                    >
                    </el-transfer>
                </div>
            </div>
            <div v-if="groupGuest.groupType===0">
                <label class="col-3"></label>
                <label class="msg form-group col-9" style="text-align: left;">
                    *团客功能根据时间生效，与checkin和checkout无关，因本酒店PMS不支持团客功能
                </label>
            </div>
            <vp class="form-group row" tag="div" v-slot="v">
                <label class="required col-3 selectRoom">状态</label>
                <el-switch class="col-9" v-model="isEnable" active-color="#409eff" inactive-color="#dcdfe6">
                </el-switch>
            </vp>
        </div>
        <div class="decision form-group row">
            <div class="col-3"></div>
            <div class="col-9">
                <button type="button" class="btn btn-info" @click="goBack">返回</button>
                <button type="button" class="btn btn-primary" @click="addOrEdit">
                    确定
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import GroupGuestAPI from "@/api/GroupGuestAPI";

export default {
    name: "AddGroupGuest",
    data() {
        return {
            pageTitle: "新增团客",
            noGroupRooms: [],
            groupRooms: [],
            groupGuest: JSON.parse(JSON.stringify(this.toEdit)),
            radioDisable: false,
            codeDisabled: false,
            successInfo: "添加成功",
            titles: ["全部房间", "团客房间"],
            timeRange: [],
            timeMsg: "*先选择时间范围，再进行房间选择",
            isEnable: this.toEdit.isEnable === '1',
            allGroupRooms: [],
        };
    },
    props: {
        toEdit: {
            type: Object,
            default: () => ({})
        },
        toFilter: {
            type: Array,
            default: () => []
        }
    },
    created() {
        GroupGuestAPI.getHotelRoomList().then(data => {
            data.forEach(room => {
                let label = {
                    key: room.roomId,
                    label: room.roomNumber,
                    disabled: true
                };
                this.allGroupRooms.push(label);
                this.noGroupRooms.push(label);
            });
            if (this.toEdit.groupGuestId !== null) {
                this.pageTitle = "编辑团客";
                this.toEdit.rooms.forEach(room => {
                    this.groupRooms.push(room.roomId);
                });
                this.radioDisable = true;
                this.codeDisabled = true;
                this.timeMsg = "";
                this.successInfo = "编辑成功";
                this.timeRange.push(Date.parse(this.groupGuest.startTime));
                this.timeRange.push(Date.parse(this.groupGuest.endTime));
                if (this.toEdit.groupType === 0) {
                    this.noGroupRooms.forEach(noRoom => {
                        noRoom.disabled = false;
                    });
                    this.filterGroupRoom();
                }
            }
        });
    },
    methods: {
        goBack() {
            this.$emit("goBack");
        },
        filterGroupRoom() {
            this.noGroupRooms = [];
            this.allGroupRooms.forEach(label => {
                this.noGroupRooms.push(label);
            });
            if (this.timeRange.length === 2) {
                let startFormat = new Date(this.timeRange[0]).format("yyyy-MM-dd hh:mm:ss");
                let endFormat = new Date(this.timeRange[1]).format("yyyy-MM-dd hh:mm:ss");
                if (this.groupGuest.startTime !== startFormat || this.groupGuest.endTime !== endFormat) {
                    // this.groupRooms = [];
                    if (this.toEdit.groupGuestId === null) {
                        this.noGroupRooms.forEach(noRoom => {
                            noRoom.disabled = false;
                        });
                    }
                    this.groupGuest.startTime = startFormat;
                    this.groupGuest.endTime = endFormat;
                }
            }
            let startStamp = Date.parse(this.groupGuest.startTime);
            let endStamp = Date.parse(this.groupGuest.endTime);
            this.toFilter.forEach(ele => {
                if (this.toEdit.groupGuestId === null || ele.groupGuestId !== this.toEdit.groupGuestId) {
                    let eleStartStamp = Date.parse(ele.startTime);
                    let eleEndStamp = Date.parse(ele.endTime);
                    let conflict1 = startStamp < eleEndStamp && endStamp >= eleEndStamp;
                    let conflict2 = startStamp <= eleStartStamp && endStamp > eleStartStamp;
                    let conflict3 = startStamp <= eleStartStamp && endStamp >= eleEndStamp;
                    let conflict4 = startStamp >= eleStartStamp && endStamp <= eleEndStamp;
                    if (conflict1 || conflict2 || conflict3 || conflict4) {
                        ele.rooms.forEach(eleRoom => {
                            for (let i = this.noGroupRooms.length - 1; i >= 0; i--) {
                                if (this.noGroupRooms[i].key === eleRoom.roomId) {
                                    this.noGroupRooms.splice(i, 1);
                                }
                            }
                        });
                    }
                }
            });
        },
        async addOrEdit() {
            if (this.groupGuest.groupGuestName === "") {
                this.$error("请输入团客名称");
                return false;
            }
            if (this.groupGuest.groupType === 0) {
                if (this.timeRange.length === 0) {
                    this.$error("请选择入住时间和退房时间");
                    return false;
                }
                this.groupGuest.startTime = new Date(this.timeRange[0]).format("yyyy-MM-dd hh:mm:ss");
                this.groupGuest.endTime = new Date(this.timeRange[1]).format("yyyy-MM-dd hh:mm:ss");
                if (this.groupRooms.length === 0) {
                    this.$error("请选择房间");
                    return false;
                }
            } else {
                if (this.groupGuest.groupGuestCode === "") {
                    this.$error("请输入团客code");
                    return false;
                }
            }
            this.groupGuest.isEnable = this.isEnable ? 1 : 0;
            this.groupGuest.rooms = [];
            this.groupRooms.forEach(roomId => {
                this.groupGuest.rooms.push({roomId: roomId});
            });
            try {
                await GroupGuestAPI.addOrEditGroupGuest(this.groupGuest);
                await this.$info(this.successInfo);
                await this.goBack();
            } catch (msg) {
                this.$error(msg);
            }
        }
    }
};
</script>

<style scoped lang="scss">
.addGroupGuest {
    width: 50%;
    margin-left: 20%;

    h3 {
        margin-top: 20px;
    }
}

.required:before {
    content: "*";
    color: red;
}

.form {
    margin-top: 50px;

    .pmsRadio {
        .inputRadio {
            margin-right: 50px;
        }
    }

    .msg {
        font-size: 16px;
        margin-top: 30px;
        font-weight: bold;
    }

    .selectRoom {
        width: 90px;
    }

    .groupRooms {
        margin-top: 30px;
    }
}

.decision {
    //   margin-top: 50px;
    justify-content: left;

    button {
        margin-right: 50px;
        width: 80px;
    }
}

::v-deep  .el-radio-group {
    margin-top: 6px;
}

::v-deep  .el-transfer {
    display: inline-block;
}

::v-deep  .el-transfer-panel {
    width: 33.33%;
}

label {
    text-align: right;
}

.row {
    align-items: center;
}

::v-deep  .el-range-editor.el-input__inner {
    width: 100%;
}

::v-deep  .el-transfer {
    width: 100%;
}

::v-deep  .el-transfer__buttons {
    width: 33.3%;
    text-align: center;
}

.timeMsg {
    position: absolute;
    color: red;
    font-size: 12px;
    left: 3%;
    bottom: -70%;
}
</style>
