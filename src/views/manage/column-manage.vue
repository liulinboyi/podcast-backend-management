<script name="COLUMNMANAGE" setup>
// import { computed } from 'vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()
// const allRoutes = router.getRoutes()
// const keepAliveRouteNames = computed(() => {
//   return allRoutes.filter((route) => route.meta?.keepAlive).map((route) => route.name)
// })
</script>

<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-slide" mode="out-in" appear> -->
      <!-- <keep-alive :include="['COLUMNMANAGEFEFAULT', 'SONGMANAGE']"> -->
      <component :is="Component" :key="route.path" />
      <!-- </keep-alive> -->
      <!-- </transition> -->
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .n-card {
    width: 300px;
    flex-shrink: 0;
    margin: 10px 0;
    cursor: pointer;
    &:hover {
      box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
    }
  }
  .blank {
    width: 300px;
    height: 0;
  }
}
</style>
