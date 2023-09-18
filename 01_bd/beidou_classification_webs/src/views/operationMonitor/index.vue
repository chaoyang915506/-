<template>
    <div class="app-box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="服务器1" name="服务器1"
        ><Page
          :tab="data.tab"
          :monitorStatistics="data.monitorStatistics"
        ></Page
      ></el-tab-pane>
      <el-tab-pane label="服务器2" name="服务器2"
        ><Page
          :tab="data.tab"
          :monitorStatistics="data.monitorStatistics"
        ></Page
      ></el-tab-pane>
      <el-tab-pane label="服务器3" name="服务器3"
        ><Page
          :tab="data.tab"
          :monitorStatistics="data.monitorStatistics"
        ></Page
      ></el-tab-pane> -->
            <el-tab-pane label="北斗卡二专用链路" name="北斗卡二专用链路"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="北斗卡三专用链路" name="北斗卡三专用链路"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="指挥机" name="指挥机"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="用户机" name="用户机"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <!-- 新增 -->
            <el-tab-pane label="数据库01" name="数据库01"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="数据库02" name="数据库02"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="运营管理01" name="运营管理01"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="运营管理02" name="运营管理02"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="数据处理01" name="数据处理01"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="数据处理02" name="数据处理02"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="基础支撑01" name="基础支撑01"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
            <el-tab-pane label="基础支撑02" name="基础支撑02"><Page :tab="data.tab" :monitorStatistics="data.monitorStatistics"></Page></el-tab-pane>
        </el-tabs>
        <div class="echrta-content">
            <DiscountEcharts :chartData="data.chartDataHistory_one" :style="data.tab === '北斗卡二专用链路' || data.tab === '运营管理02' ? 'width:100%' : 'width:50%'" />
            <DiscountEcharts v-if="data.tab !== '北斗卡二专用链路' && data.tab !== '运营管理02'" :chartData="data.chartDataHistory_two" />
            <DiscountEcharts
                :chartData="data.chartDataHistory_three"
                v-if="data.tab !== '用户机' || data.tab !== '基础支撑01'"
                :style="data.tab === '服务器1' || data.tab === '服务器2' || data.tab === '服务器3' || data.tab === '数据库01' || data.tab === '数据库02' || data.tab === '运营管理01' ? 'width:50%' : 'width:100%'"
            />
            <DiscountEcharts :chartData="data.chartDataHistory_thour" v-if="data.tab === '服务器1' || data.tab === '服务器2' || data.tab === '服务器3' || data.tab === '数据库01' || data.tab === '数据库02' || data.tab === '运营管理01'" />
            <div class="stateTable" v-if="data.tab === '用户机' || data.tab !== '基础支撑01'">
                <h4 style="font-weight: 700; margin: 0 0 4px 6px">链接状态</h4>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column type="index" label="序号" align="center" />
                    <el-table-column prop="名称" label="名称" align="center" />
                    <el-table-column prop="状态" label="状态" align="center" />
                    <el-table-column prop="状态报告时间" label="状态报告时间" align="center" />
                    <el-table-column prop="功率1" label="功率1" align="center" />
                    <el-table-column prop="功率2" label="功率2" align="center" />
                    <el-table-column prop="功率3" label="功率3" align="center" />
                    <el-table-column prop="功率4" label="功率4" align="center" />
                    <el-table-column prop="功率5" label="功率5" align="center" />
                    <el-table-column prop="功率6" label="功率6" align="center" />
                    <el-table-column prop="功率报告时间" label="功率报告时间" align="center" />
                </el-table>
            </div>
            <div class="stateTable" v-if="data.tab === '用户机'">
                <h4 style="font-weight: 700; margin: 0 0 4px 6px">播发队列</h4>
                <el-table :data="queueTableData" style="width: 100%">
                    <el-table-column type="index" label="序号" align="center" />
                    <el-table-column prop="播发分类" label="播发分类" align="center" />
                    <el-table-column prop="等待数量" label="等待数量" align="center" />
                    <el-table-column prop="具体内容" label="具体内容" align="center" />
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from '@vue/reactivity'
import Page from './handle/page'
import DiscountEcharts from '@/components/discountEcharts/index.vue'
let activeName = ref('服务器1')
const queueTableData = [
    {
        播发分类: '认证设备播发队列指令数',
        等待数量: '159',
        具体内容: '主播及系统认证确认指令',
    },
    {
        播发分类: '非认证设备播发队列指令数',
        等待数量: '0',
        具体内容: '调位、设参、设组、告警等需由认证播发设备播发的指令',
    },
    {
        播发分类: '优先级为0的等待指令数',
        等待数量: '6',
        具体内容: '暂无',
    },
    {
        播发分类: '优先级为1的等待指令数',
        等待数量: '0',
        具体内容: '一般指令',
    },
    {
        播发分类: '优先级为2的等待指令数',
        等待数量: '165',
        具体内容: '调位指令等',
    },
    {
        播发分类: '优先级为3的等待指令数',
        等待数量: '0',
        具体内容: '告警、紧急报警应答等',
    },
    {
        播发分类: '组播和认证的播发能力',
        等待数量: '0',
        具体内容: '指挥机一分钟可播发指令条数',
    },
    {
        播发分类: '普通指令的播发能力',
        等待数量: '7',
        具体内容: '认证设备可播发指令条数',
    },
    {
        播发分类: '不需认证指令的播发能力',
        等待数量: '164',
        具体内容: '非认证设备可播发指令条数',
    },
]
const tableData = [
    {
        名称: '播发设备28201',
        状态: '正常',
        状态报告时间: '2022/11/17 12:21',
        功率1: '',
        功率2: '',
        功率3: '',
        功率4: '',
        功率5: '',
        功率6: '',
        功率报告时间: '2022/11/17 12:21',
    },
    {
        名称: '播发设备2091',
        状态: '正常',
        状态报告时间: '2022/11/17 12:21',
        功率1: '',
        功率2: '',
        功率3: '',
        功率4: '',
        功率5: '',
        功率6: '',
        功率报告时间: '2022/11/17 12:21',
    },
]
let data = reactive({
    tab: '服务器1',
    monitorStatistics: null,
    chartDataHistory_one: {
        title: 'CPU使用情况(%)',
        company: '%',
        type: 'line',
        lineColor: ['#339966'],
        legendList: [],
        dataZoom: false,
        gridStyle: {
            left: 10,
            right: 10,
            top: 100,
            bottom: 10,
            containLabel: true,
        },
        xaxisdate: [0, 10, 20, 17, 20, 17, 26, 30, 26, 30, 26, 40, 37, 40, 40],
        seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
    chartDataHistory_two: {
        title: '网络连通情况监测(MB)',
        company: 'MB',
        type: 'line',
        lineColor: ['#0033CC'],
        legendList: [],
        dataZoom: false,
        gridStyle: {
            left: 10,
            right: 10,
            top: 100,
            bottom: 10,
            containLabel: true,
        },
        xaxisdate: [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
        seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
    chartDataHistory_three: {
        title: '数据流量监测预警(次)',
        company: '次',
        type: 'line',
        lineColor: ['#339966', '#FFCC00', '#0066CC'],
        legendList: ['登录量', '点击量', '查看量'],
        dataZoom: false,
        gridStyle: {
            left: 10,
            right: 10,
            top: 100,
            bottom: 10,
            containLabel: true,
        },
        xaxisdate: [
            [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
            [0, 10, 20, 17, 20, 17, 26, 30, 26, 30, 26, 40, 37, 40, 40],
            [10, 7, 12, 17, 20, 27, 16, 40, 26, 30, 16, 30, 27, 30, 10],
        ],
        seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
    chartDataHistory_thour: {
        title: '磁盘读写速率(MB)',
        company: 'MB',
        type: 'line',
        lineColor: ['#336600', '#FF0000'],
        legendList: ['', ''],
        dataZoom: false,
        gridStyle: {
            left: 10,
            right: 10,
            top: 100,
            bottom: 10,
            containLabel: true,
        },
        xaxisdate: [
            [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
            [0, 0, 0, 0, 0, 7, 30, 40, 0, 30, 0, 0, 27, 0, 0],
        ],
        seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
})
const handleClick = val => {
    data.tab = val.props.label
    // 这里需要调用接口
    if (data.tab === '服务器1' || data.tab === '数据库01') {
        data.monitorStatistics = ['2', '90.6%', '60.6%', '56.4%']
        ;(data.chartDataHistory_one = {
            title: 'CPU使用情况(%)',
            company: '%',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [0, 10, 20, 17, 20, 17, 26, 30, 26, 30, 26, 40, 37, 40, 40],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '网络连通情况监测(MB)',
                company: 'MB',
                type: 'line',
                lineColor: ['#0033CC'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
                seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '数据流量监测预警(次)',
            company: '次',
            type: 'line',
            lineColor: ['#339966', '#FFCC00', '#0066CC'],
            legendList: ['登录量', '点击量', '查看量'],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
                [0, 10, 20, 17, 20, 17, 26, 30, 26, 30, 26, 40, 37, 40, 40],
                [10, 7, 12, 17, 20, 27, 16, 40, 26, 30, 16, 30, 27, 30, 10],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
        // 4
        data.chartDataHistory_thour = {
            title: '磁盘读写速率(MB)',
            company: 'MB',
            type: 'line',
            lineColor: ['#336600', '#FF0000'],
            legendList: ['', ''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [0, 2, 10, 13, 15, 20, 30, 50, 40, 50, 40, 30, 48, 50, 30],
                [0, 0, 0, 0, 0, 7, 30, 40, 0, 30, 0, 0, 27, 0, 0],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '服务器2' || data.tab === '数据库02') {
        data.monitorStatistics = ['3', '52.3%', '89.3%', '35.6%']
        ;(data.chartDataHistory_one = {
            title: 'CPU使用情况(%)',
            company: '%',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [7, 7, 30, 27, 30, 7, 46, 30, 46, 40, 46, 30, 37, 40, 10],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '网络连通情况监测(MB)',
                company: 'MB',
                type: 'line',
                lineColor: ['#0033CC'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [8, 7, 10, 3, 25, 30, 40, 60, 40, 40, 40, 10, 38, 30, 30],
                seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '数据流量监测预警(次)',
            company: '次',
            type: 'line',
            lineColor: ['#339966', '#FFCC00', '#0066CC'],
            legendList: ['登录量', '点击量', '查看量'],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [10, 22, 10, 13, 15, 30, 30, 20, 40, 60, 30, 30, 38, 60, 30],
                [0, 0, 30, 27, 20, 27, 36, 35, 26, 35, 36, 50, 47, 30, 40],
                [10, 17, 12, 27, 30, 27, 46, 40, 16, 30, 26, 40, 37, 40, 10],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
        // 4
        data.chartDataHistory_thour = {
            title: '磁盘读写速率(MB)',
            company: 'MB',
            type: 'line',
            lineColor: ['#336600', '#FF0000'],
            legendList: ['', ''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [0, 12, 27, 16, 25, 20, 30, 60, 30, 30, 40, 30, 48, 20, 30],
                [0, 0, 20, 0, 10, 0, 30, 0, 0, 30, 0, 0, 27, 0, 0],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '服务器3' || data.tab === '运营管理01' || data.tab === '基础支撑02') {
        data.monitorStatistics = ['1', '45.3%', '66.3%', '74.1%']
        ;(data.chartDataHistory_one = {
            title: 'CPU使用情况(%)',
            company: '%',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [22, 3, 10, 7, 0, 7, 26, 30, 46, 50, 36, 50, 27, 30, 20],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '网络连通情况监测(MB)',
                company: 'MB',
                type: 'line',
                lineColor: ['#0033CC'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [10, 12, 10, 23, 25, 30, 24, 37, 30, 50, 30, 20, 28, 30, 34],
                seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '数据流量监测预警(次)',
            company: '次',
            type: 'line',
            lineColor: ['#339966', '#FFCC00', '#0066CC'],
            legendList: ['登录量', '点击量', '查看量'],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [10, 21, 14, 16, 19, 23, 30, 40, 50, 30, 40, 33, 38, 60, 30],
                [0, 20, 10, 7, 0, 27, 46, 50, 16, 20, 46, 42, 17, 10, 10],
                [10, 7, 12, 17, 30, 27, 36, 30, 26, 30, 16, 30, 37, 30, 10],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
        // 4
        data.chartDataHistory_thour = {
            title: '磁盘读写速率(MB)',
            company: 'MB',
            type: 'line',
            lineColor: ['#336600', '#FF0000'],
            legendList: ['', ''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [
                [0, 2, 10, 23, 25, 20, 30, 50, 20, 50, 20, 30, 48, 20, 30],
                [10, 0, 0, 30, 0, 0, 30, 40, 0, 30, 0, 0, 7, 0, 0],
            ],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '北斗卡二专用链路' || data.tab === '运营管理02') {
        data.monitorStatistics = ['1010', '496', '514', '195']
        ;(data.chartDataHistory_one = {
            title: '接收数量(个)',
            company: '个',
            type: 'bar',
            lineColor: ['#66FFCC'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [22, 3, 10, 7, 0, 7, 26, 30, 46, 50, 36, 50, 27, 30, 20],
            seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '发送数量(个)',
                company: '个',
                type: 'bar',
                lineColor: ['#33CCFF'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [10, 12, 10, 23, 25, 30, 24, 37, 30, 50, 30, 20, 28, 30, 34],
                seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '链接状态',
            company: '',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [[0, 10, 10, 7, 10, 17, 36, 30, 16, 20, 26, 22, 27, 10, 10]],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '北斗卡三专用链路' || data.tab === '数据处理01') {
        data.monitorStatistics = ['33562', '1563', '1759', '321']
        ;(data.chartDataHistory_one = {
            title: '接收数量(个)',
            company: '个',
            type: 'bar',
            lineColor: ['#66FFCC'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [12, 13, 22, 7, 0, 10, 26, 20, 36, 40, 26, 30, 17, 30, 20],
            seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '发送数量(个)',
                company: '个',
                type: 'bar',
                lineColor: ['#33CCFF'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [12, 32, 20, 13, 15, 32, 24, 37, 32, 34, 30, 20, 18, 30, 34],
                seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '链接时长',
            company: '',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [[0, 10, 30, 7, 30, 37, 36, 10, 16, 21, 21, 22, 27, 11, 10]],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '指挥机' || data.tab === '数据处理02') {
        data.monitorStatistics = ['2563', '998', '1655', '226']
        ;(data.chartDataHistory_one = {
            title: '接收数量(个)',
            company: '个',
            type: 'bar',
            lineColor: ['#66FFCC'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [23, 3, 13, 7, 0, 37, 26, 40, 44, 40, 46, 20, 17, 30, 10],
            seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '发送数量(个)',
                company: '个',
                type: 'bar',
                lineColor: ['#33CCFF'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [14, 15, 13, 22, 26, 40, 24, 34, 34, 30, 35, 22, 26, 32, 34],
                seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '链接时长',
            company: '',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [[34, 30, 30, 37, 30, 17, 6, 30, 16, 30, 26, 32, 57, 20, 10]],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
    if (data.tab === '用户机' || data.tab === '基础支撑01') {
        data.monitorStatistics = ['4425', '3688', '1527', '186']
        ;(data.chartDataHistory_one = {
            title: '接收数量(个)',
            company: '个',
            type: 'bar',
            lineColor: ['#66FFCC'],
            legendList: [],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [12, 13, 13, 17, 10, 47, 26, 34, 26, 40, 36, 30, 27, 33, 20],
            seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
        }),
            // 2
            (data.chartDataHistory_two = {
                title: '发送数量(个)',
                company: '个',
                type: 'bar',
                lineColor: ['#33CCFF'],
                legendList: [],
                dataZoom: false,
                gridStyle: {
                    left: 10,
                    right: 10,
                    top: 100,
                    bottom: 10,
                    containLabel: true,
                },
                xaxisdate: [20, 22, 14, 13, 15, 10, 14, 17, 30, 50, 0, 20, 8, 30, 34],
                seriesone: ['10/25', '10/26', '10/27', '10/28', '10/29', '10/30', '10/31', '11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8'],
            })
        // 3
        data.chartDataHistory_three = {
            title: '链接时长',
            company: '',
            type: 'line',
            lineColor: ['#339966'],
            legendList: [''],
            dataZoom: false,
            gridStyle: {
                left: 10,
                right: 10,
                top: 100,
                bottom: 10,
                containLabel: true,
            },
            xaxisdate: [[0, 0, 10, 7, 10, 7, 36, 30, 6, 20, 26, 2, 27, 10, 10]],
            seriesone: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        }
    }
}
</script>

<style scoped>
.el-tabs.el-tabs--top.el-tabs--border-card {
    height: calc(100vh - 126px);
}
.echarts {
    width: 50%;
    height: 300px;
    display: inline-block;
}
.stateTable {
    border-top: 20px solid rgb(244, 247, 252);
    padding: 10px;
    padding-bottom: 20px;
}
</style>
