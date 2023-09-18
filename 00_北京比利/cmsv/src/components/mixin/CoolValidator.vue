<script>
import '@/plugins/bootstrapValidator/js/bootstrapValidator.min';
import '@/plugins/bootstrapValidator/js/language/zh_CN';

export default {
    name: "CoolValidtor",
    data() {
        return {
            $bv: {},
            bvOptions: {},
            validated: false,
        };
    },
    methods: {
        _buildBV() {
            if (this.$bv && this.$bv.destroy) this.$bv.destroy();

            const $el = $(this.$el);
            const $form = $el.is('form') ? $el : $el.find('form');
            $form.on('init.form.bv', (e, data) => {
                this.$bv = data.bv;
            }).bootstrapValidator(this.bvOptions).on('status.field.bv', function (e, data) {
                // $(e.target)  --> The field element
                // data.bv      --> The BootstrapValidator instance
                // data.field   --> The field name
                // data.element --> The field element

                data.bv.disableSubmitButtons(false);
            });
        }
    },
    mounted() {
        this._buildBV();
    },
    beforeDestroy() {
        if (this.$bv) this.$bv.destroy();
    }
}
</script>

<style scoped>
@import "~@/plugins/bootstrapValidator/css/bootstrapValidator.min.css";
</style>