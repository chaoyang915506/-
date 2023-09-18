import env from "@/env";
import Api from "./Api";

const prefix = env.cms;

class SpecialVideo extends Api {
  constructor() {
    super();
  }

  taglists(token) {
    let url = `${prefix}/cms/tag?token=${token}`;
    return this.axios.get(url);
  }

  addtag(token, body) {
    let url = `${prefix}/cms/tag?token=${token}`;
    return this.axios.post(url, body);
  }
}

export default new SpecialVideo();
