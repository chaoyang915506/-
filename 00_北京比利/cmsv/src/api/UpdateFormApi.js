import env from '@/env/index.js'
import Axios from 'axios'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取应用旧的信息
  getoldApp () {
    const url = 'https://cmsservice.dev.mycool.tv/cmsservice/firmware/application'
    return Axios.get(url)
  }
  //获取到旧的upgrade
  getoldupgrade () {
    const url = 'https://cmsservice.dev.mycool.tv/cmsservice/firmware/upgrade'
    return Axios.get(url)
  }
  //获取旧的firmware
  getoldfirmware () {
    const url = 'https://cmsservice.dev.mycool.tv/cmsservice/firmware/getFirmware'
    return Axios.get(url)
  }
}