<script lang="ts" setup>
import type { Event } from '../actions/types.ts'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import calendarServices from '../actions/calendar.services'
import { ref } from 'vue';
import { PatientSend } from '../actions/calendar.interfaces.ts';

dayjs.locale('es');

const props = defineProps({
    show: Boolean,
    event: Object as () => Event,
});

const emit = defineEmits(['close', 'refresh', 'open-edit']);
const patientSend = ref<PatientSend[]>([])
const showH = ref<boolean>(false);

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

const showHistory = async () => {
    const id = props.event.id;
    showH.value = true;
    const response = await calendarServices.getPatientCalendarId(id)
    patientSend.value = response
    // console.log(response);
}

</script>
<template>
    <!-- @pointerleave="closeModal()" -->
    <div v-if="show" class="floating-panel bg-white dark:bg-slate-800 py-2 px-3 rounded-lg">
        <div class="flex gap-2 justify-between items-center  border-b-2 border-gray-200/80 dark:border-gray-700 pb-2">
            <div class="flex gap-2 text-lg font-semibold">
                <n-tag v-if="event.extendedProps.calendar === 'Recordatorio'" :bordered="false" type="warning"
                    size="small">
                    Recordatorio
                </n-tag>

                <n-tag v-else :bordered="false" type="info" size="small">
                    Programación
                </n-tag>

                <n-tag :bordered="false"
                    :type="event.extendedProps.status == 'Finalizado' ? 'success' : event.extendedProps.status == 'En Proceso' ? '' : 'info'"
                    size="small" round>
                    {{ event.extendedProps.status }}
                </n-tag>
            </div>

            <div class="flex gap-3">
                <n-button v-if="event.extendedProps.status === 'Pendiente'" text @click="openEdit()"> <j-icon
                        w="w-[16px]" class=" text-gray-400 hover:text-gray-500" name="edit" />
                </n-button>

                <n-button v-else text @click="showHistory()">
                    <j-icon w="w-[19px]" class="text-gray-400 hover:text-gray-500" name="history" />
                </n-button>


                <n-button text @click="closeModal()">
                    <j-icon w="w-[28px]" class="rotate-45 text-gray-400 hover:text-red-500" name="add" />
                </n-button>
            </div>
        </div>

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
                        No Enviados {{ event.extendedProps.totalNot }}
                    </n-tag>
                </div>
            </div>

            <div class="flex gap-1 justify-end items-center opacity-35" style="font-size: 10px;">
                <j-icon w="w-[14px]" name="calendartime" />
                {{ event.extendedProps.createdDate }}
            </div>
        </div>

        <div v-if="showH" class="modal-history bg-white dark:bg-slate-800 py-2 px-3 rounded-lg">
            <div class="flex justify-between items-center ">
                <strong class="text-lg opacity-55">Historial de Envio ({{ patientSend.length }})</strong>
                <n-button text @click="showH = false">
                    <j-icon w="w-[28px]" class="rotate-45 text-gray-400 hover:text-red-500" name="add" />
                </n-button>
            </div>

            <n-scrollbar style="max-height: 415px; min-height: 415px;">
                <div v-if="patientSend.length > 0" v-for="item in patientSend" :key="item.id" class="flex justify-between items-center px-2 py-1 hover:bg-gray-100/70
                     dark:hover:bg-gray-900/60 cursor-pointer border-b border-gray-200 dark:border-gray-700 group">
                    <div>
                        <strong>{{ item.namePatient }}</strong>
                        <div class="text-sm text-gray-500 dark:text-gray-400 flex gap-1 items-center -mt-1">
                            <span>Celular: {{ item.phone }}</span>
                        </div>
                    </div>
                    <n-tag :bordered="false"
                        :type="item.status == 'Enviado' ? 'success' : item.status == 'Pendiente' ? 'primary' : 'error'"
                        size="small" round>
                        {{ item.status }}
                    </n-tag>
                </div>

                <div v-else class="flex flex-col gap-1 mt-24 items-center justify-center opacity-70">
                    <n-spin size="small" />
                </div>
            </n-scrollbar>
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
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
}

.modal-history {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    border-radius: 8px;
    width: 400px;
    height: 500px;
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
}
</style>
