<template>
    <div class="lucky-wrapper">
        <div class="lucky-box">
            <div class="lucky-box__number">{{ result || number || '??' }}</div>
        </div>
    </div>
</template>

<script>
import { INTERVAL } from '@/helpers/constants';
export default {
    props: {
        result: Number,
        done: Boolean,
        special: Boolean,
        employeeNumbers: Array,
        guestNumbers: Array
    },
    data() {
        return {
            number: null
        };
    },
    mounted() {
        if (this.result) {
            return;
        }
        this.run = setInterval(() => {
            this.getNumber(this.numbers);
        }, INTERVAL);
    },
    computed: {
        numbers() {
            return [...this.guestNumbers, ...this.employeeNumbers];
        }
    },
    watch: {
        done(val) {
            if (val) {
                clearInterval(this.run);
                this.getNumber(
                    this.special ? this.guestNumbers : this.employeeNumbers
                );
                this.$emit('finish', this.number);
            }
        }
    },
    beforeDestroy() {
        if (this.run) {
            clearInterval(this.run);
        }
    },
    methods: {
        getNumber(list) {
            this.number = list[Math.floor(Math.random() * list.length)];
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
        font-size: 40px;
        line-height: 2;
    }
}
</style>
