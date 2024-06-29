import { ref, computed, type Ref, readonly } from 'vue'
import { defineStore } from 'pinia'
import { getFetch } from '@/helpers/main'
import { urlBack } from '@/constansDev'
import type { StaticDataDropDown } from '@/pages/types'

export const useMainStore = defineStore('mainState', () => {
  const authState = ref(false)
  const getAuthState = computed(() => authState.value)
  const checkAuthState = async () => {
    return await getFetch(urlBack + 'auth/check', {})
  }
  const setAuthState = (state: boolean) => {
    authState.value = state
  }

  const userData = ref({
    userId: 2
  })

  return { userData, getAuthState, checkAuthState, setAuthState }
})
