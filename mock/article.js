const Mock = require('mockjs')

const List = []
const count = 100
const Userlist=[]
const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    jobGroup: '@ctitle(3,6)',
    jobName: '@ctitle(4,8)',
		cronExpression: '* * * * * ? *',  //cron表达式
    'concurrent|1': ['0','1'],  //是否允许并发执行
    'invokeMethod|1': ['HTTP_GET', 'HTTP_POST', 'HTTP_PUT', 'HTTP_DELETE'],
    invokeParam: '@ctitle(5,10)',  //请求参数
    invokeTarget: '@ctitle(5,10)',  //调用目标字符串
    misfirePolicy: '@ctitle(5,10)',  //cron计划策略
    createTime: '@date',
    'status|1': ['PENDING','PROCESSED','PROCESSING'],
    createUser: '@cname',
    updateUser: '@cname',
		createTime: {
      "date": '@date',
      "day": 0,
      "hours": 0,
      "minutes": 0,
      "month": 0,
      "nanos": 0,
      "seconds": 0,
      "time": 0,
      "timezoneOffset": 0,
      "year": 0
		},
    updateTime: {
      "date": 0,
      "day": 0,
      "hours": 0,
      "minutes": 0,
      "month": 0,
      "nanos": 0,
      "seconds": 0,
      "time": 0,
      "timezoneOffset": 0,
      "year": 0
    },

  }))
}

for (let i = 0; i < 10; i++) {
  Userlist.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['admin', 'editor', 'visitor'],
    'status|1': ['disabled', 'using'],
    'repeat|1': ['每月', '每周','每天'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

module.exports = [
  {
    url: '/job/list',
    type: 'get',
    response: config => {
      const {page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          current:'@integer(1,5)',
          pages: Math.ceil(mockList.length/20),
          size:20,
          total: mockList.length,
          records: pageList,
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/user',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = Userlist.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/job/add',  //添加任务
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/job/update/*',  
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/job/delete/*',  //根据任务ID删除任务
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }

]

