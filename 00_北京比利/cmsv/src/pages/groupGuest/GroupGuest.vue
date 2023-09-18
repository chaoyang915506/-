<template>
    <div>
        <div v-if="showPage === 0">
            <h2>团客管理</h2>
            <CoolTable
                    @editBtn="editBtn"
                    @welcomeBtn="toWelcome"
                    @deleteBtn="deleteBtn"
                    ref="messageTable"
                    :columns="columns"
                    :data="groupGuests"
            >
                <button class="btn btn-primary ml-1" @click="addGroupGuest">新建团客</button>
                <button class="btn btn-danger ml-1" @click="deleteOverdue">一键删除过期团客</button>
            </CoolTable>
        </div>
        <AddGroupGuest
                :toEdit="toEdit"
                :toFilter="groupGuests"
                v-else-if="showPage === 1"
                @goBack="goBack"
        ></AddGroupGuest>
        <WelcomeApp :groupGuest="welcomeGroupGuest" @goBack="goBack" v-else></WelcomeApp>
    </div>
</template>
<script>
import GroupGuestAPI from "@/api/GroupGuestAPI";
import CoolTable from "@/components/CoolTable";
import AddGroupGuest from "@/pages/groupGuest/AddGroupGuest";
import WelcomeApp from "@/views/welcome/WelcomeApp";

export default {
    name: "GroupGuest",
    components: {
        WelcomeApp,
        CoolTable,
        AddGroupGuest
    },
    data() {
        return {
            showPage: 0,
            columns: [
                {
                    field: "",
                    title: "序号",
                    align: "center",
                    formatter: (val, row, idx) => {
                        return idx + 1;
                    }
                },
                {
                    field: "groupGuestName",
                    title: "名称",
                    align: "center",
                    formatter: (val) => {
                        return `<div class="text-overflow">${val}</div>`
                    }
                },
                {
                    field: "groupType",
                    title: "PMS是否支持团客",
                    align: "center",
                    formatter: (val, row, idx) => {
                        return val === 1 ? "是" : "否";
                    }
                },
                {
                    field: "groupGuestCode",
                    title: "团客code",
                    align: "center",
                    formatter: (val, row, idx) => {
                        if (row.groupType === 1) {
                            return val;
                        } else {
                            return "-";
                        }
                    }
                },
                {
                    field: "",
                    title: "房间号",
                    align: "center",
                    formatter: (val, row, idx) => {
                        let roomNoStr = "";
                        row.rooms.forEach(room => {
                            roomNoStr = roomNoStr + room.roomNo + ", ";
                        });
                        return `<div class="text-overflow">` + roomNoStr.substring(0, roomNoStr.length - 2) + `</div>`;
                    }
                },
                {
                    field: "",
                    title: "时间范围",
                    align: "center",
                    formatter: (val, row, idx) => {
                        let startTime = row.startTime;
                        let endTime = row.endTime;
                        if (startTime === null) {
                            startTime = "";
                        }
                        if (endTime === null) {
                            endTime = "";
                        }
                        return startTime + " - " + endTime;
                    }
                },
                {
                    field: "isEnable",
                    title: "状态",
                    align: "center",
                    formatter: (val, row, idx) => {
                        return val === "1" ? "激活" : "未激活";
                    }
                },
                {
                    field: "groupGuestId",
                    title: "操作",
                    align: "left",
                    formatter: (val, row, idx) => {
                        let btnTemplate = `<button class="btn btn-primary  btn-sm" data-val=${val} data-emit="editBtn">编辑</button>
                            <button class="btn btn-primary  btn-sm" data-val=${val} data-emit="welcomeBtn">欢迎页设置</button>`;
                        if (row.groupType === 0) {
                            btnTemplate += ` <button class="btn btn-danger btn-sm" data-val=${val} data-emit="deleteBtn" >删除</button>`;
                        }
                        btnTemplate = `<div style="min-width: 248px">` + btnTemplate + `</div>`;
                        return btnTemplate;
                    }
                }
            ],
            groupGuests: [],
            groupRooms: [],
            toEdit: {
                groupGuestName: "",
                groupGuestCode: "",
                groupType: 0,
                description: "",
                serviceType: "",
                startTime: null,
                endTime: null,
                rooms: []
            },
            welcomeGroupGuest: null
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            GroupGuestAPI.getGroupGuestList().then(data => {
                this.groupGuests = [];
                for (let i = data.length - 1; i >= 0; i--) {
                    this.groupGuests.push(data[i]);
                }
            });
        },
        goBack() {
            this.showPage = 0;
            this.welcomeGroupGuest = null;
            this.init();
        },
        addGroupGuest() {
            this.toEdit = {
                groupGuestId: null,
                groupGuestName: "",
                groupGuestCode: "",
                groupType: 0,
                isEnable: '1',
                description: "",
                serviceType: "",
                startTime: null,
                endTime: null,
                rooms: []
            };
            this.showPage = 1;
        },
        async deleteOverdue() {
            if (
                    await this.$confirm("确定删除团客吗？", "删除后将无法恢复，分组内公告和欢迎页也会被删除")
            ) {
                let overdueIds = [];
                let nowStamp = new Date().valueOf();
                this.groupGuests.forEach(groupGuest => {
                    if (Date.parse(groupGuest.endTime) < nowStamp) {
                        overdueIds.push(groupGuest.groupGuestId);
                    }
                });
                try {
                    await GroupGuestAPI.deleteGroupGuest(overdueIds);
                    await this.$info("删除成功");
                    await this.init();
                } catch (msg) {
                    this.$error(msg);
                }
            }
        },
        editBtn(id) {
            this.toEdit = this.groupGuests.find(e => e.groupGuestId === id);
            this.showPage = 1;
        },
        toWelcome(id) {
            this.welcomeGroupGuest = this.groupGuests.find(e => e.groupGuestId === id);
            this.showPage = 2;
        },
        async deleteBtn(id) {
            if (
                    await this.$confirm("确定删除团客吗？", "删除后将无法恢复，分组内公告和欢迎页也会被删除")
            ) {
                try {
                    await GroupGuestAPI.deleteGroupGuest([id]);
                    await this.$info("删除成功");
                    await this.init();
                } catch (msg) {
                    this.$error(msg);
                }
            }
        }
    }
};
</script>
<style scoped lang="scss">
::v-deep  .omit {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

::v-deep  td {
    max-width: 300px;
    overflow-wrap: break-word;

}

::v-deep  .text-overflow {
    display: block; /*内联对象需加*/
    //width:31em;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
</style>
