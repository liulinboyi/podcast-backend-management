import { defineStore } from 'pinia'
import { asyncRoutes, basicRoutes } from '@/router/routes'

function hasPermission(route, role) {
  const routeRole = route.meta?.role ? route.meta.role : []
  if (!role.length || !routeRole.length) {
    return false
  }
  return role.some((item) => routeRole.includes(item))
}

function filterAsyncRoutes(routes = [], role) {
  const ret = []
  routes.forEach((route) => {
    if (hasPermission(route, role)) {
      const curRoute = {
        ...route,
        children: [],
      }
      if (route.children && route.children.length) {
        curRoute.children = filterAsyncRoutes(route.children, role)
      } else {
        Reflect.deleteProperty(curRoute, 'children')
      }
      ret.push(curRoute)
    }
  })
  return ret
}

export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: [],
    }
  },
  getters: {
    routes() {
      // 如果有模块路由，可以拼接路由
      // return basicRoutes.concat(this.accessRoutes)
      // 但是我这里为了方便，直接修改的basicRoutes
      return this.accessRoutes
    },
  },
  actions: {
    generateRoutes(role = []) {
      const accessRoutes = filterAsyncRoutes(asyncRoutes, role)
      this.accessRoutes = accessRoutes
      return accessRoutes
    },
  },
})
