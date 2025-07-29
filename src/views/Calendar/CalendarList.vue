<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import { blankEvent, useCalendar } from './actions/useCalendar';
import type { Event } from "./actions/types";

// import { useDarkMode } from '../../utils/DarkMode';
import { defineAsyncComponent, ref, watch } from 'vue'
import { useCalendarStore } from './actions/useCalendarStore';

const add = defineAsyncComponent(() => import('./modals/AddEvent.vue'))
const detail = defineAsyncComponent(() => import('./modals/DetailEvent.vue'))

// const { theme } = useDarkMode();
const store = useCalendarStore()
const today = ref<any>(Date.now())
const event = ref(structuredClone(blankEvent))
const isEventHandlerSidebarActive = ref<boolean>(false)
const isDetailActive = ref<boolean>(false)
const isDetailActiveAnother = ref<boolean>(false)
const searchFilter = ref<string>("")
const isMobile = ref<boolean>(window.innerWidth < 760)
const date = ref(new Date().toISOString().substr(0, 10))

const { refCalendar, calendarOptions, refetchEvents } = useCalendar(event,
    isEventHandlerSidebarActive, isDetailActive, isDetailActiveAnother, isMobile, date)

const dataCalendary = ref<Event[]>([])

const openNew = () => {
    event.value = blankEvent
    console.log(event.value.start)
    event.value.extendedProps.calendar = "Recordatorio"

    isEventHandlerSidebarActive.value = true
}

watch(() => store.listEvents, (newVal) => {
    dataCalendary.value = newVal
})

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

        <detail :show="isDetailActive" @close="isDetailActive = !isDetailActive" @refresh="refetchEvents" :event="event"
            @open-edit="isEventHandlerSidebarActive = true" />

        <div>
            <div class="w-1/5 p-2 gap-2" style="width: auto;">
                <n-button block type="primary" class="shadow mb-4" @click="openNew">
                    <j-icon w="w-[25px]" name="add" />
                    Agregar Evento
                </n-button>
                <n-date-picker panel type="date" v-model:value="today" :style="{ '--n-item-cell-width': '30px' }"
                    :actions="null" class="shadow" />

                <div class="flex flex-col gap-2 mt-4 mb-2">
                    <strong class="text-lg">Ultimos 5 Registros</strong>

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
                            <strong>{{ item.title }}</strong>
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
