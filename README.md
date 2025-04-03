## 简介

`vue3-admin-vite` 是一款开源免费且开箱即用的中后台管理系统模版，兼容移动端、支持语言国际化。  
完全采用 `ECMAScript` 模块（`ESM`）规范来编写和组织代码，使用了最新的 `Vue3`、
`Vite`、`Element-Plus`、`TinyMCE 7`、`TypeScript`、`Pinia`、`Tailwindcss` 等主流技术开发

## 鸣谢

感谢 vue-pure-admin 作者  
本项目是在 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 基础上按整合的精简版  
文档参考 [Pure Admin 保姆级文档](https://pure-admin.cn/pages/introduction/)  
常用工具图表、去水印等 [@pureadmin/utils](https://pure-admin-utils.netlify.app/guide/guide)

## 预览

预览: [vue3-admin-vite](http://42.194.189.215:83)  
纯前端演示，暂不支持新增、修改、删除功能

## 国际化

演示环境支持菜单、设置栏、首页这几个地方的语言切换，其他请参照自行拓展

## Mock 模拟数据

采用 Mock 模拟数据的纯前端演示  
具体 API 数据格式请参考[mock 文件夹](https://github.com/liyang616/vue3-admin-vite/tree/main/mock)

### 安装依赖

```bash
cd vue3-admin-vite

pnpm install
```

### 启动平台

```bash
pnpm dev
```

### 项目打包

```bash
pnpm build
```

### 许可证

完全免费开源  
[MIT © 2025 vue3-admin-vite](https://github.com/liyang616/vue3-admin-vite/blob/main/LICENSE)

### 维护者

[liyang616](https://github.com/liyang616)

## `Git` 贡献提交规范

参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `workflow` 工作流改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中

## 浏览器支持

本地开发推荐使用 `Chrome`、`Edge`、`Firefox` 浏览器，作者常用的是最新版 `Chrome` 浏览器  
更详细的浏览器兼容性支持请看 [Vue 支持哪些浏览器？](https://cn.vuejs.org/about/faq.html#what-browsers-does-vue-support) 和 [Vite 浏览器兼容性](https://cn.vitejs.dev/guide/build#browser-compatibility)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                不支持                                                                                                |                                                                                              最后两个版本                                                                                              |                                                                                                   最后两个版本                                                                                                    |                                                                                                 最后两个版本                                                                                                  |                                                                                                 最后两个版本                                                                                                  |
