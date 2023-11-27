import { create, type Draft, type Patch } from 'mutative'
import { ref, shallowRef } from 'vue'

export function useMutative<
  T,
  R extends void | T | Promise<void> | Promise<T> = void,
>(baseState: T) {
  const original = baseState
  const state = shallowRef(baseState)
  const patches = ref<Patch[]>([])
  const inversePatches = ref<Patch[]>([])

  const update = (mutate: (draft: Draft<T>) => R) => {
    const [nextState, newPatches, newInversePatches] = create(
      state.value,
      mutate,
      {
        enablePatches: true,
      },
    ) as any

    state.value = nextState
    patches.value.push(...newPatches)
    inversePatches.value.push(...newInversePatches)
  }

  return { original, state, patches, inversePatches, update }
}
