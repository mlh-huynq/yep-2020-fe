<template>
    <div class="nav">
        <router-link to="/list/hn" class="btn btn-primary">Hà Nội</router-link>
        <router-link to="/list/dn" class="btn btn-primary">Đà Nẵng</router-link>
        <router-link to="/dieu-khien/hn" class="btn btn-primary"
            >Trang điều khiển Hà Nội</router-link
        >
        <router-link to="/dieu-khien/dn" class="btn btn-primary"
            >Trang điều khiển Đà Nẵng</router-link
        >
        <router-link to="/ket-qua" class="btn btn-primary"
            >Trang kết quả</router-link
        >
        <button class="btn btn-danger" @click="reset">
            Xóa cơ sở dữ liệu
        </button>
    </div>
</template>

<script>
export default {
    methods: {
        async reset() {
            const isErase = confirm('Bạn có chắc muốn xóa hết dữ liệu không?');
            if (isErase) {
                const res = await this.$axios.post('/reset-db');
                if (res) {
                    alert('Xóa dữ liệu thành công!');
                } else {
                    alert('Xóa dữ liệu thất bại!');
                }
            }
        }
    }
};
</script>
