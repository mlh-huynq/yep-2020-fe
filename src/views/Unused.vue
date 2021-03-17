<template>
    <div>
        <h1>Số thừa</h1>
        <hr />
        <div class="mb-3">
            <input type="number" v-model.number="number" />
            <button @click="add">Thêm</button>
        </div>
        <h2 v-if="location">{{ location }}</h2>
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
        <div class="send-btn">
            <button class="btn btn-primary ">
                Gửi
            </button>
        </div>
    </div>
</template>

<script>
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
                this.numbers.push(this.number);
                this.number = '';
            }
        },
        remove(number) {
            if (this.numbers.includes(number)) {
                this.numbers = this.numbers.filter(n => n !== number);
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
