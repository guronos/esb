<template>
  <a-flex justify="flex-end">
    <a-button type="primary"
      ><PlusOutlined :style="{ color: '#fff' }" />Добавить напоминание</a-button
    >
  </a-flex>
  <div class="table">
    <div v-for="(day, idx) in week" :key="idx" class="column">
      <div class="column__header">
        <a-typography-title :level="5" class="header_landing-letter">{{
          day.humanDate
        }}</a-typography-title>
      </div>
      <div v-if="Object.keys(reminders).length" class="column_body">
        <a-card
          v-for="item in reminders[day.timestamp]"
          :key="item.id"
          :title="item.title"
          style="width: 95%"
        >
          <p>{{ item.body }}</p>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getWeek, getStartDay } from '@/helpers/calendar'
import { getFetch } from '@/helpers/main'
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const week: string[] = getWeek(Date.now())

const reminders = ref(
  await getFetch('http://localhost:3000/reminders/')
    .then((arr) => {
      const remindersFromDay = {}
      arr.forEach((element) => {
        const timestamp = getStartDay(element.dateAction)
        if (!remindersFromDay.hasOwnProperty(timestamp)) remindersFromDay[timestamp] = []
        remindersFromDay[timestamp].push(element)
      })
      return remindersFromDay
    })
    .catch()
)

console.log(week)
</script>
<style scoped>
.table {
  display: flex;
}
.column {
  width: 15%;
  display: flex;
  flex-direction: column;
}
.column__header {
  display: flex;
  justify-content: center;
  background: #4f3ddf7a;
}
.header_landing-letter::first-letter {
  text-transform: uppercase;
}
.column_body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  background: #503ddf2d;
}
</style>
