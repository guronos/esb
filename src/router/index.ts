import MainPage from '@/pages/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: MainPage
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
})

export default router
