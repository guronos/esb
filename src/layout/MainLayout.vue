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
                    :router="true"
                    :default-active="$route.fullPath"
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
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu as IconMenu } from '@element-plus/icons-vue'

const isCollapse = ref<boolean>(false)
// функции меню
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

const $route = useRoute()

const selectedKeys = ref<string[]>([''])
const menu: Menu = {
    mainPage: {
        title: 'Главная',
        link: '/',
        routeName: '',
        key: '1'
    },
    reminders: {
        title: 'Напоминания',
        link: '/reminders',
        routeName: '',
        key: '2'
    },
    entries: {
        title: 'Записи',
        link: '/entries',
        routeName: '',
        key: '3'
    },
    entities: {
        title: 'Сущности',
        link: '/entities',
        routeName: '',
        key: '4'
    },
    settings: {
        title: 'Настройки',
        link: '/settings',
        routeName: '',
        key: '5'
    }
}

const setMenuIndicator = (): void => {
    if ($route.name) {
        selectedKeys.value = [menu[$route.name as string].key]
    }
}
watch(() => $route.fullPath, setMenuIndicator)
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 94vh;
}
</style>
