<template>
    <div class="wrapper">
        <div class="results-area">
            <h2>Các số đã trúng thưởng</h2>
            <span v-for="res in results" :key="res" class="item">{{
                res
            }}</span>
        </div>
        <div class="lucky-area">

        <div :class="{ 'lucky-money': true, spinning }">
            {{ number || '???' }}
            <div class="cover">
                <div class="spin-btn" @click="spin">
                    <img src="~/assets/lucky.svg" alt="">
                </div>
            </div>
        </div>
        </div>
        <button @click="reset" class="btn btn-danger">reset</button>
        <transition name="congrats">
            <div class="result" v-show="result">
                <div class="result-box">
                    <h1>Xin chúc mừng</h1>
                    <div class="result-text">{{ result }}</div>
                    <a href="javascript:;" @click="skip" class="continue"
                        >Tiếp tục</a
                    >
                </div>
                <canvas class="result-confetti" ref="confetti" />
            </div>
        </transition>
    </div>
</template>

<script>
import confettiGenerator from 'confetti-js';
export default {
    name: 'LuckyMoney',
    beforeRouteEnter(to, from, next) {
        if (['hn', 'dn'].includes(to.params.location)) {
            next();
        } else {
            next('/404');
        }
    },
    computed: {
        availableNumbers() {
            return this.totalNumbers.filter(n => !this.results.includes(n));
        }
    },
    data() {
        const totalNumber = this.$route.params.location === 'dn' ? 350 : 150;
        const resultsStorage = localStorage.getItem('results');
        return {
            number: null,
            spinning: false,
            result: null,
            results: resultsStorage ? JSON.parse(resultsStorage) : [],
            isShowResult: false,
            totalNumbers: Array(totalNumber)
                .fill(1)
                .map((r, i) => r + i)
        };
    },
    
    mounted() {
         document.body.onkeyup = e => {
            if((e.keyCode === 32 || e.code === 'Space') && !this.spinning){
                this.spin()
            }
            if(e.keyCode === 13 || e.code === 'Enter') {
                if(!this.spinning) {
                    this.spin()
                } else if(this.result) {
                    this.skip()
                }
            }
        };
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
            clock: '30'
        });
        this.confetti.render();
    },
    methods: {
        getNumber() {
            this.number = this.availableNumbers[
                Math.floor(Math.random() * this.availableNumbers.length)
            ];
        },
        spin() {
            this.spinning = true;
            this.getNumber();
            this.spinInterval = setInterval(this.getNumber, 100);
            setTimeout(() => {
                clearInterval(this.spinInterval);
                this.result = this.number;
                this.results.push(this.number);
                localStorage.setItem('results', JSON.stringify(this.results));
            }, 3000);
        },
        reset() {
            this.results = [];
            localStorage.removeItem('results');
        },
        skip() {
            this.spinning = false;
            this.number = null;
            this.result = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    width: 90%;
    max-width: 1000px;
    min-height: 100vh;
    margin: auto;
    padding: 30px 0 60px;
    display: flex;
    flex-direction: column;
}
.lucky-area {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.results-area {
    width: 100%;
    .item {
        font-size: 20px;
        margin-right: 12px;
    }
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
.lucky-money {
    height: 320px;
    width: 240px;
    line-height: 320px;
    border-radius: 12px;
    border: 2px solid red;
    font-size: 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
    &.spinning {
        .cover {
            display: none;
        }
    }
    .cover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        .spin-btn {
            width: 100px;
            height: 100px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.15s linear 0.05s;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            width: 100%;
            left: 0;
            height: 0;
            display: block;
            z-index: -1;
            background: red;
            transition: all 0.15s linear;
        }
        &::before {
            top: 0;
        }
        &::after {
            bottom: 0;
        }
    }
    &:hover {
        .cover {
            .spin-btn {
                opacity: 1;
            }
            &::before,
            &::after {
                height: 50%;
            }
        }
    }
}
</style>
