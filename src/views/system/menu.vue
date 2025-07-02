<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="菜单名称">
        <el-input v-model="searchForm.title" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="searchLoading" @click="getList">搜索</el-button>
        <el-button type="primary" v-auth="'btn_add'" @click="addRow(0)">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pub-table">
      <el-table :data="list" :max-height="$tableHeight" border :row-key="(row) => row.id">
        <el-table-column label="菜单名称" min-width="160">
          <template #default="scope">
            <IconifyIconOffline
              class="mr-2"
              v-if="scope.row.icon"
              :icon="scope.row.icon"
              width="16px"
              height="16px"
              aria-hidden="false"
            />
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="菜单类型" :formatter="typeFormatter" min-width="90" />
        <el-table-column label="路由路径" prop="path" min-width="160" />
        <el-table-column label="按钮权限" prop="auths" min-width="180" />
        <el-table-column label="排序" prop="rank" min-width="80" />
        <el-table-column label="隐藏" :formatter="showLink" min-width="80" />
        <el-table-column label="操作" align="center" :fixed="$isMobile ? false : 'right'" min-width="160">
          <template #default="scope">
            <el-button
              link
              type="primary"
              v-if="scope.row.menuType != 3"
              v-auth="'btn_add'"
              @click.prevent="addRow(1, scope.row)"
            >
              新增
            </el-button>
            <el-button link type="primary" v-auth="'btn_edit'" @click.prevent="editRow(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" v-auth="'btn_delete'" @click.prevent="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="showForm"
      :title="formTitle"
      draggable
      width="720"
      :close-on-click-modal="false"
      :fullscreen="$isMobile ? true : false"
      @close="closeForm"
    >
      <el-form
        ref="formRef"
        :model="dialogForm"
        :rules="formRules"
        :inline="$isMobile ? false : true"
        label-width="auto"
        class="pub-form"
      >
        <el-form-item label="菜单类型" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.menuType" @change="resetForm" placeholder="请选择">
            <el-option label="菜单" :value="0" />
            <el-option label="iframe" :value="1" />
            <el-option label="外链" :value="2" />
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" class="w100">
          <el-cascader
            v-model="dialogForm.parentId"
            :options="menuData"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'title'
            }"
            @change="parentIdChange"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="菜单名称" :class="$isMobile ? 'w100' : 'w50'" prop="title">
          <el-input v-model="dialogForm.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 3"
          label="路由名称"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="name"
        >
          <el-input v-model="dialogForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 3"
          label="路由路径"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="path"
        >
          <el-input v-model="dialogForm.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType == 1"
          label="链接地址"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="frameSrc"
        >
          <el-input v-model="dialogForm.frameSrc" placeholder="请输入 iframe 链接地址" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 1" label="加载动画" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.frameLoading" placeholder="请选择">
            <el-option label="开启" :value="true" />
            <el-option label="关闭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 0" label="组件路径" :class="$isMobile ? 'w100' : 'w50'">
          <el-input v-model="dialogForm.component" placeholder="默认和路由路径一致" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 0" :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>菜单排序</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="值越大越靠后（只针对一级路由有效）"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="dialogForm.rank" controls-position="right" placeholder="值越大越靠后" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 3" :class="$isMobile ? 'w100' : 'w50'" prop="auths">
          <template #label>
            <div class="question">
              <span>权限标识</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="同个页面下的按钮权限标识必须保持唯一, 统一命名: 对应菜单url + btn_xx。拼接前缀使其唯一: 后端接口权限使用。 前端按钮权限判断无需前缀, 例: hasAuth('btn_add')"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.auths" placeholder="格式: btn_xx" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 0" :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>路由重定向</span>
              <el-tooltip class="box-item" effect="dark" content="路由默认跳转的地址" placement="top">
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.redirect" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType != 3" :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>菜单图标</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="<div><a href='https://yesicon.app/' style='text-decoration: underline;' target='_blank'>在线图标集<a/>: 将 Iconify 方式的 xx:xxx 名字复制过来即可 </div><div><a href='https://pure-admin.cn/pages/icon/#%E6%9C%AC%E5%9C%B0%E5%9B%BE%E6%A0%87-2' style='text-decoration: underline;' target='_blank'>离线图标使用说明<a/>: 暂时只支持 Element Plus、Remix Icon 这两个图集</div>"
                raw-content
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.icon" placeholder="ep:home-filled" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType != 3" :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>右侧图标</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="<div><a href='https://yesicon.app/' style='text-decoration: underline;' target='_blank'>在线图标集<a/>: 将 Iconify 方式的 xx:xxx 名字复制过来即可 </div><div><a href='https://pure-admin.cn/pages/icon/#%E6%9C%AC%E5%9C%B0%E5%9B%BE%E6%A0%87-2' style='text-decoration: underline;' target='_blank'>离线图标使用说明<a/>: 暂时只支持 Element Plus、Remix Icon 这两个图集</div>"
                raw-content
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.extraIcon" placeholder="ri:search-line" />
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 2 && dialogForm.menuType != 3"
          label="进场动画"
          :class="$isMobile ? 'w100' : 'w50'"
        >
          <el-select
            v-model="dialogForm.enterTransition"
            placeholder="手机端长按查看动画"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in animates"
              :label="item"
              :value="item"
              @mouseover="hovered[i] = true"
              @mouseleave="hovered[i] = false"
            >
              <div :class="hovered[i] ? 'animate__animated animate__' + item + ' animate__infinite' : ''">
                {{ item }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 2 && dialogForm.menuType != 3"
          label="离场动画"
          :class="$isMobile ? 'w100' : 'w50'"
        >
          <el-select
            v-model="dialogForm.leaveTransition"
            placeholder="手机端长按查看动画"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) in animates"
              :label="item"
              :value="item"
              @mouseover="hovered[i] = true"
              @mouseleave="hovered[i] = false"
            >
              <div :class="hovered[i] ? 'animate__animated animate__' + item + ' animate__infinite' : ''">
                {{ item }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType == 0" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>菜单高亮</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="当showLink: false隐藏的菜单，通过url直接访问时，指定高亮某个菜单"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.activePath" placeholder="高亮菜单的path" />
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType != 3" label="显示菜单" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="dialogForm.showLink" placeholder="请选择">
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.menuType != 3" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>父级菜单</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="显示：父级菜单只有一个子菜单时候，会显示父级菜单"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="dialogForm.showParent" placeholder="请选择">
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 2 && dialogForm.menuType != 3"
          :class="$isMobile ? '' : 'w50'"
        >
          <template #label>
            <div class="question">
              <span>缓存页面</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="缓存: 会保存该页面的整体状态，刷新后会清空状态"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="dialogForm.keepAlive" placeholder="请选择">
            <el-option label="缓存" :value="true" />
            <el-option label="不缓存" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 2 && dialogForm.menuType != 3"
          :class="$isMobile ? '' : 'w50'"
        >
          <template #label>
            <div class="question">
              <span>标签页</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="允许: 当前菜单名称会显示在标签页"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="dialogForm.hiddenTag" placeholder="请选择">
            <el-option label="允许" :value="false" />
            <el-option label="禁止" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.menuType != 2 && dialogForm.menuType != 3"
          :class="$isMobile ? '' : 'w50'"
        >
          <template #label>
            <div class="question">
              <span>固定标签页</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="固定: 当前菜单名称固定显示在标签页且不可以关闭"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="dialogForm.fixedTag" placeholder="请选择">
            <el-option label="固定" :value="true" />
            <el-option label="不固定" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>i18nKey</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="语言国际化: language.xlsx里翻译对应的key"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" aria-hidden="false" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="dialogForm.i18nKey" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForm = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, reactive } from 'vue'
import { animates } from './animate'
const { proxy }: any = getCurrentInstance()
defineOptions({
  name: 'systemMenu'
})

const searchForm = ref<any>({})
const listData = ref([])
const menuData = ref([])
const list = ref([])
const showForm = ref<boolean>(false)
const formTitle = ref<any>('')
const dialogForm = ref<any>({})
const hovered = ref<any>([])
const formRules = reactive({
  title: [{ required: true, message: '菜单名称为必填项', trigger: 'blur' }],
  name: [{ required: true, message: '路由名称为必填项', trigger: 'blur' }],
  path: [{ required: true, message: '路由路径为必填项', trigger: 'blur' }],
  auths: [{ required: true, message: '权限标识为必填项', trigger: 'blur' }],
  frameSrc: [{ required: true, message: '链接地址', trigger: 'blur' }]
})

// 动态构建树形数据
const buildTreeData = (data: any) => {
  const map = new Map()
  const tree = []

  // 初始化节点
  data.forEach((item: any) => {
    item.children = [] // 确保每个节点都有 children 属性
    map.set(item.id, item)
  })

  // 构建树结构
  data.forEach((item: any) => {
    if (item.parentId === 0) {
      tree.push(item)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(item)
      } else {
        tree.push(item)
      }
    }
  })
  return tree
}

// 获取数据
const searchLoading = ref<boolean>(false)
const getList = () => {
  searchLoading.value = true
  proxy.$api.getMenu().then((res: any) => {
    searchLoading.value = false
    if (res.code !== 200) return
    listData.value = res.data
    // 初始化树形数据
    menuData.value = buildTreeData(res.data)

    if (searchForm.value.title) {
      let data = res.data
      let arr1 = []
      let arr2 = []
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].title.includes(searchForm.value.title)) {
          arr1.push(data[i])
          ids.push(data[i].id)
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (ids.includes(data[i].parentId)) {
          arr2.push(data[i])
        }
      }
      res.data = [...new Map([...arr1, ...arr2].map((item) => [item.id, item])).values()]
    }
    // 树形数据
    list.value = buildTreeData(res.data)
  })
}
getList()

// 处理菜单类型的显示
const typeFormatter = (row: any) => {
  switch (row.menuType) {
    case 0:
      return '菜单'
    case 1:
      return 'Iframe'
    case 2:
      return '外链'
    case 3:
      return '按钮'
    default:
      return '未知'
  }
}

const showLink = (row: any) => {
  switch (row.menuType) {
    case true:
      return '否'
    case false:
      return '是'
    default:
      return '否'
  }
}

// 关闭弹窗
const closeForm = () => {
  proxy.$refs.formRef.resetFields()
}

// 重置表单
const resetForm = () => {
  if (dialogForm.value.id) delete dialogForm.value.id
  // dialogForm.value.parentId = 0 // 父节点id
  // dialogForm.value.menuType = 0 // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  dialogForm.value.title = '' // 菜单名称
  dialogForm.value.i18nKey = '' // 国际化语言key
  dialogForm.value.name = '' // 路由名称（必须保持唯一）
  dialogForm.value.path = '' // 路由路径
  dialogForm.value.component = '' // 组件路径
  dialogForm.value.rank = 99 // 菜单排序
  dialogForm.value.redirect = '' // 路由重定向path
  dialogForm.value.icon = '' // 菜单图标
  dialogForm.value.extraIcon = '' // 右侧图标
  dialogForm.value.enterTransition = '' // 进场动画
  dialogForm.value.leaveTransition = '' // 离场动画
  dialogForm.value.activePath = '' // 菜单高亮
  dialogForm.value.auths = '' // 按钮权限标识
  dialogForm.value.frameSrc = '' // iframe链接地址
  dialogForm.value.frameLoading = true // 开启iframe加载动画
  dialogForm.value.keepAlive = false // 不缓存页面
  dialogForm.value.hiddenTag = false // 当前菜单名称会显示在标签页
  dialogForm.value.fixedTag = false // true时，当前菜单名称固定显示在标签页且不可以关闭
  dialogForm.value.showLink = true // 显示菜单
  dialogForm.value.showParent = true // 父级菜单只有一个子菜单时候，会显示父级菜单
  if (dialogForm.value.parentId) parentIdChange()
}

// 新增, type:0一级菜单, type:1非一级菜单
const addRow = (type: number, row?: any) => {
  showForm.value = true
  formTitle.value = '新增'
  if (type === 0) dialogForm.value.parentId = 0
  dialogForm.value.menuType = 0
  if (row && row.id) {
    dialogForm.value.parentId = row.id
  }
  resetForm()
}

// 编辑
const editRow = (row: any) => {
  showForm.value = true
  formTitle.value = '编辑'
  dialogForm.value = JSON.parse(JSON.stringify(row))
}

// 删除
const deleteRow = (row: any) => {
  ElMessageBox.confirm(
    `是否确认删除: ${row.title} ? 注意此菜单的所有下级也会一并删除，请谨慎操作`,
    '提示',
    {
      type: 'warning',
      draggable: true,
      closeOnClickModal: false
    }
  )
    .then(() => {
      // proxy.$api.menuDel(row.id).then((res: any) => {
      //   if (res.code !== 200) return
      //   getList()
      //   ElMessage({
      //     message: '删除成功',
      //     type: 'success'
      //   })
      // })
    })
    .catch(() => {
      // catch error
    })
}

// 上级菜单变化时自动填写btn标识前缀
const parentIdChange = () => {
  if (dialogForm.value.menuType == 3) {
    // 按钮权限拼接url做唯一值：后端接口权限使用
    // 前端权限判断依然保持没有前缀的样子btn_xx
    dialogForm.value.auths = listData.value
      .find(
        (item) =>
          item.id ===
          (Array.isArray(dialogForm.value.parentId)
            ? dialogForm.value.parentId[dialogForm.value.parentId.length - 1]
            : dialogForm.value.parentId)
      )
      .path.split('/')
      .join(':')
      .replace(/^:/, '')
    if (dialogForm.value.auths) dialogForm.value.auths = dialogForm.value.auths + ':btn_'
  }
}

// 确定
const formRef = ref(null)
const submitLoading = ref<boolean>(false)
const submit = () => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      submitLoading.value = true
      if (!dialogForm.value.parentId) dialogForm.value.parentId = 0
      if (Array.isArray(dialogForm.value.parentId))
        dialogForm.value.parentId = dialogForm.value.parentId[dialogForm.value.parentId.length - 1]

      delete dialogForm.value.children
      if (!dialogForm.value.enterTransition) dialogForm.value.enterTransition = ''
      if (!dialogForm.value.leaveTransition) dialogForm.value.leaveTransition = ''

      if (dialogForm.value.id) {
        // proxy.$api.menuEdit(dialogForm.value).then((res: any) => {
        //   showForm.value = false
        //   submitLoading.value = false
        //   if (res.code !== 200) return
        //   getList()
        //   ElMessage({
        //     message: '编辑成功',
        //     type: 'success'
        //   })
        // })
      } else {
        // proxy.$api.menuAdd(dialogForm.value).then((res: any) => {
        //   showForm.value = false
        //   submitLoading.value = false
        //   if (res.code !== 200) return
        //   getList()
        //   ElMessage({
        //     message: '新增成功',
        //     type: 'success'
        //   })
        // })
      }
      submitLoading.value = false
      showForm.value = false
      console.log(dialogForm.value)
    }
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
}
</style>
