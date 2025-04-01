import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import Mock from 'mockjs'

const apiUrl = 'https://vue3.admin.com/api'
let tableList = null
Mock.Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '189'] // 前缀
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) //Number()
  }
})
export default defineFakeRoute([
  // 表格
  {
    url: apiUrl + '/demo/table',
    method: 'post',
    response: ({ body }) => {
      if (!tableList) {
        tableList = Mock.mock({
          'list|30-100': [
            {
              'id|1-1000': 1,
              name: '@cname',
              phone: '@phone',
              email: '@email',
              'sex|0-1': 1,
              'status|0-1': 1,
              roles: ['admin', 'common'],
              createTime: '@datetime("T")',
              remark:
                '1.演示demo的数据是mock模拟, id可能不唯一。<br>2.只支持用户名称查询。<br>3.实际开发时，请在对应的方法里按需修改即可。',
              ip: '@ip',
              'image|1-13': 1
            }
          ]
        })
      }
      let list = tableList.list.filter((item) => item.name.includes(body?.name))
      if (body.status != undefined)
        list = list.filter((item) => String(item.status).includes(String(body?.status)))
      if (body.startDate) list = list.filter((item) => parseInt(item.createTime) >= body.startDate)
      if (body.endDate) list = list.filter((item) => parseInt(item.createTime) <= body.endDate)

      let total = list.length
      list = list.slice((body?.currentPage - 1) * body?.pageSize, body?.currentPage * body?.pageSize)
      return {
        code: 200,
        data: {
          list,
          total: total, // 总条目数
          pageSize: body?.pageSize, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      }
    }
  }
])
