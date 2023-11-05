const Mock = require('mockjs')
const Userlist=[]
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
  visitor: {
    token: 'visitor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'visitor-token': {
    roles: ['visitor'],
    introduction: 'I am a super visitor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'visitor'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

for (let i = 0; i < 20; i++) {
  Userlist.push(Mock.mock({
    id: '@increment',
    username: '@title(5, 10)',
    email: '@integer(1000000)'+'@'+'@title(2, 3)'+'.com',
    password: '@integer(10000)',
    'userLevel|1': ['ADMIN','ADV_USER','GUEST','SYS_ADMIN','USER'],
    plugins: ['a-plugin','b']
  }))
}
const page=Mock.mock({page:'@integer(1,5)'})['page']

module.exports = [
  // user list
  {
    url: '/user/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page1 = 1, limit1 = 20, sort } = config.query
      const page=config.query.pageNum
      const limit=config.query.pageSize
      console.log(config.query)
      let mockList = Userlist.filter(item => {
        // if (importance && item.importance !== +importance) return false
        // if (type && item.type !== type) return false
        // if (title && item.title.indexOf(title) < 0) return false
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
          size: limit,
          records: pageList,
          total: mockList.length,
        }
      }
    }
  },

  //user delete
  {
    url: '/user/*',
    type: 'delete',
    response: config => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  //user update
  {
    url: '/user/*',
    type: 'put',
    response: config => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },


  //user search
  {
    url: '/user/*',
    type: 'get',
    response: config => {
      const info = {
        "email": "avbsajbvkja",
        "id": 789456,
        "password": "545454545",
        "plugins": ['a','b','c'],
        "userLevel": "SYS_ADMIN",
        "username": "cccccc"
      }
      return {
        code: 20000,
        data: info
      }
    }
  },
  // user login
  {
    url: '/authenticate/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // user register
  {
    url: '/authenticate/register',
    type: 'post',
    response: config => {
      const { username,password, email } = config.body
      console.log(config.body)
      if(tokens.hasOwnProperty(username)){
        return {
          code: 60204,
          message: '用户名已存在.'
        }
      }
      tokens[username]=username
      const token='editor-token'
      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = {
        "email": "",
        "id": 0,
        "password": "",
        "plugins": [],
        "userLevel": "ADMIN",
        "username": ""
      }
      // console.log(config)
      // console.log(users)
      // // mock error
      // if (!info) {
      //   return {
      //     code: 50008,
      //     message: 'Login failed, unable to get user details.'
      //   }
      // }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
