export interface I_UserLogin {
    email: string
    password: string
}

export interface I_UserCreate {
    email: string
    phone: string
    password: string
    passwordRepeat: string
    firstName: string
    lastName: string
    middleName: string
    birthDate: string
    sex: string
    region: string
    city: string
    isAcceptedCookies: boolean
    isAcceptLicense: boolean
}

export interface I_ComponentData {
    component: string
    parentProps: I_ComponentProps
    model: string
    props: I_ComponentProps
    subComponents?: I_SubComponent[]
}
interface I_SubComponent {
    component: string
    props: I_ComponentProps
    slot?: string
}
interface I_ComponentProps {
    [key: string]: string | undefined | boolean
}

export interface RemindersFromDay {
    [key: string]: Array<Reminder>
}
export interface I_UserData {
    userId?: number
}
export interface Reminder {
    id?: string
    title: string
    body: string
    status: E_Status_Reminders
    dateAction: number | string
    author: number
    userId: number
    priorityType: E_Priority_Reminders
    typeAction: E_Types_Actions
}
export interface ReminderEdit extends Partial<Reminder> {
    id: string
}
export interface EmitEditingReminderData {
    reminderData: Reminder,
    lastKey: string
}
export interface WeekDateData {
    humanDate: string
    timestamp: string
}

export enum E_Priority_Reminders {
    critical = 'Критический',
    high = 'Высокий',
    medium = 'Средний',
    low = 'Низкий'
}

export enum E_Status_Reminders {
    wait = 'Ожидание',
    done = 'Выполнено',
    overdue = 'Просрочено'
}

export enum E_Types_Actions {
    to = 'Техобслуживание',
    plan = 'Плановая замена',
    repair = 'Ремонт',
    other = 'Прочее'
}

export type ms_timestamp = number
