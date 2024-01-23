<template>
  <div class="relative h-full bg-white p-8">
    <Loading absolute :loading="updateLoading" />

    <ATypographyTitle>账户设置</ATypographyTitle>
    <ATypographyParagraph>修改账户信息后需要重新登录</ATypographyParagraph>
    <ADivider />

    <div class="mt-16 flex items-center justify-center">
      <AForm
        size="large"
        :labelCol="{ style: { width: '67px' } }"
        scrollToFirstError
        class="w-120"
      >
        <AFormItem label="用户名" v-bind="validateInfos.name">
          <AInput v-model:value="formModel.name" placeholder="请输入用户名" />
        </AFormItem>

        <AFormItem label="旧密码" v-bind="validateInfos.oldPassword">
          <AInputPassword
            v-model:value="formModel.oldPassword"
            placeholder="请输入旧密码"
          />
        </AFormItem>

        <AFormItem label="新密码" v-bind="validateInfos.password">
          <AInputPassword
            v-model:value="formModel.password"
            placeholder="请输入新密码"
          />
        </AFormItem>

        <AFormItem class="mt-16 text-center">
          <AButton type="primary" @click="onConfirm" class="w-50">确定</AButton>
        </AFormItem>
      </AForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import { useUserStore } from '../stores/user'
import type { Rule } from 'ant-design-vue/es/form'

const { update, updateLoading, username, id } = useUserStore()

const formModel = ref({
  id,
  name: username,
  oldPassword: '',
  password: '',
})

const rules = ref<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      message: '请输入用户名！',
    },
  ],
  oldPassword: [{ required: true, message: '请输入旧密码！' }],
  password: [
    { required: true, message: '请输入新密码！' },
    {
      validator() {
        if (formModel.value.oldPassword === formModel.value.password) {
          return Promise.reject('新密码与旧密码相同！')
        }
        return Promise.resolve()
      },
    },
  ],
})

const { validateInfos, validate } = Form.useForm(formModel, rules)

async function onConfirm() {
  await validate()
  update(formModel.value)
}
</script>
