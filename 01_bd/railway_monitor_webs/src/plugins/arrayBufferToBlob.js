//将二进制流转换成url
export default function arrayBufferToBlob(file, type) {
  let pic = "";
  let bytes = window.atob(file);
  let buffer = new ArrayBuffer(bytes.length);
  let unit = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    unit[i] = bytes.charCodeAt(i);
  }
  let blob = new Blob([buffer], {type});
  pic = window.URL.createObjectURL(blob);
  return pic ? pic : "";
}
