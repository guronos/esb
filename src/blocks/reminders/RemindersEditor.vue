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
                type="datetime"
                placeholder="Выбрать дату"
                format="HH:mm:ss DD.MM.YY"
                value-format="X"
            />
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { error, getFetch, success } from '@/helpers/main'
import type { EmitEditingReminderData, Reminder, ReminderEdit } from '@/pages/types'
import { E_Priority_Reminders, E_Types_Actions, E_Status_Reminders } from '@/pages/types'
import { useMainStore } from '@/stores/mainState'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, toValue } from 'vue'
import { dayjs } from 'element-plus'
import _ from 'lodash'

const emit = defineEmits<{
    addingReminder: [addingReminder: Reminder]
    editingReminder: [editingReminder: EmitEditingReminderData]
}>()
const $storeMain = useMainStore()
const userData = $storeMain.userData
const reminder = reactive<Reminder | ReminderEdit>({
    title: '',
    body: '',
    dateAction: '',
    status: 'wait' as E_Status_Reminders,
    priorityType: 'low' as E_Priority_Reminders,
    typeAction: 'other' as E_Types_Actions,
    author: userData.userId as number,
    userId: userData.userId as number
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
            for (const key in reminder) {
                if (
                    key !== 'id' &&
                    reminder[key as keyof ReminderEdit] ===
                        reminderCloneBegin[key as keyof ReminderEdit]
                )
                    delete reminder[key as keyof Reminder]
            }
        }
        const responseRaw = await getFetch(routeData.route, reminder, routeData.method)
        if (responseRaw.statusCode === 200) {
            if (reminder.id) {
                emit('editingReminder', {
                    reminderData: responseRaw.data,
                    lastKey: timestampKey.value
                })
                success('Напоминание отредактировано')
            } else {
                emit('addingReminder', responseRaw.data)
                success('Напоминание добавлено')
            }
            formReset()
        } else error('Ошибка создания/редактирования записи')
    })
}
const reminderCloneBegin: ReminderEdit = reactive({
    id: ''
})
const timestampKey = ref<string>('')

// Редактирование
const setStateEdit = (data: Reminder, remindersKey: string): void => {
    data.dateAction = dayjs(data.dateAction).format('X')
    Object.assign(reminder, data)
    Object.assign(reminderCloneBegin, data)
    timestampKey.value = remindersKey
}

const disableCreateBtn = computed((): boolean => {
    if (reminder.id) {
        return _.isEqual(toValue(reminder), toValue(reminderCloneBegin))
    } else {
        return !reminder.body || !reminder.dateAction
    }
})

defineExpose({
    sendForm,
    formReset,
    setStateEdit,
    disableCreateBtn
})
</script>
