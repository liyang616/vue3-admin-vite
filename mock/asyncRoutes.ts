// 模拟后端动态生成路由
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
const system = {
  path: '/system',
  name: 'system',
  redirect: '/system/menu',
  meta: {
    title: '系统管理',
    i18nKey: '',
    icon: 'ep:tools',
    rank: 11
  },
  children: [
    {
      path: '/system/menu',
      name: 'systemMenu',
      redirect: '',
      component: '',
      meta: {
        title: '菜单管理',
        i18nKey: '',
        showParent: true,
        roles: ['admin'],
        auths: ['btn_add', 'btn_edit', 'btn_delete'],
        icon: '',
        extraIcon: '',
        showLink: '',
        keepAlive: false,
        frameSrc: '',
        frameLoading: true,
        transition: {
          enterTransition: '',
          leaveTransition: ''
        },
        hiddenTag: false,
        activePath: ''
      }
    },
    {
      path: '/system/role',
      name: 'systemRole',
      meta: {
        title: '角色管理',
        i18nKey: '',
        showParent: true,
        roles: ['admin'],
        auths: ['btn_add', 'btn_edit', 'btn_delete']
      }
    },
    {
      path: '/system/user',
      name: 'systemUser',
      meta: {
        title: '用户管理',
        i18nKey: '',
        showParent: true,
        roles: ['admin'],
        auths: ['btn_add', 'btn_edit', 'btn_delete']
      }
    }
  ]
}

const demo = {
  path: '/demo',
  redirect: '/demo/table',
  meta: {
    title: '模板',
    i18nKey: '',
    icon: 'ep:menu',
    rank: 12
  },
  children: [
    {
      path: '/demo/table',
      name: 'demoTable',
      meta: {
        title: '表格',
        i18nKey: '',
        showParent: true,
        roles: ['admin', 'common'],
        auths: ['btn_add', 'btn_edit', 'btn_delete']
      }
    }
  ]
}

const docs = {
  path: '/docs',
  redirect: '/docs/element-plus',
  meta: {
    title: '相关文档',
    i18nKey: '',
    icon: 'ep:link',
    rank: 13
  },
  children: [
    {
      path: '/docs/Element-Plus',
      name: 'ElementPlus',
      meta: {
        title: 'Element Plus',
        i18nKey: '',
        frameSrc: 'https://element-plus.org/zh-CN/',
        showParent: true,
        roles: ['admin', 'common']
      }
    },
    {
      path: '/docs/Tailwind-CSS',
      name: 'TailwindCSS',
      meta: {
        title: 'Tailwind CSS',
        i18nKey: '',
        frameSrc: 'https://tailwindcss.com/docs/installation',
        showParent: true,
        roles: ['admin', 'common']
      }
    },
    {
      path: '/docs/iconify',
      name: 'iconify',
      meta: {
        title: 'iconify图集',
        i18nKey: '',
        frameSrc: 'https://yesicon.app/',
        showParent: true,
        roles: ['admin', 'common']
      }
    },
    {
      path: '/docs/pure-admin',
      name: 'https://pure-admin.cn/',
      meta: {
        title: 'pure-admin外链',
        i18nKey: '',
        showParent: true,
        roles: ['admin', 'common']
      }
    }
  ]
}

const apiUrl = 'https://vue3.admin.com/api'
export default defineFakeRoute([
  {
    url: apiUrl + '/get-async-routes',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [system, demo, docs]
      }
    }
  }
])
