// 根据角色动态生成路由
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

const apiUrl = 'https://vue3.admin.com/api'
export default defineFakeRoute([
  {
    url: apiUrl + '/login',
    method: 'post',
    response: ({ body }) => {
      if (body.username === 'admin') {
        return {
          code: 200,
          data: {
            avatar: '/src/assets/user.jpg',
            username: 'admin',
            nickname: '凌云枫',
            // 一个用户可能有多个角色
            roles: ['admin'],
            // 按钮级别权限
            permissions: ['*:*:*'],
            accessToken: 'eyJhbGciOiJIUzUxMiJ9.admin'
          }
        }
      } else {
        return {
          code: 200,
          data: {
            avatar: '/src/assets/user2.jpg',
            username: 'common',
            nickname: '陈平安',
            roles: ['common'],
            permissions: ['btn_add', 'btn_edit'],
            accessToken: 'eyJhbGciOiJIUzUxMiJ9.common'
          }
        }
      }
    }
  }
])
