<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import { blankEvent, useCalendar } from './actions/useCalendar';
import type { Event } from "./actions/types";

import { defineAsyncComponent, ref, watch } from 'vue'
import { useCalendarStore } from './actions/useCalendarStore';

const add = defineAsyncComponent(() => import('./modals/AddEvent.vue'))
const detail = defineAsyncComponent(() => import('./modals/DetailEvent.vue'))

const store = useCalendarStore()
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref<boolean>(false)
const isDetailActive = ref<boolean>(false)
const isDetailActiveAnother = ref<boolean>(false)
const searchFilter = ref<string>("")
const isMobile = ref<boolean>(window.innerWidth < 760)
const date = ref(new Date().toISOString().substr(0, 10))

const { refCalendar, calendarOptions, refetchEvents, jumpToDate } = useCalendar(event,
    isEventHandlerSidebarActive, isDetailActive, isDetailActiveAnother, isMobile, date)

const dataCalendary = ref<Event[]>([])

const openNew = () => {
    event.value = blankEvent
    event.value.extendedProps.calendar = "Recordatorio"

    isEventHandlerSidebarActive.value = true
}

watch(() => store.listEvents, (newVal) => {
    dataCalendary.value = newVal
})

watch(date, () => {
    jumpToDate(date.value)
});

const searchData = () => {
    if (searchFilter.value.length === 0) {
        dataCalendary.value = store.listEvents;
        return;
    } else {
        dataCalendary.value = store.listEvents.filter((item) =>
            (item.title.toLowerCase().includes(searchFilter.value.toLowerCase()))
        );
    }
}
</script>

<template>
    <div class="flex-grow gap-2 w-full bg-white dark:bg-gray-900 shadow p-2 rounded-md h-[90vh] overflow-hidden flex">
        <add :show="isEventHandlerSidebarActive" @close="isEventHandlerSidebarActive = !isEventHandlerSidebarActive"
            @refresh="refetchEvents" :event="event" />

        <detail :show="isDetailActive" @close="isDetailActive = !isDetailActive" @refresh="refetchEvents"
            :event="event as Event" @open-edit="isEventHandlerSidebarActive = true" />

        <div>
            <div class="w-1/5 p-2 gap-2" style="width: auto;">
                <n-button block type="primary" class="shadow mb-4" @click="openNew">
                    <j-icon w="w-[25px]" name="add" />
                    Agregar Evento
                </n-button>
                <n-date-picker panel type="date" v-model:formatted-value="date"
                    :style="{ '--n-item-cell-width': '30px' }" value-format="yyyy-MM-dd" :actions="null"
                    class="shadow" />

                <div class="flex flex-col gap-2 mt-4 mb-2">
                    <strong class="text-lg opacity-55">Ultimos Registros</strong>

                    <n-input v-model:value="searchFilter" @input="searchData" placeholder="Buscar Evento" size="small">
                        <template #prefix>
                            <j-icon w="w-[14px]" name="search" />
                        </template>
                    </n-input>
                </div>
            </div>

            <n-scrollbar style="max-height: 43vh; min-height: 43vh;"
                class="bg-gray-50/40 dark:bg-gray-900/40 rounded-md px-3">

                <div v-for="item in dataCalendary" :key="item.id">
                    <div class="flex flex-col gap-1">
                        <div>
                            <strong class="opacity-55">{{ item.title }}</strong>
                        </div>

                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-1">
                                <j-icon w="w-[15px]" name="clock" />
                                <span>
                                    {{ item.extendedProps.timeStart }} {{ item.extendedProps.istart }}
                                </span>
                            </div>
                            <div v-if="item.extendedProps.calendar !== 'Recordatorio'" class="flex items-center gap-1">
                                <j-icon w="w-[17px]" name="people" />
                                <span>{{ item.extendedProps.totalPatients }}</span>
                            </div>
                        </div>

                        <div style="max-width: 230px;">
                            {{ item.extendedProps.description }}
                        </div>

                        <div class="flex items-center gap-2 mb-1">
                            <n-tag v-if="item.extendedProps.calendar === 'Recordatorio'" :bordered="false"
                                type="warning" size="small">
                                Recordatorio
                            </n-tag>

                            <n-tag v-else :bordered="false" type="info" size="small">
                                Programación
                            </n-tag>

                            <n-tag v-if="item.extendedProps.calendar === 'Programación'" :bordered="false"
                                :type="item.extendedProps.status == 'Ejecutando' ? 'warning' : item.extendedProps.status == 'Finalizado' ? 'success' : ''"
                                size="small">
                                {{ item.extendedProps.status }}
                            </n-tag>
                        </div>

                        <hr class="border-spacing-1 border-gray-200 dark:border-slate-800" />
                    </div>
                </div>

                <div v-if="store.listEvents.length === 0" class="flex items-center justify-center h-full">
                    <svg class="opacity-5" xmlns="http://www.w3.org/2000/svg" width="52" height="52"
                        viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5h9a2 2 0 0 1 2 2v9m-.184 3.839A2 2 0 0 1 18 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 1.158-1.815M16 3v4M8 3v1m-4 7h7m4 0h5M3 3l18 18" />
                    </svg>
                </div>
            </n-scrollbar>
        </div>

        <div class="md:w-4/5 w-full py-2">
            <FullCalendar ref="refCalendar" :options="calendarOptions"
                class="rounded-2xl bg-white/90 dark:bg-gray-900/90  overflow-hidden" :style="{
                    '--fc-button-bg-color': '#B88746',
                    '--fc-button-border-color': 'transparent',
                    '--fc-button-hover-bg-color': '#C69B57',
                    '--fc-button-hover-border-color': 'transparent',
                    '--fc-button-active-bg-color': '#A77535',
                    '--fc-today-bg-color': '#B88746/5',
                    '--fc-event-bg-color': '#B88746',
                    '--fc-event-border-color': 'transparent',
                    '--fc-highlight-color': '#B88746/10',
                    '--fc-border-color': '#E5E7EB',
                    '--fc-page-bg-color': 'transparent',
                }" />
        </div>
    </div>
</template>

<style>
.fc .fc-button {
    @apply text-white font-medium tracking-wide px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm bg-opacity-90;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
    @apply transform scale-95 shadow-inner bg-opacity-100 ring-2 ring-amber-200/20;
}

.fc .fc-toolbar-title {
    @apply text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent;
}

.fc-theme-standard .fc-scrollgrid {
    @apply border border-gray-200/60 dark:border-amber-200/70;
}

.fc-theme-standard td,
.fc-theme-standard th {
    @apply border border-gray-200/60 dark:border-amber-200/70;
}

.fc-day-today {
    @apply bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/10 dark:to-transparent !important;
}

.fc-event {
    @apply cursor-pointer rounded-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:ring-2 hover:ring-amber-200/30 !important;
}

/* Header buttons group */
.fc .fc-button-group {
    @apply rounded-lg overflow-hidden shadow-lg;
}

.fc .fc-button-group .fc-button {
    @apply border-r border-amber-400/20 last:border-r-0;
}

/* Today button special styling */
.fc .fc-today-button {
    @apply bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400;
}

/* Dark mode adjustments */
.dark .fc-theme-standard .fc-scrollgrid,
.dark .fc-theme-standard td,
.dark .fc-theme-standard th {
    @apply border-amber-900/10;
}

.dark .fc-toolbar-title {
    @apply bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text;
}

.dark .fc-button-primary {
    @apply text-gray-900 bg-opacity-95;
}

/* Additional elegant touches */
.fc .fc-daygrid-day-number {
    @apply font-medium text-amber-900/70 dark:text-amber-100/70;
}

.fc .fc-col-header-cell-cushion {
    @apply font-semibold text-amber-800 dark:text-amber-200;
}

/* Hover effects on days */
.fc-day:hover {
    @apply bg-amber-50/50 dark:bg-amber-900/5 transition-colors duration-200;
}

/* Event time indicators */
.fc-event-time {
    @apply font-medium opacity-90;
}

/* More elegant scrollbar */
.fc-scroller {
    @apply transition-colors duration-200;
}

.fc-scroller::-webkit-scrollbar {
    @apply w-2 h-2;
}

.fc-scroller::-webkit-scrollbar-track {
    @apply bg-amber-50/50 dark:bg-amber-900/20 rounded-full;
}

.fc-scroller::-webkit-scrollbar-thumb {
    @apply bg-amber-200 dark:bg-amber-700 rounded-full hover:bg-amber-300 dark:hover:bg-amber-600;
}
</style>
