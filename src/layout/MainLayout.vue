<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :value="false">expand</el-radio-button>
          <el-radio-button :value="true">collapse</el-radio-button>
        </el-radio-group>
        <el-menu
          class="el-menu-vertical-demo"
          :router
          :default-active="route.fullPath"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item v-for="tab in menu" :key="tab.key" :index="tab.link">
            <el-icon><icon-menu /></el-icon>
            <template #title>{{ tab.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <suspense>
            <router-view></router-view>
          </suspense>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
  <!-- <a-layout style="min-height: 100vh">
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
          <suspense>
            <router-view></router-view>
          </suspense>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center; padding: 8px 50px">
        ESB ©2024 Created by Guronos
      </a-layout-footer>
    </a-layout>
  </a-layout> -->
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

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
    link: '/entities',
    key: '4'
  },
  settings: {
    title: 'Настройки',
    link: '/settings',
    key: '5'
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 94vh;
}
</style>
