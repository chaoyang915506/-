import env from "@/env";
import Api from "./Api";

export default new (class extends Api {
  constructor() {
    super();
  }

  del(id, token) {
    let url = env.cms + "/cms/airline/delById?id=" + id + "&token=" + token;
    return this.axios.get(url);
  }
  multipleDel(ids, token) {
    let url = env.cms + "/cms/airline/batchDel?token=" + token;
    return this.axios.post(url, {
      ids: ids,
    });
  }

  getLanguageList(token) {
    let url = env.cms + "/cms/language/getLanguageList?token=" + token;
    return this.axios.get(url);
  }

  create(token, data) {
    let url = env.cms + "/cms/airline/add?token=" + token;
    return this.axios.post(url, data);
  }

  getInfo(token, id) {
    let url = env.cms + `/cms/airline/getById?id=${id}&token=${token}`;
    return this.axios.get(url);
  }

  update(token, data) {
    let url = env.cms + `/cms/airline/update?token=${token}`;
    return this.axios.post(url, data);
  }

  export(token, data) {
    let url =
      env.cms +
      `/cms/airline/getByCondition?name=${data["name"]}&nameEn=${data["nameEn"]}` +
      `&icaoCode=${data["icaoCode"]}&iataCode=${data["iataCode"]}&token=${token}`;

    return this.axios.get(url);
  }

  import(token, data) {
    let url = env.cms + `/cms/airline/batchDelAndSave?token=${token}`;
    return this.axios.post(url, data);
  }
})();
