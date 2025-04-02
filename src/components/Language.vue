<template>
  <el-dropdown id="header-translation" trigger="click">
    <GlobalizationIcon :class="css" />
    <template #dropdown>
      <el-dropdown-menu class="translation">
        <el-dropdown-item
          v-for="item in languageList"
          :style="getDropdownItemStyle(locale, item.value)"
          :class="['dark:!text-white', getDropdownItemClass(locale, item.value)]"
          @click="languageClick(item)"
        >
          <IconifyIconOffline v-show="locale === item.value" class="check-zh" :icon="Check" />
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useNav } from '@/layout/hooks/useNav'
import Check from '@iconify-icons/ep/check'
import GlobalizationIcon from '@/assets/svg/globalization.svg?component'
const { getDropdownItemStyle, getDropdownItemClass } = useNav()
const { proxy }: any = getCurrentInstance()
const route = useRoute()

const css = ref('')
route.path == '/login'
  ? (css.value =
      'hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300')
  : (css.value = 'navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none')

// i18n语言切换
import { languageList } from '@/i18n/language'
import { useI18n } from 'vue-i18n'
const { locale, t: $t } = useI18n()

locale.value = languageList[localStorage.getItem('language') || 'zh-CN'].value
proxy.$language.value = languageList[localStorage.getItem('language') || 'zh-CN'].value
document.title = route.meta.i18nKey ? $t(route.meta.i18nKey as string) : route.meta.title

const languageClick = (item: any) => {
  locale.value = languageList[item.value].value
  localStorage.setItem('language', locale.value)
  document.title = route.meta.i18nKey ? $t(route.meta.i18nKey as string) : route.meta.title
  proxy.$language.value = locale.value
}
</script>

<style lang="scss" scoped></style>
