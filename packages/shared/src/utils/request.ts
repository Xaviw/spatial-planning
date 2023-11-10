import { message } from 'ant-design-vue'
import { extend } from 'umi-request'

export const request = extend({
  prefix: '/api',
  timeout: 10000,
})

// 在不同端调用，可以传入对应的处理
export function extendErrorHandler() {
  request.extendOptions({
    errorHandler(error) {
      const codeMap: Record<number, string> = { 401: 'xxxxx' }

      if (error.response) {
        message.warn(codeMap[error.response.status])
      } else {
        message.error(error.message)
      }
    },
  })
}
