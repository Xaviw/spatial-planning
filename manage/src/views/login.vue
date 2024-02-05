<template>
  <div class="relative h-screen w-screen flex items-center justify-center">
    <WaveTop class="absolute left-0 right-0 top-0" />

    <div class="box relative z-1 flex overflow-hidden rounded-2xl">
      <Loading absolute :loading="userStore.loginLoading" />

      <div
        class="relative box-border w-100 flex items-center justify-center overflow-hidden bg-blue-1"
      >
        <ManageIllustration class="absolute top--28 h-200 w-200" />
      </div>
      <div
        class="box-border w-100 flex items-center justify-center px-12 py-26"
      >
        <AForm
          scrollToFirstError
          hideRequiredMark
          size="large"
          :labelCol="{ style: { width: '66px' } }"
          class="w-full"
        >
          <AFormItem class="mb-12">
            <div class="text-center text-3xl font-bold">{{ title }}</div>
          </AFormItem>
          <AFormItem
            label="用户名"
            v-bind="validateInfos.name"
            :help="!isProd && '演示账号：admin'"
          >
            <AInput v-model:value="formModel.name" placeholder="请输入用户名" />
          </AFormItem>
          <AFormItem
            label="密码"
            v-bind="validateInfos.password"
            :help="!isProd && '演示密码：123456'"
          >
            <AInputPassword
              v-model:value="formModel.password"
              placeholder="请输入密码"
              @keyup.enter="onLogin"
            />
          </AFormItem>
          <AFormItem class="mt-12">
            <AButton
              type="primary"
              size="large"
              class="w-full"
              @click="onLogin"
            >
              登录
            </AButton>
          </AFormItem>
        </AForm>
      </div>
    </div>

    <WaveBottom class="absolute bottom-0 left-0 right-0" />
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { ManageIllustration, WaveBottom, WaveTop } from '@sp/shared/svgs'
import { Form } from 'ant-design-vue'
import { useUserStore } from '../stores/user'
import type { Rule } from 'ant-design-vue/es/form'

const title = import.meta.env.VITE_TITLE
const isProd = import.meta.env.PROD

const userStore = useUserStore()

const formModel = ref({
  name: '',
  password: '',
})

const rules = ref<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      message: '请输入用户名！',
    },
  ],
  password: [{ required: true, message: '请输入密码！' }],
})

const { validateInfos, validate } = Form.useForm(formModel, rules)

async function onLogin() {
  await validate()
  userStore.login(formModel.value)
}
</script>

<style scoped>
.box {
  box-shadow: 0 0 24px 6px rgba(0, 0, 0, 0.1);
}

.box::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
