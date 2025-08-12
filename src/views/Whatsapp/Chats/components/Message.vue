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
    <div class="message-container group">
        <div class="relative flex min-w-[40px] min-h-[40px] transition-all duration-300 group-hover:scale-110">
            <img v-if="avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-yellow-400/30 
                       shadow-md hover:shadow-yellow-400/20" :alt="name" :src="avatar" loading="lazy" />
            <j-icon v-else w="w-[41px]" name="userDefault" class="text-gray-400 group-hover:text-yellow-500" />
        </div>

        <div class="hidden sm:flex flex-col w-full border-b dark:border-slate-700/60 p-2 transition-all duration-300 
                    group-hover:border-yellow-400/20">

            <div class="flex items-center justify-between">
                <span class="font-medium transition-all duration-300 group-hover:text-yellow-500">
                    {{ name }}
                </span>
                <span class="text-[10px] text-gray-400 transition-all duration-300 group-hover:text-yellow-500/70">
                    {{ formatDateLa(timestamp, "large") }}
                </span>
            </div>

            <div class="flex items-center justify-between mt-0.5">
                <div class="flex items-center gap-1">
                    <Check v-if="fromMe == 1" :status="false"
                        class="transition-all duration-300 group-hover:scale-110" />
                    <j-icon v-if="mediaType == 'image'" w="w-[14px]" name="img"
                        class="opacity-60 mr-1 transition-all duration-300 group-hover:opacity-100" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 transition-all duration-300 
                               group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        {{ message }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-container {
    @apply flex md:px-3 py-0.5 items-center gap-2 select-none cursor-pointer transition-all duration-300 ease-out relative overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50;
}

/* Entrance animation */
/* @keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.message-container {
    animation: slideIn 0.3s ease-out;
} */

@media (max-width: 640px) {
    .message-container {
        @apply p-1 px-2 justify-center;
    }

}
</style>