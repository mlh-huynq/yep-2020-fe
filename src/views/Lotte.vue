<template>
    <div v-if="ready" class="wrapper">
        <div class="row justify-content-center">
            <LuckyNumber
                v-for="(slot, i) in slots"
                :key="i"
                :result="slot.result"
                :done="slot.done"
                :numbers="availableNumbers"
                @finish="onFinish(slot, $event)"
            />
        </div>
    </div>
    <Loading v-else />
</template>

<script>
import LuckyNumber from '@/components/LuckyNumber.vue';
import Loading from '@/components/Loading.vue';
import { RESULT_INTERVAL, SOCKET_URL, QUANTITY } from '@/helpers/constants';
import io from 'socket.io-client';
export default {
    components: {
        LuckyNumber,
        Loading
    },
    beforeRouteEnter(to, from, next) {
        if (
            ['hn', 'dn'].includes(to.params.location) &&
            [1, 2, 3].includes(parseInt(to.params.id))
        ) {
            next();
        } else {
            next('/404');
        }
    },
    mounted() {
        const { location, id } = this.$route.params;
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                location: this.$route.params.location,
                prizeId: parseInt(this.$route.params.id)
            }
        });
        this.socket.on('init', data => {
            const total = QUANTITY[location][id];
            this.availableNumbers = data.availableNumbers;
            this.slots = Array(total)
                .fill(null)
                .map((r, i) => ({
                    result: data.prizeNumbers[i] || null,
                    done: !!data.prizeNumbers[i]
                }));

            this.ready = true;
            if (data.isStopping) {
                this.run = setInterval(this.done, RESULT_INTERVAL);
            }
        });
        this.socket.on('stop', prizeId => {
            if (prizeId === parseInt(this.$route.params.id)) {
                this.done();
                this.run = setInterval(this.done, RESULT_INTERVAL);
            }
        });
    },
    data() {
        return {
            availableNumbers: [],
            slots: [],
            disable: false,
            key: 1,
            ready: false
        };
    },
    methods: {
        done() {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                if (!slot.done) {
                    slot.done = true;
                    if (i === this.slots.length - 1) {
                        clearInterval(this.run);
                    }
                    return;
                }
            }
        },
        onFinish(slot, number) {
            slot.done = true;
            slot.result = number;
            this.availableNumbers = this.availableNumbers.filter(
                r => r !== number
            );
            this.socket.emit('result', { ...this.$route.params, number });
        }
    },
    beforeDestroy() {
        this.socket.disconnect();
        if (this.run) {
            clearInterval(this.run);
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
</style>
