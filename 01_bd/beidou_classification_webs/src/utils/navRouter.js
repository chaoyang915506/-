import { computed } from 'vue'
import store from '@/store'

let navigationRouter = computed(() => store.state.app.navigationRouter)
export function filterShowMode (type) {
  if (navigationRouter.value && navigationRouter.value.length) {
    if (type) {
      if (navigationRouter.value[navigationRouter.value.length - 1] && navigationRouter.value[navigationRouter.value.length - 1].meta && navigationRouter.value[navigationRouter.value.length - 1].meta.title == type) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    if (type) {
      return false
    } else {
      return true
    }
  }
}