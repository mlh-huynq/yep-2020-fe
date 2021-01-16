<template>
  <div class="lucky-wrapper">
    <div :class="{ 'lucky-box': true, active }" @click="spin">
      <div class="lucky-box__number">{{ number || "??" }}</div>
    </div>
  </div>
</template>

<script>
import { INTERVAL } from "@/helpers/constants";
export default {
  props: {
    numbers: Array,
    hasSpinning: Boolean,
    interval: Number,
    done: Boolean,
    result: Number
  },
  data() {
    return {
      number: this.result,
      isSpinning: false
    };
  },
  computed: {
    active() {
      return !this.done && (!this.hasSpinning || this.isSpinning);
    }
  },
  methods: {
    spin() {
      if (!this.active) {
        return;
      }

      if (this.isSpinning) {
        this.isSpinning = false;
        clearInterval(this.run);
        this.$emit("spin-end", this.number);
      } else {
        this.$emit("spin-start");
        this.isSpinning = true;
        this.run = setInterval(() => {
          const random = Math.floor(Math.random() * this.numbers.length);
          this.number = this.numbers[random];
        }, this.interval || INTERVAL);
      }
    }
  },
  beforeDestroy() {
    if (this.run) {
      clearInterval(this.run);
    }
  }
};
</script>

<style lang="scss" scoped>
.lucky-wrapper {
  text-align: center;
  padding: 0 10px;
}
.lucky-box {
  text-align: center;
  width: 160px;
  padding: 30px 12px;
  border: 1px solid #555;
  border-radius: 12px;
  margin-bottom: 20px;
  cursor: pointer;
  &:not(.active) {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }
  &__number {
    font-size: 80px;
    line-height: 2;
  }
}
</style>
