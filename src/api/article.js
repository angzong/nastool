import request from '@/utils/request'
//这里是夏飞二号负责的任务板块

export function start(id) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `job/resume/${id}`,
    method: 'get',
  })
}

export function stop(id) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `job/pause/${id}`,
    method: 'get',
  })
}

export function runOnce(id) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `job/run/${id}`,
    method: 'get',
  })
}

export function fetchList(id,query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `job/list/${id}`,
    method: 'get',
    param: query
  })
}

export function getMetadata() {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `metadata/list`,
    method: 'get',
  })
}

export function fetchPlugins(id,query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/list/${id}`,
    method: 'get',
    params: query
  })
}

export function startPlugin(plugin) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/start`,
    method: 'post',
    data: plugin
  })
}

export function stopPlugin(plugin) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/stop`,
    method: 'post',
    data: plugin
  })
}

export function deletePlugin(plugin) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/delete`,
    method: 'delete',
    data: plugin
  })
}

export function fetchAllPlugins(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/list`,
    method: 'get',
    params: query
  })
}

export function uploadFile(formatdata) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/add`,
    method: 'post',
    data: formatdata,
    transformRequest: [function(data, headers) {
      // 去除post请求默认的Content-Type
      delete headers.post['Content-Type']
      return data
    }]
  })
}

export function download(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: `plugin/download`,
    method: 'post',
    data: query
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
    data: addJobVo
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

export function getPicData(criteria, userId) {
  return request({
    // url: '/vue-element-admin/article/list',
    baseURL: 'http://localhost:12131',
    url: `photo/list/${criteria}/${userId}`,
    method: 'get'
  })
}

export function getAnimeData() {
  return request({
    // url: '/vue-element-admin/article/list',
    baseURL: 'http://localhost:12133',
    url: `/anime/list`,
    method: 'get'
  })
}
