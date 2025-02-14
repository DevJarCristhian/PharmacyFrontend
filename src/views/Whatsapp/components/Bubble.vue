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
          :class="['px-3.5 py-2 rounded-3xl justify-start items-center gap-3 text-black', sender === 'user' ? 'bg-[#d8fdd2]  rounded-tr-none' : 'bg-gray-100  rounded-tl-none']">
          <h5 class="text-sm font-normal">{{ message }}</h5>
        </div>
        <div :class="['items-center inline-flex mx-4', sender === 'user' ? 'justify-end' : 'justify-start']">
          <Check v-if="sender === 'user'" :status="status" />
          <h6 class="text-gray-500 text-xs font-normal leading-4 py-1">
            {{ formatDateLarge(timestamp) }}
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aquí puedes agregar tus estilos personalizados si los necesitas */
</style>
