<template>
    <div style="height: 100%; width: 100%; display: flex">
        <div class="left_chart">
            <div class="chart_total">
                <div class="chart_tit">短报文分类</div>
                <div class="every_class">
                    <div class="chart_class" v-for="(i, j) in chartDataList.twoPieChart.sData" :key="j">
                        <div class="content_left">{{ i.name }}</div>
                        <div class="content_right">{{ i.value }}</div>
                    </div>
                    <!-- <div class="chart_class">
            <div class="content_left">位置类</div>
            <div class="content_right">426</div>
          </div>
          <div class="chart_class">
            <div class="content_left">位置类</div>
            <div class="content_right">426</div>
          </div>
          <div class="chart_class">
            <div class="content_left">位置类</div>
            <div class="content_right">426</div>
          </div> -->
                </div>
            </div>
            <div class="chart_pie">
                <TwoPieChart :chartData="chartDataList.twoPieChart" />
            </div>
        </div>
        <div class="right_chart">
            <ThreePieEcharts :chartData="chartDataList.threePieChart" />
        </div>
    </div>
</template>

<script setup>
import TwoPieChart from '@/components/TwoPieChart/index.vue'
import ThreePieEcharts from '@/components/ThreePieEcharts/index.vue'
const props = defineProps({
    chartDataList: {
        type: Object,
        default: {},
    },
})
</script>

<style lang="scss" scoped>
.left_chart {
    width: 40%;
    height: 100%;
    display: flex;
    background-color: #fff;
    .chart_total,
    .chart_pie {
        width: 50%;
        height: 100%;
        .chart_tit {
            padding-left: 3px;
            height: 20px;
            font-size: 16px;
            font-weight: 700;
            color: black;
        }
    }
    .chart_total {
        padding: 10px;
    }
}
.right_chart {
    width: calc(60% - 10px);
    margin-left: 10px;
    height: 100%;
    background-color: #fff;
}
.every_class {
    width: 100%;
    height: 100%;
    padding: 10px;
    .chart_class {
        width: 100%;
        height: calc((100% - 34px) / 4);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        position: relative;
        .content_left {
            font-size: 13px;
            position: absolute;
            left: 10%;
        }
        .content_right {
            position: absolute;
            right: 10%;
            font-size: 13px;
        }
    }
    .chart_class:nth-child(1) {
        background-image: linear-gradient(to bottom, #fff, red);
    }
    .chart_class:nth-child(2) {
        background-image: linear-gradient(to bottom, #fff, #ffc245);
    }
    .chart_class:nth-child(3) {
        background-image: linear-gradient(to bottom, #fff, #5ccfcd);
    }
    .chart_class:nth-child(4) {
        background-image: linear-gradient(to bottom, #fff, #0482ff);
        margin-bottom: 0;
    }
}
</style>
