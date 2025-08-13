<script setup lang="ts">
import { globalActions } from '../store/actions';
import { RouterLink, useRoute } from "vue-router";
import { h, onMounted, ref, toRefs, watch } from 'vue';
import JIcon from '../components/JIcon.vue';
import { authStores } from '../store/auth';
import navigations from '../router/navigations';

const route = useRoute();
const { routes } = toRefs(authStores());
const store = globalActions();
const { collapsed } = toRefs(store);

const activeKey: string = (route.name as string) || "";
const selectedKeys = ref<string>(activeKey);
const openKeys = ref<string[]>();
const isMobile = ref<boolean>(window.innerWidth < 768);
const menus = ref<any[]>(routes.value);

onMounted(() => {
    window.addEventListener('resize', updateMobileStatus);
});

watch(routes, () => {
    menus.value = routes.value;
    // collapsed.value = isMobile.value ? false : true;
});

const updateMobileStatus = () => { isMobile.value = window.innerWidth < 768; };

const expandKey = () => {
    const key = navigations
        .filter(item => item.key === route.name || (item.children && item.children.some(child => child.key === route.name)))
        .map(item => item.key)[0];
    openKeys.value = [key];
}
expandKey();

const renderMenuIcon = (option: any) => {
    if (!!option.i) {
        return h(JIcon, {
            name: option.i,
            class: 'menu-icon'
        });
    }
    return null;
};

const renderMenuLabel = (option: any) => {
    if (!!option.href) {
        return h(RouterLink,
            {
                to: option.href,
                class: 'menu-link-wrapper'
            },
            () => h("div",
                {
                    class: "menu-label-content",
                },
                option.label
            )
        );
    }
    return h("div",
        {
            class: "menu-label-content",
        },
        option.label
    );
};
</script>

<template>
    <div class="side-container bg-white dark:bg-gray-900 dark:border-r select-none dark:border-gray-800/80 drop-shadow h-full hidden md:block"
        :class="{ 'w-44': !collapsed, 'w-16': collapsed }">
        <n-menu :render-label="renderMenuLabel" :render-icon="renderMenuIcon" :collapsed="collapsed"
            :collapsed-width="64" :collapsed-icon-size="22" :options="menus" accordion v-model:value="selectedKeys"
            :default-expanded-keys="openKeys" />
    </div>

    <n-drawer v-if="isMobile" v-model:show="collapsed" width="12rem" placement="left">
        <div
            class="fixed inset-y-0 left-0 w-48 bg-white dark:bg-gray-900 dark:border-r select-none dark:border-gray-800/80 drop-shadow py-4">
            <span class="flex items-center justify-center my-2">
                <img width="120px" src="../assets/logo.webp" alt="">
            </span>
            <n-menu :render-label="renderMenuLabel" :render-icon="renderMenuIcon" :collapsed="false" :width="64"
                :options="menus" accordion v-model:value="selectedKeys" />
        </div>
    </n-drawer>
</template>

<style scoped>
.menu-label-content {
    @apply relative transition-all duration-300 ease-out;
}

.menu-icon {
    @apply transition-all duration-300 ease-out;
}

:deep(.n-menu-item-content) {
    @apply transition-all duration-300;
}

:deep(.n-menu-item-content:hover) {

    .menu-label-content,
    .menu-icon {
        @apply translate-x-2;
    }
}

:deep(.n-menu-item-content-header:hover) {

    .menu-label-content,
    .menu-icon {
        @apply translate-x-2;
    }
}

/* Deshabilitar el efecto cuando el sidebar está colapsado */
.w-16 :deep(.n-menu-item-content:hover) {

    .menu-label-content,
    .menu-icon {
        @apply translate-x-0;
    }
}

/* Mejora la transición del color */
:deep(.n-menu-item-content) {
    @apply transition-colors duration-300 ease-in-out;
}


/* Disable effects when sidebar is collapsed */
.w-16 :deep(.n-menu-item-content:hover) {

    .menu-label-content,
    .menu-icon {
        @apply translate-x-0;
    }
}

/* Add subtle ripple effect */
:deep(.n-menu-item-content::before) {
    content: '';
    @apply absolute bg-[#FFD100FF]/0 transition-all duration-300 ease-out;
}

:deep(.n-menu-item-content:hover::before) {
    @apply bg-[#FFD100FF]/5;
}

/* Smooth transition for all interactive elements */
:deep(.n-menu-item-content),
:deep(.n-menu-item-content *) {
    @apply transition-all duration-300 ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.side-container {
    animation: slideIn 0.2s ease-out;
}
</style>
