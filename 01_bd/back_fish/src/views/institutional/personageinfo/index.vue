  <template>
  <div>
    <div v-if="kaikai == false" class="app" ref="content">
      <div class="back" @click="back">&lt;返回</div>
      <!-- 个人简历头 -->

      <div class="presonage" ref="presonage">
        <div class="info">
          <img class="imginfo" :src="imgurl + infodata.imagePath" alt="" />
          <div class="infoclass">
            <div class="name">
              {{ infodata.zhName }}<sub>&emsp;&emsp;{{ infodata.gender }} </sub>
            </div>
            <div class="position">{{ infodata.zw }}</div>
            <!-- <div class="userinfo">
              <div>个人简历:</div>
              <span :class="[info == true ? 'elipsis' : '']">{{}}</span>
            </div> -->
            <!-- <div v-if="height > 151" class="unfold" @click="info = !info">
              {{ info == true ? "展开" : "收起" }}
            </div> -->
          </div>
        </div>

        <!-- <div class="cloud"></div> -->

        <!-- 时间轴 -->
        <div class="time">
          <!-- 词云图 -->
          <div class="left">
            <cloudpic style="height: 100%; width: 100%" />
          </div>
          <div class="right">
            <div class="character_css">
              <a @click="goAnchor(0)" :class="[page == 0 ? 'active_nav' : '']">
                人物履历
              </a>
              <a @click="goAnchor(1)" :class="[page == 1 ? 'active_nav' : '']">
                个人能力
              </a>
              <a @click="goAnchor(2)" :class="[page == 2 ? 'active_nav' : '']">
                人物关系
              </a>
            </div>
            <div style="padding: 23px 0px 14px">
              <div class="line">
                <div :class="['dot', page == 0 ? 'active_dot' : '']"></div>
                <div :class="['dot', page == 1 ? 'active_dot' : '']"></div>
                <div :class="['dot', page == 2 ? 'active_dot' : '']"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人简历 -->
      <div class="presonage_content" id="figure">
        <div class="ittle_info"><span></span>&emsp;个人简历:</div>
        <div class="info_content" style="display: flex">
          <div class="perinfo">
            <el-tabs v-model="acitveName" tab-position="top">
              <!-- 第一个下内容 -->
              <el-tab-pane label="教育经历" name="one" class="tab_css">
                <div class="education" v-for="(i, j) in education" :key="j">
                  <img
                    :src="imgurl + i.imagePath"
                    class="img"
                    alt=""
                    onerror="this.src='/img/ui/u1635.svg'"
                  />
                  <div class="detailed">
                    <div>{{ i.eduScl }}</div>
                    <div>
                      <img :src="school" class="icon" alt="" />
                      {{ i.eduDegree }}
                    </div>
                    <div>
                      <img class="icon" :src="clock" alt="" />
                      {{ i.eduBeginTime }}——{{ i.eduEndTime }}年
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="工作经历" name="second" class="tab_css">
                <div class="education" v-for="(k, y) in worklist" :key="y">
                  <img
                    :src="imgurl + k.imagePath"
                    onerror="this.src='/img/ui/u1635.svg'"
                    class="img"
                    alt=""
                  />
                  <div class="detailed">
                    <div>{{ k.post }}</div>
                    <div>
                      <img :src="school" class="icon" alt="" /> {{ k.orgName }}
                    </div>
                    <div>
                      <img class="icon" :src="clock" alt="" />{{
                        k.begintime
                      }}——{{ k.endtime }}年
                    </div>
                    <div>
                      <img
                        class="icon"
                        onerror="this.src='/img/ui/u1635.svg'"
                        :src="map"
                        alt=""
                      />
                      {{ k.addr }}
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="演训经历" name="three" class="tab_css">
                <div class="education" v-for="(k, y) in yxdata" :key="y">
                  <img
                    :src="imgurl + k.imagePath"
                    onerror="this.src='/img/ui/u1635.svg'"
                    class="img"
                    alt=""
                  />
                  <div class="detailed">
                    <div>{{ k.tEvent }}</div>
                    <div>
                      <img :src="school" class="icon" alt="" /> {{ k.orgName }}
                    </div>
                    <div>
                      <img
                        class="icon"
                        :src="clock"
                        alt=""
                        onerror="this.src='/img/ui/u1635.svg'"
                      />{{ k.tDatetime }}
                    </div>
                    <!-- <div>
                      <img class="icon" :src="map" alt="" /> {{ k.addr }}
                    </div> -->
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 图谱 -->
          <div class="alas_message" style="margin-left: 10px">
            <el-tabs value="one" tab-position="top">
              <!-- 第一个下内容 -->
              <el-tab-pane label="个人简历" name="one" class="tab_css">
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- 个人能力 -->
      <div class="presonage_content" id="power">
        <div class="ittle_info"><span></span>&emsp;个人能力:</div>
        <div class="info_content">
          <div>
            <el-tabs v-model="acitveName1" tab-position="top">
              <!-- 第一个下内容 -->
              <el-tab-pane label="技能" name="one">
                <div class="title_ab">核心技能({{ jndata1.length }})</div>
                <div class="ability">
                  <div v-for="(k, z) in jndata1" :key="z">{{ k.hxjn }}</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="获得荣誉" name="second">
                <div class="title_ab">全部荣誉({{ jndata2.length }})</div>
                <div class="honor">
                  <div v-for="(y, q) in jndata2" :key="q">
                    <span class="first">{{ y.hdry }}</span
                    >&emsp;&emsp;<span>{{ y.hdryTime }}</span>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="评价" name="three">
                <div class="title_ab">全部评价({{ jndata3.length }})</div>
                <div class="evaluate">
                  <div
                    v-for="(h, w) in jndata3"
                    :key="w"
                    style="margin-top: 20px;
}"
                  >
                    <span class="first">{{ h.pjTitle }}</span
                    >&emsp;&emsp;<span>{{ h.pjTime }}</span>
                    <div class="content">
                      {{ h.pjContent }}
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="其他" name="four">
                <div class="title_ab">其他({{ jndata4.length }})</div>
                <div class="evaluate">
                  <!-- <div
                  v-for="(b,p) in jndata4"
                  :key="p"
                  style="margin-top: 20px;
}"
                >
                  <span class="first">xxx评价</span>&emsp;&emsp;<span
                    >2021-12-20</span
                  >
                  <div class="content">
                    fsdafsdafsdafsdafsadfsadfasdfsadfsdafsadfsdafsadfsadfasdfsad
                  </div>
                </div> -->
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <!-- 人物关系 -->
      <div class="presonage_content" id="concern">
        <div class="ittle_info"><span></span>&emsp;人物关系:</div>
        <div class="info_content">
          <div class="title_ab">同事({{ fellowlist.length }})</div>
          <div class="character">
            <div
              class="relation"
              @click="pushinfo(j)"
              v-for="(j, q) in fellowlist"
              :key="q"
            >
              <img
                :src="imgurl + j.imagePath"
                alt=""
                class="pic_cl"
                onerror="this.src='/img/ui/u1635.svg'"
              />
              <div class="info">{{ j.zhName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <personageinfo v-if="kaikai" :kaikai="openall" :id="ids" />
  </div>
</template>

<script>
import { 查询图片服务器地址 } from "@/api/situation/situation";

import {
  组织人员详情查询,
  人员教育经历查询,
  人员工作经历查询,
  个人能力查询,
  人物关系查询,
  组织机构获取人员演训经历查询,
} from "@/api/institutional/institutional.js";
import bus from "@/utils/bus.js";
export default {
  name: "personageinfo",
  components: {
    cloudpic: () => import("@/components/eCharts/cloudpic/index.vue"),
  },
  props: {
    kaikai: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      require: true,
    },
    imgurl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      img: "/img/ui/u1635.svg",
      acitveName: "one",
      acitveName1: "one",
      school: "/img/ui/school.svg",
      map: "/img/ui/map.svg",
      clock: "/img/ui/clock_icon_u1508.svg",
      menu: "/img/ui/menu.svg",
      atlas: "/img/ui/atlas.svg",
      page: 0,
      info: true,
      wenzi: "展开",
      height: 0,
      infodata: {}, //个人信息
      education: [], //教育
      worklist: [], //工作
      imgurl: "",
      jndata1: [],
      jndata2: [],
      jndata3: [],
      jndata4: [],
      fellowlist: [], //同事
      openall: false,
      ids: 0,
      yxdata: [], //演训数据
    };
  },
  created() {
    查询图片服务器地址().then((res) => {
      // console.log(res.data.imageServerUri);
      this.imgurl = res.data.imageServerUri;
      // console.log(this.imgurl, "rrrr");
    });
  },
  watch: {
    id: {
      handler(val) {
        if (val) {
          this.getallinfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getallinfo();
  },
  methods: {
    pushinfo(i) {
      // console.log(i, "");
      this.ids = i.orgUserId;

      this.kaikai = true;
    },
    back() {
      if (this.kaikai == false) {
        bus.$emit("closeuserinfo", false);
      } else {
        this.$parent.$data.openall = false;
      }
    },
    async getallinfo() {
      // console.log(this.id, "id");
      let info = await 组织人员详情查询(this.id);
      let res = await 人员教育经历查询(this.id);
      let res1 = await 人员工作经历查询(this.id);
      let resd = await 组织机构获取人员演训经历查询(this.id);
      // console.log(resd, "res");
      this.yxdata = resd.rows;
      this.worklist = res1.rows;
      console.log(res1, "工作");
      this.education = res.rows;
      console.log(res, "教育");
      this.infodata = info.data;
      // let rs = [{ id: this.id }];
      let jn1 = await 个人能力查询({
        orgUserId: this.id,
        psType: 1,
      });
      let jn2 = await 个人能力查询({
        orgUserId: this.id,
        psType: 2,
      });
      let jn3 = await 个人能力查询({
        orgUserId: this.id,
        psType: 3,
      });
      let jn4 = await 个人能力查询({
        orgUserId: this.id,
        psType: 4,
      });
      console.log(resd, "演训");
      // console.log(jn1, jn2, jn3, jn4, "red");
      console.log(jn1, "核心技能");
      this.jndata1 = jn1.rows;
      this.jndata2 = jn2.rows;
      this.jndata3 = jn3.rows;
      this.jndata4 = jn4.rows;

      let params = {
        orgUserId: this.id ? this.id : "",
        ddId: this.infodata.ddId ? this.infodata.ddId : "",
        sideNum: this.infodata.sideNum ? this.infodata.sideNum : "",
        slbId: this.infodata.slbId ? this.infodata.slbId : "",
        zdId: this.infodata.zdId ? this.infodata.zdId : "",
      };
      let res8 = await 人物关系查询(params);
      console.log(params, "red");
      console.log(res8, "同事");
      this.fellowlist = res8.rows;
    },
    goAnchor(val) {
      this.page = val;
      let blocks = document.querySelectorAll(".presonage_content");
      //   let 40 = 40; //滚动步长
      let currentScrollTop = this.$refs.content.scrollTop;
      let tragetOffsetTop = blocks[val].offsetTop;
      if (currentScrollTop > tragetOffsetTop) {
        const smoothUp = () => {
          if (currentScrollTop >= tragetOffsetTop) {
            if (currentScrollTop - tragetOffsetTop >= 40) {
              currentScrollTop -= 40;
              setTimeout(smoothUp, 1);
            } else {
              currentScrollTop = tragetOffsetTop - 40;
            }
            this.$refs.content.scrollTop = currentScrollTop;
          }
        };
        smoothUp();
      } else {
        const smoothDown = () => {
          if (currentScrollTop <= tragetOffsetTop) {
            if (tragetOffsetTop - currentScrollTop >= 40) {
              currentScrollTop += 40;
              setTimeout(smoothDown, 1);
            } else {
              currentScrollTop = tragetOffsetTop - 40;
            }
            this.$refs.content.scrollTop = currentScrollTop;
          }
        };
        smoothDown();
      }
    },
    handleScroll() {
      let scrollTop = this.$refs.content.scrollTop;
      let blocks = document.querySelectorAll(".presonage_content");
      blocks.forEach((item, index) => {
        if (scrollTop >= item.offsetTop) {
          this.page = index;
        }
      });
    },
  },
  mounted() {
    this.height = window.getComputedStyle(this.$refs.presonage).height;
    this.$refs.content.onscroll = () => {
      this.handleScroll();
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.tab_css {
  overflow: auto;
  height: 420px;
}
.back {
  position: absolute;
  left: 10px;
  top: 26px;
  // width: c;
  z-index: 999;
  color: #0d9cb4;
  font-weight: 700;
  font-size: 17px;
}
</style>