import { defineStore } from 'pinia'
import { getUser } from '@/api/user'
import { removeToken } from '@/utils/token'
const VITE_RESOURCE_BASE_URI = import.meta.env.VITE_RESOURCE_BASE_URI
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
      scrollTop: 0,
      scrollEl: null,
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    name() {
      return this.userInfo?.username
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.roles || []
    },
  },
  actions: {
    setScroll(top, el) {
      this.scrollTop = top
      this.scrollEl = el
    },
    async getUserInfo() {
      try {
        const res = await getUser()
        if (res.status === 200) {
          const { id, username, avatar, roles } = res.data
          this.userInfo = { id, username, avatar: `${VITE_BASE_URL}${VITE_RESOURCE_BASE_URI}${avatar}`, roles }
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res.message)
        }
      } catch (error) {
        console.error(error)
        return Promise.reject(error.message)
      }
    },
    logout() {
      removeToken()
      this.userInfo = {}
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
