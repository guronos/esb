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

enum E_Priority_Reminders {
  critical = 1,
  high = 2,
  medium = 3,
  low = 4
}

enum E_Status_Reminders {
  wait = 1,
  done = 2,
  overdue = 3
}

enum E_Types_Actions {
  to = 1,
  plan = 2,
  repair = 3,
  other = 4
}
