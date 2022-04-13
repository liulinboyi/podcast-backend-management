import Layout from '@/layout/index.vue'
import Home from '@/views/dashboard/index.vue'
import COLUMNMANAGE from '@/views/manage/column-manage.vue'
import { ChartBar, Dove, Github, HouseDamage, Link, TimesCircle } from '@vicons/fa'
import { useUserStore } from '@/store/modules/user'
import { getDetailById } from '@/api/column/index'

export const basicRoutes = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true,
  },
  {
    name: 'REDIRECT',
    path: '/redirect',
    component: Layout,
    isHidden: true,
    children: [
      {
        name: 'REDIRECT_NAME',
        path: '',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    name: 'LOGIN',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    isHidden: true,
    meta: {
      title: '登录页',
    },
  },

  {
    name: 'DASHBOARD',
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '首页',
      icon: ChartBar,
      role: ['ROLE_user', 'ROLE_admin'],
    },
    children: [
      {
        name: 'HOME',
        path: 'home',
        component: Home,
        meta: {
          title: '专栏',
          icon: HouseDamage,
          role: ['ROLE_user', 'ROLE_admin'],
        },
      },
    ],
  },

  {
    name: 'TEST',
    path: '/test',
    component: Layout,
    redirect: '/test/column-manage',
    meta: {
      title: '管理',
      role: ['ROLE_user', 'ROLE_admin'],
    },
    children: [
      {
        name: 'COLUMNMANAGE',
        path: 'column-manage',
        redirect: '/test/column-manage/column',
        component: COLUMNMANAGE,
        meta: {
          title: '专栏管理',
          role: ['ROLE_user', 'ROLE_admin'],
        },
        children: [
          {
            name: 'COLUMNMANAGEFEFAULT',
            path: 'column',
            component: () => import('@/views/manage/column-manage-default.vue'),
            meta: {
              title: '我的专栏',
              top: 0,
              role: ['ROLE_user', 'ROLE_admin'],
            },
          },
          {
            name: 'SONGMANAGE',
            path: 'song',
            component: () => import('@/views/manage/song-manage.vue'),
            meta: {
              title: '专栏播客管理',
              hide: true,
              role: ['ROLE_user', 'ROLE_admin'],
            },
            beforeEnter: async (to, from) => {
              // 组合式api无法使用beforeEnter，所以在这里使用
              // 来拦截行为：
              // 查看专栏这个动作
              // 拦截条件：
              // 不是管理员且不是当前用户创建的专栏
              const userStore = useUserStore()
              let { columnId } = to.query
              let res = await getDetailById(columnId)
              // 结束
              let data = res.data
              if (
                !userStore.role.includes('ROLE_admin') /* 不是管理员 */ &&
                data.userId !== userStore.userId /* 专栏信息中的userId不等于用户中的userId */
              ) {
                // 当直接在导航栏修改url时，from的path就是"/"，需要单独处理
                // if (from.path === '/') {
                //   return { path: '/' }
                // }
                // 直接去404页面
                return { path: '/404' }
              }
              return true
            },
          },
        ],
      },
      {
        name: 'REVIEWMANAGE',
        path: 'review-manage',
        component: () => import('@/views/manage/review-manage.vue'),
        meta: {
          title: '专栏审核',
          role: ['ROLE_admin'],
        },
      },
      // {
      //   name: 'UNOCSS',
      //   path: 'unocss',
      //   component: () => import('@/views/test-page/TestUnocss.vue'),
      //   meta: {
      //     title: '测试unocss',
      //   },
      // },
      // {
      //   name: 'MESSAGE',
      //   path: 'message',
      //   component: () => import('@/views/test-page/TestMessage.vue'),
      //   meta: {
      //     title: '测试Message',
      //   },
      // },
      // {
      //   name: 'DIALOG',
      //   path: 'dialog',
      //   component: () => import('@/views/test-page/TestDialog.vue'),
      //   meta: {
      //     title: '测试Dialog',
      //   },
      // },
      // {
      //   name: 'TEST-KEEP-ALIVE',
      //   path: 'keep-alive',
      //   component: () => import('@/views/test-page/TestKeepAlive.vue'),
      //   meta: {
      //     title: '测试Keep-Alive',
      //     keepAlive: true,
      //   },
      // },
    ],
  },

  // {
  //   name: 'ERROR-PAGE',
  //   path: '/error-page',
  //   component: Layout,
  //   redirect: '/error-page/404',
  //   meta: {
  //     title: '错误页',
  //     icon: TimesCircle,
  //   },
  //   children: [
  //     {
  //       name: 'ERROR-404',
  //       path: '404',
  //       component: () => import('@/views/error-page/404.vue'),
  //       meta: {
  //         title: '404',
  //       },
  //     },
  //   ],
  // },

  // {
  //   name: 'EXTERNAL-LINK',
  //   path: '/external-link',
  //   component: Layout,
  //   meta: {
  //     title: '外部链接',
  //     icon: Link,
  //   },
  //   children: [
  //     {
  //       name: 'LINK-GITHUB-SRC',
  //       path: 'https://github.com/zclzone/vue-naive-admin',
  //       meta: {
  //         title: '源码 - github',
  //         icon: Github,
  //       },
  //     },
  //     {
  //       name: 'LINK-GITEE-SRC',
  //       path: 'https://gitee.com/zclzone/vue-naive-admin',
  //       meta: {
  //         title: '源码 - gitee',
  //       },
  //     },
  //     {
  //       name: 'LINK-DOCS',
  //       path: 'https://www.yuque.com/qszone/vue-naive-admin',
  //       meta: {
  //         title: '文档 - 语雀',
  //         icon: Dove,
  //       },
  //     },
  //   ],
  // },
]

export const NOT_FOUND_ROUTE = {
  name: 'NOT_FOUND',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
}

// const modules = import.meta.globEager('./modules/*.js')
// const asyncRoutes = []
// Object.keys(modules).forEach((key) => {
//   asyncRoutes.push(...modules[key].default)
// })
const asyncRoutes = basicRoutes
console.log(asyncRoutes)
export { asyncRoutes }
