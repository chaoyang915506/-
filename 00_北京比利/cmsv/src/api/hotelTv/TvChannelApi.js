import env from "@/env";
import Api from "../Api";
import Axios from "axios";
import qs from "qs";

export default new (class extends Api {
  constructor() {
    super();
  }

  // 获取频道数据
  getHotelTVListApi() {
    const url = env.cms + "/cms/tv/getBasicChannelList";
    return this.axios.get(url);
  }
  // 获取语言
  getLangListApi() {
    const url = env.cms + "/cms/language/getLanguageList";
    return this.axios.post(url);
  }
  // 获取当前操作的频道数据
  getCurrByIdApi(chId) {
    const url = env.cms + "/cms/tv/getById";
    return this.axios.post(url, qs.stringify(chId));
  }
  // 添加频道
  addChannelApi(channelData) {
    const url = env.cms + "/cms/tv/add";
    return this.axios.post(url, channelData);
  }
  // 更新频道
  updateChannelApi(channelData) {
    const url = env.cms + "/cms/tv/update";
    return this.axios.post(url, channelData);
  }
  // 删除频道
  delChannelApi(chId) {
    const url = env.cms + "/cms/tv/remove";
    return this.axios.post(url, qs.stringify(chId));
  }
})();
