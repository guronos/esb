<template>
  <div>
    <div class="reminders_add">
      <el-date-picker
        v-model="weekFerstDay"
        type="week"
        format="DD/MM/YY"
        placeholder="Выбор недели"
        @change="changeDate"
      />
      <el-button type="primary" @click="openModal">Добавить запись</el-button>
    </div>
    <div v-if="Object.keys(reminders).length">
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
    <div v-else>Записи на выбранное время отсутствуют</div>
  </div>

  <el-dialog v-model="stateModal" title="Создание напоминания">
    <el-form
      ref="validateFormRef"
      :rules="validateForm"
      :model="newReminder"
      label-position="right"
      label-width="auto"
    >
      <el-form-item label="Заголовок" prop="title" reset-field="true">
        <el-input v-model="newReminder.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Текст напоминания" prop="body">
        <el-input v-model="newReminder.body" type="textarea" />
      </el-form-item>
      <el-form-item label="Тип">
        <el-select v-model="newReminder.typeAction" placeholder="Выберите тип события">
          <el-option
            v-for="type in staticData.typeAction"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Приоритет">
        <el-select v-model="newReminder.priorityType" placeholder="Выберите приоритет">
          <el-option
            v-for="priority in staticData.priorityType"
            :key="priority.value"
            :label="priority.label"
            :value="priority.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Выберите дату события" prop="dateAction">
        <el-date-picker
          v-model="newReminder.dateAction"
          type="datetime"
          placeholder="Выбрать дату"
          format="hh:mm:ss DD/MM/YY"
          value-format="X"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeModal(validateFormRef)">Отменить</el-button>
        <el-button type="primary" @click="sendForm(validateFormRef)"> Создать </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { getWeek, getStartDay } from '@/helpers/calendar'
import { getFetch } from '@/helpers/main'
import { useMainStore } from '@/stores/mainState'
import { reactive, ref, toRaw } from 'vue'
import type { Ref } from 'vue'
import type { Riminder, RemindersFromDay } from './types'
import type { FormInstance, FormRules } from 'element-plus'

const weekFerstDay = ref('')
const changeDate = (e: Date) => {
  week.value = getWeek(e || Date.now())
  getReminders()
}

const userData = useMainStore().userData
const staticData = useMainStore().staticDataDropDown

const newReminder = reactive<Riminder>({
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
const openModal = () => {
  stateModal.value = true
}
const closeModal = (formEl) => {
  formEl.resetFields()
  stateModal.value = false
}
const validateForm = reactive<FormRules<Riminder>>({
  title: [
    { required: true, message: 'Поле должно быть заполнено', trigger: 'change' },
    { min: 1, max: 20, message: 'Длина заколовка должна превышать 20 символов', trigger: 'blur' }
  ],
  body: [{ required: true, message: 'Поле должно быть заполнено', trigger: 'change' }],
  dateAction: [
    {
      type: 'string',
      required: true,
      message: 'Выберите дату события',
      trigger: 'change'
    }
  ]
})
const validateFormRef = ref<FormInstance>()
const sendForm = async (formEl: FormInstance | undefined) => {
  console.log(formEl)
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    // newReminder.dateAction = dayjs(newReminder.dateAction, 'YYYY-MM-DDTHH:mm:ssZ[Z]')
    // newReminder.dateAction = dayjs(newReminder.dateAction, 'YYYY-MM-DDTHH:mm:ssZ[Z]')
    console.log(valid, fields)
    if (!valid) return
    // newReminder.dateAction = Number(newReminder.dateAction)
    const repsonseRaw = await getFetch('http://localhost:3000/reminders/create', newReminder)
    // const response = await repsonseRaw.json()
    console.log(repsonseRaw)
    addReminder(repsonseRaw)
    formEl.resetFields()
    stateModal.value = false
  })
}

const week: Ref<string[]> = ref(getWeek(Date.now()))
const reminders = ref([])
const getReminders = async () => {
  reminders.value = await getFetch('http://localhost:3000/reminders/list', {
    filter: {
      dateStart: week.value[0].timestamp / 1000,
      dateEnd: week.value.at(-1).timestamp / 1000
    }
  })
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
}
getReminders()

function addReminder(reminder) {
  const timestamp = getStartDay(reminder.dateAction)
  if (!reminders.value.hasOwnProperty(timestamp)) reminders.value[timestamp] = []
  reminders.value[timestamp].push(reminder)
}

console.log(week, staticData)
</script>
<style scoped>
.reminders_add {
  display: flex;
  justify-content: end;
}
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
  min-height: 20rem;
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
