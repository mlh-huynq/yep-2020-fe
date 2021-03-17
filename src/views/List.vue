<template>
    <div class="nav">
        <router-link
            v-for="(name, id) in prizeList"
            :key="id"
            :to="`/quay-so/${$route.params.location}/${id}`"
            class="btn btn-primary"
            >{{ name }}</router-link
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
