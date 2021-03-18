<template>
    <div class="nav">
        <router-link
            v-for="(name, id) in prizeList"
            :key="id"
            :to="`/lotte/${$route.params.location}/${id}`"
            class="btn btn-primary"
            >{{ name }}</router-link
        >
        <hr />
        <hr />
        <router-link
            :to="`/control/${$route.params.location}`"
            class="btn btn-primary"
            >Trang điều khiển</router-link
        >
        <router-link
            :to="`/unused/${$route.params.location}`"
            class="btn btn-primary"
            >Trang loại bỏ số</router-link
        >
    </div>
</template>

<script>
import { prizeList } from '@/helpers/constants';
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
            prizeList
        };
    }
};
</script>
