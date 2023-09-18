import Api from './Api'
import env from '@/env'
import qs from 'qs'
export const SyscnfApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/cnf/syscnfs?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/cnf?hotelId=' + env.hotelId
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/cnf?hotelId=' + env.hotelId
        return this.axios.put(url, body)
    }
}

export const SyscnfMetaApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/syscnfMeta/syscnfMetas'
        return this.axios.get(url)
    }

}

export const SyscnfGroupApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/syscnfGroup/getAll'
        return this.axios.get(url)
    }
}
export const syscnfMetaListApi=new class extends Api {
    constructor() {
      super()
    }
    getclassify () {
      const url = env.cms + '/cms/syscnfGroup/getAll'
      return this.axios.get(url)
    }
    getAllTable (body) {
      const url = env.cms + '/cms/syscnfMeta/getAll?limit=9999&offset=0&input=' + body.input + '&syscnfGroupId=' + body.syscnfGroupId
      return this.axios.get(url)
    }
    deleteApi (id) {
      const url = env.cms + '/cms/syscnfMeta/delete?id=' + id
      return this.axios.get(url)
    }
    batchDelete (body) {
      const url = env.cms + '/cms/syscnfMeta/batchDelete'
      return this.axios.post(url, body)
    }
    getOneIdit (id) {
      const url = env.cms + '/cms/syscnfMeta/getOne?id=' + id
      return this.axios.get(url)
    }
    update (body) {
      const url = env.cms + '/cms/syscnfMeta/update'
      return this.axios.post(url, qs.stringify(body))
    }
    addsyscn (body) {
      const url = env.cms + '/cms/syscnfMeta/add'
      return this.axios.post(url, qs.stringify(body))
    }
    getGroupPage () {
      const url = env.cms + '/cms/syscnfGroup/getByPage?limit=9999&offset=0'
      return this.axios.get(url)
    }
  
  
    updateAdd (body) {
      const url = env.cms + '/cms/syscnfGroup/add'
      return this.axios.post(url, body)
    }
    updateGroup (body) {
      const url = env.cms + '/cms/syscnfGroup/update'
      return this.axios.post(url, body)
    }
    getExcByGroupId (id) {
      const url = env.cms + '/cms/syscnfMeta/getExcByGroupId?id=' + id
      return this.axios.get(url)
    }
    getIncByGroupId (id) {
      const url = env.cms + '/cms/syscnfMeta/getIncByGroupId?id=' + id
      return this.axios.get(url)
    }
    delAndSave (body) {
      const url = env.cms + '/cms/syscnfMeta/delAndSave'
      return this.axios.post(url, body)
    }
    deleteGroup (id) {
      const url = env.cms + '/cms/syscnfGroup/delete?id=' + id
      return this.axios.get(url)
    }
    batchDeleteAll (body) {
      const url = env.cms + '/cms/syscnfGroup/batchDelete'
      return this.axios.post(url, body)
      
  }
  //如果是空
  deleteByGroupId (groupId) {
    const url =env.cms+'/cms/syscnfGroupRelation/deleteByGroupId?hotelId='+env.hotelId+'&groupId='+groupId
    return this.axios.post(url)
  }
  
  }