<template>
    <div class="container">
        <h2 class="mt-2">媒体排序</h2>
        <cool-loading :loading="loading"></cool-loading>
        <div class="row">
            <div class="col-5">
                <!-- 区域中文名 -->
                <div>
                    <div class="form-inline">
                        <label class="mr-4">基础栏目</label>
                        <div class="input-group mb-2 mr-sm-2">
                            <select
                                @change="Selected"
                                ref="select"
                                class="form-control"
                                v-model="selectColumn"
                            >
                                <option
                                    :value="item.itemBasicId"
                                    v-for="item in columnList"
                                    :key="item.itemBasicId"
                                >
                                    {{ item.itemBasicDesc }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <!-- 区域中文名 -->
                <div class="form-inline">
                    <label class="mr-4">媒体名称</label>
                    <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="bi bi-search"></i>
                            </div>
                        </div>
                        <input
                            type="text"
                            v-model="allareaSearch"
                            class="form-control"
                        />
                    </div>
                </div>
                <!-- 盒子 -->
                <div class="boxstyle" ref="leftbox">
                    <ul>
                        <li
                            v-for="(item, index) in residuceList"
                            :key="item.id"
                            @click="moveitemAll(item, index)"
                        >
                            <p>
                                {{ item.meta.name }}
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-2 center">
                <!-- 区域中文名 -->

                <!-- <div class="form-inline" style="visibility: hidden">
                    <label class="mr-4">基础栏目</label>
                    <div class="input-group mb-2 mr-sm-2"></div>
                </div> -->

                <!-- 区域中文名 -->
                <!-- <div class="form-inline" style="visibility: hidden">
                    <label class="mr-4">媒体名称</label>
                    <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="bi bi-search"></i>
                            </div>
                        </div>
                        <input type="text" class="form-control" />
                    </div>
                </div> -->
                <div class="arrows">
                    <i
                        class="bi bi-arrow-right-square-fill iconsize"
                        @click="rightAll"
                    ></i>
                    <i
                        class="bi bi-arrow-left-square-fill iconsize"
                        @click="leftAll"
                    ></i>
                </div>
                <div></div>
            </div>
            <div class="col-5">
                <!-- 区域中文名 -->
                <div>
                    <div class="form-inline" style="visibility: hidden">
                        <label class="mr-4">区域英文名</label>
                        <div class="input-group mb-2 mr-sm-2">
                            <input
                                disabled
                                type="text"
                                class="form-control"
                                v-model="province.nameEn"
                            />
                        </div>
                    </div>
                </div>
                <!-- 区域中文名 -->
                <div class="form-inline">
                    <label class="mr-4">媒体名称</label>
                    <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="bi bi-search"></i>
                            </div>
                        </div>
                        <input
                            type="text"
                            v-model="checkedSearch"
                            class="form-control"
                        />
                    </div>
                </div>
                <!-- 盒子 -->
                <div class="boxstyle" ref="rightbox">
                    <ul>
                        <li
                            v-for="(item, index) in childrenSeledList"
                            :key="item.id"
                            @click="pruneList(item, index)"
                        >
                            <p>
                                {{ item.meta.name }}
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="mt-4">
                    <button class="btn btn-dark" @click="saveSubmit">
                        保存排序
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MediaSortApi from '@/api/MediaSortApi'
import CoolLoading from '@/components/CoolLoading.vue'
export default {
    data () {
        return {
            columnList: [],//栏目
            selectColumn: '',//选择的栏目
            AllNotSeled: [],//全部
            allareaSearch: '',//未选的search条件


            // AllDataList: [],//全部数据

            ChildrenList: [],//子区域数据

            province: {},//省份数据

            checkedSearch: '',//子区域search

            loading: false,
        }
    },
    created () {
        this.getcolumn()
    },
    computed: {
        // 未选的全部
        residuceList () {
            let condition = RegExp(this.allareaSearch, 'ig')
            return this.AllNotSeled.filter(item => {
                return this.allareaSearch == '' ? true : condition.test(item.meta.name)
            })
        },
        //子区域
        childrenSeledList () {
            let condition = RegExp(this.checkedSearch, 'ig')
            return this.ChildrenList.filter(item => {
                return this.checkedSearch == "" ? true : condition.test(item.meta.name)
            })

        }
    },
    components: {
        CoolLoading,
    },
    methods: {
        //选中
        async Selected () {
            try {
                this.AllNotSeled = []
                this.ChildrenList = []
                const data = await MediaSortApi.getColumnCountApi(this.columnList.find(item => item.itemBasicId == this.selectColumn).type)
                this.AllNotSeled = data
            } catch (error) {
                console.log(error)
            }
        },
        async getcolumn () {
            try {
                const data = await MediaSortApi.getColumnApi()

                this.selectColumn = data[0].itemBasicId

                this.columnList = data
                const seled = await MediaSortApi.getColumnCountApi(this.columnList.find(idx => idx.itemBasicId == this.selectColumn).type)
                // console.log(seled)
                this.AllNotSeled = seled
            } catch (error) {
                console.log(error)
            }
        },
        //右边全部
        rightAll () {
            // console.log('goright')
            if (this.AllNotSeled.length == 0) return
            this.ChildrenList = [...this.ChildrenList, ...this.residuceList]
            let arr = []
            this.AllNotSeled.forEach(it => {
                let index = this.ChildrenList.findIndex(idx => {
                    if (it.meta.id == idx.meta.id) return true
                })
                if (index == -1) {
                    arr.push(it)
                }
            })
            this.AllNotSeled = arr
            this.$nextTick(() => {
                this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
            })
        },
        leftAll () {
            // console.log('goleft', this.ChildrenList.length)
            if (this.ChildrenList.length == 0) return
            this.AllNotSeled = [...this.residuceList, ...this.childrenSeledList]
            let arr = []


            this.ChildrenList.forEach(idx => {
                let index = this.AllNotSeled.findIndex(item => {
                    if (item.meta.id == idx.meta.id) return true
                })
                if (index == -1) {
                    arr.push(idx)
                }
            })

            this.ChildrenList = arr
            this.$nextTick(() => {
                // console.log(this.$refs.leftbox.scrollHeight)
                this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
            })
        },
        //给选中区域添加
        moveitemAll (item, index) {
            // console.log('添加')
            this.AllNotSeled = this.residuceList.filter(idx => idx.meta.id !== item.meta.id)
            this.ChildrenList.push(item)
            this.$nextTick(() => {
                this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
            })
        },
        //给选中区域删除
        pruneList (item, index) {

            this.ChildrenList = this.childrenSeledList.filter(idx => idx.meta.id !== item.meta.id)
            this.AllNotSeled.push(item)
            this.$nextTick(() => {
                // console.log(this.$refs.leftbox.scrollHeight)
                this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
            })
        },
        async saveSubmit () {
            try {
                this.loading = true
                let data = this.ChildrenList.map((item, index) => {
                    return {
                        mediaId: item.meta.id,
                        sort: index
                    }
                })
                // console.log(data, 'data')
                if (data.length < this.ChildrenList.length + this.AllNotSeled.length) {
                    this.loading = false
                    return this.$error('左侧的列表要全部移到右边列表中')
                }

                await MediaSortApi.savesortApi({ list: [...data], metaType: this.selectColumn })
                this.loading = false
                await this.Selected()

                this.ChildrenList = []
                await this.$info('保存排序成功')

            } catch (error) {
                this.loading = false

                console.log(error)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.iconsize {
    font-size: 35px;
}
.center {
    // margin: 0 auto;
    display: flex;
    // position: absolute;

    // padding: 41% 0 41% 4%;
    // height: 600px;
}
::v-deep .form-inline .input-group,
.form-inline .custom-select {
    width: 55%;
}

label {
    width: 20%;
}
.boxstyle {
    margin-top: 5%;
    text-align: center;
    width: 83%;
    border: 2px solid #8f8f8f;
    height: 600px;
    padding: 5% 5% 5% 0;
    border-radius: 10px;
    overflow: auto;
}
li {
    list-style: none;
    margin-bottom: 3%;
    margin-right: 6%;
    border-bottom: 1px solid #8f8f8f;
    padding-bottom: 5%;
}
p {
    padding: 0;
    margin: 0;
    line-height: 1.1;
    word-wrap: break-word;
}
.arrows {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>