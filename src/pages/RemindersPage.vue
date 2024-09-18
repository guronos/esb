<template>
    <div>
        <div class="reminders_add">
            <el-date-picker
                v-model="weekFirstDay"
                type="week"
                format="DD/MM/YY"
                value-format="x"
                placeholder="Выбор недели"
                @change="changeDate"
            />
            <el-button type="primary" @click="openModal()">
                <el-icon>
                    <Plus />
                </el-icon>
                <span class="_text-btn">Добавить запись</span>
            </el-button>
        </div>
        <div v-if="Object.keys(reminders).length" class="table_wrapper">
            <div class="table">
                <div v-for="(day, dayKey) in week" :key="dayKey" class="column">
                    <div class="column__header">
                        <div class="column-text">{{ day.humanDate }}</div>
                    </div>
                    <div class="column_body">
                        <template
                            v-for="entryReminder in reminders[day.timestamp]"
                            :key="entryReminder.id"
                        >
                            <el-card
                                class="reminder__card"
                                shadow="hover"
                                :class="{
                                    'overdue-color':
                                        entryReminder.status !== 'done' &&
                                        currentTime > getTimestamp(entryReminder.dateAction),
                                    'done-color': entryReminder.status === 'done'
                                }"
                            >
                                <template #header>
                                    <div class="card_header">
                                        <div>{{ entryReminder.title }}</div>
                                        <div class="card_actions">
                                            <div class="card_actions-switcher">
                                                <div
                                                    v-if="entryReminder.status !== 'done'"
                                                    class="card_arrays-wrapper"
                                                >
                                                    <el-icon><DArrowLeft /></el-icon>
                                                </div>
                                            </div>
                                            <div class="card_main-actions-wrap">
                                                <div class="card_done">
                                                    <el-icon>
                                                        <Select />
                                                    </el-icon>
                                                </div>
                                                <div
                                                    class="card_edit"
                                                    @click="
                                                        openEditModal(entryReminder, day.timestamp)
                                                    "
                                                >
                                                    <el-icon><EditPen /></el-icon>
                                                </div>
                                                <div class="card_delete">
                                                    <el-popconfirm
                                                        title="Вы уверены что хотите удалить запись?"
                                                        @confirm="
                                                            removeReminder(
                                                                entryReminder.id as string,
                                                                day.timestamp
                                                            )
                                                        "
                                                    >
                                                        <template #reference>
                                                            <el-icon><Close /></el-icon>
                                                        </template>
                                                    </el-popconfirm>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <p class="text card_desc">{{ entryReminder.body }}</p>
                                <template #footer>
                                    <div class="card__footer">
                                        <div class="footer_row">
                                            <span>Приоритет:</span>
                                            <el-tag size="small">{{
                                                entryReminder.priorityType
                                            }}</el-tag>
                                        </div>
                                        <div class="footer_row">
                                            <span>Тип:</span>
                                            <el-tag size="small" type="info">{{
                                                entryReminder.typeAction
                                            }}</el-tag>
                                        </div>
                                    </div>
                                </template>
                            </el-card>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>Записи на выбранное время отсутствуют</div>
    </div>
    <el-dialog v-model="stateModal" destroy-on-close title="Создание напоминания">
        <RemindersEditor
            ref="modalCreator"
            @adding-reminder="addReminder"
            @editing-reminder="editReminder"
        />
        <template #footer>
            <div v-if="modalCreator" class="dialog-footer">
                <el-button @click="closeModal()">Отменить</el-button>
                <el-button
                    :disabled="modalCreator.disableCreateBtn"
                    type="primary"
                    @click="modalCreator.sendForm(modalCreator)"
                >
                    Создать
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import RemindersEditor from '@/blocks/reminders/RemindersEditor.vue'
import { getWeek, getStartDay } from '@/helpers/calendar'
import { error, getFetch, success } from '@/helpers/main'
import { ref, nextTick } from 'vue'
import type {
    RemindersFromDay,
    WeekDateData,
    ms_timestamp,
    Reminder,
    EmitEditingReminderData
} from './types'
import { ElMessage } from 'element-plus'
import { E_Priority_Reminders, E_Status_Reminders } from './types'
import { Plus } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { format } from 'date-fns'

const currentTime = dayjs().format('X')
const getTimestamp = (datetime: string | number) => format(datetime, 'T')

const weekFirstDay = ref<ms_timestamp>(Date.now())
const changeDate = (e: ms_timestamp) => {
    week.value = getWeek(e)
    getReminders()
}
const modalCreator = ref()
const week = ref<Array<WeekDateData>>(getWeek(Date.now()))
const reminders = ref<RemindersFromDay>({})
const getReminders = async () => {
    if (!week.value.length) return
    reminders.value = await getFetch('/api/v1//reminders/list', {
        filter: {
            dateStart: +week.value[0].timestamp / 1000,
            dateEnd: +week.value.at(-1).timestamp / 1000
        }
    })
        .then((response) => {
            const data = response.data
            const remindersFromDay: RemindersFromDay = {}
            data.forEach((element: Reminder) => {
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

function addReminder(reminder: Reminder): void {
    const timestamp = getStartDay(reminder.dateAction)
    if (!Object.prototype.hasOwnProperty.call(reminders.value, timestamp))
        reminders.value[timestamp] = []
    reminders.value[timestamp].push(reminder)
    stateModal.value = false
}
function editReminder(reminderDataAndKey: EmitEditingReminderData): void {
    const { lastKey, reminderData } = reminderDataAndKey
    reminders.value[lastKey].some((i, idx) => {
        if (i.id === reminderData.id) return reminders.value[lastKey].splice(idx, 1)
    })
    addReminder(reminderData)
    stateModal.value = false
}

const stateModal = ref<boolean>(false)
const openModal = () => {
    stateModal.value = true
}
const closeModal = () => {
    if (modalCreator.value) modalCreator.value.formReset()
    stateModal.value = false
}

const openEditModal = (data: Reminder, remindersKey: string) => {
    stateModal.value = true
    nextTick(() => {
        modalCreator.value.setStateEdit(data, remindersKey)
    })
}

const removeReminder = async (reminderId: string, key: string) => {
    const data = await getFetch(`/api/v1/reminders/${reminderId}`, false, 'DELETE')
    if (data.statusCode === 200) {
        reminders.value[key].splice(
            reminders.value[key].findIndex((i) => i.id === reminderId),
            1
        )
        success('Запись успешна удалена.')
    } else {
        error(
            'Произошла непредвиденная ошибка при удалении, скоро мы начнем работу над ее устранением.'
        )
    }
}
</script>
<style scoped>
.reminders_add {
    display: flex;
    justify-content: space-between;
    margin: 0 0 8px 0;
}
.table_wrapper {
    height: 78vh;
    overflow-y: auto;
}
.table {
    display: flex;
    background: #503ddf3a;
    border-radius: 4px;
}
.column {
    width: 15%;
    display: flex;
    flex-direction: column;
}
.column__header {
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4f3ddf7a;
}
._text-btn {
    margin-left: 4px;
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
    justify-content: flex-start;
    gap: 8px;
    padding: 8px 0;
    border-radius: 0 0 4px 4px;
}
.reminder__card {
    width: 95%;
    max-height: 14rem;
}

.card_header {
    min-height: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
}
.card_actions {
    min-width: 20px;
    min-height: 20px;
    position: absolute;
    right: 0;
    display: flex;
    background-color: #fff;
}
.card_actions-switcher {
    width: 20px;
    height: 20px;
    visibility: visible;
    opacity: 1;
    cursor: pointer;
    transition: all 0.3s ease-in;
}
.card_actions:hover .card_actions-switcher {
    visibility: hidden;
    opacity: 0;
    transition: all 0s ease-out;
}
.card_main-actions-wrap {
    width: 0;
    height: 0;
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-out;
}
.card_actions:hover .card_main-actions-wrap {
    width: auto;
    height: auto;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.3s ease-in;
}
.card_main-actions-wrap > div {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
}
.card_main-actions-wrap > div:hover {
    background-color: rgba(208, 215, 236, 0.4);
}
.card_desc {
    max-height: 72px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
}
.card__footer {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 4px;
}
.footer_row {
    display: flex;
    justify-content: space-between;
    gap: 4px;
}
.overdue-color {
    background-color: rgb(236, 83, 83);
}
.done-color {
    background-color: #29d432;
}
</style>
