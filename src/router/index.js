import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { basicRoutes } from './routes'
import { useUserStore } from '@/store/modules/user'

let store = null

export const router = createRouter({
  history: createWebHistory('/'),
  routes: basicRoutes,
  // 失效，这里布局滚动使用的是绝对定位~
  scrollBehavior(to, from, savedPosition) {
    // debugger
    // console.log(store)
    // if (store.scrollEl) {
    //   setTimeout(() => {
    //     store.scrollEl.scrollTop = store.scrollTop
    //   }, 1000)
    // }
  },
  // scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    router.hasRoute(name) && router.removeRoute(name)
  })
  basicRoutes.forEach((route) => {
    !router.hasRoute(route.name) && router.addRoute(route)
  })
}

export async function setupRouter(app) {
  app.use(router)
  store = useUserStore()
  setupRouterGuard(router)
  await router.isReady()
}
