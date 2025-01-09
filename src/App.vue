<script setup lang="ts">
import { onMounted, ref, watch, } from 'vue';
import mainRouter from './router';
import { useRouter } from 'vue-router';
import { useDarkMode } from './utils/DarkMode';
import { esAR, dateEsAR } from 'naive-ui'
import { light, dark } from './utils/Config';
import { authStores } from './store/auth';

const router = useRouter();
const store = authStores();
const { theme } = useDarkMode();
const setTheme = ref(theme.value ? light : dark);

watch(theme, () => {
    setTheme.value = theme.value ? light : dark;
});

onMounted(() => {
    if (localStorage.getItem("token")) {
        store.getUser();
        mainRouter.getRoutes().forEach(route => { router.addRoute(route); });
    } else {
        router.push('/login');
    }
});
</script>

<template>
    <div id="app">
        <n-config-provider :theme-overrides="setTheme" :locale="esAR" :date-locale="dateEsAR"
            class="text-gray-950 dark:text-white selection:bg-yellow-200 dark:selection:bg-yellow-400/40">
            <n-modal-provider>
                <n-message-provider>
                    <router-view />
                </n-message-provider>
            </n-modal-provider>
        </n-config-provider>
    </div>
</template>
