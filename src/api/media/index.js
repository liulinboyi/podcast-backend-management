import { defAxios as request } from '@/utils/http'

/** 更新专栏播客媒体 */
export function updateFileConfig(data) {
  return request({
    method: 'post',
    url: `file/updateMedia`,
    data,
  })
}
