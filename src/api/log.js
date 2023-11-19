import request from '@/utils/request'

export function getLogList(query) {
  return request({
    url: `/log/list?pageNum=${query.pageNum}&pageSize=${query.pageSize}`,
    method: 'get'
  })
}
