<template>
  <div>
    <div class="setting">
      <div>Giải thưởng</div>
      <select v-model="pickedPrice">
        <option v-for="(value, key) in prices" :key="key" :value="key">{{
          value.text
        }}</option>
      </select>
      <div>Thời gian nhảy số (ms)</div>
      <input type="number" v-model.number="interval" />
    </div>
    <Container
      v-if="prices[pickedPrice]"
      :key="pickedPrice"
      v-model="availableNumbers"
      :slots="prices[pickedPrice].slots"
      :interval="interval"
    ></Container>
  </div>
</template>

<script>
import { HN_PRICE_QUANTITY, INTERVAL } from "@/helpers/constants";
import Container from "@/components/Container.vue";
export default {
  components: {
    Container
  },
  data() {
    const availableNumbers = Array(150)
      .fill(1)
      .map((r, i) => i + r);
    const genSlots = no => {
      return Array(no)
        .fill(1)
        .map(() => ({ result: null, done: false }));
    };
    const prices = {
      special: {
        text: "Đặc biệt",
        slots: genSlots(HN_PRICE_QUANTITY.special)
      },
      first: {
        text: "Giải phụ 1",
        slots: genSlots(HN_PRICE_QUANTITY.first)
      },
      second: {
        text: "Giải phụ 2",
        slots: genSlots(HN_PRICE_QUANTITY.second)
      },
      third: {
        text: "Giải phụ 3",
        slots: genSlots(HN_PRICE_QUANTITY.third)
      }
    };
    return {
      availableNumbers,
      interval: INTERVAL,
      prices,
      pickedPrice: "special"
    };
  }
};
</script>
