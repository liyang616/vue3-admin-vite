<template>
  <el-config-provider :locale="Locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue'
import { ElConfigProvider } from 'element-plus'
const { proxy }: any = getCurrentInstance()

// element-plus语言切换
const Locale = ref<any>({})
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import enUS from 'element-plus/es/locale/lang/en'
if (proxy.$language.value == 'en-US') Locale.value = enUS
if (proxy.$language.value == 'zh-CN') Locale.value = zhCN

watch(proxy.$language, (newVal, oldVal) => {
  if (proxy.$language.value == 'en-US') Locale.value = enUS
  if (proxy.$language.value == 'zh-CN') Locale.value = zhCN
})
</script>
