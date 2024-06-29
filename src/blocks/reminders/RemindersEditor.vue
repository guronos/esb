<template>
  <el-form
    ref="validateFormRef"
    :rules="validateForm"
    :model="reminder"
    label-position="right"
    label-width="auto"
  >
    <el-form-item label="Заголовок" prop="title" reset-field="true">
      <el-input v-model="reminder.title" autocomplete="off" />
    </el-form-item>
    <el-form-item label="Текст напоминания" prop="body">
      <el-input v-model="reminder.body" type="textarea" />
    </el-form-item>
    <el-form-item label="Тип">
      <el-select v-model="reminder.typeAction" placeholder="Выберите тип события">
        <el-option
          v-for="(typeVal, typeKey) in E_Types_Actions"
          :key="typeKey"
          :label="typeVal"
          :value="typeKey"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Приоритет">
      <el-select v-model="reminder.priorityType" placeholder="Выберите приоритет">
        <el-option
          v-for="(priorityVal, priorityKey) in E_Priority_Reminders"
          :key="priorityKey"
          :label="priorityVal"
          :value="priorityKey"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Выберите дату события" prop="dateAction">
      <el-date-picker
        v-model="reminder.dateAction"
        type="date"
        placeholder="Выбрать дату"
        format="hh:mm:ss DD.MM.YY"
        value-format="X"
      />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { getFetch } from '@/helpers/main'
import type { Riminder } from '@/pages/types'
import { E_Priority_Reminders, E_Types_Actions, E_Status_Reminders } from '@/pages/types'
import { useMainStore } from '@/stores/mainState'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const emit = defineEmits<{
  addingReminder: [addingReminder: Riminder]
}>()

const $storeMain = useMainStore()
const userData = $storeMain.userData
// const stateModal = ref<boolean>(false)
// const openModal = () => {
//   stateModal.value = true
// }
// const closeModal = (formEl: FormInstance | undefined) => {
//   if (formEl) formEl.resetFields()
//   stateModal.value = false
// }
const reminder = reactive<Riminder>({
  title: '',
  body: '',
  dateAction: '',
  status: 'wait' as E_Status_Reminders,
  priorityType: 'low' as E_Priority_Reminders,
  typeAction: 'other' as E_Types_Actions,
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
const formReset = () => {
  if (validateFormRef.value) validateFormRef.value.resetFields()
}
const sendForm = async (formEl: FormInstance | undefined) => {
  console.log(formEl)
  if (!validateFormRef.value) return
  await validateFormRef.value.validate(async (valid, fields) => {
    if (!valid) return
    const responseRaw: Riminder = await getFetch('http://localhost:3000/reminders/create', reminder)
    emit('addingReminder', responseRaw)
    formReset()
    // stateModal.value = false
  })
}

defineExpose({
  // openModal,
  // closeModal,
  sendForm,
  formReset
})
</script>
