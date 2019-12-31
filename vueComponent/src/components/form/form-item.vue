<template>
  <div>
    <label v-if="label">{{label}}</label>
    <div>
      <slot></slot>
      <div v-if="validateState === 'error'" class="i-form-item-message">{{ validateMessage }}</div>
    </div>
  </div>
</template>

<script>
import Emitter from "./emitter";
import AsyncValidator from "async-validator";
export default {
  inject: ["form"],
  name: "iFormItem",
  mixins: [Emitter],
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    }
  },
  data() {
    return {
      isRequired: false, // 是否为必填
      validateState: "", // 校验状态
      validateMessage: "" // 校验不通过时的提示信息
    };
  },
  computed: {
    fieldValue() {
      return this.form.model[this.prop];
    }
  },
  mounted() {
    if (this.prop) {
      this.dispatch("iForm", "on-form-item-add", this);
      this.initValue = this.fieldValue;
      this.setRules();
    }
  },
  methods: {
    setRules() {
      this.$on("on-form-blur", this.onFieldBlur);
      this.$on("on-form-change", this.onFieldChange);
      const rule = this.getRules();
      if (rule.length > 0) {
        rule.every(rule => {
          this.isRequired = rule.isRequired;
        });
      }
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      this.validate("change");
    },
    getRules() {
      let formRules = this.form.rules;
      formRules = formRules ? formRules[this.prop] : [];
      return [].concat(formRules || []);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules.filter(
        rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      );
    },
    validate(trigger, cb = function() {}) {
      let rule = this.getFilteredRule(trigger);
      if (!rule || rule.length === 0) {
        return true;
      }
      this.validateState = "validating";
      let descripter = {};
      descripter[this.prop] = rule;
      let validator = new AsyncValidator(descripter);
      let model = {};
      model[this.prop] = this.fieldValue;

      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? "success" : "error";
        this.validateMessage = errors ? errors[0].message : "";

        cb(this.validateMessage);
      });
    },
    resetField() {
      this.validateState = "";
      this.validateMessage = "";
      console.log("", this.initValue);
      this.form.model[this.prop] = this.initialValue;
    }
  },
  beforeDestroy() {
    this.dispatch("iForm", "on-form-item-remove", this);
  }
};
</script>

<style>
.i-form-item-label-required:before {
  content: "*";
  color: red;
}
.i-form-item-message {
  color: red;
}
</style>