<template>
  <input :value="currentValue" @input="handleInput" type="text" @blur="handleBlur" />
</template>

<script>
import Emitter from "./emitter";
export default {
  name: "iInput",
  mixins: [Emitter],
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    handleInput(e) {
      const value = e.target.value;

      this.currentValue = value;
      this.$emit("input", value);
      this.dispatch("iFormItem", "on-form-change", value);
    },
    handleBlur() {
      this.dispatch("iFormItem", "on-form-blur", this.currentValue);
    }
  },
  watch: {
    value(newVal) {
      console.log("ssss", newVal);
      this.currentValue = newVal;
    }
  }
};
</script>

<style>
</style>