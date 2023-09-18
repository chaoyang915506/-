<template>
    <div id="Access">
        <table class="table">
            <thead>
            <tr>
                <th scope="col">访问者</th>
                <th scope="col">访问URL</th>
                <th scope="col">访问时间</th>
                <th scope="col">是否放行</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(access,index) in accesses" :key="index">
                <td>{{ access.managerName }}</td>
                <td>{{ access.accessUrl }}</td>
                <td>{{ access.accessTime | dateFormat }}</td>
                <td>{{ access.isPassed === 1 ? "是" : "否" }}</td>
            </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" @click="toFirstPage()">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li :class="prevItemClass" @click="changePrevPage()">
                    <a class="page-link" href="#">上一页</a>
                </li>
                <li :class="firstItemClass" @click="changePage(firstPage,1)">
                    <a class="page-link" href="#">{{ firstPage }}</a>
                </li>
                <li :class="secondItemClass" @click="changePage(secondPage,2)">
                    <a class="page-link" href="#">{{ secondPage }}</a>
                </li>
                <li :class="thirdItemClass" @click="changePage(thirdPage,3)">
                    <a class="page-link" href="#">{{ thirdPage }}</a>
                </li>
                <li :class="nextItemClass" @click="changeNextPage()">
                    <a class="page-link" href="#">下一页</a>
                </li>
                <li class="page-item" @click="toLastPage()">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import AccessApi from '@/api/AccessApi'

export default {
    name: "Access",
    data() {
        return {
            accesses: [],
            total: 0,
            maxPage: 1,
            currentPage: 1,
            firstPage: 1,
            secondPage: 2,
            thirdPage: 3,
            pageSize: 10,
            firstItemClass: "page-item active",
            secondItemClass: "page-item",
            thirdItemClass: "page-item",
            prevItemClass: "page-item",
            nextItemClass: "page-item",
            activeIndex: 1,
        }
    },
    created() {
        this.accessByPage();
    },
    methods: {
        accessByPage() {
            AccessApi.accessByPage(this.currentPage, this.pageSize).then(data => {
                if (data == null) {
                    this.accesses = [];
                    return;
                }
                this.total = data.total;
                this.accesses = data.data;
                let left = this.total % this.pageSize;
                if (left > 0) {
                    this.maxPage = Math.floor(this.total / this.pageSize) + 1;
                } else {
                    this.maxPage = Math.floor(this.total / this.pageSize);
                    if (this.maxPage === 0) {
                        this.maxPage = 1;
                    }
                }
            });
        },
        toFirstPage() {
            if (this.currentPage === 1) {
                return;
            }
            this.firstPage = 1;
            this.secondPage = 2
            this.thirdPage = 3;
            this.changePage(1, 1);
        },
        toLastPage() {
            if (this.currentPage === this.maxPage) {
                return;
            }
            this.firstPage = this.maxPage - 2;
            this.secondPage = this.maxPage - 1
            this.thirdPage = this.maxPage;
            this.changePage(this.maxPage, 3);
        },
        changePage(pageNo, index) {
            if (pageNo > this.maxPage) {
                return;
            }
            if (index > 0 && index < 4) {
                this.firstItemClass = "page-item";
                this.secondItemClass = "page-item";
                this.thirdItemClass = "page-item";

                if (index === 1) {
                    this.firstItemClass = "page-item active"
                } else if (index === 2) {
                    this.secondItemClass = "page-item active"
                } else {
                    this.thirdItemClass = "page-item active"
                }
            }
            this.activeIndex = index;
            this.currentPage = pageNo;
            this.accessByPage();
        },
        changePrevPage() {
            if (this.currentPage === 1) {
                return;
            }
            if (this.activeIndex === 1) {
                this.firstPage = this.firstPage - 1;
                this.secondPage = this.secondPage - 1;
                this.thirdPage = this.thirdPage - 1;
                this.changePage(this.currentPage - 1, 1);
            } else {
                this.changePage(this.currentPage - 1, this.activeIndex - 1);
            }
        },
        changeNextPage() {
            if (this.currentPage === this.maxPage) {
                return;
            }
            if (this.activeIndex === 3) {
                this.firstPage = this.firstPage + 1;
                this.secondPage = this.secondPage + 1;
                this.thirdPage = this.thirdPage + 1;
                this.changePage(this.currentPage + 1, 3);
            } else {
                this.changePage(this.currentPage + 1, this.activeIndex + 1);
            }
        },
    }
}
</script>

<style scoped>

</style>