import { bootSilentFactory } from '@alova/scene-vue'
import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import vueHook from 'alova/vue'
import { message, notification, Modal } from 'ant-design-vue'
import type { Res } from '#/request'

type ErrorHandler = (
  response: Response,
  result?: Res<any>,
) => void | Promise<void>

// 存储子包错误处理器
let errorHandler: ErrorHandler

const errorMessage: Record<number, string> = {
  400: '出错了，请联系管理员！',
  401: '您的登录信息已过期，请重新登录！',
  403: '您当前没有权限访问！',
  404: '未找到相关资源，请联系管理员！',
  500: '服务器出错了，请稍后再试！',
}

const [notify] = notification.useNotification()

export const request = createAlova({
  baseURL: import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_PREFIX,
  statesHook: vueHook,
  requestAdapter: GlobalFetch(),
  responded: {
    async onSuccess(response, method) {
      let json: Res<any> | undefined
      let errMsg: string

      try {
        json = await response.json()
        // eslint-disable-next-line no-empty
      } catch {}

      if (!response.ok || !json?.code) {
        errMsg =
          json?.message || errorMessage[response.status] || response.statusText

        const msgMode = method.meta?.errorMessageMode

        if (msgMode === 'notify') {
          notify.error({
            message: '出错了！',
            description: errMsg,
            placement: 'topRight',
          })
        } else if (msgMode === 'modal') {
          Modal.error({
            title: '出错了！',
            content: errMsg,
            centered: true,
            keyboard: false,
            mask: false,
            okText: '确定',
          })
        } else if (msgMode === 'message' || msgMode !== 'none') {
          message.error(errMsg)
        }

        await errorHandler(response, json)

        return Promise.reject(json)
      }

      return method.meta?.isReturnNativeResponse ? response : json.data
    },
    onError(error: Error) {
      if (error.message?.includes('network timeout')) {
        message.error('请求超时，请稍后再试！')
      } else if (error.message?.includes('Failed to fetch')) {
        message.error('请求失败，请检查您的网络！')
      }
    },
  },
  timeout: 1000 * 60,
  // 默认不使用缓存
  localCache: null,
  cacheLogger: false,
})

bootSilentFactory({
  alova: request,
})

/** 用于不同子包设置包含业务逻辑的错误处理，例如401 */
export function setErrorHandler(handler: ErrorHandler) {
  errorHandler = handler
}
