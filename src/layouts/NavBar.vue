<script setup lang="ts">
import JIcon from '../components/JIcon.vue';
import { useDarkMode } from '../utils/DarkMode';
import { globalActions } from '../store/actions';
import { ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import authServices from '../services/auth.services';
import { authStores } from '../store/auth';
import { renderIcon } from '../utils/Functions';
import useSocket from '../utils/websocket/useWebsocket';
import { useCalendarStore } from '../views/Calendar/actions/useCalendarStore';

const { responseStatus, notify } = useSocket();
const { toggleDarkMode, theme } = useDarkMode();
const { user } = toRefs(authStores())

const storeCal = useCalendarStore()
const store = globalActions();
const router = useRouter();
const showNotify = ref<boolean>(false)
const showMessage = ref<boolean>(false)
const timeLeft = ref<number>(0);
const options = ref([
    {
        label: theme.value ? 'Modo Oscuro' : 'Modo Claro',
        key: 'theme',
        icon: theme.value ? renderIcon("moon") : renderIcon("sun")
    },
    {
        label: 'Cerrar sesión',
        key: 'logout',
        icon: renderIcon("logout")
    }
])

const handleSelect = async (key: string) => {
    if (key === 'logout') {
        await authServices.logout()
        localStorage.removeItem('token')
        router.push('/login');
    }
    if (key === 'theme') {
        toggleDarkMode()
        options.value[0].icon = theme.value ? renderIcon("moon") : renderIcon("sun")
        options.value[0].label = theme.value ? 'Modo Oscuro' : 'Modo Claro'
    }
}


storeCal.fetchNotifications()

setTimeout(() => {
    storeCal.fetchActiveWhastapp()
}, 300);

const offset = [-5, 2]

watch(responseStatus, () => {
    setTimeout(() => {
        storeCal.fetchActiveWhastapp()
    }, 2000);
});

watch(notify, () => {
    if (notify.value.type === 'notify') {
        storeCal.fetchNotifications()
        showNotify.value = true;
    } else {
        timeLeft.value = 4;
    }
});

setInterval(async () => {
    if (timeLeft.value > 0) {
        timeLeft.value--;
    }
}, 1000);

watch(timeLeft, (newTimeLeft) => {
    showMessage.value = newTimeLeft === 0 ? false : true;
});

</script>

<template>
    <div class="flex justify-between h-14 w-full p-2 px-4 bg-white dark:bg-gray-900 drop-shadow-md z-10">
        <div class="flex items-center">
            <button @click="store.setCollapsed()"
                class="opacity-70 hover:bg-slate-200/60 dark:hover:bg-gray-800 rounded-md p-2">
                <j-icon name="menu" />
            </button>
            <span class="">
                <img width="120px" src="../assets/logo.webp" alt="">
            </span>
        </div>

        <div class="flex items-center gap-2">
            <!-- <span class="text-sm opacity-70  bg-slate-400/10 dark:bg-gray-700/20 rounded-md px-3 py-1">
                Test de Hora: <strong>{{ timeTest.time }}</strong>
            </span> -->
        </div>

        <div class="flex items-center gap-1">
            <div class="flex items-center gap-2">
                <n-tag round :bordered="false" :type="storeCal.activeWhatsapp === 'Conectado' ? 'success' : 'error'">
                    <div class="flex items-center gap-1 group">
                        <div>
                            <j-icon w="w-[20px]" name="comunication" />
                        </div>

                        <div class="hidden group-hover:block text-xs select-none font-semibold">
                            {{ storeCal.activeWhatsapp }}
                        </div>
                    </div>
                </n-tag>

                <n-popover placement="bottom" style="max-height: 300px; width: 280px; border-radius: 8px;"
                    content-style="padding: 0;" trigger="click" scrollable>
                    <template #trigger>
                        <button class=" hover:bg-slate-200/60 dark:hover:bg-gray-800 rounded-md p-2"
                            @click="showNotify = false">
                            <n-badge dot :type="showNotify ? 'success' : 'white'" :offset="offset">
                                <j-icon name="bell" class="opacity-60" />
                            </n-badge>
                        </button>
                    </template>

                    <div v-if="storeCal.notify.length > 0" v-for="(item, index) in storeCal.notify" :key="index"
                        class="group">
                        <div
                            class="flex flex-col py-1 group-hover:bg-slate-100/70 dark:group-hover:bg-gray-700/40 px-2">
                            <div class="flex items-center gap-1">
                                <j-icon w="w-[20px]" name="calendar" />
                                <strong> {{ item.title }}
                                </strong>
                            </div>

                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-1">
                                    <span>
                                        {{ item.message }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between gap-2 my-1">
                                <div class="flex items-center gap-1 text-xs">
                                    <j-icon w="w-[16px]" name="clock" />
                                    <span>
                                        {{ item.createdAt }}
                                    </span>
                                </div>

                                <n-tag :bordered="false" :type="item.status === 'Finalizado' ? 'success' : 'warning'"
                                    size="x-small" class="text-xs">
                                    {{ item.status }}
                                </n-tag>
                            </div>

                            <hr class="border-spacing-1 border-gray-200 dark:border-slate-700 mt-1" />
                        </div>
                    </div>

                    <div v-else class="flex items-center justify-center p-2 h-32">
                        <span class="opacity-55 text-sm">Sin Notificaciones</span>
                    </div>
                </n-popover>
            </div>

            <n-dropdown trigger="click" :show-arrow="true" :options="options" @select="handleSelect">
                <div class="flex items-center gap-2 cursor-pointer select-none">
                    <div class="opacity-70 bg-slate-200/60 dark:bg-gray-800 rounded-md p-1.5">
                        <j-icon name="profile" />
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="grid grid-cols-1 items-center -space-y-1  -mt-1">
                            <div class="text-sm font-medium">
                                {{ user.name }}
                            </div>
                            <div class="text-xs opacity-55">
                                {{ user.role }}
                            </div>
                        </div>
                        <div class="opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 3.586L17.414 9L16 10.414l-4-4l-4 4L6.586 9zm-4 10l4 4l4-4L17.414 15L12 20.414L6.586 15z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </n-dropdown>
        </div>

        <div v-if="showMessage"
            class="fixed right-1/3 top-2 z-50 bg-white dark:bg-slate-700 p-2 w-56 h-10 rounded-md drop-shadow-md">
            <div class="flex items-center center gap-2">
                <j-icon w="w-[18px]" name="check" />
                <span>Mensaje Enviado con exito.</span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>