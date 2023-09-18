import { getCurrentInstance } from 'vue'
// import { uploadFiles, bizDownload } from "@/api/files";

// const { proxy } = getCurrentInstance();

// 上传文件
export function uploadFileData(fileData) {
  let attachmentParam = [];
  if (fileData && fileData.length) {
    return new Promise(async (resolve, reject) => {
      let formData = new FormData();
      for (let i = 0; i < fileData.length; i++) {
        formData.append("files", fileData[i].raw);
      }
      let res = await uploadFiles(formData);
      if (res.code == 200 && res.data) {
        attachmentParam = res.data.fileIds;
      }
      resolve(attachmentParam);
    });
  }
}
// 预览文件
// export function previewFile(file, proxy) {
//   let type = "";
//   if (file.name) {
//     type = file.name.split(".")[1];
//   }
//   let typeShow = "";
//   if (type == "pdf") {
//     typeShow = "application/pdf";
//   } else if (type == "gif") {
//     typeShow = "image/gif";
//   } else if (type == "jpe" || type == "jpeg" || type == "jpg") {
//     typeShow = "image/jpeg";
//   } else if (type == "svg") {
//     typeShow = "image/svg+xml";
//   } else if (type == "txt") {
//     typeShow = "text/plain";
//   } else if (type == "png") {
//     typeShow = "image/png";
//   } else {
//     typeShow = "";
//   }
//   // console.log(typeShow, 'typeShow')
//   // 获取上传图片的本地URL，用于上传前的本地预览
//   if (file.id) {
//     bizDownload(file.id).then((res) => {
//       let bytes = window.atob(res.data);
//       let buffer = new ArrayBuffer(bytes.length); //处理异常,将ascii码小于0的转换为大于0
//       let unit = new Uint8Array(buffer);
//       for (var i = 0; i < bytes.length; i++) {
//         unit[i] = bytes.charCodeAt(i);
//       }
//       let blob = new Blob([buffer], {
//         type: typeShow ? typeShow : res.type,
//       });
//       // 生成blob图片,需要参数(字节数组, 文件类型)
//       // const blob = new Blob([res.data], {
//       //   type: typeShow ? typeShow : res.type,
//       // });
//       // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
//       const url = window.URL.createObjectURL(blob);
//       if (typeShow) {
//         let documentFile = window.open(url, "newwindow");
//         setTimeout(() => {
//           documentFile.document.title = file.name;
//         }, 10);
//       } else {
//         proxy.$modal
//           .confirm(file.name + "暂不支持在线预览，请下载后查看详情", "info")
//           .then(() => {
//             // let documentFile = window.open(url, "newwindow");
//             // setTimeout(() => {
//             //   console.log(file.name, 'file.name', url)
//             // 	documentFile.document.title = file.name;
//             // }, 10);
//             let filename = file.name;
//             let url = window.URL.createObjectURL(blob);
//             let donloadElement = document.createElement("a");
//             donloadElement.style.display = "none";
//             donloadElement.href = url;
//             donloadElement.download = filename;
//             document.body.appendChild(donloadElement);
//             donloadElement.click();
//             document.body.removeChild(donloadElement);
//             window.URL.revokeObjectURL(url);
//           });
//       }
//     });
//   } else {
//     let URL = null;
//     if (window.createObjectURL != undefined) {
//       // basic
//       URL = window.createObjectURL(file.raw);
//     } else if (window.URL != undefined) {
//       // mozilla(firefox)
//       URL = window.URL.createObjectURL(file.raw);
//     } else if (window.webkitURL != undefined) {
//       // webkit or chrome
//       URL = window.webkitURL.createObjectURL(file.raw);
//     }
//     // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
//     // console.log(file, fileList, URL, 'fileList')
//     if (typeShow) {
//       let documentFile = window.open(URL, "newwindow");
//       setTimeout(() => {
//         documentFile.document.title = file.name;
//       }, 10);
//     } else {
//       console.log(file, "fiele");
//       proxy.$modal
//         .confirm(file.name + "暂不支持在线预览，请下载后查看详情", "info")
//         .then(() => {
//           let documentFile = window.open(URL, "newwindow");
//           setTimeout(() => {
//             // console.log(file.name, 'file.name', URL)
//             documentFile.document.title = file.name;
//           }, 10);
//         });
//       // return ElMessage.warning(file.name + '暂不支持在线预览，请下载后查看详情')
//     }
//   }
// }
// // 下载文件-----通用下载接口
// export function downBizFile(file, proxy) {
//   bizDownload(file.id).then((res) => {
//     let bytes = window.atob(res.data);
//     let buffer = new ArrayBuffer(bytes.length); //处理异常,将ascii码小于0的转换为大于0
//     let unit = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.length; i++) {
//       unit[i] = bytes.charCodeAt(i);
//     }
//     let blob = new Blob([buffer]);
//     let filename = file.name;
//     let url = window.URL.createObjectURL(blob);
//     let donloadElement = document.createElement("a");
//     donloadElement.style.display = "none";
//     donloadElement.href = url;
//     donloadElement.download = filename;
//     document.body.appendChild(donloadElement);
//     donloadElement.click();
//     document.body.removeChild(donloadElement);
//     window.URL.revokeObjectURL(url);
//   });
// }

// 下载文件-----自定义下载接口
export function downDefinedUrlFile(
  fileData,
  fileName,
  fileType,
  isOctetSstream
) {
  let blob;
  if (isOctetSstream) {
    let bytes = window.atob(fileData);
    let buffer = new ArrayBuffer(bytes.length); //处理异常,将ascii码小于0的转换为大于0
    let unit = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
      unit[i] = bytes.charCodeAt(i);
    }
    blob = new Blob([buffer]);
  } else {
    blob = new Blob(
      [fileData],
      fileType ? fileType : { type: "application/octet-stream" }
    );
  }
  let filename = fileName;
  let url = window.URL.createObjectURL(blob);
  let donloadElement = document.createElement("a");
  donloadElement.style.display = "none";
  donloadElement.href = url;
  donloadElement.download = filename;
  document.body.appendChild(donloadElement);
  donloadElement.click();
  document.body.removeChild(donloadElement);
  window.URL.revokeObjectURL(url);
}
