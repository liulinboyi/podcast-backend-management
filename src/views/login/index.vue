<script setup>
import { ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { login } from '@/api/auth'
// import { createLocalStorage } from '@/utils/cache'
import { setToken } from '@/utils/token'

const title = import.meta.env.VITE_APP_TITLE
const baseUrl = import.meta.env.VITE_APP_GLOB_BASE_API

// 路由
const router = useRouter()
const route = useRoute()
// 解引用的当前路由
// 如果参数是一个 ref，则返回内部值，
// 否则返回参数本身。
// 这是 val = isRef(val) ? val.value : val 的语法糖函数。
const query = unref(router.currentRoute).query
// 验证码地址
const code = ref(`http://${window.location.host}${baseUrl}/code/image`)

// 用户填写的信息
const loginInfo = ref({
  name: '', // 用户名
  password: null, // 密码
  rememberMe: true, // 是否记住登录状态
  imageCode: '', // 验证码
})

let itemRefs = null

/** 通过函数获得element ref */
const setItemRef = (el) => {
  if (el) {
    itemRefs = el
  }
}

/** 刷新验证码 */
function refreshCode() {
  itemRefs.src = code.value
}

// const ls = createLocalStorage({ prefixKey: 'login_' })
// const lsLoginInfo = ls.get('loginInfo')
// if (lsLoginInfo) {
// loginInfo.value.name = lsLoginInfo.name || ''
// loginInfo.value.password = lsLoginInfo.password || ''
// }

async function handleLogin() {
  const { name, password, rememberMe, imageCode } = loginInfo.value
  if (!name || !password) {
    $message.warning('请输入用户名和密码')
    return
  }
  try {
    $message.loading('正在验证...')
    const res = await login({ username: name, password: password.toString(), 'remember-me': rememberMe, imageCode })
    if (res.code === 200) {
      $message.success('登录成功')
      // ls.set('loginInfo', { name, password })
      // setToken(res.data.token)

      if (query.redirect) {
        const path = query.redirect
        Reflect.deleteProperty(query, 'redirect')
        router.push({ path, query })
      } else {
        router.push('/')
      }
    } else if (res.code === 400) {
      $message.warning(res.Message)
      // 刷新验证码
      refreshCode()
    }
  } catch (error) {
    console.log(error)
    $message.error(error.message)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="form-wrapper">
      <h2 class="title">{{ title }}</h2>
      <div class="form-item" mt-20>
        <input
          v-model="loginInfo.name"
          autofocus
          type="text"
          class="input"
          placeholder="用户名"
          @keydown.enter="handleLogin"
        />
      </div>
      <div class="form-item" mt-20>
        <input
          v-model="loginInfo.password"
          type="password"
          class="input"
          placeholder="密码"
          @keydown.enter="handleLogin"
        />
      </div>
      <div class="form-item code" mt-20>
        <img :ref="setItemRef" :src="code" alt="" @click="refreshCode" />
        <input
          v-model="loginInfo.imageCode"
          type="text"
          class="input"
          placeholder="验证码"
          @keydown.enter="handleLogin"
        />
      </div>
      <div class="form-item" mt-20>
        <button class="submit-btn" @click="handleLogin">登录</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./index.scss"></style>
