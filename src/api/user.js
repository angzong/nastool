import request from '@/utils/request'
//这里是用户的增删改查api
//baseurl在 .env.development文件下，替换“/dev-api”即可
export function login(data) {
  return request({
    url: '/authenticate/login',
    method: 'post',
    data
  })
}
//得到用户列表
export function fetchUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}
//删
export function deleteUser(query) {
  // console.log('/user/{userId}')
  return request({
    url: '/user/' + query ,
    method: 'delete'
  })
}
//更新
export function updateUser(userId,user) {
  // console.log('/user/{userId}')
  console.log(user)
  return request({
    url: '/user/' + userId ,
    method: 'put',
    data: user
  })
}
//注册
export function register(data) {
  return request({
    url: '/authenticate/register',
    method: 'post',
    data
  })
}
//拿用户信息
export function getInfo(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'get'
  })
}
//登出
export function logout() {
  return request({
    url: '/user/logout',
  })
}
