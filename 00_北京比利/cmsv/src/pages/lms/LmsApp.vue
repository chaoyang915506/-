<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 my-3">
        <h2>{{ $t("Lms.title") }}</h2>
      </div>
      <pms-status class="col-8" />
      <room-info class="col-12" />
    </div>
  </div>
</template>

<script>
import PmsStatus from "./PmsStatus.vue";
import RoomInfo from "./RoomInfo.vue";

export default {
  name: "LmsApp",
  components: { RoomInfo, PmsStatus }
};
</script>
