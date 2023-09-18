import request from '@/utils/request'
// 上传文件
export const uploadFile = (data) => {
  return request({
    url: '/commonFile/upload',
    method: 'post',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },// form data
    timeout: 30000*30000,
    data
  })
}