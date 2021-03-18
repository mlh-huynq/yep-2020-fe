<template>
    <div v-if="ready" class="wrapper">
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
            total: 0,
            employeeNumbers: [],
            guestNumbers: [],
            slots: [],
            disable: false,
            key: 1,
            ready: false,
            specialIndex: null
        };
    },
    computed: {
        interval() {
            const { location, id } = this.$route.params;
            const time =
                RESULT_INTERVAL * { 1: 1, 2: 1, 3: 4, 4: 4, 5: 2, 6: 2 }[id];
            if (location === 'dn') {
                if (parseInt(id) === 6) {
                    return (time / 3) * 2;
                }
                return time / 2;
            }
            return time;
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
