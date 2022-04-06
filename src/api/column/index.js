import { defAxios as request } from '@/utils/http'

/** 获取所有专栏 */
export function getAllColumn(data = {}) {
  return request({
    url: '/personalColumn/findAll',
    method: 'get',
  })
}

/** 获取专栏详情 */
export function getDetailById(id) {
  return request({
    url: `personalColumn/findDetailById?id=${id}`,
    method: 'get',
  })
}

/** 新建专栏 专栏 */
export function createColumn(data) {
  return request({
    method: 'post',
    url: `personalColumn/create`,
    data,
  })
}

/** 更新专栏媒体信息 */
export function updateMedia(data) {
  return request({
    method: 'post',
    url: 'personalColumn/update',
    data,
  })
}

/** 删除专栏 */
export function deleteColumn(id) {
  return request({
    method: 'get',
    url: `personalColumn/delete?id=${id}`,
  })
}

// export function getUser(id) {
//   if (id) {
//     return request({
//       // url: `/user/${id}`,
//       url: '/myself',
//       method: 'get',
//     })
//   }
//   return request({
//     url: '/myself',
//     method: 'get',
//   })
// }

// export function saveUser(data = {}, id) {
//   if (id) {
//     return request({
//       url: '/user',
//       method: 'put',
//       data,
//     })
//   }

//   return request({
//     url: `/user/${id}`,
//     method: 'put',
//     data,
//   })
// }
