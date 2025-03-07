// 模拟后端动态生成系统管理相关数据
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
const apiUrl = 'https://vue3.admin.com/api'

export default defineFakeRoute([
  // 账户设置
  {
    url: apiUrl + '/userInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          avatar: 'https://avatars.githubusercontent.com/u/44761321',
          username: 'admin',
          nickname: '小铭',
          sex: 0,
          email: 'vue3Admin@qq.com',
          phone: '15888889999',
          description: '一个对UI界面、体验交互有追求的前端工程师'
        }
      }
    }
  },

  // 角色管理
  {
    url: apiUrl + '/role',
    method: 'post',
    response: ({ body }) => {
      let list = [
        {
          createTime: 1605456000000, // 时间戳（毫秒ms）
          updateTime: 1684512000000,
          id: 1,
          name: '超级管理员',
          code: 'admin',
          menuIds: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112],
          status: 1, // 状态 1 启用 0 停用
          remark: '超级管理员拥有最高权限'
        },
        {
          createTime: 1605456000000,
          updateTime: 1684512000000,
          id: 2,
          name: '普通角色',
          code: 'common',
          menuIds: [100, 101, 102, 103, 104, 105, 106, 107, 108],
          status: 0,
          remark: '普通角色拥有部分权限'
        }
      ]
      list = list.filter((item) => item.name.includes(body?.name))
      if (body.status != undefined)
        list = list.filter((item) => String(item.status).includes(String(body?.status)))
      if (body.code) list = list.filter((item) => item.code === body.code)
      return {
        code: 200,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      }
    }
  },

  // 用户管理
  {
    url: apiUrl + '/user',
    method: 'post',
    response: ({ body }) => {
      let list = [
        {
          avatar: 'https://avatars.githubusercontent.com/u/44761321',
          username: 'admin',
          nickname: '小铭',
          phone: '15888889999',
          email: '888@qq.com',
          sex: 0,
          id: 1,
          status: 1,
          roles: ['admin', 'common'],
          remark: '管理员',
          createTime: 1605456000000
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/52823142',
          username: 'common',
          nickname: '小林',
          phone: '18288886666',
          email: '666@qq.com',
          sex: 1,
          id: 2,
          status: 1,
          roles: ['common'],
          remark: '普通用户',
          createTime: 1605456000000
        }
      ]
      list = list.filter((item) => item.username.includes(body?.username))
      if (body.status != undefined)
        list = list.filter((item) => String(item.status).includes(String(body?.status)))
      if (body.phone) list = list.filter((item) => item.phone === body.phone)
      return {
        code: 200,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      }
    }
  },

  // 用户管理-获取所有角色列表
  {
    url: apiUrl + '/all-role',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          { id: 1, name: '超级管理员' },
          { id: 2, name: '普通角色' }
        ]
      }
    }
  },

  // 获取alioss凭证
  {
    url: apiUrl + '/alioss',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          accessKeyId: 'STS.NTGxDsYb5MRRTE29SPCXg6ZyG',
          accessKeySecret: 'HLuxyMiHux5zsQLVufUQC8wKd4R3mQt1gR6QcK2LrTZs',
          bucket: 'tool-officel',
          region: 'oss-cn-guangzhou',
          stsToken: 'CAIS9gF1q6Ft5B2yfSjIr5fyM/7HtL0U+pC5VmOD3VMFT9dL2Z/SpTz2IH1JfX'
        }
      }
    }
  }
])
