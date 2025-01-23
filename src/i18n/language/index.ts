import langData from './data.json'

// 语言配置表
export const languageList = {
  // 英语
  'en-US': {
    name: 'English',
    value: 'en-US'
  },
  // 简体中文
  'zh-CN': {
    name: '简体中文',
    value: 'zh-CN'
  }
}

// 语言key列表
export const languageKeys = Object.keys(languageList)
// 当前语言环境
export const currentLocale = window?.localStorage?.getItem('language') || languageKeys[0]
// 当前语言集合
export const getLanguageGroup = () => {
  const _lang = {}
  languageKeys.map((lanKey: string) => {
    _lang[lanKey] = langData[lanKey]
  })
  return _lang
}
