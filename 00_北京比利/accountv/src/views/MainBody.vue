<template>
    <main class="embed-responsive">
        <transition name="fade">
            <component
                v-if="!href.startsWith('http')"
                :is="href"
                class="embed-responsive-item"
            ></component>
            <iframe v-else :src="href" class="embed-responsive-item"/>
        </transition>
    </main>
</template>

<script>
import MainWelcome from './MainWelcome.vue'
import HotelList from './HotelList.vue'
import MyAccount from './MyAccount.vue'
import AccountApi from '../api/AccountApi'

export default {
    name: 'MainBody',
    components: {MainWelcome, HotelList, MyAccount},
    computed: {
        chosenHotelId() {
            return this.$store.state.chosenHotel.hotelId;
        },
        href() {
            let href = this.$store.state.href;
            if (!href.startsWith('http')) {
                return this.$store.state.href;
            } else {
                href = new URL(href);
                const params = href.searchParams;
                if (params.get('hotelId')) {
                    params.set('hotelId', this.chosenHotelId);
                }
                params.set('locale', this.$root.$i18n.locale)
                params.set('token', sessionStorage.getItem('token'));
                return href.toString()
            }
        }
    },
    created() {
        AccountApi.hotels()
            .then(data => this.$store.commit('setHotels', data.list))
            .catch(err => this.$store.commit('setHotels', []));
    }
}
</script>