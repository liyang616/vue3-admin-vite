import Cookies from 'js-cookie'
import { useUserStoreHook } from '@/store/modules/user'
import { storageLocal, isString, isIncludeAllChildren } from '@pureadmin/utils'

export interface DataInfo<T> {
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

export const userKey = 'user-info'
export const TokenKey = 'authorized-token0' // key区分(随便自定义): 因cookies公用特性，同时有多套系统的时候，避免全部系统退出
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = 'multiple-tabs0' // key区分(随便自定义): 因cookies公用特性，同时有多套系统的时候，避免全部系统退出

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey) ? JSON.parse(Cookies.get(TokenKey)) : storageLocal().getItem(userKey)
}

/**
 * @description 设置`token`以及一些必要信息
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`这五条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: DataInfo<Date>) {
  const { accessToken } = data

  Cookies.set(TokenKey, accessToken)

  Cookies.set(multipleTabsKey, 'true')

  function setUserKey({ avatar, username, nickname, roles, permissions }) {
    useUserStoreHook().SET_AVATAR(avatar)
    useUserStoreHook().SET_USERNAME(username)
    useUserStoreHook().SET_NICKNAME(nickname)
    useUserStoreHook().SET_ROLES(roles)
    useUserStoreHook().SET_PERMS(permissions)
    storageLocal().setItem(userKey, {
      avatar,
      username,
      nickname,
      roles,
      permissions
    })
  }

  if (data.username && data.roles) {
    const { username, roles } = data
    setUserKey({
      avatar: data?.avatar ?? '',
      username,
      nickname: data?.nickname ?? '',
      roles,
      permissions: data?.permissions ?? []
    })
  } else {
    const avatar = storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? ''
    const username = storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? ''
    const nickname = storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? ''
    const roles = storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? []
    const permissions = storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? []
    setUserKey({
      avatar,
      username,
      nickname,
      roles,
      permissions
    })
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey)
  Cookies.remove(multipleTabsKey)
  storageLocal().removeItem(userKey)
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token
}

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false
  const allPerms = '*:*:*'
  const { permissions } = useUserStoreHook()
  if (!permissions) return false
  if (permissions.length === 1 && permissions[0] === allPerms) return true
  const isAuths = isString(value) ? permissions.includes(value) : isIncludeAllChildren(value, permissions)
  return isAuths ? true : false
}
