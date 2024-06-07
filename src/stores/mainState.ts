import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainState', () => {
  const userData = ref({
    userId: 2
  })
  const staticDataDropDown = ref({
    priorityType: [
      {
        value: 1,
        label: 'Критический'
      },
      {
        value: 2,
        label: 'Высокий'
      },
      {
        value: 3,
        label: 'Средний'
      },
      {
        value: 4,
        label: 'Низкий'
      }
    ],
    typeAction: [
      {
        value: 1,
        label: 'Техобслуживание'
      },
      {
        value: 2,
        label: 'Плановая замена'
      },
      {
        value: 3,
        label: 'Ремонт'
      },
      {
        value: 4,
        label: 'Прочее'
      }
    ]
  })
  return { userData, staticDataDropDown }
})
