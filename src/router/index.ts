import MainLayout from '@/layout/MainLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '@/stores/mainState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainLayout',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'mainPage',
          alias: '/',
          component: () => import('@/pages/MainPage.vue')
        },
        {
          path: '/reminders',
          name: 'reminders',
          component: () => import('@/pages/RemindersPage.vue')
        },
        {
          path: '/entries',
          name: 'entries',
          component: () => import('@/pages/EntryList.vue')
        },
        {
          path: '/entities',
          name: 'entities',
          component: () => import('@/pages/EntityData.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('@/pages/RegistrationPage.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (to.path === '/login') return true
  const $mainStore = useMainStore()
  console.log('mainStore.getAuthState', to, $mainStore.getAuthState)
  if ($mainStore.getAuthState) return true
  else if (to.path === '/registration') return true
  const data = await $mainStore.checkAuthState()
  const checkState = !!data
  $mainStore.setAuthState(checkState)
  console.log('before', checkState, to, from)
  if (checkState) {
    return true
  } else {
    return '/login'
  }
})

export default router
