export interface RemindersFromDay {
  [key: string]: Array<Riminder>
}

export interface Riminder {
  title: string
  body: string
  status: E_Status_Reminders
  dateAction: number | string
  author: number
  user: number
  priorityType: E_Priority_Reminders
  typeAction: E_Types_Actions
}
export interface WeekDateData {
  humanDate: string
  timestamp: string
}

export interface StaticDataDropDown {
  priorityType?: StaticDataDropDownObject[]
  typeAction?: StaticDataDropDownObject[]
}
interface StaticDataDropDownObject {
  value: number
  label: string
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
