<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
export default {
    name: "bankView",
    components: {},
    watch: {
        $route: {
            handler(newVal,oldVal){

            },
            immediate: true,
            deep: true
        }
    },
    data(){
        return {}
    },
    activated(){},
    mounted(){}
}
</script>
<style lang="sass" scoped>
</style>
