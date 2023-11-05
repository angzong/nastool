import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authenticate/login',
    method: 'post',
    data
  })
}
export function fetchUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function deleteUser(query) {
  // console.log('/user/{userId}')
  return request({
    url: '/user/' + query ,
    method: 'delete'
  })
}

export function updateUser(userId,user) {
  // console.log('/user/{userId}')
  return request({
    url: '/user/' + userId ,
    method: 'put',
    params: user
  })
}

export function register(data) {
  return request({
    url: '/authenticate/register',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/',
    method: 'get',
    params: { userId }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
