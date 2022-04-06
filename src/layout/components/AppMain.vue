<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in" appear @after-enter="transitionComplete">
      <keep-alive :include="keepAliveRouteNames">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from '@/utils/eventHub'

const router = useRouter()
const allRoutes = router.getRoutes()
const keepAliveRouteNames = computed(() => {
  return allRoutes.filter((route) => route.meta?.keepAlive).map((route) => route.name)
})
function transitionComplete(el) {
  // console.log('动画结束')
  // emitter.emit('animationEnd')
}
</script>
