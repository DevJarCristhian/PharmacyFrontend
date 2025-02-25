<script setup lang="ts">
import { defineProps } from 'vue';
import Check from './Check.vue';
import { formatDateLarge } from '../../../utils/Functions';

interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  status?: boolean;
  name?: string;
}

defineProps<ChatBubbleProps>();
</script>

<template>
  <div :class="['flex gap-2.5 mb-2 mx-auto', sender === 'user' ? 'justify-end' : 'justify-start']">
    <div class="grid">
      <h5
        :class="['items-center inline-flex text-sm font-semibold text-white pb-0.5', sender === 'user' ? 'justify-end' : 'justify-start']">
        {{ name }}
      </h5>
      <div class="max-w-md grid">
        <div
          :class="['px-3 pt-0.5 rounded-xl shadow justify-start items-center  text-black', sender === 'user' ? 'bg-[#d8fdd2]  rounded-tr-none' : 'bg-white  rounded-tl-none']">
          <h5 class="text-sm font-normal -mb-1">{{ message }}</h5>

          <div class="items-center inline-flex justify-end ml-5">
            <h6 class="text-gray-500/80 dark:text-gray-600/80 text-[11px] leading-4  mr-1">
              {{ formatDateLarge(timestamp) }}
            </h6>
            <Check v-if="sender === 'user'" :status="status" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Aquí puedes agregar tus estilos personalizados si los necesitas */
</style>
