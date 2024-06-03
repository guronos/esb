<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="router.push(menu.mainPage.link)">
          <pie-chart-outlined />
          <span>{{ menu.mainPage.title }}</span>
        </a-menu-item>
        <a-menu-item key="2" @click="router.push(menu.reminders.link)">
          <pie-chart-outlined />
          <span>{{ menu.reminders.title }}</span>
        </a-menu-item>
        <a-menu-item key="3" @click="router.push(menu.entries.link)">
          <desktop-outlined />
          <span>{{ menu.entries.title }}</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>{{ menu.entities.title }}</span>
            </span>
          </template>
          <a-menu-item key="5">Tom</a-menu-item>
          <a-menu-item key="6">Bill</a-menu-item>
          <a-menu-item key="7">Alex</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="4" @click="router.push(menu.settings.link)">
          <file-outlined />
          <span>{{ menu.settings.title }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; height: 48px; padding-left: 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-if="route.name">{{ menu[route.name].title }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-layout-header>
      <a-layout-content style="margin: 16px; height: 100%">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center; padding: 8px 50px">
        ESB ©2024 Created by Guronos
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>([''])
const menu: Menu = {
  mainPage: {
    title: 'Главная',
    link: '/',
    key: '1'
  },
  reminders: {
    title: 'Напоминания',
    link: '/reminders',
    key: '2'
  },
  entries: {
    title: 'Записи',
    link: '/entries',
    key: '3'
  },
  entities: {
    title: 'Сущности',
    link: '/entities'
  },
  settings: {
    title: 'Настройки',
    link: '/settings',
    key: '4'
  }
}

const setMenuIndicator = () => {
  if (route.name) {
    selectedKeys.value = [menu[route.name].key]
  }
}
watch(() => route.fullPath, setMenuIndicator)
</script>
<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
