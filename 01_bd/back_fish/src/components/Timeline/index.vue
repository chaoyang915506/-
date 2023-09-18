<template>
  <main>
    <section class="page-section">
      <div class="container">
        <div class="timeline">
          <div class="timeline__wrap">
            <div class="timeline__items">
              <div
                class="timeline__item"
                v-for="i in timeline.lifedata"
                :key="i.id"
              >
                <div class="timeline__content">
                  <h2>{{ parseTime(i.endtime, "{y}年{m}月{d}日") }}</h2>
                  <p>
                    {{ i.c1 + i.event }}
                  </p>
                </div>
              </div>
              <!-- <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2022</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div> -->
              <!-- <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2022</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2020</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2019</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2018</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2017</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2004</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div>
              <div class="timeline__item">
                <div class="timeline__content">
                  <h2>2002</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer dignissim neque condimentum lacus dapibus.
                  </p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { parseTime } from "@/utils/ruoyi";
export default {
  props: {
    timeline: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    option() {
      console.log(this.timeline.lifedata);
      return this.timeline.lifedata;
    },
  },
  mounted() {
    timeline(document.querySelectorAll(".timeline"), {
      forceVerticalMode: 700,
      mode: "horizontal",
      verticalStartPosition: "left",
      visibleItems: 6,
    });
  },
  methods: {},
};
</script>

<style lang="scss"></style>
