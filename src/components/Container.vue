<template>
  <div class="wrapper">
    <div class="row justify-content-center">
      <LuckyNumber
        v-for="(slot, i) in slots"
        :key="i"
        :done="slot.done"
        :result="slot.result"
        :has-spinning="hasSpinning"
        :numbers="availableNumbers"
        :interval="interval"
        @spin-end="onSpin(slot, $event)"
        @spin-start="hasSpinning = true"
      />
    </div>
    <transition name="congrats">
      <div class="result" v-show="isShowResult">
        <div class="result-box">
          <h1>Xin chúc mừng</h1>
          <div class="result-text">{{ result }}</div>
          <a href="javascript:;" @click="skip" class="continue">Tiếp tục</a>
        </div>
        <canvas class="result-confetti" ref="confetti" />
      </div>
    </transition>
  </div>
</template>

<script>
import LuckyNumber from "@/components/LuckyNumber.vue";
import confettiGenerator from "confetti-js";

export default {
  components: {
    LuckyNumber
  },
  model: {
    prop: "availableNumbers",
    event: "change"
  },
  props: {
    availableNumbers: {
      type: Array,
      required: true
    },
    slots: {
      type: Array,
      required: true
    },
    interval: Number
  },
  data() {
    return {
      result: null,
      isShowResult: false,
      hasSpinning: false
    };
  },
  mounted() {
    this.confetti = new confettiGenerator({
      target: this.$refs.confetti,
      max: 50,
      colors: [
        [255, 195, 195],
        [125, 233, 255],
        [168, 241, 127],
        [255, 94, 153],
        [255, 202, 0]
      ],
      size: 1.8,
      clock: "30"
    });
    this.confetti.render();
  },
  methods: {
    onSpin(slot, number) {
      setTimeout(() => {
        this.hasSpinning = false;
        this.result = number;
        this.isShowResult = true;
        slot.result = number;
        slot.done = true;
        this.$emit(
          "change",
          this.availableNumbers.filter(no => no !== number)
        );
      }, 600);
    },
    skip() {
      this.isShowResult = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 90%;
  max-width: 1000px;
  margin: auto;
  padding: 30px 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
  &-box {
    background: #fff;
    width: 320px;
    text-align: center;
    padding: 30px 0;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  &-text {
    font-size: 150px;
    line-height: 1.5;
  }
  &-confetti {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.congrats-enter,
.congrats-leave-to {
  opacity: 0.3;
  .result-box {
    opacity: 0;
    transform: scale(0.4);
  }
}
.continue {
  text-decoration: none !important;
}
</style>
