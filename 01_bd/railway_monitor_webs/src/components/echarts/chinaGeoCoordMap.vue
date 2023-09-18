<!-- 中国地图 -->
<template>
	<div
		:id="mapLineID ? 'mapLineID' : 'mapContainer'"
		:class="isShowControl ? '' : 'notShowControl'"
	></div>
</template>
<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { getMonitor, getFacilityTecSpec } from "@/api/display/display.js";
import { getMonitorById } from "@/api/simulationOverview/Overview.js";
import { getWarnLine } from "@/api/display/display.js";

let { proxy } = getCurrentInstance();
//riskGrade
const { risk_grade, WindStatus, RainStatus, FogStatus, SnowStatus } =
	proxy.useDict(
		"risk_grade",
		"WindStatus",
		"RainStatus",
		"FogStatus",
		"SnowStatus"
	);
let props = defineProps({
	chartData: {
		type: Array,
		default: [],
	},
	mapLineID: {
		type: String,
		default: "",
	},
	isShowControl: {
		type: Boolean,
		default: true,
	},
	isCheckPath: {
		type: Boolean,
		default: false,
	},
	showViewer: {
		type: Boolean,
		default: false,
	},
	geoCoordMap: {
		type: Object,
		default: {},
	},
	currentMoniter: {
		type: Object,
		default: {},
	},
	chinaDatas: {
		type: Array,
		default: [],
	},
	isMapOrSiteMap: {
		type: Boolean,
		default: true,
	},
	isShowInfoWindow: {
		type: Boolean,
		default: true,
	},
});
let emit = defineEmits([
	"handleLineClick",
	"handleCheckClick",
	"checkImg",
	"handleFzCheckClick",
]);
let warnLine = [];
let targetMap = null;
let disCountry = null;
let province = null;
let siteLayer = null;
let pathSimplifierIns = null;
let markerList = [];
let isShowInfoWindow = false;
let currentInfoWindowm = null;
let infoWindowData = null;
let trainPointInfoWindow = null;
let fileData = null;
let solidPolyLine = null;
let dashedPolyLine = null;
let endMarkerList = [];
let textLine = null;
let textList = [];
let lineList = [];
let viaMarkerList = [];
var colors = [
	"#34E0A8",
	"#EA4F0B",
	"#ff9900",
	"#109618",
	"#990099",
	"#0099c6",
	"#dd4477",
	"#66aa00",
	"#b82e2e",
	"#316395",
	"#994499",
	"#22aa99",
	"#aaaa11",
	"#6633cc",
	"#e67300",
	"#8b0707",
	"#651067",
	"#329262",
	"#5574a6",
	"#3b3eac",
];
watch(
	() => props.isMapOrSiteMap,
	(val) => {
		targetMap.remove(disCountry);
		targetMap.remove(province);
		targetMap.remove(siteLayer);
		if (props.isMapOrSiteMap) {
			// 非卫星地图加载样式
			targetMap.add(disCountry);
			targetMap.add(province);
		} else {
			targetMap.add(siteLayer);
		}
	}
);
//用户取消搜索后关闭弹框冲突  别删此代码
watch(
	() => props.currentMoniter,
	(val) => {
		if (val == null) {
			closeInfoWindow();
		}
	}
);
watch(
	() => props.chartData,
	() => {
		// if (!pathSimplifierIns) return;
		// pathSimplifierIns.setData();
		if (markerList.length) {
			targetMap.remove(markerList);
			targetMap.remove(lineList);
			targetMap.remove(textList);
			targetMap.remove(viaMarkerList);
			targetMap.remove(endMarkerList);
			if (trainPointInfoWindow) targetMap.remove(trainPointInfoWindow);
			refreshMapUI();
		}
	}
);
watch(
	() => props.isShowInfoWindow,
	(val) => {
		if (!val) {
			infoWindowData = null;
		}
	}
);
watch(
	() => props.showViewer,
	(val) => {
		if (!val) {
			fileData = null;
		}
	}
);
getWarnLine().then((res) => {
	warnLine = res.data;
});
function initMap() {
	// 配置安全密钥
	// window._AMapSecurityConfig = { securityJsCode: 'a8502bec0dd3180a49925c99c0e27572' };
	AMapLoader.load({
		key: import.meta.env.VITE_AMSP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
		// "version": "2.0",     // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		AMapUI: {
			plugins: [
				"misc/PathSimplifier",
				"overlay/SimpleMarker",
				"control/BasicControl",
			], //SimpleMarker设置自定义图标，PathSimplifier轨迹展示组件
		},
		plugins: [
			"AMap.Pixel",
			"AMap.MarkerClusterer",
			"AMap.DistrictSearch",
			"AMap.ToolBar",
			"AMap.DistrictLayer",
			"AMap.PlaceSearch",
			"AMap.AutoComplete",
		], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	}).then((AMap) => {
		targetMap = new AMap.Map(props.mapLineID ? "mapLineID" : "mapContainer", {
			// maxPitch: 60,
			// pitch: 10, //45 俯仰角
			// viewMode: '3D',
			zoom: 6,
			expandZoomRange: true,
			// zooms: [3, 10],
			mapStyle: "amap://styles/96866b90730665d461d33defc3eb7577", //地图主题
			// center: [116.397428, 39.90923],                 //中心点坐标
			rotation: 0, //顺时针旋转角度
			resizeEnable: true,
		});
		siteLayer = new AMap.TileLayer.Satellite();
		// AMap.plugin(["AMap.ControlBar"], function () {
		//   var bar = new AMap.ControlBar();
		//   targetMap.addControl(bar);
		// })
		AMap.plugin(["AMap.ToolBar"], function () {
			targetMap.addControl(new AMap.ToolBar());
		});
		// 创建图层
		AMap.plugin(["AMap.DistrictLayer"], function () {
			// var defaultLayer = new AMap.createDefaultLayer();
			disCountry = new AMap.DistrictLayer.Country({
				zIndex: 15,
				SOC: "CHN",
				depth: 0,
				styles: {
					"nation-stroke": "#bbdaf1",
					"coastline-stroke": "#bbdaf1",
					"province-stroke": "#bbdaf1",
					"city-stroke": "#bbdaf1",
					fill: "rgba(127,127,127,0.5)",
				},
			});
			province = new AMap.DistrictLayer.Province({
				zIndex: 20,
				depth: 0,
				styles: {
					"province-stroke": "#bbdaf1",
					"city-stroke": "#bbdaf1",
					fill: "#bbdaf1",
				},
			});
			// // disCountry 跟 defaultLayer 一定要搭配使用 不然只使用 disCountry 会导致不显示省市名称
			targetMap.add(disCountry);
			// targetMap.value.add(defaultLayer)
			targetMap.add(province);
		});
		refreshMapUI();
	});
}
// 定义黑白相间的线
function trainLine(data, lineName) {
	// 定义每条线路的名字
	let arr = props.isCheckPath ? data : data.path;
	let middlePoint = arr[Math.round((arr.length - 1) / 2)];
	textLine = new AMap.Text({
		text: props.isCheckPath ? lineName : data.lineName,
		map: targetMap,
		anchor: "center", // 设置文本标记锚点
		offset: new AMap.Pixel(30, 0),
		style: {
			"background-color": "transparent",
			"text-align": "center",
			"font-size": "12px",
			"font-weight": "bold",
			"border-width": 0,
			color: "#F56C6C",
		},
		position: middlePoint,
	});
	// 黑白相间轨迹
	solidPolyLine = new AMap.Polyline({
		map: targetMap,
		path: props.isCheckPath ? data : data.path,
		// showDir: true,
		// strokeColor: props.isCheckPath ? "#eee" : "#444", // 线颜色--浅蓝色 选中线的样式
		strokeColor: "#444", // 线颜色--浅蓝色
		// strokeOpacity: 1,     //线透明度
		strokeWeight: 5, // 线宽
		strokeStyle: "solid", //线样式
		lineJoin: "round", // 折线拐点的绘制样式
	});
	dashedPolyLine = new AMap.Polyline({
		map: targetMap,
		path: props.isCheckPath ? data : data.path,
		isOutline: true,
		// outlineColor: props.isCheckPath ? "#F56C6C" : "#444",
		outlineColor: "#444",
		// showDir: true,
		// strokeColor: props.isCheckPath ? "#F56C6C" : "#ddd", // 线颜色--浅蓝色
		strokeColor: "#ddd", // 线颜色--浅蓝色
		// strokeOpacity: 0.6,     //线透明度
		strokeWeight: 5, // 线宽
		strokeDasharray: [15, 15], //勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
		strokeStyle: "dashed", //线样式
		lineJoin: "round", // 折线拐点的绘制样式
	});
	if (!props.isCheckPath) {
		dashedPolyLine.setExtData({
			lineName: data.lineName,
			lineEnd: data.lineEnd,
			lineId: data.lineId,
			name: data.name,
			siteName: data.siteName,
			sitesNum: data.sitesNum,
		});
		dashedPolyLine.on("mouseover", (ev) => {
			// console.log(ev.target, "移入", ev);
			ev.target.setOptions({
				strokeColor: "#43F4FF", // 线颜色--浅蓝色
			});
		});
		dashedPolyLine.on("mouseout", (ev) => {
			ev.target.setOptions({
				strokeColor: "#ddd", // 线颜色--浅蓝色
			});
		});
		// 线的点击事件
		dashedPolyLine.on("click", (ev) => {
			if (!props.isShowControl) return;
			let pathData = ev.target.getExtData();
			emit("handleLineClick", pathData);
		});
	}
	solidPolyLine.setMap(targetMap);
	dashedPolyLine.setMap(targetMap);
	lineList.push(solidPolyLine);
	lineList.push(dashedPolyLine);
	textList.push(textLine);
}
// 设置站点
function trainPoint(data, siteNameArr) {
	let arr = props.isCheckPath ? data : data.path;
	let pointEndArr = [];
	let pointArr = arr.filter((val, index, arr) => {
		return index != 0 && index != arr.length - 1;
	});

	if (!props.isCheckPath) {
		pointEndArr = arr.filter((val, index, arr) => {
			return index == arr.length - 1;
		});
	}
	// console.log(data, "站点", pointArr);
	if (pointEndArr && pointEndArr.length) {
		// 创建一个 icon
		let endIcon = new AMap.Icon({
			size: new AMap.Size(25, 34),
			image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
			imageSize: new AMap.Size(135, 40),
			imageOffset: new AMap.Pixel(-95, -3),
		});
		// 将 icon 传入 marker
		let endMarker = new AMap.Marker({
			position: new AMap.LngLat(pointEndArr[0].lng, pointEndArr[0].lat),
			icon: endIcon,
			offset: new AMap.Pixel(-13, -30),
		});
		targetMap.add(endMarker);
		endMarkerList.push(endMarker);
	}
	pointArr.forEach((val, index) => {
		let viaMarker = new AMap.Marker({
			position: val,
			// 将一张图片的地址设置为 icon
			icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png",
			// 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
			offset: new AMap.Pixel(-10, -30),
		});
		// --站点不展示--
		// viaMarker.setExtData({
		// 	index,
		// 	lineStart: data.name,
		// 	lineEnd: data.lineEnd,
		// 	siteName: props.isCheckPath
		// 		? siteNameArr[index + 1]
		// 		: data.siteNameArr[index + 1],
		// });
		// targetMap.add(viaMarker);
		// viaMarkerList.push(viaMarker);
		// viaMarker.on("mouseover", (ev) => {
		// 	// console.log(ev.target, ev.target.getExtData(), "移入", ev);
		// 	let info = [];
		// 	info.push(
		// 		"<div style='background: #eee;padding: 0px 5px;font-size: 13px'>"
		// 	);
		// 	info.push(`<p>${ev.target.getExtData().siteName}</p></div>`);
		// 	trainPointInfoWindow = new AMap.InfoWindow({
		// 		isCustom: true, //使用自定义窗体
		// 		anchor: "middle-left",
		// 		offset: new AMap.Pixel(10, -10),
		// 		content: info.join(""), //使用默认信息窗体框样式，显示信息内容
		// 	});
		// 	trainPointInfoWindow.open(targetMap, val);
		// });
		// viaMarker.on("mouseout", (ev) => {
		// 	trainPointInfoWindow.close();
		// });
	});
	// 地图缩放到合适级别
	// targetMap.setFitView();
	// 将 markers 添加到地图
	// viaMarker.dom.classList.add('amsp-pass-icon') //添加样式类
}
function refreshMapUI() {
	AMapUI.loadUI(
		["overlay/SimpleMarker", "control/BasicControl"],
		function (SimpleMarker, BasicControl) {
			let zoomCtrl2 = new BasicControl.Zoom({
				position: "br",
			});
			targetMap.addControl(zoomCtrl2);
			// console.log(props.chartData, "chartData", props.isCheckPath);
			if (!props.isCheckPath) {
				props.chartData.forEach((item, index) => {
					if (item.path[0][0] != null && item.path[0][1] != null) {
						let marker = new SimpleMarker({
							//自定义图标地址
							iconStyle: {
								src: new URL(
									"./../../assets/images/display/u123.png",
									import.meta.url
								).href, //网络地址路径，本地不行
								style: {
									width: "80px",
									height: "80px",
								},
							},
							label: {
								content: `<div style="background: #737373;padding: 5px 10px;display:flex;align-items:center;box-shadow: 3px 3px 36px #7FD5D5, -3px -3px 36px #7FD5D5;">
                  <img src="${
										new URL(
											"./../../assets/images/display/u126.svg",
											import.meta.url
										).href
									}" alt="" srcset="">
                  <span style="margin-left:5px;color:#D5D5D5">${
										item.name
									}</span>
                </div>`,
							},
							//设置基点偏移
							offset: new AMap.Pixel(0, 0),
							anchor: "center",
							map: targetMap,
							showPositionPoint: false,
							position: item.path[0],
							zIndex: 100,
							containerClassNames: "center-dot-class",
						});
						markerList.push(marker);
						// 绘制路线
						trainLine(item);
						// 绘制站点
						trainPoint(item);
					}
				});
				warnLine.forEach((item) => {
					let srcUrl; // 点样式
					let centerUrl; // 点中间样式
					let borderColor;
					let siteClass;
					// 预警
					srcUrl = new URL(
						"./../../assets/images/display/warning.png",
						import.meta.url
					).href;
					centerUrl = new URL(
						"./../../assets/images/display/warning-center.svg",
						import.meta.url
					).href;
					borderColor = "rgba(216, 30, 6, 0.7)";
					siteClass = 0;

					let rippleLittleUrl = new URL(
						"./../../assets/images/display/ripple-little.svg",
						import.meta.url
					).href;
					let rippleLargeUrl = new URL(
						"./../../assets/images/display/ripple-large.svg",
						import.meta.url
					).href;

					let htmltemplate = ``;
					// 	if (item.warn == 1 || item.isShow == 0) {
					// 		htmltemplate = siteClass
					// 			? `<div><img class="center-dot-check-img-class " style="width:35px;height:35px" src='${srcUrl}' /></div>`
					// 			: `<div style="display: flex;  align-items: center;flex-direction: column;position:relative">
					//   <img class="center-dot-check-img-class" style="width:35px;height:35px" src='${srcUrl}' />
					//   <div class="ripple-class">
					//     <span style="--i:1;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
					//     <span style="--i:2;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
					//   </div>
					// </div>`;
					// 	} else {
					htmltemplate = siteClass
						? `<div><img  style="width:35px;height:35px" src='${srcUrl}' /></div>`
						: `<div style="display: flex;  align-items: center;flex-direction: column;position:relative">
                <img  style="width:35px;height:35px" src='${srcUrl}' />
                <div class="ripple-class">
                  <span style="--i:1;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                  <span style="--i:2;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                </div>
              </div>`;
					let marker = new SimpleMarker({
						iconStyle: htmltemplate,
						label: {
							content: siteClass
								? `<div style="background: #737373;padding: 5px 10px;display:flex;align-items:center;box-shadow: 1px 1px 26px #7FD5D5, -1px -1px 26px #7FD5D5">
                    <img src="${
											new URL(
												"./../../assets/images/display/u126.svg",
												import.meta.url
											).href
										}" alt="" srcset="">
                    <span style="margin-left:5px;color:#D5D5D5">${
											item.name
										}</span>
                  </div>`
								: "",
						},
						//设置基点偏移
						offset: new AMap.Pixel(0, 0),
						anchor: "center",
						map: targetMap,
						showPositionPoint: false,
						position: [item.lon, item.lat],
						zIndex: 100,
						containerClassNames: siteClass ? "" : "center-dot-check-class",
					});

					marker.setExtData(item);
					if (
						props.currentMoniter &&
						props.currentMoniter.monitorId == item.id
					) {
						markerClick(item, marker);
					}
					// 给marker添加点击事件
					marker.on("click", (e) => {
						if (siteClass) return; // 站点不可点击
						markerClick(e, marker);
					});
					markerList.push(marker);
				});
			} else {
				// console.log(props.chartData, "第二个");
				// console.log(props.chartData[0].points)
				// console.log("走了吗");
				props.chartData.forEach((val) => {
					// 绘制路线
					trainLine(val.trainstatilist, val.lineName);
					// trainPoint(val.trainstatilist, val.stationlist);
					if (val.points && val.points.length) {
						val.points.forEach((item, index) => {
							if (item.lnglat[0] != null && item.lnglat[1] != null) {
								let srcUrl; // 点样式
								let centerUrl; // 点中间样式
								let borderColor;
								let siteClass;
								if (item.warn == 1 || item.isShow == 0) {
									// 预警
									srcUrl = new URL(
										"./../../assets/images/display/warning.png",
										import.meta.url
									).href;
									centerUrl = new URL(
										"./../../assets/images/display/warning-center.svg",
										import.meta.url
									).href;
									borderColor = "rgba(216, 30, 6, 0.7)";
									siteClass = 0;
								} else if (item.abnormal == 1) {
									// 异常
									srcUrl = new URL(
										"./../../assets/images/display/abnormal.svg",
										import.meta.url
									).href;
									centerUrl = new URL(
										"./../../assets/images/display/abnormal-center.svg",
										import.meta.url
									).href;
									borderColor = "rgba(194, 194, 194, 0.7)";
									siteClass = 0;
								} else if (item.grade == "1" || item.isShow == 1) {
									// 关键监测点
									srcUrl = new URL(
										"./../../assets/images/display/grade-point.svg",
										import.meta.url
									).href;
									centerUrl = new URL(
										"./../../assets/images/display/grade-point-center.svg",
										import.meta.url
									).href;
									borderColor = "rgba(196, 221, 42, 0.7)";
									siteClass = 0;
								} else if (item.normal == 1) {
									// 正常、在线
									srcUrl = new URL(
										"./../../assets/images/display/online.png",
										import.meta.url
									).href;
									centerUrl = new URL(
										"./../../assets/images/display/online-center.svg",
										import.meta.url
									).href;
									borderColor = "rgba(15, 252, 207, 0.7)";
									siteClass = 0;
								} else {
									// "/assets/images/display/train.svg",
									srcUrl = new URL(
										"./../../assets/images/display/train.svg",
										import.meta.url
									).href;
									siteClass = 1;
								}
								let rippleLittleUrl = new URL(
									"./../../assets/images/display/ripple-little.svg",
									import.meta.url
								).href;
								let rippleLargeUrl = new URL(
									"./../../assets/images/display/ripple-large.svg",
									import.meta.url
								).href;

								let htmltemplate = ``;
								if (item.warn == 1 || item.isShow == 0) {
									htmltemplate = siteClass
										? `<div><img class="center-dot-check-img-class " style="width:35px;height:35px" src='${srcUrl}' /></div>`
										: `<div style="display: flex;  align-items: center;flex-direction: column;position:relative">
                <img class="center-dot-check-img-class" style="width:35px;height:35px" src='${srcUrl}' />
                <div class="ripple-class">
                  <span style="--i:1;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                  <span style="--i:2;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                </div>
              </div>`;
								} else {
									htmltemplate = siteClass
										? `<div><img  style="width:35px;height:35px" src='${srcUrl}' /></div>`
										: `<div style="display: flex;  align-items: center;flex-direction: column;position:relative">
                <img  style="width:35px;height:35px" src='${srcUrl}' />
                <div class="ripple-class">
                  <span style="--i:1;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                  <span style="--i:2;background-image: radial-gradient(rgba(69, 65, 70, 0.5) 35%, ${borderColor})"></span>
                </div>
              </div>`;
								}
								let marker = new SimpleMarker({
									iconStyle: htmltemplate,
									label: {
										content: siteClass
											? `<div style="background: #737373;padding: 5px 10px;display:flex;align-items:center;box-shadow: 1px 1px 26px #7FD5D5, -1px -1px 26px #7FD5D5">
                    <img src="${
											new URL(
												"./../../assets/images/display/u126.svg",
												import.meta.url
											).href
										}" alt="" srcset="">
                    <span style="margin-left:5px;color:#D5D5D5">${
											item.name
										}</span>
                  </div>`
											: "",
									},
									//设置基点偏移
									offset: new AMap.Pixel(0, 0),
									anchor: "center",
									map: targetMap,
									showPositionPoint: false,
									position: item.lnglat,
									zIndex: 100,
									containerClassNames: siteClass
										? ""
										: "center-dot-check-class",
								});

								marker.setExtData(item);
								//自定义图标地址
								// iconStyle: {
								//   src: srcUrl,//网络地址路径，本地不行
								//   style: {
								//     width: '35px',
								//     height: '35px'
								//   }
								// },
								//设置节点属性
								// iconLabel: {
								//   //html
								//   innerHTML: `<div class="my-blue-point"><img style="width:25px;height:25px" src='${centerUrl}' /></div>`,
								//   style: {
								//     width: '25px',
								//     height: '25px',
								//     borderRadius: '50%',
								//     top: '-8px',
								//     background: 'rgba(15, 255,207, 0.9)'
								//   }
								// },
								// 自动触发marker点击事件
								if (
									props.currentMoniter &&
									props.currentMoniter.monitorId == item.id
								) {
									markerClick(item, marker);
								}
								// console.log(props.currentMoniter, 'currentMoniter', item)
								// 给marker添加点击事件
								marker.on("click", (e) => {
									if (siteClass) return; // 站点不可点击
									markerClick(e, marker);
								});
								markerList.push(marker);
							}
						});
					}
				});
			}
		}
	);
}
// 详情中marker点击事件
const markerClick = async (e, marker) => {
	if (!props.isShowControl) return;
	let data = e.target ? e.target.getExtData() : e;
	if (currentInfoWindowm && data.id != currentInfoWindowm.id) {
		closeInfoWindow();
		isShowInfoWindow = false;
	}

	if (!isShowInfoWindow) {
		// 外层地图
		if (data.lineId) {
			let res = await getMonitor({
				// monitorId: data.lineId,
				monitorId: 122,
			});
			if (res.code == 200) {
				let infoName = "";
				let fontColor = "";
				// 预警
				infoName = "预警";
				fontColor = "#D81E06";
				let infoWindow = createInfoWindow(
					res.data,
					infoName,
					fontColor,
					data.lineId
				);
				openInfoWindow(infoWindow, marker);
			} else {
				closeInfoWindow();
			}
		}
		if (data.id == undefined) return;
		let res;
		if (data.isShow == 0 || data.isShow == 1) {
			res = await getMonitorById(data.id);
		} else {
			res = await getMonitor({
				monitorId: data.id,
			});
		}

		if (res.code == 200) {
			let infoName = "";
			let fontColor = "";
			if (data.warn == 1) {
				// 预警
				infoName = "预警";
				fontColor = "#D81E06";
			} else if (data.abnormal == 1) {
				// 异常
				infoName = "异常";
				fontColor = "#C2C2C2";
			} else if (data.grade == "1") {
				// 关键监测点
				infoName = "关键监测点";
				fontColor = "#C4DD2A";
			} else if (data.normal == 1) {
				// 正常、在线
				infoName = "在线";
				fontColor = "#0FFCCF";
			} else if (data.isShow == 1) {
				infoName = "未发布";
				fontColor = "#0FFCCF";
			} else if (data.isShow == 0) {
				infoName = "已发布";
				fontColor = "#D81E06";
			}
			let infoWindow = createInfoWindow(res.data, infoName, fontColor, data.id);
			openInfoWindow(infoWindow, marker);
		}
		currentInfoWindowm = data;
	} else {
		closeInfoWindow();
	}
};
//构建自定义窗体
function createInfoWindow(data, infoName, fontColor, monitorId) {
	var infoWindowData = new AMap.InfoWindow({
		isCustom: true, //使用自定义窗体
		content: getContent(data, infoName, fontColor, monitorId),
		offset: new AMap.Pixel(16, -45),
	});
	return infoWindowData;
}
// 处理经纬度
function lonAndLat(data) {
	let str = data.toString().split(".");
	return str[0] + "°" + (str[1] ? str[1] + "′" : "");
}
//处理窗体内容
function getContent(data, infoName, fontColor, monitorId) {
	// console.log(data, "data");
	let content;
	if (data.isShow == 0 || data.isShow == 1) {
		content = `<div class="info-window-class">
      <div class="info-window-content-class">
        <span>监测点名称 - ${data.monitoringPointName}</span>
        <span style="color: ${fontColor};font-weight:bolder">${infoName}</span>
      </div>
      <div class="info-window-content-class">
        <span>经度<span style="margin: 0 15px 0 5px">${lonAndLat(
					data.lon
				)}</span>纬度<span style="margin: 0 8px">${lonAndLat(
			data.lat
		)}</span></span>
      </div>
      <div class="info-window-content-fz-class">
        <p style="color: #D6D6D6;font-size: 15px">图像增强模型</p>
        <p style="color: #058E8A;font-size: 13px">${
					data.imageEnhance || " "
				}</p>
        <p style="color: #D6D6D6;font-size: 15px">场景分析模型</p>
        <p style="color: #058E8A;font-size: 13px">${
					data.sceneAnalysis || " "
				}</p>
        <p style="color: #D6D6D6;font-size: 15px">场景分割模型</p>
        <p style="color: #058E8A;font-size: 13px">${
					data.sceneDivision || " "
				}</p>
        <p style="color: #D6D6D6;font-size: 15px">材质识别模型</p>
        <p style="color: #058E8A;font-size: 13px">${
					data.materialQuality || " "
				}</p>
      </div>
      <div class="btn-info-window" onclick="handleCheck('${infoName}',${monitorId})">查看详情</div>
   </div>`;
	} else {
		let weatherImg = new URL(
			"./../../assets/images/display/u693.svg",
			import.meta.url
		).href;
		content = `<div class="info-window-class">
      <div class="info-window-content-class">
        <span>${data.lineName}</span>
        <span style="color: ${fontColor};font-weight:bolder">${infoName}</span>
      </div>
      <div class="info-window-content-class">
        <span style="display:flex;align-items:center">
          <img src="${weatherImg}"/>
          <span style="white-space:nowrap">
            <span style="margin-left:5px" v-show="${
							data.windStatus !== undefined || data.windStatus !== null
						}">${formatterWeather(data.windStatus, "wind")}</span>
            <span style="margin-left:5px" v-show="${
							data.rainStatus !== undefined || data.rainStatus !== null
						}">${formatterWeather(data.rainStatus, "rain")}</span>
            <span style="margin-left:5px" v-show="${
							data.fogStatus !== undefined || data.fogStatus !== null
						}">${formatterWeather(data.fogStatus, "fog")}</span>
            <span style="margin-left:5px" v-show="${
							data.snowStatus !== undefined || data.snowStatus !== null
						}">${formatterWeather(data.snowStatus, "snow")}</span>
          </span>
        </span>
        <span style="margin-left: 15px"> E<span style="margin: 0 15px 0 2px">${lonAndLat(
					data.lon
				)}</span>N<span style="margin: 0 5px">${lonAndLat(
			data.lat
		)}</span></span>
    </div>
    <div class="info-window-content-class">
      <span>监控摄像头</span>
      <span>${data.facility_model ? data.facility_model : ""}</span>
      <span style="cursor:pointer" onclick="getFacilityTecSpecData(${
				data.facilityId
			})">技术参数</span>
    </div>
    <div class="info-window-temp-class">
      <div>
        <span>风险等级</span><span>${data.riskGrade}</span>
      </div>
      <div>
        <span>误报率</span><span>${
					data.monitorMisinf ? data.monitorMisinf : 0
				}%</span>
      </div>
        <div>
          <span>异物侵限</span><span>${data.contaLimitNum || " "}</span>
        </div>
      </div>
      <div class="btn-info-window" onclick="handleCheck('${infoName}',${monitorId})">查看详情</div>
   </div>`;
	}
	return content;
}

// formatterRiskGrade data.risk 改成传值
//打开窗体
function openInfoWindow(infoWindow, marker) {
	infoWindow.open(targetMap, marker.getPosition());
	isShowInfoWindow = true;
}
//关闭窗体
function closeInfoWindow() {
	targetMap.clearInfoWindow();
	isShowInfoWindow = false;
}
// 查看技术参数
window.getFacilityTecSpecData = (id) => {
	getFacilityTecSpec({
		facilityId: id,
	}).then((res) => {
		// console.log(res, "res");
		fileData = res.data;
		emit("checkImg", fileData);
	});
};

// 查看详情
window.handleCheck = (infoName, monitorId) => {
	if (infoName == "预警") {
		infoWindowData = {
			monitorId,
			facilityState: "warn",
		};
		emit("handleCheckClick", infoWindowData);
	} else if (infoName == "异常") {
		infoWindowData = {
			monitorId,
			facilityState: "abnormal",
		};
		emit("handleCheckClick", infoWindowData);
	} else if (infoName == "关键监测点") {
		infoWindowData = {
			monitorId,
			facilityState: "grade",
		};
		emit("handleCheckClick", infoWindowData);
	} else if (infoName == "在线") {
		infoWindowData = {
			monitorId,
			facilityState: "normal",
		};
		emit("handleCheckClick", infoWindowData);
	} else if (infoName == "已发布" || infoName == "未发布") {
		infoWindowData = {
			monitorId,
		};
		console.log(infoName, "handleFzCheckClickhandleFzCheckClick");
		emit("handleFzCheckClick", infoWindowData);
	}
};
// 格式化风险等级
const formatterRiskGrade = (val) => {
	console.log(val, "quanbu");
	// riskGrade
	let result = risk_grade.value.find((item) => item.value == val);
	if (result) {
		return result.label;
	} else {
		return "";
	}
};
// 格式化天气
const formatterWeather = (val, type) => {
	// 风
	if (type == "wind") {
		let result = WindStatus.value.find((item) => item.value == val);
		if (result) {
			return result.label;
		} else {
			return "";
		}
	}
	// 雨
	if (type == "rain") {
		let result = RainStatus.value.find((item) => item.value == val);
		if (result) {
			return result.label;
		} else {
			return "";
		}
	}
	// 雾
	if (type == "fog") {
		let result = FogStatus.value.find((item) => item.value == val);
		if (result) {
			return result.label;
		} else {
			return "";
		}
	}
	// 雪
	if (type == "snow") {
		let result = SnowStatus.value.find((item) => item.value == val);
		if (result) {
			return result.label;
		} else {
			return "";
		}
	}
};
onMounted(() => {
	setTimeout(() => {
		initMap();
	}, 1000);
});
//关闭窗体
const expcloseInfoWindow = () => {
	closeInfoWindow();
};
defineExpose({ expcloseInfoWindow });
</script>
<style scoped lang="scss">
#mapContainer :deep(.amap-controlbar-zoom) {
	// background: none !important;
}
#mapContainer :deep(.amap-controlbar),
#mapLineID :deep(.amap-controlbar) {
	top: 0 !important;
	right: 5px !important;
}
#mapContainer :deep(.amap-toolbar),
#mapLineID :deep(.amap-toolbar) {
	top: 0 !important;
	right: 30px !important;
	left: auto !important;
}
#mapContainer :deep(.amap-ui-control-position-br),
#mapLineID :deep(.amap-ui-control-position-br) {
	top: 60px !important;
	right: 40px;
	bottom: auto;
}
#mapContainer :deep(.amap-ui-control-zoom a),
#mapLineID :deep(.amap-ui-control-zoom a) {
	background: transparent !important;
	color: #fff;
	border-bottom: none;
}
#mapContainer :deep(.amap-ui-control-zoom),
#mapLineID :deep(.amap-ui-control-zoom) {
	border: none;
}
/* //去掉高德地图logo */
#mapContainer :deep(.amap-logo),
#mapContainer :deep(.amap-locate),
#mapContainer :deep(.amap-zoomcontrol),
#mapLineID :deep(.amap-logo),
#mapLineID :deep(.amap-locate),
#mapLineID :deep(.amap-zoomcontrol) {
	display: none !important;
}
/* //去掉高德的版本号 */
#mapContainer :deep(.amap-copyright),
#mapLineID :deep(.amap-copyright) {
	opacity: 0 !important;
}
#mapContainer :deep(.center-dot-class img),
#mapLineID :deep(.center-dot-class img) {
	animation: rotatePercent 1s linear infinite;
	animation-delay: calc(var(--i) * 0.5s);
}
#mapContainer :deep(.center-dot-check-class .center-dot-check-img-class),
#mapLineID :deep(.center-dot-check-class .center-dot-check-img-class) {
	animation: rotatePercentCheck 1s linear infinite;
	animation-delay: calc(var(--i) * 0.5s);
}
#mapContainer :deep(.ripple-class),
#mapLineID :deep(.ripple-class) {
	width: 100px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}
#mapContainer :deep(.ripple-class span),
#mapLineID :deep(.ripple-class span) {
	position: absolute;
	box-sizing: border-box;
	border-radius: 50%;
	animation: animate 3s linear infinite;
	animation-delay: calc(1s * var(--i));
}
.updownmove {
	animation: rotatePercentCheck 1s linear infinite;
	animation-delay: calc(var(--i) * 0.5s);
}
// @keyframes animate {
//   0% {
//     width: 0;
//     height: 0;
//   }

//   50% {
//     opacity: 1;
//   }

//   100% {
//     width: 100px;
//     height: 70px;
//     opacity: 0;
//   }
// }
// @keyframes rotatePercent {
//   0% {
//     transform: translateY(-5px);
//     filter: hue-rotate(180deg);
//     /* hue-rotate 色彩转换传递的参数为角度，
// 		该角度指向的颜色圆盘上的颜射就是当前显示的颜色 */
//   }
//   50% {
//     transform: translateY(0px);
//   }
//   100% {
//     transform: translateY(-5px);
//   }
// }
@keyframes rotatePercentCheck {
	0% {
		transform: translateY(-5px);
	}
	50% {
		transform: translateY(0px);
	}
	100% {
		transform: translateY(-5px);
	}
}
#mapContainer :deep(.amap-marker-label),
#mapLineID :deep(.amap-marker-label) {
	padding: 0;
	border: none;
	top: -40px !important;
	left: 5px !important;
}
.notShowControl :deep(.amap-pancontrol),
.notShowControl :deep(.amap-ui-control-zoom) {
	display: none !important;
}
#mapContainer :deep(.info-window-class),
#mapLineID :deep(.info-window-class) {
	// background: #363636;
	// box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
	// padding: 10px;
	min-width: 280px;
	color: #fefefe;
	font-size: 13px;
}
#mapContainer :deep(.info-window-class .info-window-content-class),
#mapLineID :deep(.info-window-class .info-window-content-class) {
	display: flex;
	align-items: center;
	padding: 10px;
	background: #353535;
	margin-bottom: 7px;
	justify-content: space-between;
	box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
}
#mapContainer :deep(.info-window-class .info-window-content-class:nth-child(3)),
#mapLineID :deep(.info-window-class .info-window-content-class:nth-child(3)) {
	font-size: 12px;
}
#mapContainer
	:deep(.info-window-class
		.info-window-content-class:nth-child(1)
		span:nth-child(2)),
#mapLineID
	:deep(.info-window-class
		.info-window-content-class:nth-child(1)
		span:nth-child(2)) {
	color: #ec453b;
	font-weight: bold;
}
#mapContainer
	:deep(.info-window-class
		.info-window-content-class:nth-child(3)
		span:nth-child(3)),
#mapLineID
	:deep(.info-window-class
		.info-window-content-class:nth-child(3)
		span:nth-child(3)) {
	color: #00edff;
	font-weight: bold;
}
#mapContainer :deep(.info-window-class .info-window-temp-class),
#mapLineID :deep(.info-window-class .info-window-temp-class) {
	display: flex;
	align-items: center;
	margin-bottom: 7px;
	justify-content: space-between;
}
#mapContainer :deep(.info-window-class .info-window-temp-class > div),
#mapLineID :deep(.info-window-class .info-window-temp-class > div) {
	box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
	padding: 10px;
	background: #353535;
	display: flex;
	flex: 1;
	height: 60px;
	flex-direction: column;
	align-items: center;
	font-weight: bold;
}
#mapContainer :deep(.info-window-content-fz-class),
#mapLineID :deep(.info-window-content-fz-class) {
	box-shadow: 3px 3px 6px #909399, -3px -3px 6px #909399;
	padding: 1px 10px;
	margin-bottom: 7px;
	background: #353535;
}
#mapContainer
	:deep(.info-window-class .info-window-temp-class > div:nth-child(2)),
#mapLineID
	:deep(.info-window-class .info-window-temp-class > div:nth-child(2)) {
	margin-left: 10px;
}
#mapContainer
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(1)
		span:nth-child(2)),
#mapLineID
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(1)
		span:nth-child(2)) {
	margin-top: 5px;
	color: #ec453b;
}
#mapContainer
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(2)
		span:nth-child(2)),
#mapLineID
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(2)
		span:nth-child(2)) {
	font-size: 16px;
	margin-top: 5px;
}
#mapContainer
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(3)
		span:nth-child(2)),
#mapLineID
	:deep(.info-window-class
		.info-window-temp-class
		> div:nth-child(3)
		span:nth-child(2)) {
	font-size: 16px;
	margin-top: 5px;
	color: #00edff;
}
#mapContainer
	:deep(.info-window-class .info-window-temp-class > div:nth-child(3)),
#mapLineID
	:deep(.info-window-class .info-window-temp-class > div:nth-child(3)) {
	margin-left: 10px;
}
#mapContainer :deep(.info-window-class .btn-info-window),
#mapLineID :deep(.info-window-class .btn-info-window) {
	text-align: center;
	padding: 10px;
	background: #353535;
	color: #00edff;
	cursor: pointer;
}
:deep(.amap-icon img) {
	width: 20px;
	height: 29px;
}
</style>
