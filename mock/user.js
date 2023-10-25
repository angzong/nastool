
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

module.exports = [
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
