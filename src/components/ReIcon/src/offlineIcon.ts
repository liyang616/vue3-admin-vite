// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { addIcon } from '@iconify/vue/dist/offline'

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-icons/ep
import Lollipop from '@iconify-icons/ep/lollipop'
import HomeFilled from '@iconify-icons/ep/home-filled'
import questionFilled from '@iconify-icons/ep/question-filled'
import plus from '@iconify-icons/ep/plus'
import tools from '@iconify-icons/ep/tools'
addIcon('ep:lollipop', Lollipop)
addIcon('ep:home-filled', HomeFilled)
addIcon('ep:question-filled', questionFilled)
addIcon('ep:plus', plus)
addIcon('ep:tools', tools)
// @iconify-icons/ri
import Search from '@iconify-icons/ri/search-line'
import InformationLine from '@iconify-icons/ri/information-line'
addIcon('ri:search-line', Search)
addIcon('ri:information-line', InformationLine)
