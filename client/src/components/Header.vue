<template>
  <div
    class="flex select-none items-center justify-between px-18 py-1 text-white"
  >
    <div class="flex flex-1 items-center text-4xl font-bold">
      <i
        class="i-streamline:ecology-science-planet-solar-system-ring-planet-saturn-space-astronomy"
      />

      <span class="ml-4 tracking-widest">
        {{ AppTitle }}
      </span>
    </div>

    <div class="flex items-center">
      <div class="search-box">
        <input
          class="search-input"
          ref="searchInput"
          v-model="searchValue"
          placeholder="搜索覆盖物名称"
        />
        <i class="search-btn i-ant-design:search-outlined" @click="onSearch" />
      </div>

      <Weather />

      <div class="ml-2 flex flex-col items-center tracking-wide">
        <span class="mb-1 text-xl font-bold">{{ currentTime }}</span>
        <span>{{ currentDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapKey } from '@sp/shared/helpers/map'
import { useMainStore } from '../stores/main'

const AppTitle = import.meta.env.VITE_TITLE

const currentTime = ref<string>()
const currentDate = ref<string>()

updateDateTime()

function updateDateTime() {
  const update = () => {
    currentTime.value = new Date().toLocaleTimeString()
    currentDate.value = new Date().toLocaleDateString()
    requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

const { mapData } = storeToRefs(useMainStore())
const map = inject(mapKey)
const searchInput = ref<HTMLInputElement | null>(null)
const searchValue = ref('')

function onSearch() {
  const name = searchValue.value.trim().toLowerCase()
  if (!name) {
    searchInput.value?.focus()
    return
  }
  // 记录模糊匹配的项
  const options: string[] = []
  for (let layer of mapData.value) {
    for (let overlay of layer.overlays) {
      const overlayName = overlay.name.toLowerCase()
      // 完全相等时直接结束
      if (overlayName === name) {
        fitViewOverlay(overlay.id)
        return
      } else if (overlayName.includes(name)) {
        options.push(overlay.id)
      }
    }
  }
  // 没有完全匹配项时使用第一个模糊匹配
  if (options.length) {
    fitViewOverlay(options.shift()!)
  }
}

// 查找成功后缩放到覆盖物位置
function fitViewOverlay(id: string) {
  const overlays = map?.value?.getAllOverlays()
  if (!overlays?.length) return
  for (let overlay of overlays) {
    if (overlay.getExtData() === id) {
      map!.value!.setFitView([overlay])
    }
  }
}

onMounted(() => {
  onKeyStroke('Enter', onSearch, { target: searchInput.value, dedupe: true })
})
</script>

<style scoped>
.search-box {
  margin-right: 1rem;
  padding: 4px 0.5rem 6px 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #ffffff00;
  transition: all 0.3s ease-in-out;
}

.search-box:hover {
  border-color: #fff;
}

.search-box:hover > .search-input {
  width: 7rem;
}

.search-input {
  outline: 0;
  background-color: inherit;
  border: 0;
  width: 0;
  transition: all 0.3s ease-in-out;
  font-size: 14px;
}

.search-btn {
  font-size: 24px;
  cursor: pointer;
}
</style>
