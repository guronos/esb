<template>
  <a-flex justify="flex-end">
    <a-button type="primary"
      ><PlusOutlined :style="{ color: '#fff' }" />Добавить напоминание</a-button
    >
  </a-flex>
  <div class="table">
    <div v-for="col in week" class="column">f</div>
  </div>
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
</script>
<style scoped>
.table {
  display: flex;
}
.column {
  width: 15%;
}
</style>
