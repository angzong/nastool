import request from '@/utils/request'

export function searchUser(query) {
  return request({
    url: '/user/' + query ,
    method: 'get'
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
