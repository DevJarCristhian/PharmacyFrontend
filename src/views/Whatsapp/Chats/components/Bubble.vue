<script setup lang="ts">
import { computed } from 'vue';
import Check from './Check.vue';
import { formatDateLarge } from '../../../../utils/Functions';

interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  status?: boolean;
  img?: string;
  loading?: boolean;
}

const props = defineProps<ChatBubbleProps>();

const parsedMessage = computed(() => {
  const parseText = (text: string) => {
    text = text.replace(/\*(.*?)\*/g, '<b>$1</b>');

    text = text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>'
    );

    text = text.replace(/\n/g, '<br/>');

    return text;
  };

  return parseText(props.message);
});

</script>

<template>
  <div :class="['flex gap-2.5 mb-2 mx-auto', sender === 'user' ? 'justify-end' : 'justify-start']">
    <div class="grid">
      <div class="max-w-md grid">


        <div
          :class="['px-3 pt-0.5 rounded-xl shadow justify-start items-center text-black', sender === 'user' ? 'bg-[#d8fdd2]  rounded-tr-none' : 'bg-white  rounded-tl-none']">

          <div v-if="img && loading" class="relative">
            <div
              class="absolute top-40 left-44 z-10 flex items-center justify-center font-bold text-white bg-black/70 rounded-md p-2">
              Cargando...
            </div>
          </div>

          <n-image v-if="img" class="mt-1 w-full" :class="img && loading ? 'opacity-70 blur-sm' : ''" :src="img"
            hide-download />

          <h5 class="text-sm font-normal -mb-1" v-html="parsedMessage"></h5>

          <div class="items-center w-full inline-flex justify-end mr-5">
            <h6 class="text-gray-500/80 dark:text-gray-600/80 text-[11px] leading-4 mr-1">
              {{ formatDateLarge(timestamp) }}
            </h6>
            <Check v-if="sender === 'user'" :status="status" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
