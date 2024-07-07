<template>
    <div class="registration">
        <el-form
            ref="userCreateRef"
            style="max-width: 600px"
            :model="userCreate"
            :rules="rules"
            label-width="auto"
            label-position="left"
            class="demo-UserCreate form"
        >
            <div class="registration_footer">
                <span>РЕГИСТРАЦИЯ</span>
                <router-link to="/login">
                    <CustomButton type="attention" class="login_custom-btn" :text="'Вход'"
                /></router-link>
            </div>
            <template v-for="(component, idx) in componentsData" :key="idx">
                <el-form-item :class="component.parentProps.class" v-bind="component.parentProps">
                    <component
                        :is="component.component"
                        v-model="userCreate[component.model as keyof I_UserCreate]"
                        v-bind="component.props"
                    >
                        <template v-if="component.subComponents">
                            <template
                                v-for="(subComponent, subIdx) in component.subComponents"
                                :key="subIdx"
                            >
                                <component
                                    v-if="subComponent.slot"
                                    :is="subComponent.component"
                                    v-bind="subComponent.props"
                                    >{{ subComponent.slot }}</component
                                >
                                <component
                                    v-else
                                    :is="subComponent.component"
                                    v-bind="subComponent.props"
                                ></component>
                            </template>
                        </template>
                    </component>
                </el-form-item>
            </template>
            <div class="info">* - поля обязательные для заполнения</div>
            <el-form-item>
                <el-button
                    class="btn"
                    :disabled="disabledBtn"
                    :color="disabledBtn ? '#4f9b9bba' : '#05f5f5'"
                    type="primary"
                    @click="submitForm(userCreateRef)"
                >
                    Зарегистрироваться
                </el-button>
                <el-button class="btn" color="#890cb0" @click="resetForm(userCreateRef)"
                    >Сбросить</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { getFetch } from '@/helpers/main'
import { useRouter } from 'vue-router'
import type { I_ComponentData, I_UserCreate } from './types'
import { useMainStore } from '@/stores/mainState'
import CustomButton from '@/components/CustomButton.vue'
import { computed } from 'vue'

const router = useRouter()
const $mainStore = useMainStore()

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

onMounted(() => {
    //TODO rm to prod
    (function devData () {
        userCreate.email = 'testUser1@hmail.hru'
        userCreate.phone = '79112223344'
        userCreate.password = 'qwertyui'
        userCreate.passwordRepeat = 'qwertyui'
        userCreate.firstName = 'test'
        userCreate.lastName = 'user'
        userCreate.middleName = 'restovich'
        userCreate.birthDate = "2024-07-01 00:00:00"
        userCreate.sex = 'm'
        userCreate.region = ''
        userCreate.city = ''
        userCreate.isAcceptedCookies = true
        userCreate.isAcceptLicense = true
    })()
})

const disabledBtn = computed(() => {
    return (
        !userCreate.email ||
        !userCreate.password ||
        !userCreate.passwordRepeat ||
        !userCreate.phone ||
        !userCreate.firstName ||
        !userCreate.lastName
    )
})
const componentsData: I_ComponentData[] = reactive([
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Имя',
            prop: 'firstName'
        },
        model: 'firstName',
        props: {
            class: 'input_color'
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Фамилия',
            prop: 'lastName'
        },
        model: 'lastName',
        props: {
            class: 'input_color'
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Отчество',
            prop: 'middleName'
        },
        model: 'middleName',
        props: {
            class: 'input_color'
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Email',
            prop: 'email'
        },
        model: 'email',
        props: {
            class: 'input_color'
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Телефон',
            prop: 'phone'
        },
        model: 'phone',
        props: {
            class: 'input_color'
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Пароль',
            prop: 'password',
            inlineMessage: 'true'
        },
        model: 'password',
        props: {
            class: 'input_color',
            type: 'password',
            'show-password': true
        }
    },
    {
        component: 'el-input',
        parentProps: {
            class: 'label_custom-color',
            label: 'Повторите пароль',
            prop: 'passwordRepeat'
        },
        model: 'passwordRepeat',
        props: {
            class: 'input_color',
            type: 'password',
            'show-password': true
        }
    },
    {
        component: 'el-select',
        parentProps: {
            class: 'label_custom-color',
            label: 'Регион',
            prop: 'region'
        },
        model: 'region',
        props: {
            placeholder: 'Выберите свой регион',
            class: 'input_color'
        },
        subComponents: [
            {
                component: 'el-option',
                props: {
                    label: 'Любой регион',
                    value: 'any'
                }
            }
        ]
    },
    {
        component: 'el-select',
        parentProps: {
            class: 'label_custom-color',
            label: 'Город',
            prop: 'city'
        },
        model: 'city',
        props: {
            placeholder: 'Выберите свой город',
            class: 'input_color'
        },
        subComponents: [
            {
                component: 'el-option',
                props: {
                    label: 'Любой регион',
                    value: 'any'
                }
            }
        ]
    },
    {
        component: 'el-date-picker',
        parentProps: {
            class: 'label_custom-color',
            label: 'Дата рождения',
            prop: 'birthDate'
        },
        model: 'birthDate',
        props: {
            id: 'el-date-picker',
            class: 'input_color',
            type: 'date',
            format: 'DD.MM.YYYY',
            'value-format': 'YYYY-MM-DD HH:mm:ss',
            'aria-label': 'Выберите дату',
            placeholder: 'Выберите дату'
        }
    },
    {
        component: 'el-radio-group',
        parentProps: {
            class: 'label_custom-color',
            label: 'Пол',
            prop: 'sex'
        },
        model: 'sex',
        props: {},
        subComponents: [
            {
                component: 'el-radio',
                props: {
                    value: 'm'
                },
                slot: 'Мужской'
            },
            {
                component: 'el-radio',
                props: {
                    value: 'f'
                },
                slot: 'Женский'
            }
        ]
    },
    {
        component: 'el-checkbox',
        parentProps: {
            class: 'label_custom-color',
            label: 'Согласен на предоставление Cookie',
            prop: 'isAcceptedCookies'
        },
        model: 'isAcceptedCookies',
        props: {
            name: 'isAcceptedCookies'
        }
    },
    {
        component: 'el-checkbox',
        parentProps: {
            class: 'label_custom-color',
            label: 'Согласен с условиями лицензии',
            prop: 'isAcceptLicense'
        },
        model: 'isAcceptLicense',
        props: {
            name: 'isAcceptLicense'
        }
    }
])

const validatePass = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('Введите пароль!'))
    if (value.length < 8) callback(new Error('Пароль должен состоять минимум из 8 символов!'))
    if (value.length > 32) callback(new Error('Максимальная длинна пароля 32 символа!'))
    if (value.match(/\W[^\\.?!]/gi))
        callback(
            new Error('Пароль может состоять только из латинских букв, цифр и символов ".?!"!')
        )
    callback()
}
const validatePassRepeat = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('Введите пароль!'))
    if (value !== userCreate.password) callback(new Error('Пароли не совпадают!'))
    callback()
}

const rules = reactive<FormRules<I_UserCreate>>({
    email: [
        { required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' },
        {
            type: 'email',
            message: 'Введите корректный email!',
            trigger: ['blur']
        }
    ],
    phone: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
    password: [{ required: true, validator: validatePass, trigger: 'blur' }],
    passwordRepeat: [{ required: true, validator: validatePassRepeat, trigger: 'blur' }],
    firstName: [
        { required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' },
        { min: 2, max: 50, message: 'Длина должна быть от 2 до 50 символов', trigger: 'blur' }
    ],
    lastName: [
        { required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' },
        { min: 2, max: 50, message: 'Длина должна быть от 2 до 50 символов', trigger: 'blur' }
    ],
    middleName: [
        { required: false, message: 'Поле обязательно для заполнения', trigger: 'blur' },
        { min: 2, max: 50, message: 'Длина должна быть от 2 до 50 символов', trigger: 'blur' }
    ],
    birthDate: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
    sex: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const response = await getFetch('/api/v1/users/create', userCreate)
            if (response.statusCode === 200) {
                $mainStore.setAuthState(true)
                $mainStore.setUserData({ userId: response.data.id })
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
<style scoped lang="scss">
//@import "@/assets/global.scss";
.registration {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-image: url('../assets/image/registrationLogo.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: #f8f8f8;
    .form {
        height: 100vh;
        overflow-y: auto;
        padding: 1rem 5rem;
        color: #f8f8f8;
        background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
        border-radius: 6px;
        .info {
            margin: 2rem auto;
            color: $error;
        }
    }
}
.registration_footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
    font-size: 16px;
    cursor: default;
    .login_custom-btn {
        width: 100%;
        height: 2.2rem;
        font-size: 1rem;
        padding: 0.6rem;
        margin: 0;
    }
}
</style>
