// /cms/cmsMovieController/getMovieListByArea?areaId=1&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNeUNvb2xUViIsImlkIjoiRTc5MDA4QjA5NjQ4NzEyNTY0RUU5Qzg0MDExOTBDNTciLCJleHAiOjE2MzM5NDM4OTgsInVzZXJOYW1lIjoic3VwZXIifQ.tR_Whck3miFZ8BQTQWZGcsKDAn3Y-lyNr6VynF7Nz0Y
import Api from './Api'
import env from "@/env"

export default new class extends Api {
    constructor() {
        super()
    }

    getMovieList() {
        const url = env.cms + '/cms/cmsMovieController/getMovieListByArea?areaId=1';
        return this.axios.get(url);
    }

    getHotelMovieList() {
        const url = env.cms + '/cms/cmsMovieController/selectByHotelId?hotelId=' + env.hotelId;
        return this.axios.get(url);
    }
}