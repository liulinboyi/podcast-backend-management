<script name="REVIEWMANAGE" setup>
import { nextTick, onBeforeMount, onMounted, reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllReview, createColumn, deleteColumn, updateMedia } from '@/api/column/index'
import { fullPath, customRequest, deepCopy } from './utils'
import { useUserStore } from '@/store/modules/user'
import { emitter } from '@/utils/eventHub'
import { NModal, NButton, NForm, NFormItemGi, NInput, NSelect, NUpload } from 'naive-ui'
const VITE_RESOURCE_BASE_URI = import.meta.env.VITE_RESOURCE_BASE_URI
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL
const VITE_APP_GLOB_BASE_API = import.meta.env.VITE_APP_GLOB_BASE_API

const router = useRouter()
const store = useUserStore()
let allColumn = reactive([])
/** 当前待更新 专栏 */
let updateColumn = ref({})
let out = ref(null)
let showModal = ref(false)
let uploadUrl = `http://${location.host}${VITE_APP_GLOB_BASE_API}/file/upload`
/** 弹窗状态 create | update */
let modalStatus = ref('create')
/** 所有弹窗状态 */
const MODALSTATUS = {
  create: 'create',
  update: 'update',
}
/** 创建状态 start | loading | end */
let createStatus = ref('start')
/** 所有创建状态 */
const CREATESTATUS = {
  start: 'start',
  loading: 'loading',
  end: 'end',
}

const bodyStyle = {
  width: '600px',
}

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

const fileList = ref([
  // {
  //   id: 'a',
  //   name: '我是上传出错的普通文件.png',
  //   status: 'error',
  // },
  // {
  //   id: 'b',
  //   name: '我是普通文本.doc',
  //   status: 'finished',
  //   type: 'text/plain',
  // },
  // {
  //   id: 'c',
  //   name: '我是自带url的图片.png',
  //   status: 'finished',
  //   url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  // },
  // {
  //   id: 'd',
  //   name: '我是上传进度99%的文本.doc',
  //   status: 'uploading',
  //   percentage: 99,
  // },
])

/** 头像 */
let fileAvatar = reactive({})

/** */
const ColumnCategory = {
  1: '默认',
}
/** 构建select选项 */
const generalOptions = Object.keys(ColumnCategory).map((v) => ({
  label: ColumnCategory[v],
  value: v,
}))

/** 刷新专栏信息 */
async function refreshColumn() {
  let columnRes = await getAllReview()
  for (let item of columnRes.data) {
    item.originImg = item.img
    item.img = fullPath(item.img)
  }
  // 清空
  allColumn.length = 0
  allColumn.push(...columnRes.data)
}

onBeforeMount(async () => {
  await refreshColumn()
})

/** 跳转到专栏内容 */
function goSong(column) {
  router.push(`/test/column-manage/song?columnId=${column.id}`)
}

/** 打开弹窗 */
// function newColumn() {
//   modalStatus.value = MODALSTATUS.create
//   showModal.value = true
// }

/** 更新专栏 */
async function updateColumns() {
  // 点击创建，进入loading状态
  createStatus.value = CREATESTATUS.loading
  updateColumn.value.title = model.value.title
  // 如果初次，并未修改分类，可能会出现，分类为展示值，并非为存储值，需要做处理
  let allClassfyId = Object.keys(ColumnCategory)
  if (!allClassfyId.includes(model.value.classifyId)) {
    for (let item of allClassfyId) {
      if (ColumnCategory[item] === model.value.classifyId) {
        model.value.classifyId = item
        break
      }
    }
  }
  updateColumn.value.classifyId = model.value.classifyId
  updateColumn.value.content = model.value.content
  updateColumn.value.img = fileAvatar.path
  updateColumn.value.mediaIdArray = (updateColumn.value.allMedia ? updateColumn.value.allMedia : [])
    .map((item) => item.id)
    .join(',')
  // 删除多余属性
  delete updateColumn.value.allMedia
  delete updateColumn.value.originImg

  let res = await updateMedia(updateColumn.value)
  // 创建成功进入end状态
  createStatus.value = CREATESTATUS.end
  console.log(res)
  // 创建完成后，关闭弹窗
  showModal.value = false
  await refreshColumn()
}

/** 创建专栏 */
async function createColumns() {
  // 点击创建，进入loa顶状态
  createStatus.value = CREATESTATUS.loading
  // 添加用户名
  model.value.username = store.userInfo.username
  // 添加媒体资源
  model.value.mediaIdArray = ''
  // 添加创建用户ID
  model.value.userId = store.userInfo.id
  // 图片
  model.value.img = fileAvatar.path
  let res = await createColumn(model.value)
  // 创建成功进入end状态
  createStatus.value = CREATESTATUS.end
  console.log(res)
  // 创建完成后，关闭弹窗
  showModal.value = false
  await refreshColumn()
}
function handleUploadChange(data) {
  fileList.value = data.fileList
}
/** 移除图片 */
function handleRemove(data) {
  // 移除图片之后，将fileAvatar的路径置为null
  fileAvatar.path = null
}
function handleFileListChange(fileList) {
  console.log(fileList)
}

function setAvatar(avatar) {
  for (let item of Object.keys(avatar)) {
    fileAvatar[item] = avatar[item]
  }
}

/** 自定义上传 */
function uploadAvatar(...args) {
  // 设置上传完成之后的setAvatar，来设置fileAvatar
  args[0].setAvatar = setAvatar
  customRequest(...args)
}

/** 编辑专栏 */
function editColumns(column) {
  // 将待更新专栏保存起来
  updateColumn.value = deepCopy(column)
  // 在编辑前设置专栏信息
  model.value.classifyId = ColumnCategory[column.classifyId]
  model.value.content = column.content
  model.value.title = column.title
  // 图片信息
  fileList.value.length = 0
  fileList.value.push({
    id: 'c',
    name: '待修改图片.png',
    status: 'finished',
    url: column.img,
  })
  fileAvatar.path = column.originImg
  modalStatus.value = MODALSTATUS.update
  // 打开弹窗
  showModal.value = true
}

/** 删除专栏 */
function deleteColumns(column) {
  const d = $dialog.success('确定删除?', {
    // content: '点击，倒计时 3 秒',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      d.loading = true
      return new Promise(async (resolve) => {
        await deleteColumn(column.id)
        await refreshColumn()
        resolve()
      })
    },
  })
}
</script>

<template>
  <div p15 flex ref="out">
    <n-card title="审核专栏" size="small" :segmented="true">
      <!-- <template #header-extra>
        <n-button @click="newColumn" text type="primary">新建专栏</n-button>
      </template> -->
      <div class="card-list">
        <n-card @click="goSong(column)" v-for="column of allColumn" :key="column.id" :title="column.title" size="small">
          <template #cover>
            <img :src="column.img" />
          </template>
          <p op60>{{ column.content }}</p>
          <template #footer>
            <div class="card-footer">
              <span @click.stop="editColumns(column)">审核</span><span @click.stop="deleteColumns(column)">删除</span>
            </div>
          </template>
        </n-card>
        <div class="blank"></div>
        <div class="blank"></div>
        <div class="blank"></div>
        <div class="blank"></div>
      </div>
    </n-card>

    <n-modal
      class="column-maname-default-modal"
      v-model:show="showModal"
      preset="card"
      title="新建专栏"
      :style="bodyStyle"
      :mask-closable="false"
    >
      <template #header>
        <div>审核专栏</div>
      </template>
      <div>
        <n-form ref="formRef" :model="model" :rules="rules" :size="size" label-placement="top">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi>
              <n-upload
                :custom-request="uploadAvatar"
                :action="uploadUrl"
                list-type="image-card"
                :max="1"
                accept="image/png, image/jpeg"
                v-model:file-list="fileList"
                @remove="handleRemove"
                @update:file-list="handleFileListChange"
                @change="handleUploadChange"
              >
                点击上传
              </n-upload>
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="专栏名称" path="title">
              <n-input v-model:value="model.title" placeholder="请输入专栏名称" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="专栏介绍" path="content">
              <n-input
                v-model:value="model.content"
                placeholder="请输入专栏介绍"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5,
                }"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="专栏分类" path="classifyId">
              <n-select v-model:value="model.classifyId" placeholder="请选择分类" :options="generalOptions" />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
      <template #action>
        <!-- <div>操作</div> -->
        <div class="action">
          <n-button type="warning" class="cancel" @click="showModal = false"> 取消 </n-button>
          <n-button
            type="success"
            class="confirm"
            @click="modalStatus === MODALSTATUS.create ? createColumns() : updateColumns()"
            :disabled="createStatus === CREATESTATUS.loading"
            :loading="createStatus === CREATESTATUS.loading"
          >
            确定
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

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

  .card-footer {
    display: flex;
    justify-content: space-around;
    span:hover {
      color: #18a058;
    }
    span {
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }
}

.column-maname-default-modal {
  .action {
    display: flex;
    justify-content: flex-end;
    .cancel {
      margin-right: 12px;
    }
    // .confirm {
    // }
  }
}
</style>

<style lang="scss">
.column-maname-default-modal {
  &.n-card > .n-card__action {
    background-color: white;
  }
}
</style>
