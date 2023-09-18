import env from "@/env";
import Api from "./Api";

// /cms/cmsHotelController/getHotelList
// /cms/redis/getModuleList
// /cms/redis/updateRedisOfHotelAndModule 更新指定酒店、模块缓存
// /cms/redis/updateRedisOfModule 更新所有酒店指定模块
// /cms/redis/updateRedisOfHotel 更新指定酒店所有模块缓存

// /cms/redis/getRedisModuleByHotel
// /cms/redis/getModuleListAndStatus

class BasicSystem extends Api {
  constructor() {
    super();
  }

  getHotels(token) {
    let url = env.cms + `/cms/cmsHotelController/getHotelList?token=${token}`;
    return this.axios.get(url);
  }

  getModules(token) {
    let url = env.cms + `/cms/redis/getModuleList?token=${token}`;
    return this.axios.get(url);
  }

  updateOne(token, module, hotelId) {
    let url = env.cms + `/cms/redis/updateRedisOfHotelAndModule?module=${module}&hotelId=${hotelId}&token=${token}`;
    return this.axios.get(url);
  }

  updateAll(token, module) {
    let url = env.cms + `/cms/redis/updateRedisOfModule?module=${module}&token=${token}`;
    return this.axios.get(url);
  }

  updateOneHotelAllModule(token, hotelId) {
    let url = env.cms + `/cms/redis/updateRedisOfHotel?hotelId=${hotelId}&token=${token}`;
    return this.axios.get(url);
  }

  getModulesStatus(token, hotelId) {
    // let url = env.cms + `/cms/redis/getRedisModuleByHotel?token=${token}&hotelId=${hotelId}`;
    let url = env.cms + `/cms/redis/getModuleListAndStatus?token=${token}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }

  updateRedisModule(token, hotelId, module, enabled) {
    let url = env.cms + `/cms/redis/setHotelRedisModule?token=${token}&hotelId=${hotelId}&module=${module}&enabled=${enabled}`;
    return this.axios.get(url);
  }

  openAll(token, hotelId) {
    let url = env.cms + `/cms/redis/openRedisOfHotel?token=${token}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }

  closeAll(token, hotelId) {
    let url = env.cms + `/cms/redis/closeRedisOfHotel?token=${token}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }
  // /cms/redis/getModuleStatus
  getHotelStatusByModule(token, module) {
    let url = env.cms + `/cms/redis/getModuleStatus?token=${token}&module=${module}`;
    return this.axios.get(url);
  }

  getAllHotel(token) {
    let url = env.cms + `/cms/cmsHotelController/getHotelList?token=${token}`;
    return this.axios.get(url);
  }

  // /cms/redis/setHotelRedisModule
  updateModuleWithHotel(token, hotelId, module, enabled) {
    let url = env.cms + `/cms/redis/setHotelRedisModule?token=${token}&hotelId=${hotelId}&module=${module}&enabled=${enabled}`;
    return this.axios.get(url);
  }

  setAllHotel(token, module, enabled) {
    let url = env.cms + `/cms/redis/setRedisModule?token=${token}&module=${module}&enabled=${enabled}&hotelId=null`;
    return this.axios.get(url);
  }
}

export default new BasicSystem();
