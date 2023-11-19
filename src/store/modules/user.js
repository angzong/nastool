import { login,register, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  email:'', id:'', password:'', plugins:[], userLevel:''
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
//此处主要负责token的记录，所以是store文件夹，将在此处进一步调用src/api文件夹下的函数

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.token)
        commit('SET_ID', data.userId)
        setToken(data.token)
        setId(data.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user register
  register({ commit }, userInfo) {
    const { username, password, email } = userInfo
    console.log("register_store")
    return new Promise((resolve, reject) => {
      // loginAndRegisterVo =
      register({ username: username.trim(), password: password , email: email}).then(response => {
        const { data } = response
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id).then(response => {
        const { data } = response
        console.log(response)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { email, id, password, plugins, userLevel,username } = data
        // const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!userLevel) {
          reject('getInfo: roles must be a non-null array!')
        }
        const avatar=''
        const introduction=''
        commit('SET_ROLES', userLevel)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()

    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })

    return new Promise((resolve, reject) => {
      // loginAndRegisterVo =
      logout().then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })

  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
