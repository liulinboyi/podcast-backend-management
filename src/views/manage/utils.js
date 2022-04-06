import axios from 'axios'
const VITE_RESOURCE_BASE_URI = import.meta.env.VITE_RESOURCE_BASE_URI
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

/** 拼接完整路径 */
export function fullPath(img) {
  return `${VITE_BASE_URL}${VITE_RESOURCE_BASE_URI}${img}`
}

export const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
  setAvatar,
}) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data)
    })
  }
  // formData.append(file.name, file.file)
  formData.append('file', file.file)
  axios
    .post(action, formData, {
      withCredentials,
      headers,
      onUploadProgress: ({ loaded, total }) => {
        onProgress({ percent: Math.ceil((loaded / total) * 100) })
      },
    })
    .then((e) => {
      $message.success(e.data.message)
      setAvatar(e.data.data)
      onFinish()
    })
    .catch((error) => {
      $message.success(error.message)
      onError()
    })
}

/** 深拷贝 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  })

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}
