<template>
	<div class="menu">
		<div class="menu-header">
			<el-row class="tac">
				<el-col :span="12">
					<!-- <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        router
                    >
                        <el-menu-item index="/SimLayout/layout/mapManageL/mapConfig">
                            <i class="el-icon-menu"></i>
                            <span>地图配置</span>
                        </el-menu-item>
                        <el-menu-item index="/SimLayout/layout/mapManageL/Monitoring">
                            <i class="el-icon-document"></i>
                            <span>监测点组件</span>
                        </el-menu-item>
                    </el-menu> -->
					<el-menu
						:collapse="isCollapse"
						:uniqueOpened="true"
						default-active="1"
						class="el-menu-vertical-demo"
						@open="handleOpen"
						@close="handleClose"
						background-color="#545c64"
						text-color="#fff"
						active-text-color="#ffd04b"
						router
					>
						<template v-for="menu in menus">
							<template v-if="menu.children.length > 0">
								<el-sub-menu :index="menu.path" :key="menu.id">
									<template #title>
										<i :class="menu.icon ? menu.icon : defaultIcon"></i>
										<span>{{ menu.meta.title }}</span>
									</template>
									<template v-for="subItem in menu.children">
										<el-sub-menu
											v-if="subItem.children.length > 0"
											:index="subItem.path"
											:key="subItem.id"
										>
											<template #title>
												<span>{{ subItem.meta.title }}</span>
											</template>
											<el-menu-item
												class="innerItem"
												v-for="(threeItem, i) in subItem.children"
												:key="i"
												:index="threeItem.path"
											>
												<template #title>{{ threeItem.meta.title }}</template>
											</el-menu-item>
										</el-sub-menu>
										<el-menu-item
											v-else
											:index="subItem.path"
											:key="subItem.id"
										>
											<i :class="subItem.icon ? subItem.icon : defaultIcon"></i>
											<template #title>{{ subItem.meta.title }}</template>
										</el-menu-item>
									</template>
								</el-sub-menu>
							</template>
							<template v-else>
								<el-menu-item :index="menu.path" :key="menu.id">
									<i :class="menu.icon ? menu.icon : defaultIcon"></i>
									<template #title>{{ menu.meta.title }}</template>
								</el-menu-item>
							</template>
						</template>
					</el-menu>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup>
import store from "@/store";
import { ref, computed } from "vue";
// import img_log from '../../../../src/assets/logo.png'
const isCollapse = ref(false);
const defaultIcon = ref("el-icon-menu");
// const menus = store.state.user.menu
// console.log('菜单信息', store.state.user.menu)
const menus = [
	{
		path: "/SimLayout/layout/mapManageL/mapConfig",
		component: () => import("@/views/compManage/mapConfig/mapConfig"),
		name: "mapConfig",
		meta: { title: "地图配置", icon: "dashboard", affix: true },
		children: [],
	},
	{
		path: "/SimLayout/layout/mapManageL/monitoring",
		component: () => import("@/views/compManage/Monitoring/Monitoring"),
		name: "monitoring",
		meta: { title: "监测点组件", icon: "dashboard", affix: true },
		children: [],
	},
	{
		path: "/SimLayout/layout/mapManageL/equitComp",
		component: () => import("@/views/equitComp/equitComp"),
		name: "equitComp",
		meta: { title: "设备组件", icon: "dashboard", affix: true },
		children: [
			{
				path: "/SimLayout/layout/mapManageL/equitComp/meteorological",
				component: () =>
					import("@/views/equitComp/meteorological/meteorological"),
				name: "meteorological",
				meta: { title: "气象监测设备", icon: "dashboard", affix: true },
				children: [],
			},
			{
				path: "/SimLayout/layout/mapManageL/equitComp/foreignBody",
				component: () => import("@/views/equitComp/foreignBody/foreignBody"),
				name: "foreignBody",
				meta: { title: "异物监测设备", icon: "dashboard", affix: true },
				children: [],
			},
		],
	},
	{
		path: "/SimLayout/layout/mapManageL/sceneLibrary",
		component: () => import("@/views/sceneLibrary/sceneLibrary"),
		name: "sceneLibrary",
		meta: { title: "情景库组件", icon: "dashboard", affix: true },
		children: [
			{
				path: "/SimLayout/layout/mapManageL/sceneLibrary/foreignBody",
				component: () => import("@/views/sceneLibrary/foreignBody/foreignBody"),
				name: "foreignBody",
				meta: { title: "异物组态库管理", icon: "dashboard", affix: true },
				children: [],
			},
			{
				path: "/SimLayout/layout/mapManageL/sceneLibrary/scenario",
				component: () => import("@/views/sceneLibrary/scenario/scenario"),
				name: "scenario",
				meta: { title: "场景组态库管理", icon: "dashboard", affix: true },
				children: [],
			},
			{
				path: "/SimLayout/layout/mapManageL/sceneLibrary/environment",
				component: () => import("@/views/sceneLibrary/environment/environment"),
				name: "environment",
				meta: { title: "环境组态库管理", icon: "dashboard", affix: true },
				children: [],
			},
		],
	},
	{
		path: "/SimLayout/layout/mapManageL/monitoring",
		component: () => import("@/views/compManage/Monitoring/Monitoring"),
		name: "monitoring",
		meta: { title: "策略组件", icon: "dashboard", affix: true },
		children: [],
	},
	{
		path: "/SimLayout/layout/mapManageL/monitoring",
		component: () => import("@/views/compManage/Monitoring/Monitoring"),
		name: "monitoring",
		meta: { title: "评价组件", icon: "dashboard", affix: true },
		children: [],
	},
];

const handleOpen = (key, keyPath) => {
	console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
	console.log(key, keyPath);
};
</script>

<style lang="less" scoped>
.menu {
	background: #3c3d3f;
	width: 100%;
	height: 100%;
	color: #bfcbd9;
	.menu-header {
		width: 100%;
		height: 100%;
		position: relative;
		background: #3c3d3f;
		display: flex;
		align-items: center;
		box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
		flex-direction: column;
		img {
			margin: 0 5px;
			width: 30px;
			height: 30px;
		}
	}
}
:deep(.el-sub-menu__title) {
	color: #bfcbd9 !important;
	background: #3c3d3f !important;
	font-size: 14px;
	padding-left: 46px !important;
}
:deep(.el-sub-menu__icon-arrow) {
	font-size: 14px;
}

:deep(.el-icon-arrow-down) {
	background: #3c3d3f;
}
:deep(.el-sub-menu) {
	width: 201px !important;
}
:deep(.el-menu-item) {
	color: #bfcbd9;
	background: #3c3d3f;

	font-size: 14px;
	width: 201px !important;
}
:deep(.el-menu-item):hover {
	background: rgb(48, 49, 50) !important;
}
:deep(.el-sub-menu):hover {
	background: rgb(48, 49, 50) !important;
}
.el-menu {
	height: 100%;
	background: #3c3d3f;
}
.el-menu-button {
	padding-top: 20px;
	text-align: center;
}

.el-menu--collapse {
	height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 201px;
	text-align: left;
	height: calc(100% - 120px);
}

.el-icon-arrow-down {
	font-size: 12px;
}

.version {
	width: 100%;
	position: absolute;
	bottom: 0px;
	color: #fff;
	text-align: center;
}

.logo {
	margin-top: 20px;
}
</style>
