<template>
  <div>
    <div class="table">
      <div v-for="(day, dayKey) in week" :key="dayKey" class="column">
        <div class="column__header">
          <div class="column-text">{{ day.humanDate }}</div>
        </div>
        <div class="column_body">
          <template v-for="entryReminder in reminders[day.timestamp]" :key="entryReminder.id">
            <el-card class="reminder__card">
              <template #header>
                <div class="card-header">
                  <span>{{ entryReminder.title }}</span>
                </div>
              </template>
              <p class="text item">{{ entryReminder.body }}</p>
              <template #footer>Footer content</template>
            </el-card>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- <a-flex justify="flex-end">
    <a-button type="primary" @click.stop="openModal"
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
  <a-modal
    v-model:open="stateModal"
    title="Title"
    width="600px"
    :confirm-loading="confirmLoading"
    :footer="null"
  >
    <div>
      <a-form
        ref="formRef"
        :model="newReminder"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="title" required label="Заголовок" name="title">
          <a-input v-model:value="newReminder.title" />
        </a-form-item>
        <a-form-item label="Дата напоминания" required name="dateAction">
          <a-date-picker
            v-model:value="newReminder.dateAction"
            show-time
            type="date"
            placeholder="Выберите дату"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="Описание" name="body">
          <a-textarea v-model:value="newReminder.body" />
        </a-form-item>
        <a-form-item label="Приоритет" name="priority">
          <a-select
            v-model:value="newReminder.priorityType"
            style="width: 120px"
            :options="staticData.priorityType"
            @change="handleChangeDropDown($event, 'priorityType')"
          />
        </a-form-item>
        <a-form-item label="Тип напоминания" name="typeActions">
          <a-select
            v-model:value="newReminder.typeAction"
            style="width: 120px"
            :options="staticData.typeAction"
            @change="handleChangeDropDown($event, 'typeActions')"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 11 }">
          <a-button type="primary" @click="sendForm">Добавить</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">Очистить</a-button>
          <a-button style="margin-left: 10px" @click="closeModal">Закрыть</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal> -->
</template>
<script setup lang="ts">
import { getWeek, getStartDay } from '@/helpers/calendar'
import { getFetch } from '@/helpers/main'
// import { PlusOutlined } from '@ant-design/icons-vue'
import { useMainStore } from '@/stores/mainState'
import { reactive, ref, toRaw } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Entry, RemindersFromDay } from './types'
// import type { Rule } from 'ant-design-vue/es/form'
// import dayjs, { Dayjs } from 'dayjs'

const formRef = ref()
const labelCol = { span: 6, offset: 0 }
const wrapperCol = { span: 42, offset: 1 }
// const formState: UnwrapRef<FormState> = reactive({
//   name: '',
//   region: undefined,
//   date1: undefined,
//   delivery: false,
//   type: [],
//   resource: '',
//   desc: ''
// })

const userData = useMainStore().userData
const staticData = useMainStore().staticDataDropDown

const newReminder: Entry = reactive({
  title: '',
  body: '',
  dateAction: '',
  status: 1,
  priorityType: 4,
  typeAction: 4,
  author: userData.userId,
  user: userData.userId
})
const stateModal = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const openModal = () => {
  stateModal.value = true
}
const closeModal = () => {
  stateModal.value = false
  confirmLoading.value = false
}
// const sendForm = async () => {
//   confirmLoading.value = true
//   formRef.value.validate().then(async () => {
//     newReminder.dateAction = dayjs(newReminder.dateAction, 'YYYY-MM-DDTHH:mm:ssZ[Z]')
//     // newReminder.dateAction = dayjs(newReminder.dateAction, 'YYYY-MM-DDTHH:mm:ssZ[Z]')
//     const repsonseRaw = await getFetch('http://localhost:3000/reminders/', newReminder)
//     // const response = await repsonseRaw.json()
//     console.log(repsonseRaw)
//     addReminder(repsonseRaw)
//     closeModal()
//   })
// }

const week: string[] = getWeek(Date.now())
const reminders = ref(
  await getFetch('http://localhost:3000/reminders/')
    .then((arr) => {
      const remindersFromDay: RemindersFromDay = {}
      arr.forEach((element: Entry) => {
        const timestamp = getStartDay(element.dateAction)
        if (!Object.prototype.hasOwnProperty.call(remindersFromDay, timestamp))
          remindersFromDay[timestamp] = []
        remindersFromDay[timestamp].push(element)
      })
      return remindersFromDay
    })
    .catch()
)
function addReminder(reminder) {
  const timestamp = getStartDay(reminder.dateAction)
  if (!reminders.value.hasOwnProperty(timestamp)) reminders.value[timestamp] = []
  reminders.value[timestamp].push(reminder)
}

console.log(week, staticData)
</script>
<style scoped>
.table {
  max-height: 85vh;
  display: flex;
  overflow: auto;
  background: #503ddf3a;
  border-radius: 4px;
}
.column {
  width: 15%;
  display: flex;
  flex-direction: column;
  /* background: #503ddf2d; */
}
.column__header {
  display: flex;
  justify-content: center;
  background: #4f3ddf7a;
}
.column:first-child .column__header {
  border-radius: 4px 0 0 0;
}
.column:last-child .column__header {
  border-radius: 0 4px 0 0;
}
.column-text {
  font-size: 16px;
  font-weight: 600;
}
.column-text::first-letter {
  text-transform: uppercase;
}
.column_body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  /* background: #503ddf2d; */
  border-radius: 0 0 4px 4px;
}
.reminder__card {
  width: 95%;
  height: 14rem;
}
</style>
