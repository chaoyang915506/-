import env from "@/env";
import Api from "./Api";
import qs from "qs";

// /cms/cmsHotelRoomController/roomlist
// /cms/deviceTypeController/queryDeviceTypes
// /cms/cmsDeviceController/add
// /cms/cmsDeviceController/godevicelist
// /cms/cmsDeviceController/devicelist
// /cms/cmsDeviceController/delete

// /cms/cmsDeviceController/selectdevice
// /cms/cmsDeviceController/update
const prefix = env.cms;
class Device extends Api {
  constructor() {
    super();
  }
  getRoomlist(token, hotelId) {
    let url = env.cms + `/cms/cmsHotelRoomController/roomlist?token=${token}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }

  getTypelist(token, hotelId) {
    let url =
      env.cms + `/cms/deviceTypeController/queryDeviceTypes?token=${token}&hotelId=${hotelId}`;
    return this.axios.get(url);
  }

  add(token, hotelId, data) {
    let url = env.cms + `/cms/cmsDeviceController/add?token=${token}&hotelId=${hotelId}`;

    return this.axios.post(url, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }

  getDeviceList(token, hotelId) {
    let url = env.cms + `/cms/cmsDeviceController/devicelist?hotelId=${hotelId}&token=${token}`;
    return this.axios.post(url);
  }

  deleteDevice(token, hotelId, deviceId) {
    let url =
      env.cms +
      `/cms/cmsDeviceController/delete?deviceId=${deviceId}&hotelId=${hotelId}&token=${token}`;
    return this.axios.get(url);
  }

  getDeviceInfo(token, hotelId, id) {
    let data = {
      deviceId: id,
      hotelId: hotelId
    };
    let url = prefix + `/cms/cmsDeviceController/selectdevice?hotelId=${hotelId}&token=${token}`;
    return this.axios.post(url, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }

  updateDevice(token, hotelId, data) {
    let url = env.cms + `/cms/cmsDeviceController/update?token=${token}&hotelId=${hotelId}`;

    return this.axios.post(url, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }
}

export default new Device();
