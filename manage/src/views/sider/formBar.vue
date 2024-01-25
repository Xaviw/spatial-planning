<!-- <template>
  <div class="flex flex-col">
    <template v-if="activeOverlay">
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <BaseForm ref="baseFormEl" />

        <component
          :is="components[activeOverlay.type].form"
          :key="activeOverlay.id"
          ref="overlayFormEl"
        />
      </div>

      <div class="flex">
        <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
          确定
        </AButton>
        <AButton class="flex-1" danger @click="onCancel">取消</AButton>
      </div>
    </template>
    <AEmpty
      v-else
      description="请右击“左栏”、“右栏”中的组件，选择“编辑”"
      class="h-full flex flex-col items-center justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import { useSiderStore } from '@sp/shared/helpers/sider'
import { components } from '@sp/shared/materials'
import BaseForm from './baseForm.vue'

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const overlayFormEl = ref<any | null>(null)

const siderStore = useSiderStore()
const {} = storeToRefs(siderStore)

function onConfirm() {}

function onCancel() {}
</script> -->
