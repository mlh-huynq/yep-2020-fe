<template>
    <div class="nav">
        <template v-for="(name, id) in prizeList">
            <button
                v-if="
                    ($route.params.location === 'hn' && parseInt(id) !== 5) ||
                        ($route.params.location === 'dn' && parseInt(id) === 5)
                "
                :key="id"
                class="btn btn-primary"
                @click="run(id)"
                :disabled="!enabled[id]"
            >
                {{ name }}
            </button>
        </template>
    </div>
</template>

<script>
import { prizeList } from '@/helpers/constants';
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
        this.socket = io('ws://128.199.177.40:3000', {
            transports: ['websocket'],
            query: {
                page: 'control'
            }
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
        min-width: 250px;
        margin-bottom: 12px;
    }
}
</style>
