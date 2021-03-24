<template>
    <div v-if="ready" class="wrapper">
        <div class="main">
            <h1 :class="{ title: true, done: isFinish }">
                {{ prizeList[$route.params.id] }}
            </h1>
            <div class="box">
                <div class="row justify-content-center">
                    <LuckyNumber
                        v-for="(slot, i) in slots"
                        :key="i"
                        :result="slot.result"
                        :done="slot.done"
                        :employee-numbers="employeeNumbers"
                        :guest-numbers="guestNumbers"
                        :special="specialIndex === i"
                        @finish="onFinish(slot, $event)"
                    />
                </div>
            </div>
        </div>
        <router-link
            :to="{
                name: 'list',
                params: {
                    location: $route.params.location
                }
            }"
            class="location"
            >{{ location }}</router-link
        >
        <div v-if="isFinish" class="navs">
            <router-link :class="{ show: navs.next }" :to="navs.next || ''">
                <img src="../assets/caret-right.svg" alt="" />
            </router-link>
        </div>
    </div>
    <Loading v-else />
</template>

<script>
import LuckyNumber from '@/components/LuckyNumber.vue';
import Loading from '@/components/Loading.vue';
import confetti from 'canvas-confetti';
import {
    RESULT_INTERVAL,
    SOCKET_URL,
    QUANTITY,
    prizeList
} from '@/helpers/constants';
import io from 'socket.io-client';
export default {
    components: {
        LuckyNumber,
        Loading
    },
    beforeRouteEnter(to, from, next) {
        if (
            ['hn', 'dn'].includes(to.params.location) &&
            [1, 2, 3, 4, 5, 6].includes(parseInt(to.params.id))
        ) {
            next();
        } else {
            next('/404');
        }
    },
    mounted() {
        const { location, id } = this.$route.params;
        this.total = QUANTITY[location][id];
        if (parseInt(id) === 6) {
            this.specialIndex = Math.floor(Math.random() * this.total);
        }
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                location: this.$route.params.location,
                prizeId: parseInt(id)
            }
        });
        this.socket.on('init', data => {
            this.employeeNumbers = data.emplyeeNumbers;
            this.guestNumbers = data.guestNumbers;
            this.slots = Array(this.total)
                .fill(null)
                .map((r, i) => ({
                    result: data.prizeNumbers[i] || null,
                    done: !!data.prizeNumbers[i]
                }));

            this.ready = true;
            if (data.isStopping) {
                this.run = setInterval(this.done, this.interval);
            }
        });
        this.socket.on('stop', prizeId => {
            if (parseInt(prizeId) === parseInt(id)) {
                // this.done();
                this.run = setInterval(this.done, this.interval);
            }
        });
    },
    data() {
        return {
            prizeList,
            total: 0,
            employeeNumbers: [],
            guestNumbers: [],
            slots: [],
            disable: false,
            key: 1,
            ready: false,
            specialIndex: null,
            isFinish: false
        };
    },
    computed: {
        interval() {
            const { location, id } = this.$route.params;
            const time =
                RESULT_INTERVAL *
                { 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 4 / 3 }[id];
            if (location === 'dn') {
                if (parseInt(id) === 6) {
                    return (time / 4) * 3;
                }
                return time / 2;
            }
            return time;
        },
        location() {
            switch (this.$route.params.location) {
                case 'hn':
                    return 'Hà Nội';
                case 'dn':
                    return 'Đà Nẵng';
                default:
                    return '';
            }
        },
        navs() {
            const { name, params } = this.$route;
            const location = params.location;
            const id = parseInt(params.id);
            return {
                prev:
                    id > 1
                        ? {
                              name,
                              params: {
                                  location,
                                  id: id - 1
                              }
                          }
                        : null,
                next:
                    id < 6
                        ? {
                              name,
                              params: {
                                  location,
                                  id: id + 1
                              }
                          }
                        : null
            };
        }
    },
    methods: {
        done() {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                if (!slot.done) {
                    slot.done = true;
                    if (i === this.slots.length - 1) {
                        clearInterval(this.run);
                        this.isFinish = true;
                        this.runFirework();
                    }
                    return;
                }
            }
        },
        onFinish(slot, number) {
            slot.done = true;
            slot.result = number;
            if (this.employeeNumbers.includes(number)) {
                this.employeeNumbers = this.employeeNumbers.filter(
                    r => r !== number
                );
            }
            if (this.guestNumbers.includes(number)) {
                this.guestNumbers = this.guestNumbers.filter(r => r !== number);
            }
            this.socket.emit('result', { ...this.$route.params, number });
        },
        runFirework() {
            const duration = 5 * 60 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 300,
                ticks: 60,
                zIndex: 1
            };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            this.firework = setInterval(function() {
                let timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(this.firework);
                }

                const particleCount = 75 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: {
                            x: randomInRange(0.1, 0.4),
                            y: Math.random() - 0.2
                        }
                    })
                );
                confetti(
                    Object.assign({}, defaults, {
                        particleCount,
                        origin: {
                            x: randomInRange(0.6, 0.9),
                            y: Math.random() - 0.2
                        }
                    })
                );
            }, 250);
        }
    },
    beforeDestroy() {
        this.socket.disconnect();
        if (this.run) {
            clearInterval(this.run);
        }
        if (this.firework) {
            clearInterval(this.firework);
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    min-height: 100vh;
    background: #53575a url('../assets/square3.png') 80px 40px no-repeat;
}
%pos {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.main {
    @extend %pos;
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
    justify-content: center;
    align-items: center;
    z-index: 2;
}
.location {
    color: #ffff00;
    position: absolute;
    top: 40px;
    right: 80px;
    font-size: 40px;
    text-transform: uppercase;
    line-height: 1;
    z-index: 3;
    text-decoration: none !important;
}
#confetti,
#firework {
    @extend %pos;
    z-index: 1;
}
.box {
    max-width: 500px;
}

.title {
    color: #ffff00;
    font-size: 48px;
    text-transform: uppercase;
    margin-bottom: 40px;
    &.done {
        animation: scale 2s ease infinite;
    }
}
.navs {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 20px;
    text-align: right;
    padding-right: 20px;
    a {
        margin: 4px;
        img {
            height: 40px;
        }
        opacity: 0.3;
        &:not(.show) {
            visibility: hidden;
            pointer-events: none;
        }
        &:hover {
            opacity: 0.6;
            transform: scale(1.2);
        }
    }
    z-index: 5;
}
@keyframes scale {
    50% {
        transform: scale(1.2);
        letter-spacing: 8px;
    }
}
</style>
