<script setup lang="ts">
import Motion from './utils/motion'
import { useRouter } from 'vue-router'
import { message } from '@/utils/message'
import { loginRules } from './utils/rule'
import { useNav } from '@/layout/hooks/useNav'
import type { FormInstance } from 'element-plus'
import i18n from '@/i18n/index'
const $t = i18n.global.t
import { useLayout } from '@/layout/hooks/useLayout'
import { useUserStoreHook } from '@/store/modules/user'
import { initRouter, getTopMenu } from '@/router/utils'
import { bg, avatar, illustration } from './utils/static'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { ref, reactive, toRaw, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange'

import dayIcon from '@/assets/svg/day.svg?component'
import darkIcon from '@/assets/svg/dark.svg?component'
import globalization from '@/assets/svg/globalization.svg?component'
import Lock from '@iconify-icons/ri/lock-fill'
import Check from '@iconify-icons/ep/check'
import User from '@iconify-icons/ri/user-3-fill'
import Language from '@/components/Language.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { proxy }: any = getCurrentInstance()

defineOptions({
  name: 'Login'
})

// 验证码
const codeImg = ref<any>('')
const codeImgUUID = ref<any>('')
const getCodeImg = () => {
  proxy.$api.getCaptcha().then((res: any) => {
    if (res.code !== 200) return
    codeImg.value = res.data.img
    codeImgUUID.value = res.data.uuid
  })
}
getCodeImg()

const router = useRouter()
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()

const { initStorage } = useLayout()
initStorage()

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange()
dataThemeChange(overallStyle.value)
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav()

const ruleForm = reactive({
  username: 'admin',
  password: 'admin123',
  code: '12'
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
          code: ruleForm.code,
          uuid: codeImgUUID.value
        })
        .then((res: any) => {
          if (res.code == 200) {
            // 获取后端路由
            return initRouter().then(() => {
              router.push(getTopMenu(true).path).then(() => {
                message($t('login.pureLoginSuccess'), { type: 'success' })
              })
            })
          } else {
            message($t('login.pureLoginFail'), { type: 'error' })
          }
        })
        .finally(() => (loading.value = false))
    }
  })
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (['Enter', 'NumpadEnter'].includes(code)) {
    onLogin(ruleFormRef.value)
  }
}

onMounted(() => {
  window.document.addEventListener('keypress', onkeypress)
})

onBeforeUnmount(() => {
  window.document.removeEventListener('keypress', onkeypress)
})
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <Language />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: $t('login.pureUsernameReg'),
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  :placeholder="$t('login.pureUsername')"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  :placeholder="$t('login.purePassword')"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item>
                <div class="codeImg">
                  <el-input v-model="ruleForm.code" clearable :placeholder="$t('login.VerificationCode')" />
                  <img :src="codeImg" @click="getCodeImg" alt="" />
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                {{ $t('login.pureLogin') }}
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.codeImg {
  display: flex;
  justify-content: space-between;
  width: 100%;
  img {
    width: auto;
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
