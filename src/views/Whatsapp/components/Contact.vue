<script setup lang="ts">
import { defineProps } from 'vue';

interface ContactProps {
    number: string;
    profilePicUrl?: string;
    name: string;
}

defineProps<ContactProps>();
</script>

<template>
    <div
        class="flex p-2  px-3 items-center gap-2.5 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800/50">
        <div class="relative block min-w-[40px] min-h-[40px]">
            <img v-if="profilePicUrl" class="w-10 h-10 rounded-full object-cover" :alt="name" :src="profilePicUrl" />
            <j-icon v-else w="w-[41px]" name="userDefault" />
        </div>

        <div class="flex w-full items-center justify-between border-b dark:border-slate-700/60 -mt-1 p-1">
            <div class="flex flex-col">
                <div class="font-medium">{{ name }}</div>
                <span class="text-sm text-gray-500 dark:text-gray-4001">{{ number }}</span>
            </div>

            <n-button type="success" size="small">
                Iniciar chat
            </n-button>
        </div>
    </div>
</template>
