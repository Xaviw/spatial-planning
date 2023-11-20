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

      <ADropdown>
        <div class="flex items-center">
          <i class="i-material-symbols:account-circle text-3xl" />
          <span class="ml-2 text-lg">管理员</span>
        </div>

        <template #overlay>
          <AMenu>
            <AMenuItem>账号设置</AMenuItem>
            <AMenuItem>退出登录</AMenuItem>
          </AMenu>
        </template>
      </ADropdown>
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
        <div class="h-full overflow-auto bg-white shadow">
          <slot />
        </div>
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<script setup lang="ts">
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import menu from '@/routes/menu'

const AppTitle = import.meta.env.VITE_TITLE
const selectedKeys = ref<string[]>([])
const route = useRoute()
const router = useRouter()

watchEffect(() => {
  selectedKeys.value = [route.name as string]
})

function onMenuClick({ key }: MenuInfo) {
  router.push({ name: key as string })
}
</script>
