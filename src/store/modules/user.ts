import { defineStore } from 'pinia'
import { type userType, store, router, resetRouter, routerArrays, storageLocal } from '../utils'
import { useMultiTagsStoreHook } from './multiTags'
import { type DataInfo, setToken, removeToken, userKey } from '@/utils/auth'
import { Api } from '@/api/index'

export interface UserResult {
  /** token */
  accessToken: string
  /** 头像 */
  avatar?: string
  /** 用户名 */
  username?: string
  /** 昵称 */
  nickname?: string
  /** 当前登录用户的角色 */
  roles?: Array<string>
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>
}

export const useUserStore = defineStore({
  id: 'pure-user',
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? '',
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? '',
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? '',
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions: storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? []
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions
    },
    /** 登入 */
    async loginByUsername(data: any) {
      return new Promise<UserResult>((resolve, reject) => {
        Api.getLogin(data)
          .then((data?: any) => {
            if (data?.code === 200) setToken(data.data)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = ''
      this.roles = []
      this.permissions = []
      removeToken()
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays])
      resetRouter()
      router.push('/login')
    }
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
