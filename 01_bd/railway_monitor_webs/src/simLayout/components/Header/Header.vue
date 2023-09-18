<template>
	<div class="containner">
		<div class="nav-header">
			<div class="logo-login"></div>
			<div class="title">铁路自然灾害及异物侵限孪生仿真监测系统</div>
			<div>
				<router-link to="/index">
					<div class="system-back-title"><span>数字孪生</span></div>
				</router-link>
				<div class="avatar-container">
					<el-dropdown class="right-menu-item hover-effect" trigger="click">
						<div class="avatar-wrapper">
							<!-- <img :src="getters.avatar" class="user-avatar" /> -->
							<div class="user-avatar"></div>
						</div>
						<template #dropdown>
							<el-dropdown-menu>
								<router-link to="/user/profile">
									<el-dropdown-item>个人中心</el-dropdown-item>
								</router-link>
								<el-dropdown-item divided @click="logout">
									<span>退出登录</span>
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { defineProps, ref, getCurrentInstance, computed, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
// import UserCenter from './UserCenter.vue'

const router = useRouter();
const store = useStore();

// 触发子组件钩子载体
// const userCenterRef = ref(null)

// const userInfo = computed(() => {
//     return store.state.user.userInfo ? store.state.user.userInfo[0] : {}
// })

// 属性定义
const props = defineProps({
	msg: String,
});
const listVisible = ref(false);
const modalData = ref({
	userName: "",
	oldPassword: "",
	newPassword: "",
});

const toOpenDrawer = ref(false);

const closeDrawer = () => {
	toOpenDrawer.value = false;
};

const logout = (command) => {
	if (command === "updatePass") {
		toOpenDrawer.value = true;
		// userCenterRef.value.getUserInfo()
	} else {
		// 退出登录
		store.commit("user/clearStore");
		router.push({
			path: "/Login", // 到登录页重新获取token
		});
	}
};
</script>

<style scoped lang="less">
.containner {
	display: flex;
	justify-content: center;
	height: 100%;
	width: 100%;
	background: #426ab3;
}
.logo-login {
    margin-left: 8px;
	width: 42px;
	height: 42px;
	background-image: url("./../../../assets/images/login/logo-login.svg");
	background-size: 100% 100%;
}
.nav-header {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: left;
	font-size: #fff;
	background: #3c3d3f;
	.system-back-title {
		background-image: url("@/assets/images/home/system-back-title.png");
		display: inline-block;
		background-size: 100% 100%;
		margin-right: 35px;
		width: 80px;
		height: 40px;
		line-height: 40px;
		position: relative;
		cursor: pointer;
		// text-align: center;
		position: absolute;
        top: 12px;
		right: 70px;
		span {
			color: #00edff;
			font-family: "黑体 Bold", "黑体 Regular", "黑体", sans-serif;
			font-weight: 700;
			font-size: 25px;
			transition: all 0.3s ease-in 0s;
			white-space: nowrap;
			position: absolute;
			left: -9px;
		}
		span:hover {
			transform: scale(1.3);
			transition: all 0.3s ease-in;
		}
	}
	.avatar-container {
		margin-right: 10px;
		display: inline-block;
		position: absolute;
        top: 8px;
		right: 30px;
		.avatar-wrapper {
			margin-top: 5px;
			position: relative;

			.user-avatar {
				cursor: pointer;
				width: 40px;
				height: 40px;
				border-radius: 10px;
				background-image: url("@/assets/images/home/avatar.svg");
				background-size: 100% 100%;
			}
			.user-avatar:hover {
				background-image: url("@/assets/images/home/avatar_mouseOver.svg");
				background-size: 100% 100%;
			}

			i {
				cursor: pointer;
				position: absolute;
				right: -20px;
				top: 25px;
				font-size: 12px;
			}
		}
	}
	.nav-header-logo-icon {
		margin: 0 5px;
		width: 30px;
		height: 30px;
	}
	.nav-header-user-icon {
		margin-right: 4px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	:deep(.nav-header-user) {
		cursor: pointer;
		margin-right: 20px;
		margin-left: auto;
	}
	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
		display: flex;
		align-items: center;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
}

.nav-breadcrumb {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 20px;
}

.title {
	// background: #426ab3;
	color: #fff;
	font-size: 26px;
	font-weight: 700;
	text-align: left;
	line-height: 64px;
	padding-left: 20px;
}
</style>
