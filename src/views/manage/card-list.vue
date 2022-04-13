<script setup name="CARDLIST">
import { ref } from 'vue'
const props = defineProps({
  navigationTo: Function,
  data: Array,
  type: String,
})

/** 提示 */
const SHOWNOTICE = {
  SHOW: 1,
  HIDE: 2,
}

/** 展示提示 1:展示 2:不展示*/
// let showNotice = ref(SHOWNOTICE.SHOW)

function prcessNotice(column) {
  console.log(column)
  if (props.type === '编辑' && column.previewStatus === '未通过') {
    column.showNotice = SHOWNOTICE.SHOW
    return column.previewStatus
  } else if (props.type === '审核' && column.needPreview === '需要审核') {
    column.showNotice = SHOWNOTICE.SHOW
    return column.needPreview
  } else {
    column.showNotice = SHOWNOTICE.HIDE
    return ''
  }
}
</script>

<template>
  <div class="card-list">
    <div class="out-card" v-for="column of props.data" :key="column.id">
      <div v-show="column.showNotice === SHOWNOTICE.SHOW" class="card-notice">{{ prcessNotice(column) }}</div>
      <n-card @click="props.navigationTo(column)" :title="column.title" size="small">
        <template #cover>
          <img :src="column.img" />
        </template>
        <p op60>{{ column.content }}</p>
        <template #footer>
          <div class="card-footer">
            <slot :column="column"></slot>
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .out-card {
    position: relative;
    overflow: hidden;
    display: flex;
    margin: 10px 0;
    .card-notice {
      position: absolute;
      top: 0;
      right: 0;

      z-index: 1;
      transform: rotate(45deg);
      top: -29px;
      background: #eee6e69e;
      right: -82px;
      height: 100px;
      width: 201px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0px 0 10px 0;
      // outline: 1px red solid;
      font-size: 20px;
      color: #666;
    }
  }
  .n-card {
    width: 300px;
    flex-shrink: 0;
    margin: 0;
    cursor: pointer;
    &:hover {
      box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
    }

    .n-card__content {
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .blank {
    width: 300px;
    height: 0;
  }
}
</style>

<style lang="scss">
.card-list {
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
</style>
