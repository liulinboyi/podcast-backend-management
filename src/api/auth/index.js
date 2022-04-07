import { defAxios as request } from '@/utils/http'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    formData: data,
  })
}

export const logout = () => {
  return request({
    method: 'get',
    url: `logout`,
  })
}

export const getUser = () => {
  return request({
    method: 'get',
    url: '/myself'
  })
}

export const refreshToken = () => {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
  })
}
