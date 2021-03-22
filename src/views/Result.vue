<template>
    <div>
        <h1>Kết quả</h1>
        <hr />
        <div class="mb-3">
            Tìm số:
            <input type="number" v-model.number="number" />
        </div>
        <h2>Hà Nội</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Tên giải</th>
                    <th>Số trúng thưởng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(numbers, id) in results.hn" :key="id">
                    <td>{{ prizeList[id] }}</td>
                    <td>
                        <div class="d-flex">
                            <div
                                v-for="no in numbers"
                                :key="no"
                                :class="{
                                    'result-number': true,
                                    active: no === number
                                }"
                            >
                                {{ no }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <h2>Đà nẵng</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Tên giải</th>
                    <th>Số trúng thưởng</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(numbers, id) in results.dn" :key="id">
                    <td>{{ prizeList[id] }}</td>
                    <td>
                        <div
                            v-for="no in numbers"
                            :key="no"
                            :class="{
                                'result-number': true,
                                active: no === number
                            }"
                        >
                            {{ no }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { prizeList, SOCKET_URL } from '@/helpers/constants';
import io from 'socket.io-client';
export default {
    data() {
        return {
            number: null,
            prizeList,
            results: {
                hn: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: []
                },
                dn: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: []
                }
            }
        };
    },
    mounted() {
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            query: {
                page: 'result'
            }
        });
        this.socket.on('hn', data => {
            this.results.hn = data;
        });
        this.socket.on('dn', data => {
            this.results.dn = data;
        });
    },
    beforeDestroy() {
        this.socket.disconnect();
    }
};
</script>

<style lang="scss" scoped>
.result-number {
    width: 12.5%;
    min-width: 60px;
    float: left;
    &.active {
        background-color: yellow;
    }
}
.table {
    font-size: 24px;
    width: 90%;
    margin: 0 auto 30px;
    border-collapse: collapse;
    text-align: center;
    tr {
        th,
        td {
            &:first-child {
                width: 200px;
                vertical-align: baseline;
            }
            border: 1px solid #555;
        }
    }
}
.lotte-number {
    font-size: 24px;
}
</style>
