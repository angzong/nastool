import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authenticate/login',
    method: 'post',
    data
  })
}

export function register(data) {
  console.log("register+++")
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
