<template>
    <div class="mainView">
        <div v-if="view" class="movie_view">
            <div class="view_info">
                <div class="item_label">电影栏目管理</div>
                <div class="item_search">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                        <i class="bi bi-search"></i>
                    </span>
                        </div>
                        <input type="text" class="form-control" placeholder="电影查询" v-model="condition" @blur="search">
                    </div>
                </div>
                <div class="item_search">
                    <select class="custom-select" id="inputGroupSelect01" v-model="language">
                        <option selected :value="0">中文(Chinese)</option>
                        <option :value="1">英文(English)</option>
                    </select>
                </div>
                <div class="item_search">
                    <button type="button" class="btn btn-primary" @click="refresh">刷新</button>
                </div>
            </div>
            <div class="movie_container">
                <div class="movie" @click="playMovie(movie)" v-if="movie.zhDesc && movie.enDesc"
                     v-for="(movie,index) in searched" :key="index">
                    <div class="index">
                        <span>{{ index + 1 }}</span>
                    </div>
                    <div class="poster_container">
                        <img class="poster" :src="language===0?movie.zhDesc.poster:movie.enDesc.poster" alt="">
                    </div>
                    <div class="name">{{ language === 0 ? movie.zhDesc.name : movie.enDesc.name }}</div>
                </div>
                <div class="placeholder" v-for="i in 6" :key="i"/>
            </div>
        </div>
        <MoviePlayer v-else :video-src="videoSrc" @quitPlayer="quitPlayer"></MoviePlayer>
    </div>
</template>

<script>
import MovieViewAPI from '@/api/MovieViewAPI';
import MoviePlayer from "@/pages/movieView/MoviePlayer";

export default {
    name: "MovieView",
    components: {
        MoviePlayer
    },
    data() {
        return {
            view: true,
            movies: [],
            language: 0,
            condition: '',
            searched: [],
            videoSrc: '',
        }
    },
    created() {
        MovieViewAPI.getMovieList().then(data => {
            this.movies = data;
            MovieViewAPI.getHotelMovieList().then(data => {
                let hotelMovies = data.map(meta => meta.id);
                this.movies = this.movies.filter(movie => {
                    return hotelMovies.indexOf(movie.meta.id) > -1;
                });
                this.searched = this.movies;
            });
        });
    },
    computed: {},
    methods: {
        refresh() {
            window.location.reload();
        },
        search() {
            this.searched = this.movies.filter(movie => {
                if (this.condition === '') {
                    return true;
                }
                if (movie.zhDesc && movie.enDesc) {
                    let zh = movie.zhDesc.name.indexOf(this.condition) > -1;
                    let en = movie.enDesc.name.indexOf(this.condition) > -1;
                    return zh || en;
                }
            });
        },
        playMovie(movie) {
            this.videoSrc = movie.meta.url;
            this.view = false;
        },
        quitPlayer() {
            this.view = true;
        }
    }
}
</script>

<style scoped lang="scss">
.movie_view {
    padding: 0 15%;
}

.view_info {
    margin-top: 20px;
}

.item_label {
    font-size: 23px;
    font-weight: bold;
    display: inline-block;
}

.item_search {
    display: inline-block;
    margin-left: 30px;
}

.movie_container {
    /* 弹性盒子 */
    display: flex;
    /* 沿行轴线两端对齐，子元素之间有间隙 */
    justify-content: space-between;
    /* 子元素溢出父容器时换行 */
    flex-flow: row wrap;

}

.movie {
    width: 175px;
    height: 253px;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px solid #007bff;
    border-radius: 10px;
}

.placeholder {
    width: 175px;
    height: 0;
    margin-right: 20px;
}

.index {
    height: 33px;
    background-color: #007bff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    span {
        margin-left: 15px;
        color: #FFFFFF;
        font-size: 20px;
    }
}

.poster_container {
    width: 172px;
    height: 100px;
    margin: 1px auto;
    border: 1px #4c4c4c;
}

.poster {
    width: 171px;
    height: 98px;
}

.name {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    padding: 15px;
    height: 120px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
</style>