<template>
    <div class="nav">
        <button class="btn btn-primary" @click="run1" :disabled="!enabled['1']">
            Giải phụ 1
        </button>
        <button class="btn btn-primary" @click="run2" :disabled="!enabled['2']">
            Giải phụ 2
        </button>
        <button class="btn btn-primary" @click="run3" :disabled="!enabled['3']">
            Giải phụ 3
        </button>
        <button class="btn btn-danger" @click="reset" >
            Xóa cơ sở dữ liệu
        </button>
    </div>
</template>

<script>
import io from 'socket.io-client';
export default {
    data() {
        return {
            enabled: {
                1: false,
                2: false,
                3: false
            }
        };
    },
    mounted() {
        this.socket = io('ws://128.199.177.40:3000', {
            transports: ['websocket'],
            query: {
                page: 'control'
            }
        });
        this.socket.on('active', prizeId => {
            console.log(1, prizeId);
            this.enabled[prizeId] = true;
        });
        this.socket.on('deactive', prizeId => {
            console.log(2, prizeId);
            this.enabled[prizeId] = false;
        });
    },
    methods: {
        run1() {
            if (this.enabled['1']) {
                this.socket.emit('stop', 1);
            }
        },
        run2() {
            if (this.enabled['2']) {
                this.socket.emit('stop', 2);
            }
        },
        run3() {
            if (this.enabled['3']) {
                this.socket.emit('stop', 3);
            }
        },
        async reset() {
            const isErase = confirm('Bạn có chắc muốn xóa hết dữ liệu không?')
            if(isErase) {
                const res = await this.$axios.post('/reset-db')
                if(res) {
                    alert('Xóa dữ liệu thành công!')
                } else {
                    alert('Xóa dữ liệu thất bại!')
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
.nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding-bottom: 50px;
    .btn {
        min-width: 200px;
        margin-bottom: 12px;
    }
}
</style>
