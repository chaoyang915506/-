<template>
  <div class="search-container">
    <div class="card">
      <div class="card-header">
        查询条件
      </div>
      <div class="card-body">
        <form>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
                  >航空公司中文名称</label
                >
                <div class="col-sm-6">
                  <input type="text" class="form-control" v-on:change="$emit('zhNameChange',$event.target.value)" />
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
                  >航空公司英文名称</label
                >
                <div class="col-sm-6">
                  <input type="text" class="form-control" v-on:change="$emit('enNameChange',$event.target.value)" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
                  >ICAO code</label
                >
                <div class="col-sm-6">
                  <input type="text" class="form-control" v-on:change="$emit('icaoCodeChange',$event.target.value)" />
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group row">
                <label for="inputEmail3" class="col-sm-4 col-form-label text-right"
                  >IATA code</label
                >
                <div class="col-sm-6">
                  <input type="text" class="form-control" v-on:change="$emit('iataCodeChange',$event.target.value)" />
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: [],
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.search-container {
  width: 100%;
  margin-top: 20px;
}


</style>
