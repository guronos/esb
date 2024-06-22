import type { WeekDateData } from '@/pages/types'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, startOfDay, type Day } from 'date-fns'
import { addYears, formatWithOptions } from 'date-fns/fp'
import { ru } from 'date-fns/locale'

const formatByHuman = formatWithOptions({ locale: ru }, 'EEEE, d MMMM yyyy')
const formatTimestamp = formatWithOptions({ locale: ru }, 'EEEE, d MMMM yyyy')
const formatWeek: { weekStartsOn: Day } = { weekStartsOn: 1 }

export const getWeek = (choiseTime: Date | number): WeekDateData[] => {
  const firstDay = startOfWeek(choiseTime, formatWeek)
  const lastDay = endOfWeek(choiseTime, formatWeek)
  return eachDayOfInterval({
    start: firstDay,
    end: lastDay
  }).map((i) => {
    return {
      humanDate: formatByHuman(i),
      timestamp: format(i, 'T')
    }
  })
}

export const getStartDay = (dateTame) => {
  return format(startOfDay(dateTame), 'T')
}
