import { apply, create, type Patches, type Draft } from 'mutative'
import { ref, shallowRef } from 'vue'

export function useMutative<T>(baseState: T) {
  const originalState = shallowRef(baseState)
  const state = shallowRef(baseState)

  const patches = ref<Patches[]>([])
  const inversePatches = ref<Patches[]>([])

  const patchFlag = ref(0)

  const update = (mutate: (state: Draft<T>) => void) => {
    const [nextState, newPatches, newInversePatches] = create(
      state.value,
      state => {
        if (patchFlag.value > 0) {
          patches.value = patches.value.splice(
            0,
            patches.value.length - patchFlag.value,
          )
          inversePatches.value = inversePatches.value.splice(
            0,
            inversePatches.value.length - patchFlag.value,
          )
          patchFlag.value = 0
        }
        mutate(state)
      },
      {
        enablePatches: { arrayLengthAssignment: false },
      },
    )

    state.value = nextState
    patches.value.push(newPatches)
    inversePatches.value.push(newInversePatches)
  }

  const revoke = () => {
    if (patchFlag.value >= inversePatches.value.length) {
      throw new Error('已没有可撤销的操作！')
    }

    patchFlag.value++

    state.value = apply(
      state.value as any,
      inversePatches.value[inversePatches.value.length - patchFlag.value],
    )

    return state.value
  }

  const redo = () => {
    if (patchFlag.value <= 0) {
      throw new Error('已没有可重做的操作！')
    }

    state.value = apply(
      state.value as any,
      patches.value[patches.value.length - patchFlag.value],
    )

    patchFlag.value--

    return state.value
  }

  const reset = (resetState: T) => {
    originalState.value = resetState
    state.value = resetState
    patches.value = []
    inversePatches.value = []
    patchFlag.value = 0
  }

  return {
    originalState,
    state,
    patches,
    inversePatches,
    update,
    revoke,
    redo,
    patchFlag,
    reset,
  }
}
