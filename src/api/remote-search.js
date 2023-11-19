import request from '@/utils/request'
//这里应该和user.js合并，但我懒
//查找用户
export function searchUser(query) {
  return request({
    url: '/user/' + query ,
    method: 'get'
  })
}

export function transactionList(query) {
  // return request({
  //   url: '/vue-element-admin/transaction/list',
  //   method: 'get',
  //   params: query
  // })
}
