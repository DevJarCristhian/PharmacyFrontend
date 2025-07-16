<script lang="ts" setup>
import { ref } from 'vue'
import { useCalendarStore } from '../actions/useCalendarStore.ts';
import type { NewEvent } from '../actions/types.ts'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const props = defineProps({
    show: Boolean,
    event: Object as () => NewEvent,
});

const emit = defineEmits(['close', 'refresh', 'open-edit']);
const store = useCalendarStore()
const loading = ref<boolean>(false)


const closeModal = () => {
    emit("close");
};

const openEdit = () => {
    emit("open-edit");
    emit("close");
}

const setFormatDate = (date: Date | string, hour: string): string => {
    const dd = dayjs(date).format('DD/MM/YYYY')
    const day = dayjs(date).format('dddd')
    return day + " " + dd + ", de " + hour
}

</script>
<template>
    <!-- @pointerleave="closeModal()" -->
    <div v-if="show" class="floating-panel bg-white dark:bg-slate-800 py-2 px-3 rounded-lg shadow-lg">
        <div class="flex gap-2 justify-between items-center">
            <div class="text-lg font-semibold">
                <n-tag v-if="event.extendedProps.calendar === 'Recordatorio'" :bordered="false" type="warning"
                    size="small">
                    Recordatorio
                </n-tag>

                <n-tag v-else :bordered="false" type="info" size="small">
                    Programación
                </n-tag>
            </div>

            <div class="flex gap-3">
                <n-button text @click="openEdit()"> <j-icon w="w-[16px]" class=" text-gray-400 hover:text-blue-500"
                        name="edit" />
                </n-button>
                <n-button text @click="closeModal()">
                    <j-icon w="w-[28px]" class="rotate-45 text-gray-400 hover:text-red-500" name="add" />
                </n-button>
            </div>
        </div>
        <hr class="my-2" />

        <div class="flex flex-col gap-2">
            <strong class="text-lg">{{ event.title }}</strong>
            <div class="flex gap-2 items-center text-xs capitalize">
                <j-icon w="w-[16px]" name="clock" />
                {{ setFormatDate(event.start, event.extendedProps.timeStart) }}
            </div>

            <div class="flex gap-2 items-center text-xs">
                <j-icon w="w-[15px]" name="user" />
                {{ event.extendedProps.userCreated }}
            </div>

            <div class="flex gap-2 items-center text-xs">
                <j-icon w="w-[14px]" name="description" />
                {{ event.extendedProps.description }}
            </div>

            <div v-if="event.extendedProps.templateId" class="flex flex-col gap-2">
                <div class="flex gap-2 items-center text-xs">
                    <j-icon w="w-[14px]" name="template" />
                    {{ event.extendedProps.templateId }}
                </div>

                <div class="flex gap-2 items-center text-xs">
                    <j-icon w="w-[16px]" name="people" />
                    {{ event.extendedProps.totalPatients }} Pacientes
                </div>

                <div class="flex gap-2 items-center text-xs">
                    <n-tag :bordered="false" type="success" size="small">
                        Enviados {{ event.extendedProps.totalSending }}
                    </n-tag>

                    <n-tag :bordered="false" type="warning" size="small">
                        Pendientes {{ event.extendedProps.totalPending }}
                    </n-tag>

                    <n-tag :bordered="false" type="error" size="small">
                        No enviados {{ event.extendedProps.totalNot }}
                    </n-tag>
                </div>
            </div>

            <div class="flex gap-1 justify-end items-center opacity-35" style="font-size: 10px;">
                <j-icon w="w-[14px]" name="calendartime" />
                {{ event.extendedProps.createdDate }}
            </div>
        </div>

        <!-- <pre style="font-size: 9px;">{{ JSON.stringify(event, null, 2) }}</pre> -->
    </div>
</template>


<style scoped>
.floating-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
