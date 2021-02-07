<template>
    <div class="wrapper">
        <transition-group name="result-group" tag="div" class="results-area">
            <div v-for="res in displayResults" :key="res" class="item">
                <img src="../assets/lucky.svg" />{{ res }}
            </div>
        </transition-group>
        <div class="lucky-area">
            <div class="lucky-money">
                {{ number || '???' }}
                <transition name="lixi">
                    <div v-if="!spinning" class="cover">
                        <div class="spin-btn" @click="spin">
                            <img src="../assets/lucky.svg" />
                        </div>
                    </div>
                </transition>
            </div>
            <img
                src="https://monstar-lab.com/global/wp-content/themes/ml_global_2019_theme/public/images/logos/logo-ml_white_3x.png"
                alt="monstar-lab"
                id="logo"
            />
        </div>
        <img src="../assets/reset.svg" class="reset-btn" @click="reset" />
        <transition name="congrats">
            <div class="result" v-show="result">
                <div class="result-box">
                    <h1>おめでとう</h1>
                    <div class="result-text">{{ result }}</div>
                    <a href="javascript:;" @click="skip" class="continue"
                        >継続する</a
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
        },
        displayResults() {
            return this.results.slice(-16);
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
            if (
                e.keyCode === 32 ||
                e.code === 'Space' ||
                e.keyCode === 13 ||
                e.code === 'Enter'
            ) {
                if (!this.spinning) {
                    this.spin();
                } else if (this.result) {
                    this.skip();
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

                localStorage.setItem('results', JSON.stringify(this.results));
            }, 3000);
        },
        reset() {
            if (confirm('Do you really want to reset the results?')) {
                this.results = [];
                localStorage.removeItem('results');
            }
        },
        skip() {
            this.results.push(this.number);
            this.spinning = false;
            this.number = null;
            this.result = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    min-height: 100vh;
    margin: auto;
    padding: 30px 5% 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url(../assets/bg.jpg) center/cover no-repeat;
}
.lucky-area {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 0;
    #logo {
        margin-top: 60px;
        width: 500px;
        max-width: 90%;
    }
}
.results-area {
    width: 900px;
    max-width: 90%;
    display: flex;
    min-height: 100px;
    @media screen and (max-width: 1080px) {
        overflow-x: auto;
    }
    .item {
        display: flex;
        transition: all 1s;
        flex-direction: column;
        height: fit-content;
        font-size: 24px;
        flex: 0 1 48px;
        min-width: 48px;
        align-items: center;
        color: yellow;
        border: 1px solid yellow;
        background: red;
        padding: 8px 0 6px;
        margin: 0 4px;
        border-radius: 4px;
        img {
            width: 16px;
            display: block;
        }
    }
}
.result-group-enter {
    opacity: 0;
    transform: translateX(30px);
}
.result-group-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
.result-group-leave-active {
    position: absolute;
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
    border: 2px solid yellow;
    font-size: 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: #fff;
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
        transition: all 0.15s linear;
        .spin-btn {
            width: 100px;
            height: 100px;
            cursor: pointer;
            opacity: 1;
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
            height: 50%;
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
    .lixi-enter,
    .lixi-leave-to {
        .spin-btn {
            opacity: 0;
        }
        &::before,
        &::after {
            height: 0;
        }
    }
}
.reset-btn {
    width: 20px;
    height: 20px;
    display: block;
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
}
</style>
