/* eslint-disable indent */
import { nextTick, ref, unref } from 'vue'
import type { RuleError } from 'ant-design-vue/es/form/interface'
import type { validateOptions } from 'ant-design-vue/es/form/useForm'

export interface FormAction {
  clearValidate: (names?: string | string[]) => Promise<void>
  resetFields: (newValues?: Recordable) => Promise<void>
  validate: (
    names?: string | string[],
    options?: validateOptions,
  ) => Promise<RuleError>
  getFieldsValue: () => Promise<Recordable>
}

export function useEditFormBase(): [
  (instance: FormAction) => void,
  FormAction,
] {
  const formRef = ref<FormAction>()

  async function getForm() {
    await nextTick()
    const form = unref(formRef)
    if (!form) {
      throw new Error('未获取到form示例！')
    }
    return form
  }

  function register(instance: FormAction) {
    if (instance === unref(formRef)) return
    formRef.value = instance
  }

  const methods: FormAction = {
    clearValidate: async (...args) => {
      const form = await getForm()
      form.clearValidate(...args)
    },
    resetFields: async (...args) => {
      const form = await getForm()
      form.resetFields(...args)
    },
    validate: async (...args) => {
      const form = await getForm()
      return form.validate(...args)
    },
    getFieldsValue: async () => {
      const form = await getForm()
      return form.getFieldsValue()
    },
  }

  return [register, methods]
}
