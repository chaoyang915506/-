<template>
    <aside>
        <div class="container" id="reserve">
            <div class="row">
                <div class="col-12 text-center mt-3">
                    <figure
                        class="figure bg-secondary w-50 text-light"
                        style="font-size: 5rem; line-height: 1"
                    >
                        <img
                            src="@/assets/images/admin.png"
                            class="figure-img img-fluid"
                            alt=""
                        />
                    </figure>
                </div>
            </div>
        </div>
        <div class="menu-container" align="center">
            <div
                id="menuInnterContainer"
                v-for="menu in localeMenus"
                :key="menu.id"
                class="list-group text-center menu-sys"
                @click="showMenu = menu.id"
            >
                <div
                    class="menu-sys-name"
                    :class="{ active: showMenu === menu.id }"
                >
                    <div class="content">{{ menu.name }}</div>
                </div>
                <div v-if="showMenu === menu.id">
                    <div
                        v-for="child in menu.children"
                        :key="child.id"
                        class="list-group-item list-group-item-action text-center"
                        style="cursor: pointer"
                        :class="{ active: child.id === isActive }"
                        @click="clickMenu(menu, child)"
                    >
                        {{ child.name }}
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="menu-left-right">
            <div
                class="float-right"
                style="margin-right: 20px; cursor: pointer"
                @click="$emit('toggle')"
            >
                <i class="bi bi-arrow-left-right"></i>
            </div>
        </div> -->
    </aside>
</template>

<script>
import MenuApi from "@/api/MenuApi";
import MenuApp from "@/pages/menu/MenuApp.vue";
import { mapMutations, mapState } from "vuex";
import Env from '@/env/index'
import AccessApi from "@/api/AccessApi"

export default {
    components: { MenuApp },
    name: "MainMenu",
    data() {
        return {
            isActive: "",
            showMenu: 0,
            goingTo: "",
            user: JSON.parse(sessionStorage.getItem("user")),
            // 访问记录数据
            accessMenuData: {
                managerId: '',
                managerName: '',
                accessMenuId: '',
                accessUrl: '',
                isPassed: "1",
                token: ''
            }
        };
    },
    computed: {
        ...mapState({
            menus: (state) => state.menus,
            chosenHotelId: (s) => s.chosenHotel.hotelId,
            href: s => s.href,
            menuMessage:(state) => state.menuMessage
        }),
        localeMenus() {
            return this.menus.map(menu => {
                const lang = menu.langs.find(lang => lang.langId == this.$root.$i18n.locale)
                menu.children.map(element => {
                    const child = element.langs.find(value => value.langId == this.$root.$i18n.locale)
                    element.name = (child && child.name) ? child.name : element.name
                })
                menu.name = (lang && lang.name) ? lang.name : menu.name

                return menu
            })
        }
    },
    watch: {
        chosenHotelId(newVal) {
            if (newVal !== 0) {
                this.jumpTo(this.goingTo);
            }
        },
        menuMessage (newVal) {
            this.refresh()
        }
    },
    methods: {
        ...mapMutations({
            jumpTo: "jumpTo",
        }),
        async clickMenu(sys, menu) {
            try {
                // console.log('当前子菜单的父菜单数据', sys)
                // console.log('当前点击的子菜单数据',menu)
                this.accessMenuData.managerId = this.user.id
                this.accessMenuData.managerName = this.user.managerName
                this.accessMenuData.accessMenuId = menu.id
                this.accessMenuData.accessUrl = menu.url
                this.accessMenuData.token = Env.token
                // console.log('访问记录数据',this.accessMenuData)
                await AccessApi.accessMenu(this.accessMenuData)
                        
            } catch (error) {
                console.log(error);
            }

            this.isActive = menu.id
            const url = new URL(menu.url, sys.url)
            url.searchParams.set(Date.now(), '')
            if (url.searchParams.get('hotelId') && this.chosenHotelId === 0) {
                // need to choose hotel
                this.goingTo = url.toString();
                this.jumpTo("hotelList");
                return
            }

            if (this.goingTo == url.toString()) {
                this.jumpTo(this.goingTo)
                return
            }

            this.goingTo = url.toString()
            this.jumpTo(this.goingTo);  
        },
        refresh() {
            MenuApi.listById(this.user.id).then((data) => {
                this.$store.commit("setMenus", data.list);

                // special case
                // 需要记录一下管理员列表页面的url，以保证角色管理跳转的url和菜单中的url一致
                const sys = data.list.find(sys => sys.system === '0')
                if (sys) {
                    const menu = sys.children.find(menu => menu.url.indexOf('newManager.html') !== -1)
                    this.$store.commit('setManagerUrl', new URL(menu.url, sys.url).toString())
                }
            })
        }
    },
    created() {
        this.refresh()
    },
};
</script>

<style scoped lang="scss">
.menu-left-right {
    position: absolute;
    bottom: 0;
    height: 40px;
    width: 100%;
}

.menu-container {
    margin-top: 30px;
    margin-bottom: 100px;
    left: 20px;
    width: 100%;
    height: 75%;
    font-family: "微软雅黑 Light";
    overflow: auto;
}

#menuInnterContainer {
    margin-right: 10%;
    margin-left: 10%;
    padding-top: 1px;
    width: 80%;
}

.menu-sys {
    cursor: pointer;
    border-radius: 0;
    margin-top: 2px;
    background-color: #afb3b9;

    .menu-sys-name {
        text-align: center;
        height: 55px;
        font-size: 17px;
        border-top: 2px solid rgb(160, 159, 159);
        &.active {
            border-bottom: 2px solid rgb(160, 159, 159);
            padding-top: 2px;
            padding-bottom: 2px;
            .content {
                background-color: #333333;
                height: 100%;
                padding-top: 10px;
                color: white;
            }
        }
        .content {
            padding-top: 13px;
        }
    }

    &:not(:first-child) {
        margin-top: 2px;
    }
}

.list-group-item {
    font-size: 16px;
    border: 0;
    color: #5e3f61;
    cursor: pointer;
    background-color: #dedede;

    &.active {
        background-color: #bdbaba;
    }
}
.bg {
    color: #312133;
    background-color: #e4e5e6;
    text-decoration: underline;
}
.bg-secondary {
    background-color: #343a40 !important;
    width: 150px !important;
}
</style>