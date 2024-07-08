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
import { getFetch, success } from '@/helpers/main'
import type { Reminder } from '@/pages/types'
import { E_Priority_Reminders, E_Types_Actions, E_Status_Reminders } from '@/pages/types'
import { useMainStore } from '@/stores/mainState'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { dayjs } from 'element-plus'

const emit = defineEmits<{
    addingReminder: [addingReminder: Reminder]
}>()
const $storeMain = useMainStore()
const userData = $storeMain.userData
const reminder = reactive<Reminder>({
    title: '',
    body: '',
    dateAction: '',
    status: 'wait' as E_Status_Reminders,
    priorityType: 'low' as E_Priority_Reminders,
    typeAction: 'other' as E_Types_Actions,
    author: userData.userId as number,
    user: userData.userId as number
})

const validateForm = reactive<FormRules<Reminder>>({
    title: [
        { required: true, message: 'Поле должно быть заполнено', trigger: 'change' },
        {
            min: 1,
            max: 20,
            message: 'Длина заголовка не должна превышать 20 символов',
            trigger: 'blur'
        }
    ],
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
    if (!validateFormRef.value) return
    await validateFormRef.value.validate(async (valid, fields) => {
        if (!valid) return
        const routeData = {
            route: '/api/v1/reminders/create',
            method: 'POST'
        }
        if (reminder.id) {
            routeData.route = '/api/v1/reminders/update'
            routeData.method = 'PATCH'
        }
        const responseRaw = await getFetch(routeData.route, reminder, routeData.method)
        if (responseRaw.statusCode === 200) {
            emit('addingReminder', responseRaw.data)
            formReset()
            success('Напоминание добавлено')
        }
    })
}

// Редактирование
const setStateEdit = (data: Reminder) => {
    data.dateAction = dayjs(data.dateAction).format('X')
    Object.assign(reminder, data)
}

defineExpose({
    // openModal,
    // closeModal,
    sendForm,
    formReset,
    setStateEdit
})
</script>
