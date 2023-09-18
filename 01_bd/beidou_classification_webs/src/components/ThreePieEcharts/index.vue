<template>
  <echarts
    :option="option"
    ref="echart"
    id="echart"
    :update-options="{ notMerge: true }"
    autoresize
  />
</template>
<script setup>
import { watch } from "@vue/runtime-core";
const emit = defineEmits(["echartsClickHandle"]);
const { proxy } = getCurrentInstance();
const props = defineProps({
  chartData: Array,
});
const option = computed(() => {
  // console.log(props.chartData, "props.chartData");
  const title1 = props.chartData[0]?.title || " ";
  const title2 = props.chartData[1]?.title || " ";
  const title3 = props.chartData[2]?.title || " ";
  const limit1 = props.chartData[0]?.limit || 0;
  const limit2 = props.chartData[1]?.limit || 0;
  const limit3 = props.chartData[2]?.limit || 0;
  const value1 = props.chartData[0]?.value || 0;
  const value2 = props.chartData[1]?.value || 0;
  const value3 = props.chartData[2]?.value || 0;
  const total1 = props.chartData[0]?.total || 0;
  const total2 = props.chartData[1]?.total || 0;
  const total3 = props.chartData[2]?.total || 0;
  const option = {
    title: [
      {
        text: "航保机构收发统计",
        left: "0",
        top: "10px",
        // textAlign: "center",
        textStyle: {
          fontWeight: "700",
          color: "black",
          fontSize: 16,
        },
      },
      {
        text: title1,
        left: "20%",
        top: "70%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(105, 120, 136, 1)",
          fontSize: 14,
        },
      },
      {
        text: title2,
        left: "50%",
        top: "70%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(105, 120, 136, 1)",
          fontSize: 14,
        },
      },
      {
        text: title3,
        left: "80%",
        top: "70%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(105, 120, 136, 1)",
          fontSize: 14,
        },
      },
      {
        text: limit1,
        left: "20%",
        top: "50%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(51, 147, 236, 1)",
          fontSize: 14,
        },
      },
      {
        text: limit2,
        left: "50%",
        top: "50%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(220, 161, 82, 1)",
          fontSize: 14,
        },
      },
      {
        text: limit3,
        left: "80%",
        top: "50%",
        textAlign: "center",
        textStyle: {
          fontWeight: "normal",
          color: "rgba(81, 193, 156, 1)",
          fontSize: 14,
        },
      },
    ],
    color: ["#eb644b", "#313443", "#fff"],
    toolbox: {
      show: false,
      feature: {
        mark: {
          show: true,
        },
        dataView: {
          show: true,
          readOnly: false,
        },
        restore: {
          show: true,
        },
        saveAsImage: {
          show: true,
        },
      },
    },
    series: [
      // 图1
      {
        name: "Line 1",
        type: "pie",
        clockWise: false,
        radius: ["30%", "28%"],
        center: ["20%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(51, 147, 236, 1)",
          },
        },
        hoverAnimation: false,
        data: [
          {
            value: value1,
            name: "01",
            itemStyle: {
              normal: {
                color: "rgba(51, 147, 236, 1)", //已完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(51, 147, 236, 1)", //已完成的圆环的颜色
              },
            },
          },
          {
            value: total1 - value1,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(51, 147, 236, 0.27)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(51, 147, 236, 0.27)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },
      {
        name: "Line 2",
        type: "pie",
        animation: false,
        clockWise: false,
        radius: ["35%", "34%"],
        center: ["20%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(51, 147, 236, 1)",
          },
        },
        hoverAnimation: false,
        tooltip: {
          show: false,
        },
        data: [
          {
            value: 100,
            name: "02",
            itemStyle: {
              normal: {
                color: "rgba(51, 147, 236, 1)", //已完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(51, 147, 236, 1)", //已经完成的圆环的颜色
              },
            },
          },
          {
            value: 0,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(51, 147, 236, 1)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(51, 147, 236, 1)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },

      // 图2
      {
        name: "Line 1",
        type: "pie",
        clockWise: false,
        radius: ["50%", "48%"],
        center: ["50%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(220, 161, 82, 1)",
          },
        },
        hoverAnimation: false,
        data: [
          {
            value: value2,
            name: "01",
            itemStyle: {
              normal: {
                color: "rgba(220, 161, 82, 1)", //已完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(220, 161, 82, 1)", //已完成的圆环的颜色
              },
            },
          },
          {
            value: total2 - value2,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(220, 161, 82, 0.27)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(220, 161, 82, 0.27)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },
      {
        name: "Line 2",
        type: "pie",
        animation: false,
        clockWise: false,
        radius: ["55%", "54%"],
        center: ["50%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(220, 161, 82, 1)",
          },
        },
        hoverAnimation: false,
        tooltip: {
          show: false,
        },
        data: [
          {
            value: 100,
            name: "02",
            itemStyle: {
              normal: {
                color: "rgba(220, 161, 82, 1)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(220, 161, 82, 1)", //未完成的圆环的颜色
              },
            },
          },
          {
            value: 0,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(220, 161, 82, 1)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(220, 161, 82, 1)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },

      // 图3
      {
        name: "Line 1",
        type: "pie",
        clockWise: false,
        radius: ["50%", "48%"],
        center: ["80%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(81, 193, 156, 1)",
          },
        },
        hoverAnimation: false,
        data: [
          {
            value: value3,
            name: "01",
            itemStyle: {
              normal: {
                color: "rgba(81, 193, 156, 1)", //已完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(81, 193, 156, 1)", //已完成的圆环的颜色
              },
            },
          },
          {
            value: total3 - value3,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(81, 193, 156, 0.27)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(81, 193, 156, 0.27)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },
      {
        name: "Line 2",
        type: "pie",
        animation: false,
        clockWise: false,
        radius: ["55%", "54%"],
        center: ["80%", "50%"],
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            shadowBlur: 40,
            shadowColor: "rgba(81, 193, 156, 1)",
          },
        },
        hoverAnimation: false,
        tooltip: {
          show: false,
        },
        data: [
          {
            value: 100,
            name: "02",
            itemStyle: {
              normal: {
                color: "rgba(81, 193, 156, 1)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(81, 193, 156, 1)", //未完成的圆环的颜色
              },
            },
          },
          {
            value: 0,
            name: "invisible",
            itemStyle: {
              normal: {
                color: "rgba(81, 193, 156, 1)", //未完成的圆环的颜色
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
              emphasis: {
                color: "rgba(81, 193, 156, 1)", //未完成的圆环的颜色
              },
            },
          },
        ],
      },
    ],
  };
  return option;
});
</script>
<style lang="scss" scoped>
</style>
