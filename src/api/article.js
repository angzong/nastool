import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: 'job/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(query) {
  return request({
    url: '/vue-element-admin/article/user',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(addJobVo) {
  return request({
    // url: '/vue-element-admin/article/create',
    url: '/job/add',
    method: 'post',
    addJobVo: addJobVo
  })
}

export function updateArticle(addJobVo, jobId) {
  return request({
    // url: '/vue-element-admin/article/update',
    url: '/job/update/' + jobId,
    method: 'put',
    addJobVo: addJobVo
  })
}

export function deleteArticle(jobId) {
  return request({
    url: '/job/delete/' + jobId,
    method: 'delete'
  })
}
