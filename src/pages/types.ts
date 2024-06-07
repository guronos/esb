export interface RemindersFromDay {
  [key: string]: Array<Entry>
}

export interface Entry {
  title: string
  body: string
  status: E_Status_Reminders
  dateAction: Date
  author: number
  user: number
  priorityType: E_Priority_Reminders
  typeAction: E_Types_Actions
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
