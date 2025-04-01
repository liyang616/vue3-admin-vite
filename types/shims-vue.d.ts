declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const scss: Record<string, string>
  export default scss
}

import { ComponentCustomProperties } from 'vue'
import { Translator } from 'vue-i18n'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $isMobile: boolean
    $t: Translator
    $tableHeight: number
  }
}
