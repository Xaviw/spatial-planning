import { cloneDeep } from 'lodash-es'
import { apply, create, type Patches, type Draft } from 'mutative'
import { ref, shallowRef } from 'vue'

// interface StepPatch<T = any> {
//   op: 'add' | 'remove' | 'replace' | 'move'
//   path: (string | number)[]
//   value: T
// }

export function useMutative<T>(baseState: T) {
  const originalState = shallowRef<T>(cloneDeep(baseState))
  const state = shallowRef<T>(cloneDeep(baseState))

  const patches = ref<Patches[]>([])
  const inversePatches = ref<Patches[]>([])

  // const operatingSteps = shallowRef<StepPatch[]>([])
  // const stepPatches = ref<Patches[]>([])
  // const stepInversePatches = ref<Patches[]>([])

  const patchFlag = ref(0)

  const update = (
    mutate: (state: Draft<T>) => void,
    // updateSteps?: (state: Draft<StepPatch[]>) => StepPatch,
  ) => {
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

    // if (typeof updateSteps === 'function') {
    //   const [newSteps, newStepPatches, newStepInversePatches] = create(
    //     operatingSteps.value,
    //     state => {
    //       const patch = updateSteps(state)
    //       const filterPatches = []
    //       for (const item of state) {
    //         if (item.value.id !== patch.value.id) {
    //           filterPatches.push(item)
    //         } else {
    //           if (patch.op === 'replace' && item.op !== 'replace') {
    //             filterPatches.push(item)
    //           } else if (patch.op === 'move') {
    //           }
    //         }
    //       }
    //     },
    //     {
    //       enablePatches: { arrayLengthAssignment: false },
    //     },
    //   )
    // }
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
    originalState.value = cloneDeep(resetState)
    state.value = cloneDeep(resetState)
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
