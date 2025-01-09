<script setup lang="ts">
import NavBar from '../layouts/NavBar.vue';
import SideBar from '../layouts/SideBar.vue';

</script>

<template>
    <div class="flex flex-col h-screen">
        <NavBar />
        <div class="flex flex-1 overflow-hidden bg-zinc-50 dark:bg-[#141D2C]">
            <SideBar />
            <n-scrollbar class="flex-1 overflow-y-auto p-4">
                <router-view v-slot="{ Component }">
                    <transition name="fade-slide" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </n-scrollbar>
        </div>
    </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
