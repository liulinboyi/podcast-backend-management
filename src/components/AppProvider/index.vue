<script setup>
import MessageContent from './MessageContent.vue'
import DialogContent from './DialogContent.vue'
import LoadingBar from './LoadingBar.vue'

import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
</script>

<template>
  <n-config-provider :theme-overrides="appStore.themeOverrides">
  <!-- provider组件已经挂载到vue实例上去了，在这里使用 -->
    <n-loading-bar-provider>
      <loading-bar />
      <n-dialog-provider>
        <dialog-content />
        <n-message-provider>
          <message-content />
          <slot></slot>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
