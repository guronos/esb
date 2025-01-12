export enum E_Priority_Reminders {
    critical,
    high,
    medium,
    low
}

export enum E_Status_Reminders {
    wait,
    done,
    overdue
}

export enum E_Types_Actions {
    to,
    plan,
    repair,
    other,
}

export const Status_Reminders = [
    'Ожидание',
    'Выполнено',
    'Просрочено',
]

export const Types_Actions = [
    'Техобслуживание',
    'Плановая замена',
    'Ремонт',
    'Прочее',
]
export const Priority_Reminders = [
    'Критический',
    'Высокий',
    'Средний',
    'Низкий',
]