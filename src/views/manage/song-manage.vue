<script>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { getDetailById, updateMedia } from '@/api/column/index'
import { reactive, onBeforeMount, nextTick } from 'vue'
import { fullPath, customRequest } from './utils'
import { h, defineComponent, ref } from 'vue'
import { NButton, useMessage, NDataTable, NCard, NImage } from 'naive-ui'
import { NModal, NForm, NFormItemGi, NInput, NSelect, NUpload, NGrid } from 'naive-ui'
import Plyr from 'plyr'
const VITE_APP_GLOB_BASE_API = import.meta.env.VITE_APP_GLOB_BASE_API
const baseUrl = import.meta.env.VITE_APP_GLOB_BASE_API

const createColumns = ({ play, deleteMedia }) => {
  return [
    {
      title: '序号',
      key: 'id',
    },
    {
      title: '名称',
      key: 'fileName',
    },
    {
      title: '播放',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => play(row),
          },
          { default: () => '播放' }
        )
      },
    },
    {
      title: '删除',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => deleteMedia(row),
          },
          { default: () => '删除' }
        )
      },
    },
  ]
}

export default defineComponent({
  name: 'SONGMANAGE',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const allMedia = reactive([])
    const columnInfo = reactive({})
    const message = useMessage()
    let showModal = ref(false)
    let showModalPlayer = ref(false)
    let curSongUrl = ref('')
    const bodyStyle = {
      width: '600px',
    }
    /** 创建状态 start | loading | end */
    let createStatus = ref('start')
    /** 所有创建状态 */
    const CREATESTATUS = {
      start: 'start',
      loading: 'loading',
      end: 'end',
    }
    let uploadUrl = `http://${location.host}${VITE_APP_GLOB_BASE_API}/file/upload`

    const formRef = ref(null)
    const size = ref('medium')
    const model = ref({
      title: null,
      content: null,
      classifyId: null,
    })
    const rules = {
      title: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入专栏名称',
      },
      content: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入专栏介绍',
      },
      classifyId: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择分类',
      },
    }
    const fileList = ref([])
    let fileMedia = reactive([])
    let originColumn = reactive({})

    let { columnId } = route.query

    async function refresh() {
      let res = await getDetailById(columnId)
      // 备份原始originColumn
      let backUp = JSON.parse(JSON.stringify(res.data))
      for (let item of Object.keys(backUp)) {
        originColumn[item] = backUp[item]
      }
      // 结束
      let data = res.data
      // if (
      //   !userStore.role.includes('ROLE_admin') /* 不是管理员 */ &&
      //   data.userId !== userStore.userId /* 专栏信息中的userId不等于用户中的userId */
      // ) {
      //   // 则返回上一页
      //   router.back()
      // }
      // 补全资源路径
      data.img = fullPath(data.img)
      // 清空数组
      allMedia.length = 0
      // 重新加入数组
      allMedia.push(...(data.allMedia ? data.allMedia : []))
      for (let item in data) {
        columnInfo[item] = data[item]
      }
    }

    onBeforeMount(async () => {
      await refresh()
    })

    /** 创建播客 */
    function newMedia() {
      showModal.value = true
    }

    async function createMedias() {
      // 点击创建，进入loa顶状态
      createStatus.value = CREATESTATUS.loading
      // 原有专栏播客媒体
      let origin = (originColumn.allMedia ? originColumn.allMedia : []).map((item) => item.id)
      originColumn.mediaIdArray = [...origin, fileMedia.map((item) => item.id)].join(',')
      // 删除用不到的字段
      delete originColumn.allMedia
      let res = await updateMedia(originColumn)
      console.log(res)
      createStatus.value = CREATESTATUS.end
      showModal.value = false
      await refresh()
      // 上传完成后清空
      fileList.value = []
      // 清空
      fileMedia.length = 0
    }

    async function deleteMedias(row) {
      let { id } = row
      let origin = originColumn.allMedia.map((item) => item.id).filter((item) => item !== id)
      originColumn.mediaIdArray = [...origin].join(',')
      // 删除用不到的字段
      delete originColumn.allMedia
      await updateMedia(originColumn)
      await refresh()
    }

    const ColumnCategory = {
      1: '默认',
    }
    /** 构建select选项 */
    const generalOptions = Object.keys(ColumnCategory).map((v) => ({
      label: ColumnCategory[v],
      value: v,
    }))

    function setMedia(media) {
      fileMedia.push(media)
    }

    function uploadAvatar(...args) {
      args[0].setAvatar = setMedia
      customRequest(...args)
    }

    function handleRemove(data) {
      // 过滤已经删除
      fileMedia = fileMedia.filter((item) => {
        return item.uniqueId !== data.id
      })
    }

    function handleUploadChange(data) {
      fileList.value = data.fileList
    }

    function handleFileListChange(fileList) {
      console.log(fileList)
    }

    const handleFinish = ({ file, event }) => {
      // 这里设置一下uniqueId
      fileMedia[fileMedia.length - 1].uniqueId = file.id
      return file
    }

    const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000))
    const countDown = (second) => `倒计时 ${second} 秒`

    return {
      sleep,
      countDown,
      createMedias,
      newMedia,
      uploadAvatar,
      handleRemove,
      handleUploadChange,
      handleFileListChange,
      handleFinish,
      allMedia,
      columnInfo,
      // data,
      columns: createColumns({
        play(row) {
          showModalPlayer.value = true
          nextTick(() => {
            curSongUrl.value = `http://${location.host}${baseUrl}/file/video/player?path=${row.path}`
            const player = new Plyr('#player')
          })
        },
        deleteMedia(row) {
          const d = $dialog.success('确定删除?', {
            // content: '点击，倒计时 3 秒',
            positiveText: '确认',
            negativeText: '取消',
            onPositiveClick: () => {
              d.loading = true
              return new Promise(async (resolve) => {
                await deleteMedias(row)
                resolve()
              })
            },
          })
        },
      }),
      pagination: false,
      showModal,
      bodyStyle,
      formRef,
      size,
      model,
      rules,
      createStatus,
      CREATESTATUS,
      generalOptions,
      uploadUrl,
      fileList,
      fileMedia,
      showModalPlayer,
      curSongUrl,
    }
  },
  components: {
    NDataTable,
    NModal,
    NForm,
    NFormItemGi,
    NInput,
    NSelect,
    NUpload,
    NGrid,
    NCard,
    NButton,
    NImage,
  },
})
</script>

<template>
  <div class="song-manage">
    <div class="cover">
      <n-image :src="columnInfo.img" object-fit="cover" />
    </div>
    <n-card title="全部播客">
      <template #header-extra>
        <n-button @click="newMedia" text type="primary">新建播客</n-button>
      </template>
    </n-card>
    <n-data-table :columns="columns" :data="allMedia" :pagination="pagination" :bordered="false" />
    <n-modal
      class="column-maname-default-modal"
      v-model:show="showModal"
      preset="card"
      title="新建专栏"
      :style="bodyStyle"
      :mask-closable="false"
    >
      <template #header>
        <div>新建专栏播客</div>
      </template>
      <div>
        <n-upload
          :custom-request="uploadAvatar"
          :action="uploadUrl"
          accept=".mp3, .m4a"
          v-model:file-list="fileList"
          @remove="handleRemove"
          @update:file-list="handleFileListChange"
          @change="handleUploadChange"
          @finish="handleFinish"
        >
          <n-button>上传文件</n-button>
        </n-upload>
      </div>
      <template #action>
        <!-- <div>操作</div> -->
        <div class="action">
          <n-button type="warning" class="cancel" @click="showModal = false"> 取消 </n-button>
          <n-button
            type="success"
            class="confirm"
            @click="createMedias"
            :disabled="createStatus === CREATESTATUS.loading"
            :loading="createStatus === CREATESTATUS.loading"
          >
            确定
          </n-button>
        </div>
      </template>
    </n-modal>
    <n-modal
      class="column-maname-default-modal"
      v-model:show="showModalPlayer"
      preset="card"
      title="播放"
      :style="bodyStyle"
      :mask-closable="false"
    >
      <audio id="player" controls>
        <source :src="curSongUrl" type="audio/mpeg" />
      </audio>
    </n-modal>
  </div>
</template>

<style lang="scss">
.song-manage {
  .cover {
    height: 300px;
    overflow: hidden;
  }
  .n-image {
    width: 100%;
    img {
      width: 100%;
    }
  }
}

.action {
  display: flex;
  justify-content: flex-end;
  .cancel {
    margin-right: 12px;
  }
  // .confirm {
  // }
}
</style>
