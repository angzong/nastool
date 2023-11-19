import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
  路由控制页面组件，所有组件在src/view下。页面布局由layout控制，路由负责填充用view的具体组件填充layout
 */


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },


  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  //用户管理
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '用户管理',
      icon: 'lock',
      roles: ['ADMIN','ADV_USER','SYS_ADMIN'	] // you can set roles in root nav
    },
    children: [
      // {
      //   path: 'profile',
      //   component: () => import('@/views/profile/index'),
      //   name: 'Profile',
      //   meta: { title: '我的', noCache: true }
      // },
      {
        path: 'userlist',
        component: () => import('@/views/tab/index'),
        name: 'Userlist',
        meta: {
          title: '用户列表',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }
      ,
      // {
      //   path: 'role',
      //   component: () => import('@/views/permission/role'),
      //   name: 'RolePermission',
      //   meta: {
      //     title: '权限设置',
      //     roles: ['ADMIN']
      //   }
      // },
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        hidden: true,
        meta: {
          title: 'Page Permission',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'directive',
        hidden: true,
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },


  //插件管理
  {
    path: '/plugin',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '插件管理',
      icon: 'icon'
    },
    children: [
      {
        path: 'market',
        component: () => import('@/views/icons/index'),
        name: 'Plugin-market',
        meta: { title: '插件市场', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        hidden:true,
        name: 'My-error',
        meta: { title: '我的插件', noCache: true }
      },
      {
        path: 'complex-table',
        component: () => import('@/views/table/complex-table'),
        name: 'My-plugin',
        meta: { title: '我的插件' }
      },
      {
        path: 'photo',
        component: () => import('@/views/table/photo'),
        name: 'My-photo',
        meta: { title: '图片管理插件' }
      },
      {
        path: 'anime',
        component: () => import('@/views/table/file-management'),
        name: 'My-anime',
        meta: { title: '影视管理插件' }
      }
    ]
  },

  //定时任务
  {
    path: '/task',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/table/timed-task'),
        name: 'ArticleList',
        meta: { title: '定时任务', icon: 'list' }
      }
    ]
  },
  // {
  //   path: '/example',
  //   hidden: true,
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,







  {
    path: '/error-log',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log plus', icon: 'bug' }
      }
    ]
  },






  {
    path: '/theme',

    component: Layout,
    hidden:true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: '主题',
        meta: { title: '主题', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
