<script setup lang="ts">
import { formatDateLa } from '../../../../utils/Functions';
import Check from './Check.vue';

interface MessageProps {
    message: string;
    count?: number;
    timestamp: string;
    avatar?: string;
    name: string;
    mediaType?: string;
    fromMe: number;
}

defineProps<MessageProps>();
</script>

<template>
    <div
        class="flex p-2  px-3 items-center gap-2.5 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800/50">
        <div class="relative block min-w-[40px] min-h-[40px]">
            <img v-if="avatar" class="w-10 h-10 rounded-full object-cover" :alt="name" :src="avatar" />
            <j-icon v-else w="w-[41px]" name="userDefault" />
        </div>

        <div class="flex flex-col w-full border-b dark:border-slate-700/60 -mt-1 p-1">
            <div class="flex items-center justify-between">
                <span class="font-medium">{{ name }}</span>
                <span class="text-xs text-gray-400">{{ formatDateLa(timestamp, "short") }}</span>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <Check v-if="fromMe == 1" :status="false" />
                    <j-icon v-if="mediaType == 'image'" w="w-[14px] opacity-60 mr-1" name="img" />

                    <span class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{{ message }}</span>
                </div>
                <div v-if="count"
                    class="flex justify-center align-middle min-w-4 min-h-4 rounded-full font-bold text-[9px] text-white bg-green-500">
                    {{ count }}
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>