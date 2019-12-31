<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
export default {
  provide() {
    return {
      form: this
    };
  },
  name: "iForm",
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    }
  },
  data() {
    return {
      fields: []
    };
  },
  created() {
    this.$on("on-form-item-add", filed => {
      if (filed) this.fields.push(filed);
    });
    this.$on("on-form-item-remove", field => {
      if (field.prop) this.fields.splice(this.fields.indexOf(field), 1);
    });
  },
  methods: {
    resetFields() {
      this.fields.forEach(filed => {
        filed.resetField();
      });
    },
    validate(cb) {
      return new Promise(resolve => {
        let vaild = true;
        let count = 0;
        this.fields.forEach(field => {
          field.validate("", error => {
            if (error) {
              vaild = false;
            }
            if (++count === this.fields.length) {
              resolve(vaild);
              if (typeof cb === "function") {
                cb(vaild);
              }
            }
          });
        });
      });
    }
  }
};
</script>

<style>
</style>