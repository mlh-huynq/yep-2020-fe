<template>
    <div>
        <h1 class="py-2 px-5">Danh sách số không hiệu lực</h1>
        <hr />
        <form class="my-3 form" @submit.prevent="add">
            <input type="number" v-model.number="number" />
            <button type="submit">Thêm</button>
        </form>
        <div v-if="numbers.length" class="d-flex box">
            <div
                v-for="no in numbers"
                :key="no"
                class="unused-number"
                @click="remove(no)"
            >
                {{ no }}
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import { SOCKET_URL } from '@/helpers/constants';
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
            number: '',
            numbers: []
        };
    },
    mounted() {
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                location: this.$route.params.location,
                page: 'ignore_number'
            }
        });
        this.socket.on('ignore', data => (this.numbers = data));
        this.socket.on('success', number => {
            this.numbers.push(number);
            this.number = '';
        });
        this.socket.on('delete-success', number => {
            this.numbers = this.numbers.filter(n => n !== number);
        });
    },
    computed: {
        location() {
            const { location } = this.$route.params;
            if (location === 'hn') {
                return 'Hà Nội';
            }
            if (location === 'dn') {
                return 'Đà Nẵng';
            }
            return null;
        }
    },
    methods: {
        add() {
            if (!this.numbers.includes(this.number)) {
                this.socket.emit('submit', { number: this.number });
            } else {
                this.number = '';
            }
        },
        remove(number) {
            if (this.numbers.includes(number)) {
                this.socket.emit('delete', { number });
            }
        }
    }
};
</script>

<style lang="scss">
.box {
    width: 90%;
    border: 1px solid;
    margin: auto;
    padding: 10px;
    &::after {
        content: '';
        display: table;
        clear: both;
    }
}
.form {
    text-align: center;
}
.location {
    padding: 0 10%;
}
.unused-number {
    width: 10%;
    min-width: 60px;
    float: left;
    cursor: not-allowed;
    text-align: center;
}
.send-btn {
    margin-top: 30px;
    text-align: center;
}
</style>
