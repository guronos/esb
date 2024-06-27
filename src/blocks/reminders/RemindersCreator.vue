<template>
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
          type="date"
          placeholder="Выбрать дату"
          format="hh:mm:ss DD.MM.YY"
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
import { getFetch } from '@/helpers/main'
import type { Riminder, StaticDataDropDown } from '@/pages/types'
import { useMainStore } from '@/stores/mainState'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'addingReminder', addingReminder: object): void
}>()

const storeMain = useMainStore()
const staticData: StaticDataDropDown = storeMain.staticDataDropDown
const userData = storeMain.userData
const stateModal = ref<boolean>(false)
const openModal = () => {
  stateModal.value = true
}
const closeModal = (formEl: FormInstance | undefined) => {
  if (formEl) formEl.resetFields()
  stateModal.value = false
}
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
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    const responseRaw = await getFetch('http://localhost:3000/reminders/create', newReminder)
    emit('addingReminder', responseRaw)
    formEl.resetFields()
    stateModal.value = false
  })
}

defineExpose({
  openModal,
  closeModal
})
</script>
