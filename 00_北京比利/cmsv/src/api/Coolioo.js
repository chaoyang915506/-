import env from "@/env";
import Api from "./Api";
import qs from "qs";

class Coolioo extends Api {
  constructor() {
    super();
  }

  createGroup(token, data) {
    let url = env.cms + `/cms/v2/mediaTypes?token=${token}`;
    return this.axios.post(url, data);
  }

  getGroup(token, metaType, offset, limit, mediaVendorId = "") {
    let url =
      env.cms +
      `/cms/v2/mediaTypes/page?mediaVendorId=${mediaVendorId}&metaType=${metaType}&offset=${offset}&limit=${limit}&token=${token}`;
    return this.axios.get(url);
  }
  getAllGroup(token) {
    // 所有未和版权关联的分组
    let url = env.cms + `/cms/v2/mediaTypes/notAssociate?token=${token}`;
    return this.axios.get(url);
  }
  getAllGroup2(token) {
    // 所有未和版权关联的分组
    let url = env.cms + `/cms/v2/mediaTypes?token=${token}`;
    return this.axios.get(url);
  }
  getAllGroup3(cp, langId = 0) {
    if (langId === null) langId = 0;
    let url = env.cms + `/cms/v2/mediaTypes/typesOfVendor?vendorId=${cp}&langId=${langId}`;
    return this.axios.get(url);
  }
  updateGroup(token, data) {
    let url = env.cms + `/cms/v2/mediaTypes?token=${token}`;
    return this.axios.put(url, data);
  }

  updateSort(token, data) {
    // let url = env.cms + `/cms/v2/mediaTypes/sort?token=${token}`;
    let url = env.cms + `/cms/v2/mediaTypes/dragSort?token=${token}`;
    return this.axios.put(url, data);
  }

  specialvideolists(offset = 0, limit = 10, name = "", state = "", style = "", copyright = "") {
    let url =
      env.cms +
      `/cms/video/coolioos?name=${name}&status=${state}&styleId=${style}&vendorId=${copyright}&offset=${offset}&limit=${limit}`;
    return this.axios.get(url);
  }

  // 素材样式
  getStylelists(token) {
    let url = env.cms + `/cms/style/getAll?token=${token}`;
    return this.axios.get(url);
  }

  // 视频版权名字
  getCopyright() {
    let url = env.cms + `/cms/vendors`;
    // let url = `http://localhost:3003/cms/vendors?token=${token}`;
    return this.axios.get(url);
  }
  // 版权列表
  getCopyrightlists(token, offset, limit, name = "") {
    let url = env.cms + `/cms/vendors/page?name=${name}&offset=${offset}&limit=${limit}`;
    return this.axios.get(url);
  }

  // 区域
  getAreas(token) {
    let url = env.cms + `/cms/area/getAll?token=${token}`;
    return this.axios.get(url);
  }
  // 新增版权
  createCopyright(token, data) {
    let url = env.cms + `/cms/vendors?token=${token}`;
    return this.axios.post(url, data);
  }
  // 更新版权
  updateCopyright(token, data) {
    let url = env.cms + `/cms/vendors?token=${token}`;
    return this.axios.put(url, data);
  }
  // 更新特色视频
  updateSpecialVideo(token, data) {
    let url = env.cms + `/cms/video/coolioos?token=${token}`;
    this.axios.put(url, data);
  }
  // 获取配置列表
  getConfiglists(token, offset, limit, name = "") {
    let url = env.cms + `/coolioo/confs?limit=${limit}&offset=${offset}&name=${name}`;
    // let url = `http://localhost:3003/coolioo/confs?limit=${limit}&offset=${offset}&name=${name}&token=${token}`;
    return this.axios.get(url);
  }
  // 获取配置信息
  getConfigInfo(token, id) {
    let url = env.cms + `/coolioo/confs/${id}`;
    // let url = `http://localhost:3003/coolioo/confs/${id}?token=${token}`;
    return this.axios.get(url);
  }

  // 更新Coolioo配置
  updateConfigInfo(token, data) {
    let url = env.cms + `/coolioo/confs`;
    return this.axios.post(url, data);
  }

  // 批量上线
  online(data) {
    let datas = { "ids[]": data };
    let url = env.cms + `/cms/media/batchOnline`;
    return this.axios.post(url, qs.stringify(datas, { indices: false }), {
      "content-type": "application/x-www-form-urlencoded",
    });
  }

  // 批量下线
  offline(data) {
    let datas = { "ids[]": data };
    let url = env.cms + `/cms/media/batchOffline`;
    return this.axios.post(url, qs.stringify(datas, { indices: false }), {
      "content-type": "application/x-www-form-urlencoded",
    });
  }
  // 下发介质
  sendmedia(data) {
    let url = env.cms + `/cms/syncRes/sync`;
    return this.axios.post(url, data);
  }
  // 删除介质
  deletemedia(data) {
    let url = env.cms + `/cms/syncRes/delSync`;
    return this.axios.post(url, data);
  }
  // 同步状态查看
  syncState(data) {
    let url = env.cms + `/cms/syncRes/syncStatus`;
    return this.axios.post(url, data);
  }

  // 素材状态
  getMaterialState(data) {
    let post = {
      ids: data,
    };
    let url = env.cms + `/cms/mediaDesc/getByMediaIds`;
    return this.axios.post(url, post);
  }

  // 修改版权状态
  updateCopyrightState(data) {
    let url = env.cms + `/cms/vendors/status`;
    return this.axios.put(url, data);
  }

  // 版权 - 批量上线
  batchOnlineCp(data) {
    let url = env.cms + `/cms/vendors/batchOnline`;
    return this.axios.post(url, data);
  }
  // 版权 - 批量下线
  batchOfflineCp(data) {
    let url = env.cms + `/cms/vendors/batchOffline`;
    return this.axios.post(url, data);
  }
  // 版权 - 导出
  copyrightExport() {
    let url = env.cms + `/cms/vendors/export`;
    return this.axios.get(url);
  }
  // 酒店 49
  getHotellists49() {
    let url = env.cms + `/cms/cmsHotelController/getHotelByItemType?itemTypeId[]=49`;
    return this.axios.get(url);
  }
  // 酒店 49
  getHotellists2549() {
    let url =
      env.cms + `/cms/cmsHotelController/getHotelByItemType?itemTypeId[]=49&itemTypeId[]=25`;
    return this.axios.get(url);
  }
  // 版权关联 - 查询
  getCpAssociated(offset, limit, hotelId, langId) {
    let url =
      env.cms +
      `/cms/vendorRelItem?langId=${langId}&offset=${offset}&limit=${limit}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }
  // 版权关联 - 全部酒店
  getAllHotels() {
    let url = env.cms + `/cms/cmsHotelController/getHotelList`;
    return this.axios.get(url);
  }
  // 版权关联 - 栏目 49
  getCat49(hotelId) {
    let url = env.cms + `/cms/cmsItemHotelController/selByBasicType?hotelId=${hotelId}`;
    return this.axios.get(url);
  }
  // 版权关联 - 版权
  getCps(hotel, cat, langId) {
    let url =
      env.cms + `/cms/vendors/noRelItem?langId=${langId}&hotelId=${hotel}&itemBasicId=${cat}`;
    return this.axios.get(url);
  }
  // 创建版权关联
  createCpAssociated(hotel, basic, vid) {
    let url =
      env.cms + `/cms/vendorRelItem?vendorId[]=${vid}&hotelId=${hotel}&itemBasicId=${basic}`;
    return this.axios.post(url);
  }
  // 版权关联 - 删除
  delAssociated(id) {
    let url = env.cms + `/cms/vendorRelItem?id[]=${id}`;
    return this.axios.delete(url);
  }
  // 删除版权
  delCopyright(params) {
    let url = env.cms + `/cms/vendors?${params}`;
    return this.axios.delete(url);
  }
  // 视频排序
  videoSort(data) {
    let url = env.cms + `/cms/v2/mediaTypes/video/sort`;
    return this.axios.put(url, data);
  }
}

export default new Coolioo();
