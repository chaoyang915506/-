<template>
    <div class="container">
        <div class="row">
            <div class="col-5">
                <!-- 区域中文名 -->
                <div>
                    <div class="form-inline">
                        <label class="mr-4">区域中文名</label>
                        <div class="input-group mb-2 mr-sm-2">
                            <input
                                disabled
                                type="text"
                                class="form-control"
                                v-model="province.name"
                            />
                        </div>
                    </div>
                </div>
                <!-- 区域中文名 -->
                <div class="form-inline">
                    <label class="mr-4">全部区域</label>
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
                            <p v-if="matchCity == 'areaSon'">
                                <span>{{ item.name }}</span
                                >&nbsp;|&nbsp;<span>{{ item.nameEn }}</span>
                            </p>
                            <p v-if="matchCity == 'manageCity'">
                                <span>{{ item.area }}</span
                                >&nbsp;|&nbsp;<span>{{ item.cityName }}</span
                                >&nbsp;|&nbsp;<span>{{ item.province }}</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-2 center">
                <div>
                    <i
                        class="bi bi-arrow-right-square-fill iconsize"
                        @click="rightAll"
                    ></i>
                </div>
                <div>
                    <i
                        class="bi bi-arrow-left-square-fill iconsize"
                        @click="leftAll"
                    ></i>
                </div>
            </div>
            <div class="col-5">
                <!-- 区域中文名 -->
                <div>
                    <div class="form-inline">
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
                    <label class="mr-4">选中子区域</label>
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
                            <p v-if="matchCity == 'areaSon'">
                                <span>{{ item.name }}</span
                                >&nbsp;|&nbsp;<span>{{ item.nameEn }}</span>
                            </p>
                            <p v-if="matchCity == 'manageCity'">
                                <span>{{ item.area }}</span
                                >&nbsp;|&nbsp;<span>{{ item.cityName }}</span
                                >&nbsp;|&nbsp;<span>{{ item.province }}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="mt-4">
                    <button class="btn btn-dark" @click="saveSubmit">
                        确定
                    </button>
                    <button
                        type="button"
                        class="btn-dark btn ml-1"
                        @click="close"
                    >
                        返回
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AreaManageModuleApi from '@/api/AreaManageModuleApi'
export default {
    props: {
        //id
        areaId: {
            type: Number,
            required: true
        },
        //区分子区域areaSon和城市manageCity
        matchCity: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            province: {},//省份数据

            ChildrenList: [],//子区域数据
            AllDataList: [],//全部数据

            AllNotSeled: [],//未选的全部

            allareaSearch: '',//未选的search条件
            checkedSearch: '',//子区域search
        }
    },
    created () {
        this.getprovince()
    },
    computed: {
        // 未选的全部
        residuceList () {
            let condition = RegExp(this.allareaSearch, 'ig')
            return this.AllNotSeled.filter(item => {
                return this.allareaSearch == '' ? true : this.matchCity == 'areaSon' ? condition.test(item.name) || condition.test(item.nameEn) : condition.test(item.area) || condition.test(item.cityName) || condition.test(item.province)
            })
        },
        //子区域
        childrenSeledList () {
            let condition = RegExp(this.checkedSearch, 'ig')
            return this.ChildrenList.filter(item => {
                return this.checkedSearch == "" ? true : this.matchCity == 'areaSon' ? condition.test(item.name) || condition.test(item.nameEn) : condition.test(item.area) || condition.test(item.cityName) || condition.test(item.province)
            })

        }
    },
    methods: {
        //右边全部
        rightAll () {
            this.ChildrenList = [...this.ChildrenList, ...this.residuceList]

            let arr = []
            this.AllNotSeled.forEach(itd => {
                let index = this.ChildrenList.findIndex(item => {
                    if (this.matchCity == 'areaSon') {

                        if (item.id == itd.id) return true
                    } else {
                        if (item.cityId == itd.cityId) return true
                    }
                })
                if (index == -1) {
                    arr.push(itd)
                }
            })
            this.AllNotSeled = arr
            this.$nextTick(() => {
                this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
            })
        },
        leftAll () {
            this.AllNotSeled = [...this.AllNotSeled, ...this.childrenSeledList]
            let arr = []
            this.ChildrenList.forEach(item => {
                let index = this.AllNotSeled.findIndex(idx => {
                    if (this.matchCity == 'areaSon') {

                        if (item.id == idx.id) return true
                    } else {
                        if (item.cityId == idx.cityId) return true
                    }
                })
                if (index == -1) {
                    arr.push(item)
                }
            })
            this.ChildrenList = arr
            this.$nextTick(() => {
                this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
            })
        },
        //给选中区域添加
        moveitemAll (item, index) {

            if (this.matchCity == 'areaSon') {
                this.AllNotSeled = this.AllNotSeled.filter(idx => idx.id !== item.id)
            } else {
                this.AllNotSeled = this.AllNotSeled.filter(idx => idx.cityId !== item.cityId)

            }
            this.ChildrenList.push(item)
            this.$nextTick(() => {
                this.$refs.rightbox.scrollTop = this.$refs.rightbox.scrollHeight
            })
        },
        //给选中区域删除
        pruneList (item, index) {
            if (this.matchCity == 'areaSon') {
                this.ChildrenList = this.ChildrenList.filter(idx => idx.id !== item.id)
            } else {
                this.ChildrenList = this.ChildrenList.filter(idx => idx.cityId !== item.cityId)
            }

            this.AllNotSeled.push(item)
            this.$nextTick(() => {
                this.$refs.leftbox.scrollTop = this.$refs.leftbox.scrollHeight
            })
        },
        //获取数据省份
        async getprovince () {
            try {
                const data = await AreaManageModuleApi.getprovince(this.areaId)
                // console.log(data, '当前省份')
                this.province = data
                if (this.matchCity == 'areaSon') {
                    const Children = await AreaManageModuleApi.getAreaChildren(this.areaId)
                    // console.log(Children, '子区域')
                    this.ChildrenList = Children
                    const AllData = await AreaManageModuleApi.getAllprovince()
                    // console.log(AllData, '全部的')
                    this.AllDataList = AllData
                    //筛选all数据
                    this.AllDataList.forEach(item => {
                        const index = this.ChildrenList.findIndex(x => {
                            if (item.id == x.id) return true
                        })
                        if (index === -1) {
                            this.AllNotSeled.push(item)
                        }
                    })
                } else {
                    const AllData = await AreaManageModuleApi.getAllCity()
                    // console.log(AllData, '全部的')
                    this.AllDataList = AllData

                    const Children = await AreaManageModuleApi.residueCity(this.areaId)
                    // console.log(Children, '子区域')
                    this.AllDataList.forEach(item => {
                        const index = Children.findIndex(x => {
                            if (item.cityId == x.cityId) {
                                this.ChildrenList.push(item)
                            }
                        })
                    })
                    this.AllDataList.forEach(item => {
                        const index = Children.findIndex(x => {
                            if (item.cityId == x.cityId) return true
                        })
                        if (index === -1) {
                            this.AllNotSeled.push(item)
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },
        async saveSubmit () {
            try {
                if (this.matchCity == 'areaSon') {
                    await AreaManageModuleApi.Managesavecontent({ areaId: this.areaId, list: this.ChildrenList.map(item => item.id) })
                } else {
                    await AreaManageModuleApi.mergeCity({ areaId: this.areaId, list: this.ChildrenList.map(item => item.cityId) })
                }
                await this.$info('保存内容成功')
                await this.close()
            } catch (error) {
                console.log(error)
            }
        },
        close () {
            this.$emit('close')
        }
    },
}
</script>

<style lang="scss" scoped>
.iconsize {
    font-size: 35px;
}

.center {
    padding: 41% 0 41% 4%;
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
}
</style>