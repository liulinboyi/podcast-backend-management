import { defAxios as request } from '@/utils/http'

export function getUsers(data = {}) {
  return request({
    url: '/users',
    method: 'get',
    data,
  })
}

export function getUser(id) {
  if (id) {
    return request({
      // url: `/user/${id}`,
      url: '/myself',
      method: 'get',
    })
  }
  return request({
    url: '/myself',
    method: 'get',
  })
}

export function saveUser(data = {}, id) {
  if (id) {
    return request({
      url: '/user',
      method: 'put',
      data,
    })
  }

  return request({
    url: `/user/${id}`,
    method: 'put',
    data,
  })
}
