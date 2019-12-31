<template>
  <div v-click-outside class="container" ref="datePicker">
    <input :value="currentValue" />
    <div v-if="visibelPanel" class="panel-contanier">
      <div class="panel-header">
        <span>&lt;&lt;</span>
        <span>{{currentValue}}</span>
        <span>&gt; &gt;</span>
      </div>
      <div class="panel-content">
        <div v-for="i in 6" :key="i">
          <div
            v-for="j in 7"
            :key="j"
            @click="handleChange(visibleDate[((i-1) *7)+(j-1)])"
            :class="[{isToday:isToday(visibleDate[((i-1) *7)+(j-1)])}]"
          >{{visibleDate[((i-1) *7)+(j-1)].getDate()}}</div>
        </div>
      </div>
      <div class="panel-footer">今天</div>
    </div>
  </div>
</template>

<script>
import { getYearMonthDay } from "./utils";

export default {
  directives: {
    clickOutside: {
      bind(el, bind, vnode) {
        const handler = function(e) {
          if (el.contains(e.target)) {
            if (!vnode.context.visibelPanel) {
              vnode.context.focus();
            }
          } else {
            if (vnode.context.visibelPanel) {
              vnode.context.blur();
            }
          }
        };

        el.handler = handler;
        document.addEventListener("click", handler);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler);
      }
    }
  },
  name: "DatePicker",
  props: {
    value: {
      type: Date,
      default: () => {
        const { year, month, day } = getYearMonthDay(new Date());
        return `${year}-${month}-${day}`;
      }
    }
  },
  data() {
    return {
      visibelPanel: false
    };
  },
  computed: {
    currentValue() {
      const { year, month, day } = getYearMonthDay(this.value);
      return `${year}-${month + 1}-${day}`;
    },
    visibleDate() {
      const { year, month } = getYearMonthDay(this.value);
      const currentFirstDay = new Date(year, month, 1);
      let week = currentFirstDay.getDay();
      if (week === 0) {
        week = 7;
      }
      const startDay = currentFirstDay - week * 60 * 60 * 1000 * 24;
      const arr = [];
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24));
      }

      return arr;
    }
  },
  created() {
    this.visibleDate;
  },
  methods: {
    handleChange(val) {
      this.$emit("input", val);
    },
    focus() {
      this.visibelPanel = true;
    },
    blur() {
      this.visibelPanel = false;
    },
    isToday(val) {
      const { year, month, day } = getYearMonthDay(val);
      const { year: y, month: m, day: d } = getYearMonthDay(this.value);
      return year === y && month === m && day === d;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 400px;
  height: 100%;
  text-align: left;
}
.panel-contanier {
  width: 400px;
  //   height: 300px;
  padding: 10px;
  border: 1px solid pink;
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .panel-content {
    width: 100%;
    & > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      & > div {
        min-width: 20px;
      }
    }
  }
  .isToday {
    background: red;
  }
}
</style>
 

 