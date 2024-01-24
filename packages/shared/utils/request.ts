import { createAlovaMockAdapter } from '@alova/mock'
import { bootSilentFactory } from '@alova/scene-vue'
import mockGroups from '@sp/shared/mocks'
import { createAlova, Method } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import vueHook from 'alova/vue'
import { message, notification, Modal } from 'ant-design-vue'
import type { Res } from '#/request'

type ErrorHandler = (
  response: Response,
  method: Method,
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

const requestAdapter = createAlovaMockAdapter(mockGroups, {
  enable: import.meta.env.VITE_MOCK_ENABLE,
  httpAdapter: GlobalFetch(),
  delay: 1000,
  mockRequestLogger: true,
})

export const request = createAlova({
  baseURL: import.meta.env.VITE_API_BASE,
  statesHook: vueHook,
  requestAdapter,
  timeout: 1000 * 60,
  // 默认不使用缓存
  localCache: null,
  cacheLogger: false,
  beforeRequest: method => {
    method.config.headers['Content-Type'] = 'application/json;charset=UTF-8'

    const accessToken = localStorage.getItem('Access-Token')
    const refreshToken = localStorage.getItem('Refresh-Token')

    if (accessToken && refreshToken) {
      method.config.headers['Access-Token'] = accessToken
      method.config.headers['Refresh-Token'] = refreshToken
    }
  },
  responded: {
    async onSuccess(response, method) {
      let json: Res<any> | undefined
      let errMsg: string

      const accessToken = response.headers.get('Access-Token')
      const refreshToken = response.headers.get('Refresh-Token')
      if (accessToken && refreshToken) {
        localStorage.setItem('Access-Token', accessToken)
        localStorage.setItem('Refresh-Token', refreshToken)
      }

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

        await errorHandler(response, method, json)

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
      throw error
    },
  },
})

bootSilentFactory({
  alova: request,
})

/** 用于不同子包设置包含业务逻辑的错误处理，例如401 */
export function setErrorHandler(handler: ErrorHandler) {
  errorHandler = handler
}
