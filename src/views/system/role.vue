<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.name" placeholder="角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色标识">
        <el-input v-model="searchForm.code" placeholder="角色标识" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择" clearable>
          <el-option label="已启用" :value="1" />
          <el-option label="已停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="searchLoading" @click="getList">搜索</el-button>
        <el-button type="primary" v-auth="'btn_add'" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pub-table">
      <el-table :data="list" :max-height="$tableHeight" border :row-key="(row) => row.id">
        <el-table-column label="角色ID" prop="id" min-width="80" />
        <el-table-column label="角色名称" prop="name" min-width="160" />
        <el-table-column label="角色标识" prop="code" min-width="100" />
        <el-table-column label="状态" prop="status" min-width="90" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              active-text="已启用"
              inactive-text="已停用"
              :active-value="1"
              :inactive-value="0"
              :loading="submitLoading"
              @change="statusChange($event, scope.row)"
              v-if="hasAuth('btn_edit')"
            />
            <div v-else>
              <span v-if="scope.row.status == 1">已启用</span>
              <span v-if="scope.row.status == 0">已停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="200" />
        <el-table-column label="创建时间" min-width="160" align="center">
          <template #default="scope">
            {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :fixed="$isMobile ? false : 'right'" min-width="130">
          <template #default="scope">
            <el-button link type="primary" v-auth="'btn_edit'" @click.prevent="editRow(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" v-auth="'btn_delete'" @click.prevent="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-sizes="[10, 25, 50, 100]"
        size="small"
        :disabled="false"
        :background="true"
        :layout="$isMobile ? layoutApp : layoutPc"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
      <el-form ref="formRef" :model="dialogForm" :rules="formRules" label-width="auto" class="pub-form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="dialogForm.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree-select
            v-model="dialogForm.menuIds"
            :data="menuData"
            multiple
            :render-after-expand="false"
            show-checkbox
            filterable
            check-strictly
            check-on-click-node
            node-key="id"
            :props="{
              value: 'id',
              label: 'title',
              children: 'children'
            }"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="dialogForm.status"
            inline-prompt
            active-text="已启用"
            inactive-text="已停用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogForm.remark" type="textarea" placeholder="请输入" />
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
import { hasAuth } from '@/router/utils'
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, reactive } from 'vue'
import moment from 'moment'
const { proxy }: any = getCurrentInstance()
defineOptions({
  name: 'systemRole'
})

const searchForm = ref<any>({
  code: '',
  name: '',
  status: ''
})
const list = ref([])
const showForm = ref<boolean>(false)
const formTitle = ref<any>('')
const dialogForm = ref<any>({})
const formRules = reactive({
  name: [{ required: true, message: '角色名称为必填项', trigger: 'blur' }],
  code: [{ required: true, message: '角色标识为必填项', trigger: 'blur' }]
})
const menuData = ref([])

// 分页
const layoutPc = 'total, sizes, prev, pager, next, jumper'
const layoutApp = 'total, sizes, jumper'
const page = ref({
  currentPage: 1,
  pageSize: 10,
  total: 10
})
const handleSizeChange = (val: number) => {
  page.value.pageSize = val
  getList()
}
const handleCurrentChange = (val: number) => {
  page.value.currentPage = val
  getList()
}

// 获取数据
const searchLoading = ref<boolean>(false)
const getList = () => {
  searchLoading.value = true
  let json = { ...searchForm.value, ...page.value }
  proxy.$api.getRole(json).then((res: any) => {
    searchLoading.value = false
    if (res.code !== 200) return
    list.value = res.data.list
    page.value.total = res.data.total
  })
}
getList()

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

// 获取菜单
const getMenu = () => {
  proxy.$api.getMenu().then((res: any) => {
    if (res.code !== 200) return
    // 初始化树形数据
    menuData.value = buildTreeData(res.data)
  })
}

// 状态开关
const statusChange = (val: any, row: any) => {
  ElMessageBox.confirm(`确认${val ? '启用' : '停用'} [${row.name}] ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {
      // submitLoading.value = true
      // proxy.$api.roleEdit(row).then((res: any) => {
      //   submitLoading.value = false
      //   if (res.code !== 200) {
      //     val ? (row.status = 0) : (row.status = 1)
      //     return
      //   }
      //   ElMessage({
      //     message: `${val ? '[' + row.roleName + '] ' + '已停用' : '[' + row.roleName + '] ' + '已启用'} `,
      //     type: 'success',
      //     duration: 3 * 1000
      //   })
      // })
      ElMessage({
        message: `${val ? '[' + row.name + '] ' + '已启用' : '[' + row.name + '] ' + '已停用'} `,
        type: 'success',
        duration: 3 * 1000
      })
    })
    .catch(() => {
      val ? (row.status = 0) : (row.status = 1)
    })
}

// 关闭弹窗
const closeForm = () => {
  proxy.$refs.formRef.resetFields()
}

// 新增
const add = () => {
  formTitle.value = '新增'
  dialogForm.value = {
    name: '',
    code: '',
    menuIds: [],
    status: 1,
    remark: ''
  }
  showForm.value = true
  getMenu()
}

// 编辑
const editRow = (row: any) => {
  formTitle.value = '编辑'
  showForm.value = true
  getMenu()
  dialogForm.value = JSON.parse(JSON.stringify(row))
}

// 删除
const deleteRow = (row: any) => {
  ElMessageBox.confirm(`是否确认删除: ${row.name} ? `, '提示', {
    type: 'warning',
    draggable: true,
    closeOnClickModal: false
  })
    .then(() => {
      // proxy.$api.roleDel(row.roleId).then((res: any) => {
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

// 确定
const formRef = ref(null)
const submitLoading = ref<boolean>(false)
const submit = () => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      // submitLoading.value = true
      if (dialogForm.value.roleId) {
        // proxy.$api.roleEdit(dialogForm.value).then((res: any) => {
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
        // proxy.$api.roleAdd(dialogForm.value).then((res: any) => {
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
    }
  })
  submitLoading.value = false
  showForm.value = false
  console.log(dialogForm.value)
}
</script>

<style lang="scss" scoped></style>
