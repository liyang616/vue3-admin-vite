// 模拟后端动态生成系统管理相关数据
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
const apiUrl = 'https://hbykt.b1tech.cn/api'

// 菜单管理
export default defineFakeRoute([
  {
    url: apiUrl + '/menu',
    method: 'post',
    response: () => {
      return {
        success: true,
        data: [
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: '系统管理',
            i18nKey: '', // 国际化语言key
            name: '',
            path: '/system',
            component: '',
            rank: 7,
            redirect: '',
            icon: 'ep:tools',
            extraIcon: '',
            enterTransition: '',
            leaveTransition: '',
            activePath: '',
            auths: '',
            frameSrc: '',
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: true
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: '菜单管理',
            i18nKey: '',
            name: 'systemMenu',
            path: '/system/menu',
            component: '',
            rank: 8,
            redirect: '',
            icon: '',
            extraIcon: '',
            enterTransition: '',
            leaveTransition: '',
            activePath: '',
            auths: '',
            frameSrc: '',
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 102,
            menuType: 3,
            title: '新增',
            i18nKey: '',
            name: '',
            path: '',
            component: '',
            rank: 8,
            redirect: '',
            icon: '',
            extraIcon: '',
            enterTransition: '',
            leaveTransition: '',
            activePath: '',
            auths: 'permission:btn:add',
            frameSrc: '',
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 103,
            menuType: 3,
            title: '编辑',
            i18nKey: '',
            name: '',
            path: '',
            component: '',
            rank: 8,
            redirect: '',
            icon: '',
            extraIcon: '',
            enterTransition: '',
            leaveTransition: '',
            activePath: '',
            auths: 'permission:btn:edit',
            frameSrc: '',
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 104,
            menuType: 3,
            title: '删除',
            i18nKey: '',
            name: '',
            path: '',
            component: '',
            rank: 8,
            redirect: '',
            icon: '',
            extraIcon: '',
            enterTransition: '',
            leaveTransition: '',
            activePath: '',
            auths: 'permission:btn:delete',
            frameSrc: '',
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          }
        ]
      }
    }
  }
])
