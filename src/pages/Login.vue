<script setup lang="ts">
import authServices from '../services/auth.services';
import { authStores } from '../store/auth';
import { FormInst, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const router = useRouter();
const message = useMessage()
const store = authStores()
const form = ref<{ email: string, password: string }>({
  email: '',
  password: '',
})

const login = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        loading.value = true
        const response = await authServices.login(form.value)
        // console.log("here", response);
        if (response.token) {
          localStorage.setItem('token', response.token)
          localStorage.removeItem("tokenRemoved");
          message.success('Bienvenido al Sistema')
          await store.getUser()
          setTimeout(() => {
            if (store.user.permissions) {
              if (store.user.permissions.find(e => e.name === 'dashboard')) {
                router.push('/dashboard')
              } else {
                router.push(`/${store.user.permissions[0].name}`)
              }
            }
          }, 300)
        }
      } catch (error) {
        console.log(error);
        message.error("Usuario o contraseña incorrectos.")
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 400)
      }
    }
    else {
      message.warning('Ingresa tus credenciales correctamente')
    }
  })
}

const rules = {
  email:
    [
      { required: true, message: "Correo Requerido", trigger: 'blur' },
      { type: 'email', message: "Ingresa un correo valido", trigger: 'blur' }
    ],
  password: [
    { required: true, message: "Contraseña Requerida", trigger: "blur", },
    { min: 6, message: 'La constraseña debe ser mayor a 6 caracteres', trigger: 'blur' }
  ],

};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#FFD100FF]/10 via-white to-[#FFD100FF]/20 dark:from-gray-900 dark:via-[#343844]/5 dark:to-gray-900 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-4xl">
      <!-- Glass Card Effect -->
      <div class="backdrop-blur-lg md:bg-white/90 dark:bg-gray-900/80 rounded-3xl overflow-hidden md:shadow-lg ">
        <div class="grid md:grid-cols-2">
          <div class="p-8 lg:p-12">
            <div class="max-w-sm mx-auto">
              <div class="flex justify-center mb-3 animate-fade-in">
                <img class="h-16 w-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3"
                  src="../assets/short.webp" alt="Logo">
              </div>

              <div class="text-center mb-10">
                <h2
                  class="text-3xl font-bold bg-gradient-to-r from-[#FFD100FF] to-[#FCD939FF] bg-clip-text text-transparent">
                  Bienvenido
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  Ingresa a tu cuenta para continuar
                </p>
              </div>

              <n-form ref="formRef" :rules="rules" v-model:model="form" class="space-y-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium -mb-7 text-gray-700 dark:text-gray-300">
                    Correo Electrónico
                  </label>
                  <n-form-item path="email">
                    <n-input v-model:value="form.email" size="large" placeholder="correo@ejemplo.com"
                      @keydown.enter="login" class="rounded-xl">
                      <template #prefix>
                        <j-icon name="profile" w="w-5" class="text-[#FFD100FF]" />
                      </template>
                    </n-input>
                  </n-form-item>
                </div>

                <!-- Password Input -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium -mb-7 text-gray-700 dark:text-gray-300">
                    Contraseña
                  </label>
                  <n-form-item path="password">
                    <n-input v-model:value="form.password" size="large" type="password"
                      placeholder="Ingrese su contraseña" show-password-on="click" @keydown.enter="login"
                      class="rounded-xl">
                      <template #prefix>
                        <j-icon name="pass" w="w-5" class="text-[#FFD100FF]" />
                      </template>
                    </n-input>
                  </n-form-item>
                </div>

                <n-button type="primary" :loading="loading"
                  class="w-full py-5 mt-6 text-base font-semibold rounded-xl bg-[#FFD100FF] hover:bg-[#FCD939FF] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm"
                  @click="login">
                  <span class="flex items-center justify-center space-x-2">
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                  </span>
                </n-button>
              </n-form>
            </div>
          </div>

          <div class="hidden md:block bg-gradient-to-br from-[#ffe058] to-[#fadb99]">
            <div class="h-full flex items-center justify-center p-12">
              <div class="relative animate-fade-in">
                <img
                  class="relative max-w-xs w-full transform transition-all duration-700 hover:scale-105 hover:rotate-1"
                  src="../assets/logo.webp" alt="Logo">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.n-input {
  @apply transition-all duration-300 bg-white/50 dark:bg-gray-800/50;
}

.n-input:hover {
  @apply shadow-lg shadow-[#FFD100FF]/10 dark:shadow-[#FFD100FF]/5;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>