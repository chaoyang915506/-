<template>
  <div>
    <ValidationProvider rules="required" v-slot="{ errors }">
      <input v-model="value" type="text" :error-messages="errors" />
      <span id="error">info: {{ errors[0] }}</span>
    </ValidationProvider>
    <div>
      <button disabled="isallow">submit</button>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", required);

export default {
  components: {
    ValidationProvider,
  },
  data() {
    return {
      value: "hi",
      isallow: false,
    };
  },
  methods: {
    handleSubmit: function() {},
  },
};
</script>
