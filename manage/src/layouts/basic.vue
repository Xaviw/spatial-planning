<template>
  <ALayout class="h-screen">
    <ALayoutHeader
      class="flex select-none items-center justify-between px-18 py-4 shadow-xl text-white!"
    >
      <div class="flex flex-1 items-center text-4xl font-bold">
        <i
          class="i-streamline:ecology-science-planet-solar-system-ring-planet-saturn-space-astronomy"
        />

        <span class="ml-4 tracking-widest">{{ AppTitle }}后台</span>
      </div>

      <div class="flex">
        <AAlert
          v-if="enableMock"
          closable
          showIcon
          message="当前为mock环境，仅作演示！"
          class="mr-8"
        />

        <ADropdown>
          <div class="flex items-center">
            <i class="i-material-symbols:account-circle text-3xl" />
            <span class="ml-2 text-lg">{{ userStore.username }}</span>
          </div>

          <template #overlay>
            <AMenu>
              <AMenuItem @click="$router.push('/update')">账号设置</AMenuItem>
              <AMenuItem @click="onLogout">退出登录</AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </div>
    </ALayoutHeader>
    <ALayout>
      <ALayoutSider collapsible class="shadow-xl">
        <AMenu
          :items="menu"
          :selectedKeys="selectedKeys"
          theme="dark"
          @click="onMenuClick"
        />
      </ALayoutSider>
      <ALayoutContent class="bg-gray-2 p-4">
        <div class="relative h-full overflow-auto">
          <slot />
        </div>
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<script setup lang="ts">
import { modal } from '@sp/shared/utils'
import menu from '../routes/menu'
import { useUserStore } from '../stores/user'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'

const AppTitle = import.meta.env.VITE_TITLE
const enableMock = import.meta.env.VITE_MOCK_ENABLE === 'true'
const selectedKeys = ref<string[]>([])
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

watchEffect(() => {
  selectedKeys.value = [route.name as string]
})

function onMenuClick({ key }: MenuInfo) {
  router.push({ name: key as string })
}

async function onLogout() {
  await modal('confirm', {
    title: '是否确定退出登录？',
  })
  userStore.logout()
}
</script>
