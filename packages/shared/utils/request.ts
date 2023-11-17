import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import vueHook from 'alova/vue'
import { message } from 'ant-design-vue'
import type { Res } from '#/request'

type ErrorHandler = (res: Res<any>) => void | Promise<void>

let errorHandler: ErrorHandler

const errorMessage: Record<number, string> = {
  400: '出错了，请联系管理员！',
  401: '您的登录信息已过期，请重新登录！',
  403: '您当前没有权限访问！',
  404: '未找到相关资源，请联系管理员！',
  500: '服务器出错了，请稍后再试！',
}

export const request = createAlova({
  baseURL: '/api',
  statesHook: vueHook,
  requestAdapter: GlobalFetch(),
  responded: async response => {
    const json = await response.json()

    if (response.status >= 400 || !json.code) {
      message.error(
        json.message || errorMessage[response.status] || response.statusText,
      )

      await errorHandler(json)

      return Promise.reject(json)
    }

    return json.data
  },
  timeout: 1000 * 60,
})

/** 用于不同子包设置不同的错误处理逻辑，主要是401处理 */
export function setErrorHandler(handler: ErrorHandler) {
  errorHandler = handler
}
