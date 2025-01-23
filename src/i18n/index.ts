import { createI18n } from "vue-i18n";
import { getLanguageGroup, currentLocale as locale } from "./language";

const comparisonMap = new Map();
// 创建i18n
const i18n = createI18n({
  locale,
  globalInjection: true,
  legacy: false,
  messages: {
    ...getLanguageGroup()
  }
});

// 语言配置
export default i18n;
