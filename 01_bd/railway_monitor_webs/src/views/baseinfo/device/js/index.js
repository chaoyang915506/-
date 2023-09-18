import { ref } from "vue";
//查询线路
export function makeline(res) {
  //   console.log(res, "数据");
  if (!res) return [];
  let linedata = [];
  [...new Set(res.data.map((i) => i.lineID).filter((i) => i))].forEach((i) => {
    let resultes = res.data.find((idx) => idx.lineID == i);
    if (resultes) {
      linedata.push(resultes);
    }
  });
  //   console.log(linedata, "线路");
  return linedata;
}
// export const timeNow = ref(new Date());
export function toflowData(file) {
  // console.log(file, "all数据");
  // if (!file || file == null) return " ";
  let pic = "";
  let bytes = window.atob(file);
  let buffer = new ArrayBuffer(bytes.length);
  let unit = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    unit[i] = bytes.charCodeAt(i);
  }
  let blob = new Blob([buffer]);
  pic = window.URL.createObjectURL(blob);
  return pic ? pic : "";
}

var checkMobile = (rule, value, cb) => {
  if (value.length > 0) {
    //合法的手机号
    return cb();
  }
  //手机号不合法
  cb(new Error("文件不能为空"));
};
export const rulesCopy = {
  addTime: [{ required: true, message: "添加时间不能为空", trigger: "blur" }],
  route: [
    {
      required: true,
      message: "所在线路不能为空",
      trigger: "blur",
    },
  ],
  monitorId: [
    { required: true, message: "所在监测点不能为空", trigger: "blur" },
  ],
  facilityType: [
    { required: true, message: "设备类型不能为空", trigger: "blur" },
  ],
  monitoringScene: [
    { required: true, message: "监测内容不能为空", trigger: "blur" },
  ],
  facilityModel: [
    { required: true, message: "传感器型号不能为空", trigger: "blur" },
  ],
  filesCopy: [{ validator: checkMobile, trigger: "change" }],
};
