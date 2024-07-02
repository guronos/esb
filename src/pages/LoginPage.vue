<template>
  <el-form
    ref="formRef"
    style="max-width: 600px"
    :model="dynamicValidateForm"
    label-width="auto"
    class="demo-dynamic"
  >
    <el-form-item
      prop="email"
      label="Введите Email"
      :rules="[
        {
          required: true,
          message: 'Please input email address',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change']
        }
      ]"
    >
      <el-input v-model="dynamicValidateForm.email" />
    </el-form-item>
    <el-form-item
      :label="'Введите пароль'"
      :prop="'password'"
      :rules="{
        required: true,
        message: 'Введите пароль',
        trigger: 'blur'
      }"
    >
      <el-input v-model="dynamicValidateForm.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">Войти</el-button>
      <el-button @click="resetForm(formRef)">Очистить</el-button>
    </el-form-item>
  </el-form>
    <router-link to="/registration">Зарегистрироватся</router-link>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { getFetch } from '@/helpers/main'
import { urlBack } from '@/constansDev'
import { useMainStore } from '@/stores/mainState'
import { useRouter } from 'vue-router'

const router = useRouter()
const mainStore = useMainStore()
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
  password: string
  email: string
}>({
  password: '',
  email: ''
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const data = await getFetch(urlBack + 'auth', dynamicValidateForm)
      const assess = data.statusCode === 200
      mainStore.setAuthState(assess)
      if (assess) {
          mainStore.setUserData({userData: data.userId})
          await router.push('/')
      }
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  // axios
  //   .post(
  //     urlBack + 'auth',
  //     {
  //       email: 'ivan@mail.ru',
  //       password: 'qwerty'
  //     },
  //     {
  //       withCredentials: true,
  //       headers: {
  //         // 'Access-Control-Allow-Credentials': 'include',
  //         'Access-Control-Allow-Origin': 'http://localhost:5173/',
  //         'Access-Control-Allow-Credentials': true,
  //         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  //       }
  //       // credentials: 'include'
  //     }
  //   )
  //   .then((response) => response.data)
})
</script>
