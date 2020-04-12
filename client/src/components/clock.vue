<template>
  <div v-if="visible">
    <span class='iconfont icon-clock'></span>
    <p :class="{red:red}">{{count}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: Number
    };
  },
  computed: {
    red() {
      return this.count >= 10 ? false : true;
    }
  },
  props: {
    num: Number,
    visible: Boolean
  },
  methods: {
  },
  mounted() {
    this.count = this.num;
    if (this.count <= 0) return;
    this.count = Math.floor(this.count);
    const Interval = setInterval(() => {
      if (this.count > 0) this.count--;
    }, 1e3);
  },
  watch: {
    visible: function(newValue, oldValue) {
      this.count = 30;
    }
  }
};
</script>

<style scoped>

.red {
  color: red;
}
.iconfont,p{
  font-size: 30px;
}
</style>