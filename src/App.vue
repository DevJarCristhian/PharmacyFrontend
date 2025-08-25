<script setup lang="ts">
import { onMounted, ref, watch, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDarkMode } from './utils/DarkMode';
import { esAR, dateEsAR } from 'naive-ui'
import { light, dark } from './utils/Config';
import { authStores } from './store/auth';

const router = useRouter();
const store = authStores();
const route = useRoute();
const { theme } = useDarkMode();
const setTheme = ref(theme.value ? light : dark);

watch(theme, () => {
    setTheme.value = theme.value ? light : dark;
});

onMounted(async () => {
    if (localStorage.getItem("token")) {
        await store.getUser();
        const permissions = await store.user.permissions;

        const filteredRoutes = router.options.routes
            .map(route => ({
                ...route,
                children: route.children?.filter(child =>
                    permissions.some(v => v.name === child.name))
            }))
            .filter(route => !route.children || route.children.length > 0);

        const verify = filteredRoutes
            .flatMap(route => route.children || [])
            .find(child => child.name === route.name);

        router.push(verify ? verify.path : '/not-found');
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
