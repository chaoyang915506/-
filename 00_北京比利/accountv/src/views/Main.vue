<template>
    <div class="h-100">
        <main-header class="main-header" />
        <main-menu
            class="main-menu shadow"
            :style="{ width: this.menuWidth - 1 + '%' }"
            @toggle="toggleMenu"
        />
        <main-body
            class="main-body"
            :style="{ width: this.bodyWidth + '%', left: this.menuWidth + '%' }"
        />
        <footer class="main-footer bg-dark text-white py-2">
            Copyright @ 2015 - {{ new Date().getFullYear() }} MYCOOLTV管理系统
        </footer>
    </div>
</template>

<script>
import MainHeader from './MainHeader.vue'
import MainMenu from './MainMenu.vue'
import MainBody from './MainBody.vue'
import { mapMutations } from 'vuex';
import { authWorker, idleWorker } from '@/Worker';
import AccountApi from '@/api/AccountApi';

export default {
    name: 'Main',
    components: { MainHeader, MainMenu, MainBody },
    data() {
        return {
            menuWidth: 20, // %
        };
    },
    computed: {
        bodyWidth() {
            return 100 - this.menuWidth;
        }
    },
    methods: {
        ...mapMutations(['jumpTo']),
        toggleMenu() {
            if (this.menuWidth === 20) {
                this.menuWidth = 5
            } else {
                this.menuWidth = 20
            }
        },
        kickOut() {
            idleWorker.stop();

            sessionStorage.removeItem('token');
            sessionStorage.removeItem('tokenExpire');

            AccountApi.logout()

            this.$router.replace('/login');
        }
    },
    created() {
        idleWorker.setHandler(async () => {
            try {
                const isTimeout = await AccountApi.isExpired()
                if (isTimeout) {
                    this.kickOut()
                }
            } catch (error) {
                this.kickOut()
            }
        });
        idleWorker.start();
    }
}
</script>

<style scoped lang="scss">
$header-height: 50px;
$footer-height: 45px;

.main-header {
    height: $header-height;
}

.main-menu {
    position: fixed;
    top: $header-height;
    bottom: $footer-height;
}

.main-body {
    position: fixed;
    top: $header-height;
    bottom: $footer-height;
}

.main-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: $footer-height;
    text-align: center;
    font-size: 16px;
}
</style>
