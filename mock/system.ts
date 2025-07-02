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
          avatar: 'http://42.194.189.215/images/head.jpg',
          username: 'admin',
          nickname: '凌云枫',
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
          avatar: 'http://42.194.189.215/images/head.jpg',
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
          avatar: 'https://avatars.githubusercontent.com/u/44761321',
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
          { code: 'admin', name: '超级管理员' },
          { code: 'common', name: '普通角色' }
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
  },

  // 接口上传图片
  {
    url: apiUrl + '/upload',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          url: 'http://42.194.189.215/images/picture/img14.jpg'
        }
      }
    }
  },

  // 获取验证码图片
  {
    url: apiUrl + '/captchaImage',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          img: 'data:image/gif;base64,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',
          uuid: 'cd3a77336d0f4042addc47b918746999'
        }
      }
    }
  }
])
