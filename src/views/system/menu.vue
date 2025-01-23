<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="菜单名称">
        <el-input v-model="searchForm.title" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getList">搜索</el-button>
        <Auth value="btn_add"><el-button type="primary" @click="addRow">新增</el-button></Auth>
      </el-form-item>
    </el-form>
    <div class="pub-table">
      <el-table :data="list" :max-height="proxy.$tableHeight" border :row-key="(row) => row.id">
        <el-table-column label="菜单名称" min-width="160">
          <template #default="scope">
            <IconifyIconOffline
              class="mr-2"
              v-if="scope.row.icon"
              :icon="scope.row.icon"
              width="16px"
              height="16px"
            />
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="菜单类型" :formatter="typeFormatter" min-width="90" />
        <el-table-column label="路由路径" prop="path" min-width="160" />
        <el-table-column label="按钮权限" prop="auths" min-width="160" />
        <el-table-column label="排序" prop="rank" min-width="80" />
        <el-table-column label="隐藏" :formatter="showLink" min-width="80" />
        <el-table-column label="操作" align="center" :fixed="$isMobile ? false : 'right'" min-width="160">
          <template #default="scope">
            <Auth value="btn_add">
              <el-button
                link
                type="primary"
                v-if="scope.row.menuType != 3"
                @click.prevent="addRow(scope.row)"
              >
                新增
              </el-button>
            </Auth>
            <Auth value="btn_edit">
              <el-button link type="primary" @click.prevent="editRow(scope.row)"> 编辑 </el-button>
            </Auth>
            <Auth value="btn_delete">
              <el-button link type="danger" @click.prevent="deleteRow(scope.row)"> 删除 </el-button>
            </Auth>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="showForm"
      :title="formTitle"
      draggable
      width="660"
      :close-on-click-modal="false"
      :fullscreen="$isMobile ? true : false"
    >
      <el-form
        :model="form"
        :rules="formRules"
        :inline="$isMobile ? false : true"
        label-width="auto"
        class="pub-form"
      >
        <el-form-item label="菜单类型" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="form.menuType" placeholder="请选择">
            <el-option label="菜单" :value="0" />
            <el-option label="iframe" :value="1" />
            <el-option label="外链" :value="2" />
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" class="w100">
          <el-cascader
            v-model="form.parentId"
            :options="menuData"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'title'
            }"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="菜单名称" :class="$isMobile ? 'w100' : 'w50'" prop="title">
          <el-input v-model="form.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType != 3"
          label="路由名称"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="name"
        >
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType != 3"
          label="路由路径"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="path"
        >
          <el-input v-model="form.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType == 1"
          label="链接地址"
          :class="$isMobile ? 'w100' : 'w50'"
          prop="frameSrc"
        >
          <el-input v-model="form.frameSrc" placeholder="请输入 iframe 链接地址" />
        </el-form-item>
        <el-form-item v-if="form.menuType == 1" label="加载动画" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="form.frameLoading" placeholder="请选择">
            <el-option label="开启" :value="true" />
            <el-option label="关闭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.menuType == 0" label="组件路径" :class="$isMobile ? 'w100' : 'w50'">
          <el-input v-model="form.component" placeholder="默认和路由路径一致" />
        </el-form-item>
        <el-form-item :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>菜单排序</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="值越大越靠后（只针对一级路由有效）"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input-number v-model="form.rank" controls-position="right" placeholder="值越大越靠后" />
        </el-form-item>
        <el-form-item v-if="form.menuType == 3" :class="$isMobile ? 'w100' : 'w50'" prop="auths">
          <template #label>
            <div class="question">
              <span>权限标识</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="同个页面下的按钮权限标识必须保持唯一, 统一格式: permission:btn:xx"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.auths" placeholder="格式: permission:btn:xx" />
        </el-form-item>
        <el-form-item v-if="form.menuType == 0" :class="$isMobile ? 'w100' : 'w50'">
          <template #label>
            <div class="question">
              <span>路由重定向</span>
              <el-tooltip class="box-item" effect="dark" content="路由默认跳转的地址" placement="top">
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.redirect" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="form.menuType != 3" :class="$isMobile ? 'w100' : 'w50'">
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
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.icon" placeholder="ep:home-filled" />
        </el-form-item>
        <el-form-item v-if="form.menuType != 3" :class="$isMobile ? 'w100' : 'w50'">
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
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.extraIcon" placeholder="ri:search-line" />
        </el-form-item>
        <el-form-item
          v-if="form.menuType != 2 && form.menuType != 3"
          label="进场动画"
          :class="$isMobile ? 'w100' : 'w50'"
        >
          <el-select v-model="form.enterTransition" placeholder="手机端长按查看动画" clearable filterable>
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
          v-if="form.menuType != 2 && form.menuType != 3"
          label="离场动画"
          :class="$isMobile ? 'w100' : 'w50'"
        >
          <el-select v-model="form.leaveTransition" placeholder="手机端长按查看动画" clearable filterable>
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
        <el-form-item v-if="form.menuType == 0" label="菜单激活" :class="$isMobile ? 'w100' : 'w50'">
          <el-input v-model="form.activePath" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="form.menuType != 3" label="显示菜单" :class="$isMobile ? '' : 'w50'">
          <el-select v-model="form.showLink" placeholder="请选择">
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.menuType != 3" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>父级菜单</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="显示：父级菜单只有一个子菜单时候，会显示父级菜单"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="form.showParent" placeholder="请选择">
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.menuType != 2 && form.menuType != 3" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>缓存页面</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="缓存: 会保存该页面的整体状态，刷新后会清空状态"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="form.keepAlive" placeholder="请选择">
            <el-option label="缓存" :value="true" />
            <el-option label="不缓存" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.menuType != 2 && form.menuType != 3" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>标签页</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="允许: 当前菜单名称会显示在标签页"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="form.hiddenTag" placeholder="请选择">
            <el-option label="允许" :value="false" />
            <el-option label="禁止" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.menuType != 2 && form.menuType != 3" :class="$isMobile ? '' : 'w50'">
          <template #label>
            <div class="question">
              <span>固定标签页</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="固定: 当前菜单名称固定显示在标签页且不可以关闭"
                placement="top"
              >
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-select v-model="form.fixedTag" placeholder="请选择">
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
                <IconifyIconOffline icon="ep:question-filled" />
              </el-tooltip>
            </div>
          </template>
          <el-input v-model="form.i18nKey" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForm = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
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
const menuData = ref([])
const list = ref([])
const showForm = ref<boolean>(false)
const formTitle = ref<any>('')
const form = ref<any>({})
const hovered = ref<any>([])
const formRules = reactive({
  title: [{ required: true, message: '菜单名称为必填项', trigger: 'blur' }],
  name: [{ required: true, message: '路由名称为必填项', trigger: 'blur' }],
  path: [{ required: true, message: '路由路径为必填项', trigger: 'blur' }],
  auths: [{ required: true, message: '权限标识为必填项', trigger: 'blur' }],
  frameSrc: [{ required: true, message: '链接地址', trigger: 'blur' }]
})

let formDef = {
  parentId: 0,
  menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
  title: '',
  i18nKey: '', // 国际化语言key
  name: '',
  path: '',
  component: '',
  rank: 99,
  redirect: '',
  icon: '',
  extraIcon: '',
  enterTransition: '',
  leaveTransition: '',
  activePath: '',
  auths: 'permission:btn:',
  frameSrc: '',
  frameLoading: true,
  keepAlive: false,
  hiddenTag: false,
  fixedTag: false,
  showLink: true,
  showParent: true
}

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
const getList = () => {
  proxy.$api.getMenu().then((res: any) => {
    if (!res.success) return
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

// 新增
const addRow = (row?: any) => {
  showForm.value = true
  formTitle.value = '新增'
  form.value = formDef
  if (row.id) {
    form.value.parentId = row.id
  }
}

// 编辑
const editRow = (row: any) => {
  showForm.value = true
  formTitle.value = '编辑'
  form.value = JSON.parse(JSON.stringify(row))
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
    .then(() => {})
    .catch(() => {
      // catch error
    })
}

// 确定
const submit = () => {
  showForm.value = false
  form.value.parentId
    ? (form.value.parentId = form.value.parentId[form.value.parentId.length - 1])
    : (form.value.parentId = 0)
  console.log(form.value)
}
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
}
</style>
