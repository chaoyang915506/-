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
