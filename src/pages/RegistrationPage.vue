<template>
  <el-form
    ref="userCreateRef"
    style="max-width: 600px"
    :model="userCreate"
    :rules="rules"
    label-width="auto"
    class="demo-UserCreate"
    :size="formSize"
    status-icon
  >
    <el-form-item label="Имя" prop="firstName">
      <el-input v-model="userCreate.firstName" />
    </el-form-item>
    <el-form-item label="Фамилия" prop="lastName">
      <el-input v-model="userCreate.lastName" />
    </el-form-item>
    <el-form-item label="Отчество" prop="middleName">
      <el-input v-model="userCreate.middleName" />
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="userCreate.email" />
    </el-form-item>
    <el-form-item label="Телефон" prop="phone">
      <el-input v-model="userCreate.phone" />
    </el-form-item>
    <el-form-item label="Пароль" prop="password">
      <el-input v-model="userCreate.password" />
    </el-form-item>
    <el-form-item label="Повторите пароль" prop="passwordRepeat">
      <el-input v-model="userCreate.passwordRepeat" />
    </el-form-item>
    <el-form-item label="Регион" prop="region">
      <el-select v-model="userCreate.region" placeholder="Выберите свой регион">
        <el-option label="Любой регион" value="any" />
      </el-select>
    </el-form-item>
    <el-form-item label="Город" prop="city">
      <el-select v-model="userCreate.city" placeholder="Выберите свой город">
        <el-option label="Любой город" value="any" />
      </el-select>
    </el-form-item>
    <el-form-item label="Дата рождения" prop="birthDate">
      <el-date-picker
        v-model="userCreate.birthDate"
        type="date"
        format="DD.MM.YYYY"
        value-format="YYYY-MM-DD HH:mm:ss"
        aria-label="Выберите дату"
        placeholder="Выберите дату"
      />
    </el-form-item>
    <el-form-item label="Пол" prop="sex">
      <el-radio-group v-model="userCreate.sex">
        <el-radio value="m">Мужской</el-radio>
        <el-radio value="f">Женский</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Согласен на предоставление Cookie" prop="isAcceptedCookies">
      <el-checkbox v-model="userCreate.isAcceptedCookies" name="isAcceptedCookies"> </el-checkbox>
    </el-form-item>
    <el-form-item label="Согласен с условиями лицензии" prop="isAcceptLicense">
      <el-checkbox v-model="userCreate.isAcceptLicense" name="isAcceptLicense"> </el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(userCreateRef)"> Зарегистрироваться </el-button>
      <el-button @click="resetForm(userCreateRef)">Сбросить</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { getFetch } from '@/helpers/main'
import { urlBack } from '@/constansDev'
import { useRouter } from "vue-router";
import type { I_UserCreate } from './types'
import {useMainStore} from "@/stores/mainState";


const router = useRouter()
const $mainStore = useMainStore()

const formSize = ref<ComponentSize>('default')
const userCreateRef = ref<FormInstance>()
const userCreate = reactive<I_UserCreate>({
  email: '',
  phone: '',
  password: '',
  passwordRepeat: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  sex: '',
  region: '',
  city: '',
  isAcceptedCookies: false,
  isAcceptLicense: false
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('Введите пароль!'))
  console.log(rule, value, callback)
  callback()
}
const validatePassRepeat = (rule: any, value: any, callback: any) => {
  if (!value) callback(new Error('Введите пароль!'))
  console.log(rule, value, callback)
  callback()
}

const rules = reactive<FormRules<I_UserCreate>>({
  email: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
  phone: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  passwordRepeat: [{ required: true, validator: validatePassRepeat, trigger: 'blur' }],
  firstName: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 2, max: 80, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 2, max: 80, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  middleName: [
    { required: false, message: 'Please input Activity name', trigger: 'blur' },
    { min: 2, max: 80, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  birthDate: [{ required: false, message: 'Заполните дату рождения', trigger: 'blur' }],
  sex: [{ required: false, message: 'Please input Activity name', trigger: 'blur' }],
  region: [
    {
      required: false,
      message: 'Выберите регион',
      trigger: 'change'
    }
  ],
  city: [
    {
      required: false,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  isAcceptedCookies: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
  isAcceptLicense: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!', userCreate)
      const response = await getFetch(urlBack + 'users/create', userCreate)
      if (response.statusCode === 200) {
          $mainStore.setUserData(response.data.userId)
          await router.push('/')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style scoped></style>
