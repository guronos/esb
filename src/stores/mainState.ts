import { ref, computed, type Ref, readonly } from 'vue'
import { defineStore } from 'pinia'
import { getFetch } from '@/helpers/main'
import { urlBack } from '@/constansDev'
import type { StaticDataDropDown } from '@/pages/types'

export const useMainStore = defineStore('mainState', () => {
  const authState = ref(false)
  const getAuthState = computed(() => authState.value)
  const setAuthState = (state: boolean) => {
    authState.value = state
  }
  const checkAuthState = async () => {
    const isAuth = await getFetch(urlBack + 'auth/check', {})
    if (isAuth.statusCode === 200) {
      setUserData({userId: isAuth.userId})
      return isAuth
    } else return false
  }

  const userData = ref({})
  const setUserData = (userDataObj: {}) => {
    userData.value = userDataObj
  }

  return { userData, setUserData, getAuthState, checkAuthState, setAuthState }
})
