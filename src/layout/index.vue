<script setup>
import AppHeader from './components/header/index.vue'
import SideMenu from './components/sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ref, onMounted, nextTick } from 'vue'
import { emitter } from '@/utils/eventHub'

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const layoutContent = ref(null)

onMounted(() => {
  let observerDom = layoutContent.value.$el.querySelector('.n-scrollbar-container')
  if (observerDom) {
    var observerOptions = {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      attributes: true, // 观察属性变动
      subtree: true, // 观察后代节点，默认为 false
    }
    var observer = new MutationObserver(callback)
    observer.observe(observerDom, observerOptions)
    function callback(mutationList, observer) {
      setTimeout(() => {
        if (observerDom.scrollHeight > observerDom.clientHeight) {
          // console.log('有滚动条')
          // observer.disconnect()
          if (router.currentRoute.value.path === '/test/column-manage/column') {
            layoutContent.value.scrollTo({ top: store.scrollTop, behavior: 'smooth' })
            // console.log(store.scrollTop)
            // console.log('滚动')
          }
        }
      })
    }
  }
})

function scroll(event) {
  // 保存滚动高度
  // 路由元信息，会在scrollBehavior中失效！
  if (event.target.scrollTop === 0) {
    return
  }
  store.setScroll(event.target.scrollTop, event.target)
}
</script>

<template>
  <div class="layout">
    <n-layout has-sider position="absolute">
      <n-layout-sider :width="200" :collapsed-width="0" :native-scrollbar="false">
        <side-menu />
      </n-layout-sider>
      <n-layout>
        <n-layout-header>
          <app-header />
        </n-layout-header>
        <n-layout
          ref="layoutContent"
          :onScroll="scroll"
          position="absolute"
          style="top: 60px; background-color: #f5f6fb"
          :native-scrollbar="false"
        >
          <app-main ref="main" />
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<style lang="scss" scoped>
.n-layout-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
}
</style>
