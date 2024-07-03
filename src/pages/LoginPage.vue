<template>
    <div class="login_main">
        <div class="login_form_wrapper">
            <div class="login_title">Вход</div>
            <el-form
                ref="formRef"
                style="max-width: 600px;"
                :model="dynamicValidateForm"
                label-width="auto"
                label-position="left"
                class="demo-dynamic"
            >
                <el-form-item
                    class="login_custom-color"
                    prop="email"
                    label="Введите Email"
                    :rules="rules"
                >
                    <el-input class="login_custom-input" autofocus autocomplete="on" v-model="dynamicValidateForm.email" />
                </el-form-item>
                <el-form-item
                    class="login_custom-color"
                    :label="'Введите пароль'"
                    :prop="'password'"
                    :rules="{
                        message: 'Введите пароль',
                        trigger: 'blur'
                    }"
                >
                    <el-input class="login_custom-input" type="password" autocomplete="off" v-model="dynamicValidateForm.password" />
                </el-form-item>
                <div class="flex-center">
                    <el-form-item>
                        <el-button color="#890cb0" @click="submitForm(formRef)">Войти</el-button>
                        <el-button color="#f6f9ea" @click="resetForm(formRef)">Очистить</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="login_custom-color login_footer">
                <span>Первый раз здесь?</span>
                <router-link to="/registration">
                    <CustomButton class="login_custom-btn" :text="'Зарегистрироваться'" /></router-link></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { getFetch } from '@/helpers/main'
import { urlBack } from '@/constansDev'
import { useMainStore } from '@/stores/mainState'
import { useRouter } from 'vue-router'
import CustomButton from '@/components/CustomButton.vue';

const router = useRouter()
const mainStore = useMainStore()
const rules = ref([
    {
        message: 'Please input email address',
        trigger: 'blur'
    },
    {
        type: 'email',
        message: 'Please input correct email address',
        trigger: ['blur']
    }
])
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
</script>
<style scoped lang="scss">
//@import "../assets/mainStyles.scss";
.login_main {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/logo.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: #f8f8f8;

    a {
        color: #2aced2;
    }
    .login_form_wrapper {
        padding: 2rem;
        background-color: #6d2082e3;
        border-radius: 6px;
        .login_title {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            color: $prime-white;

        }
        .login_custom-color {
            --el-text-color-regular: #f6F6F6;
            --el-color-danger: #d0f903;
            .login_custom-input {
                --el-text-color-regular: rgba(0, 0, 0, 0.94)
            }
        }
        .login_footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 3rem;
            gap: 0.5rem;
            .login_custom-btn {
                width: 100%;
                height: 2.2rem;
                font-size: 1rem;
                padding: 0.6rem;
                margin: 0;
            }
        }
    }
}
</style>
