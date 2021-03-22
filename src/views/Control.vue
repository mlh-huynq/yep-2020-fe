<template>
    <div class="wrapper">
        <div class="row justify-content-center">
            <template v-for="(name, id) in prizeList">
                <div
                    class="col-30 col-sm-20 my-4"
                    v-if="
                        (parseInt(id) === current &&
                            $route.params.location === 'hn' &&
                            parseInt(id) !== 5) ||
                            ($route.params.location === 'dn' &&
                                parseInt(id) === 5)
                    "
                    :key="id"
                >
                    <button
                        class="button"
                        @click="run(id)"
                        :disabled="!enabled[id]"
                    >
                        {{ name }}
                        <template v-if="note[id]">
                            <br />
                            {{ note[id] }}
                        </template>
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { prizeList, SOCKET_URL } from '@/helpers/constants';
import io from 'socket.io-client';
export default {
    beforeRouteEnter(to, from, next) {
        if (['hn', 'dn'].includes(to.params.location)) {
            next();
        } else {
            next('/404');
        }
    },
    data() {
        return {
            prizeList,
            note: {
                5: '水野さん',
                6: '社長'
            },
            current: this.$route.params.location === 'dn' ? 5 : 1,
            enabled: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false
            }
        };
    },
    mounted() {
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                page: 'control'
            }
        });
        this.socket.on('init', ({ lastPrizeId }) => {
            this.current = parseInt(lastPrizeId || 0) + 1;
        });
        this.socket.on('active', prizeId => {
            this.enabled[prizeId] = true;
        });
        this.socket.on('deactive', prizeId => {
            this.enabled[prizeId] = false;
        });
    },
    methods: {
        run(id) {
            if (this.enabled[id]) {
                this.socket.emit('stop', id);
                if (this.$route.params.location === 'hn') {
                    if (this.current === 4) {
                        this.current = 6;
                    } else if (this.current !== 6) {
                        this.current += 1;
                    }
                }
            }
        }
    },
    beforeDestroy() {
        this.socket.disconnect();
    }
};
</script>

<style lang="scss" scpoed>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #ffff00;
    background-image: url('../assets/title.png'), url('../assets/square1.png'),
        url('../assets/square2.png');
    background-repeat: no-repeat;
    background-position: 0 30px, 54px 84%, 90% 0;
    background-size: 360px auto, 50px auto, 120px auto;
    .button-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 600px;
        .col {
            text-align: center;
            margin: 24px 0;
        }
    }
}
.row {
    width: 90%;
    max-width: 800px;
    text-align: center;
}
.button {
    background: #53575a;
    color: #ffff00;
    font-size: 20px;
    width: 200px;
    height: 100px;
    text-transform: uppercase;
    outline: none;
    border: none;
    white-space: nowrap;
    &:disabled {
        background: #888b8d;
        color: #eff0f0;
        pointer-events: none;
    }
}
</style>
