<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import { blankEvent, useCalendar } from './actions/useCalendar';
// import { useDarkMode } from '../../utils/DarkMode';
import { ref } from 'vue'

// const { theme } = useDarkMode();
const today = ref<any>(Date.now())
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref<boolean>(false)
const isDetailActive = ref<boolean>(false)
const isDetailActiveAnother = ref<boolean>(false)
const isMobile = ref<boolean>(window.innerWidth < 760)
const date = ref(new Date().toISOString().substr(0, 10))
// const { isLeftSidebarOpen } = useResponsiveLeftSidebar()

// const { refCalendar, calendarOptions, refetchEvents, removeEventInCalendar, jumpToDate } = useCalendar(event, isEventHandlerSidebarActive, isDetailActive, isDetailActiveAnother, isLeftSidebarOpen, isMobile, date)
const { refCalendar, calendarOptions } = useCalendar(event,
    isEventHandlerSidebarActive, isDetailActive, isDetailActiveAnother, isMobile, date)

</script>

<template>
    <div class="flex-grow gap-2 w-full bg-white dark:bg-gray-900 shadow p-2 rounded-md h-[90vh] overflow-hidden flex">

        <div class="w-1/5 p-2 gap-2" style="width: auto;">
            <n-button block type="primary" class="shadow mb-4">
                <j-icon w="w-[14px]" name="add" />
                Agregar Evento
            </n-button>
            <n-date-picker panel type="date" v-model:value="today" :style="{ '--n-item-cell-width': '30px' }"
                :actions="null" class="shadow" />
        </div>
        <div class="md:w-4/5 w-full p-1">
            <FullCalendar ref="refCalendar" :options="calendarOptions" style="min-height: 100%;"
                :style="{ '--fc-button-bg-color': '#404e66' }" />
        </div>
    </div>
</template>

<style>
.dark .fc-theme-standard .fc-scrollgrid {
    border: 1px solid #2c384e;
}

.dark .fc-theme-standard td,
.dark .fc-theme-standard th {
    border: 1px solid #2c384e;
}
</style>
