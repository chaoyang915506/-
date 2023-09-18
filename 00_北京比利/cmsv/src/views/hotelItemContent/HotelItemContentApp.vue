<template>
    <div class="container-fluid h-100">
        <div class="row h-100"> 
            <div class="col-12 mt-3" style="height: 5%;">
                <form class="form-inline p-3 bg-light" autocomplete="off">
                    <label class="col-auto">选择分类：</label>
                    <select class="col-2 form-control" v-model="itemFilter">
                        <option v-for="(hotelItem, i) in hotelItemList" :key="i" :value="hotelItem">{{ hotelItem.name }}</option>
                    </select>
                    <div class="col-auto">
                        <div class="btn btn-outline-primary mr-1" @click="create">添加内容</div>
                        <div class="btn btn-outline-primary mr-1" @click="selectAll">全选</div>
                        <div class="btn btn-outline-primary mr-1" @click="unselectAll">全不选</div>
                        <div class="btn btn-danger" @click="del">删除所选</div>
                    </div>
                    <div class="form-text text-danger">{{ `注：上传时需要提供${langList.length}种语言的内容` }}</div>
                </form>
            </div>
            <div class="col-12 mt-4" style="height: 90%;">
                <div v-show="view === 'list'" class="card h-99">
                    <div class="card-header">
                        <div
                            v-for="lang in langList"
                            :key="lang.langId"
                            class="btn mr-1"
                            :class="[ langFilter === lang.langId ? 'btn-primary' : 'btn-light']"
                            @click="langFilter = lang.langId"
                        >{{ lang.label}}</div>
                    </div>
                    <div class="card-body overflow-auto" style="height: 800px;">
                        <div class="row">
                            <div v-if="contents.length === 0" class="offset-5 col-2">
                                <button class="btn btn-outline-primary btn-lg btn-block" @click="create">添加内容</button>
                            </div>
                            <div
                                v-else
                                v-for="(content, i) in contents"
                                :key="content.miId"
                                class="col-xl-3 col-lg-4 col-md-5 col-sm-6 mb-2"
                                draggable="true"
                                @dragstart="onDrag($event, i)"
                                @drop.prevent="onDrop($event, i)"
                                @dragover.prevent.stop
                            >
                                <hotel-content-item
                                    class="content"
                                    :content="content"
                                    :selected="content.selected"
                                    @update:selected="select(content)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="view === 'form'" class="col-6 offset-1 p-3">
                    <hotel-content-form
                        :value="hotelContent"
                        :items="itemFilter.hotelItemList"
                        @change="initContents"
                        @close="view = 'list'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LangApi from '@/api/LangApi'
import ItemHotelApi from '@/api/ItemHotelApi'
import Api from '@/api/Api'
import ItemBasicApi from '@/api/ItemBasicApi'
import { HotelContent } from '@/api/models/HotelContent'
import CoolModal from '@/components/CoolModal.vue'
import HotelContentItem from './HotelContentItem.vue'
import HotelContentForm from './HotelContentForm.vue'
import { mapState } from 'vuex'
import HotelContentApi from '@/api/HotelContentApi'

export default {
    name: 'HotelItemContentApp',
    components: { CoolModal, HotelContentItem, HotelContentForm },
    data() {
        return {
            view: 'list',
            itemBasicArr: [],
            itemArr: [],
            contentArr: [],
            langFilter: -1,
            hotelItemList: [],
            itemFilter: {},
            hotelContent: {},
        }
    },
    computed: {
        ...mapState({
            langList: state => state.langList,
        }),
        items() {
            let ret = this.itemFilter.hotelItemList;

            if (this.langFilter !== -1) {
                ret = ret.filter(item => item.langId === this.langFilter);
            }

            return ret ? ret : [];
        },
        contents() {
            return this.contentArr.filter(content => this.items.find(item => item.itemId === content.itemId) !== undefined)
                .map(content => {
                    return { ...content, selected: false }
                }).sort((a, b) => a.sort - b.sort)
        }
    },
    methods: {
        create() {
            this.hotelContent = new HotelContent();
            this.hotelContent.langId = this.langFilter === -1 ? this.langList[0].langId : this.langFilter;

            this.view = 'form'
        },
        initHotelItems() {
            ItemHotelApi.list()
                .then(data => {
                    this.hotelItemList = []
                    this.itemBasicArr.filter(itemBasic => itemBasic.type === 53)
                        .forEach(itemBasic => {
                            const hotelItemList = data.list.filter(hotelItem => hotelItem.itemBasicId === itemBasic.itemBasicId)
                            if (hotelItemList.length !== 0) {
                                this.hotelItemList.push({
                                    name: hotelItemList.map(hotelItem => hotelItem.itemMenuName).reduce((a, b) => a + ' | ' + b),
                                    hotelItemList,
                                })
                            }
                        })
                })
                .catch(err => this.$error(err))
        },
        initContents() {
            this.contentArr = [];

            for (let item of this.itemArr) {
                HotelContentApi.list(item.itemId)
                    .then(data => this.contentArr.push(...data))
                    .catch(err => this.$error(err))
            }
        },
        select(_content) {
            _content.selected = !_content.selected;

            this.$forceUpdate();
        },
        selectAll() {
            this.contents.forEach(content => content.selected = true)

            this.$forceUpdate();
        },
        unselectAll() {
            this.contents.forEach(content => content.selected = false)

            this.$forceUpdate()
        },
        del() {
            const idArr = this.contents.filter(content => content.selected)
                .map(content => content.miId);

            if (idArr.length === 0) {
                return;
            }

            this.$confirm('是否删除所选内容？')
                .then(ok => {
                    if (ok) {
                        return HotelContentApi.delete(idArr).then(data => {
                            this.$info('删除成功')
                                .then(() => {
                                    this.initContents()
                                })
                        })
                    }
                })
                .catch(err => this.$error(err))
        },
        onDrag(e, i) {
            e.dataTransfer.setData('i', i)
        },
        onDrop(e, j) {
            const i = e.dataTransfer.getData('i')

            const miIds = this.contents.map(content => content.miId);
            [miIds[i], miIds[j]] = [miIds[j], miIds[i]]

            HotelContentApi.sort(miIds)
                .then(data => {
                    this.initContents()
                })
                .catch(err => this.$error('调整排序失败'))
        },
    },
    created() {
        Api.all([LangApi.list(), ItemBasicApi.list(), ItemHotelApi.list()],
            (langData, itemBasicData, hotelItemData) => {
                this.$store.commit('setLangList', langData);
                this.langFilter = langData[0].langId;

                this.itemBasicArr = itemBasicData.list;

                let items = [];

                this.hotelItemList = [];
                itemBasicData.list
                    .filter(itemBasic => itemBasic.type === 53)
                    .forEach(itemBasic => {
                        const hotelItemList = hotelItemData.list.filter(hotelItem => hotelItem.itemBasicId === itemBasic.itemBasicId)
                        if (hotelItemList.length !== 0) {
                            this.hotelItemList.push({
                                name: hotelItemList.map(hotelItem => hotelItem.itemMenuName).reduce((a, b) => a + ' | ' + b),
                                hotelItemList,
                            })

                            items.push(...hotelItemList);
                        }
                    });

                this.itemArr = items;
                this.itemFilter = this.hotelItemList[0];

                this.initContents()
            })
            .catch(err => this.$error(err))
    }
}
</script>

<style scoped lang="scss">
.content {
    width: 280px;
    height: 200px;
}
</style>