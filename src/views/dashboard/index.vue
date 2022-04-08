<template>
  <div>
    <n-card>
      <div flex items-center>
        <img width="60" style="border-radius: 50%" :src="userStore.avatar" />
        <div ml20>
          <p text-16>Hello, {{ userStore.name }}</p>
          <p op80 text-12 mt5>今天又是元气满满的一天</p>
        </div>
        <div flex ml-auto>
          <!-- <n-statistic label="待办" :value="4">
            <template #suffix> / 10 </template>
          </n-statistic> -->
          <n-statistic ml80 label="专栏数量">
            <n-number-animation ref="starsNumberRef" show-separator :from="0" :to="allColumn.length" />
          </n-statistic>
          <!-- <n-statistic ml80 label="Forks">
            <n-number-animation ref="starsNumberRef" show-separator :from="0" :to="299" />
          </n-statistic> -->
        </div>
      </div>
    </n-card>

    <div p15 flex>
      <n-card title="我的专栏" size="small" :segmented="true">
        <template #header-extra>
          <n-button @click="goMore" text type="primary">更多</n-button>
        </template>
        <div class="card-list">
          <n-card
            v-for="column of allColumn"
            @click="goSong(column)"
            :key="column.id"
            :title="column.title"
            size="small"
          >
            <template #cover>
              <img :src="column.img" />
            </template>
            <p op60>{{ column.content }}</p>
          </n-card>
          <div class="blank"></div>
          <div class="blank"></div>
          <div class="blank"></div>
          <div class="blank"></div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref, defineComponent } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getAllColumn } from '@/api/column/index'
import { useRouter } from 'vue-router'
const VITE_RESOURCE_BASE_URI = import.meta.env.VITE_RESOURCE_BASE_URI
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

export default defineComponent({
  name: 'DASHBOARD-INDEX',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    function goMore() {
      router.push('/test/column-manage')
    }

    /** 跳转到专栏内容 */
    function goSong(column) {
      router.push(`/test/column-manage/song?columnId=${column.id}`)
    }

    // let allColumn = ref([])
    // 转成响应式
    let allColumn = reactive([])

    onBeforeMount(async () => {
      let columnRes = await getAllColumn()
      for (let item of columnRes.data) {
        item.img = `${VITE_BASE_URL}${VITE_RESOURCE_BASE_URI}${item.img}`
      }
      // allColumn.value = columnRes.data
      allColumn.push(...columnRes.data)
    })

    return {
      userStore,
      allColumn,
      goMore,
      goSong,
    }
  },
})
</script>

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
