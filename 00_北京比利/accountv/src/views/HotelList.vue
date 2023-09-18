<template>
    <div class="container-fluid" style="padding-bottom: 10px">
        <div class="row" style="height: 15%">
            <div class="col-12">
                <h1 class="my-3">{{ $t("hotelList.topHint") }}</h1>
            </div>
            <div class="col-12">
                <form
                    class="form-inline border-bottom py-2"
                    onsubmit="return false;"
                >
                    <div class="form-group col-auto">
                        <label>{{ $t("hotelList.cityLabel") }}</label>
                        <select
                            class="custom-select ml-2"
                            v-model="cityIdFilter"
                        >
                            <option :value="-1">{{ $t("hotelList.cityAll") }}</option>
                            <option
                                v-for="c in cities"
                                :key="c.cityId"
                                :value="c.cityId"
                            >
                                {{ c.city }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group col-auto">
                        <label>{{ $t("hotelList.nameLabel") }}</label>
                        <input class="form-control ml-2" v-model="nameFilter" />
                    </div>
                </form>
            </div>
        </div>
        <div class="row mb-2" style="height: 85%; overflow: auto">
            <div class="col-12">
                <div class="d-flex flex-wrap">
                    <div
                        v-for="hotel in optionalHotels"
                        :key="hotel.hotelId"
                        class="card text-light m-2"
                        style="width: 200px; cursor: pointer"
                        @click="chooseHotel(hotel)"
                    >
                        <img
                            :src="hotel.hotelImage"
                            class="card-img-top bg-dark"
                            style="height: 120px; object-fit: contain"
                        />
                        <div class="card-body bg-white text-dark">
                            <h5 class="card-title" style="height: 35px">
                                {{
                                    locale === "1"
                                        ? hotel.hotelEnName
                                        : hotel.hotelName
                                }}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
    name: "HotelList",
    data() {
        return {
            cityIdFilter: -1,
            nameFilter: ""
        };
    },
    computed: {
        ...mapState({
            hotels: (state) => state.hotels,
        }),
        locale() {
            return this.$root.$i18n.locale
        },
        cities() {
            let citymap = new Map();
            this.hotels.forEach((hotel) => {
                citymap.set(hotel.cityId, { cityId: hotel.cityId, city: hotel.city });
            });

            let ret = []

            let it = citymap.values()
            for (let i = 0; i < citymap.size; i++) {
                ret.push(it.next().value)
            }

            return ret.sort((a, b) => a.cityId - b.cityId)
        },
        optionalHotels() {
            return this.hotels.filter((hotel) => {
                const cityIdFilter =
                    this.cityIdFilter === -1 ? true : hotel.cityId === this.cityIdFilter;
                const nameFilter =
                    this.nameFilter === ""
                        ? true
                        : hotel.hotelName.indexOf(this.nameFilter) !== -1 || hotel.hotelEnName.indexOf(this.nameFilter) !== -1;

                return cityIdFilter && nameFilter;
            });
        },
    },
    methods: {
        ...mapMutations({
            chooseHotel: 'choose'
        }),
    },
};
</script>
