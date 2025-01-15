<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'


const today = ref<any>(Date.now())

const handleDateClick = (arg) => {
    alert('date click! ' + arg.dateStr)
}

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: [
        { title: 'event 1', date: '2025-01-09' },
        { title: 'event 2', date: '2025-01-16' }
    ],
}

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
            <FullCalendar :options="calendarOptions" style="min-height: 100%;" />
        </div>
    </div>
</template>

<style scoped></style>