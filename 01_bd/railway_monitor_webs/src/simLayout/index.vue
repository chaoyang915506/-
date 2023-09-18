<template>
    <div class="home—container">
        <div class="logo-login"></div>
        <h3 class="title">铁路自然灾害及异物侵限孪生仿真监测系统</h3>
        <div class="total—interface">
            <router-link to="/mapConfig/mapConfig">
                <div class="imgBak imgBak1">
                    <!-- <img src="./../assets/images/home/fzty-home-组件管理.png" /> -->
                    <span>组件管理</span>
                </div>
            </router-link>
            <router-link to="/compTest/algLibrary/imageEnhance">
                <div class="imgBak imgBak2">
                    <!-- <img src="./../assets/images/home/fzty-home-组件测试.png" /> -->
                    <span>组件测试</span>
                </div>
            </router-link>
            <router-link to="/simAssess/overview">
                <div class="imgBak imgBak3">
                    <!-- <img src="./../assets/images/home/fzty-home-仿真评估.png" /> -->
                    <span>仿真评估</span>
                </div>
            </router-link>
            <router-link to="/system/user">
                <div class="imgBak imgBak4">
                    <!-- <img src="./../assets/images/home/fzty-home-系统管理.png" /> -->
                    <span>系统管理</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.total—interface {
    width: 100%;
    height: 90px;
    position: absolute;
    top: 49%;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    .imgBak {
        // background-size: 120% 120%;
    }
    .imgBak1 {
        background-image: url('../assets/images/home/no1.png');
    }
    .imgBak2 {
        background-image: url('../assets/images/home/no2.png');
    }
    .imgBak3 {
        background-image: url('../assets/images/home/no3.png');
    }
    .imgBak4 {
        background-image: url('../assets/images/home/no4.png');
    }
    a {
        margin-right: 118px;
        div {
            width: 160px;
            height: 137px;
            // background-color: red;
            display: inline-block;
            text-align: center;
            span {
                display: inline-block;
                margin-top: 140px;
                margin-right: 10px;
                font-size: larger;
                color: white;
            }
            span:hover {
                color: #409eff;
                cursor: pointer;
            }
            img {
                width: 44px;
                height: 44px;
            }
        }
    }
    a:last-child {
        margin: 0;
    }
}
.home—container {
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/home/fzty_home.png');
    background-size: 100% 100%;
}
.logo-login {
    position: absolute;
    z-index: 10;
    height: 8%;
    width: 4%;
    right: 48%;
    top: 8%;
    background-image: url('../assets/images/login/logo-login.svg');
    background-size: 100% 100%;
}
.title {
    margin: 200px auto 100px auto;
    margin-left: 50%;
    transform: translate(-50%);
    color: #fff;
    display: inline-block;
    font-size: 40px;
}
</style>
