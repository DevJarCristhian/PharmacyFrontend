<script lang="ts" setup>
import { defineAsyncComponent, onMounted, onUpdated, ref } from 'vue'
import calendarServices from '../actions/calendar.services'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useCalendarStore } from '../actions/useCalendarStore';
import type { Event, NewEvent } from '../actions/types.ts'
import whatsappServices from '../../../services/whatsapp/whatsapp.services.ts';
import { PatientSend, GetPatient } from '../actions/calendar.interfaces.ts';

const patientModal = defineAsyncComponent(() => import('./ListPatients.vue'))

const props = defineProps({
    show: Boolean,
    event: Object as () => NewEvent,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const store = useCalendarStore()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const showSend = ref<boolean>(false)
const patientSend = ref<PatientSend[]>([])
const messageOptions = ref<{ value: number, label: string }[]>([])
const event = ref<Event>(JSON.parse(JSON.stringify(props.event)))

const rules: FormRules = {
    title: [
        { required: true, message: "Campo Requerido", trigger: ["input", "blur"] },
    ],
    'extendedProps.istart': [
        { required: true, message: "Campo Requerido", trigger: ["input", "blur"] },
    ],
    'extendedProps.calendar': [
        { required: true, message: "Campo Requerido", trigger: ["input", "blur"] },
    ],
    'extendedProps.timeStart': [
        { required: true, message: "Campo Requerido", trigger: ["input", "blur"] },
    ],
}

const getTemplates = async () => {
    const response = await whatsappServices.getTemplates("2")
    messageOptions.value = response
}

onMounted(() => {
    getTemplates()
})

onUpdated(async () => {
    if (props.show == true) {
        event.value = props.event as Event;
        patientSend.value = [];

        if (event.value.extendedProps.calendar === 'Programación' && event.value.id) {
            setTimeout(async () => {
                await getPatients(event.value.id)
            }, 250)
        }
    }
})

const handleSubmit = async () => {
    if (event.value.extendedProps.calendar === 'Programación') {
        // const dateNowString = new Date().toISOString().substr(0, 10);

        // if (event.value.extendedProps.istart < dateNowString) {
        //     message.warning("La fecha de inicio no puede ser menor a la fecha actual.");
        //     return;
        // }

        if (patientSend.value.length === 0) {
            message.warning("Debe agregar al menos un paciente para Programación.");
            return;
        }
    }

    formRef.value?.validate(async (errors) => {
        let response: any;
        try {
            if (!errors) {
                loading.value = true
                if ('id' in event.value) {
                    response = await updateEvent(event.value);
                } else {
                    response = await NewEvent(event.value);
                }
                console.log(response);
                emit('refresh')
                closeModal()
                if ('id' in event.value) {
                    message.success("Evento actualizado correctamente.")
                } else {
                    message.success("Evento creado correctamente.")
                }
            } else {
                message.error('Campos Requeridos')
            }
        } catch (error) {
            message.error("Error generar evento.");
        } finally {
            loading.value = false;
        }
    })
}

const NewEvent = async (event: Event) => {
    const data = {
        title: event.title,
        startDate: event.extendedProps.istart.toString(),
        endDate: event.extendedProps.istart.toString(),
        timeStart: event.extendedProps.timeStart,
        timeEnd: event.extendedProps.timeEnd,
        category: event.extendedProps.calendar,
        description: event.extendedProps.description,
        templateId: event.extendedProps.templateId,
        patients: event.extendedProps.calendar !== "Recordatorio" ? patientSend.value : [],
    }
    const response = await calendarServices.store(data);
    return response
}

const updateEvent = async (event: Event) => {
    let listPatients = [];

    if (event.extendedProps.calendar !== "Recordatorio") {
        listPatients = patientSend.value.filter(patient => !patient.id);
    }

    const data = {
        title: event.title,
        startDate: event.extendedProps.istart.toString(),
        endDate: event.extendedProps.istart.toString(),
        timeStart: event.extendedProps.timeStart,
        timeEnd: event.extendedProps.timeEnd,
        category: event.extendedProps.calendar,
        description: event.extendedProps.description,
        templateId: event.extendedProps.templateId,
        patients: listPatients,
    }
    // console.log(data);
    const response = await calendarServices.update(event.id, data);
    return response
}

const getPatients = async (id: number) => {
    const response = await calendarServices.getPatientCalendarId(id)
    patientSend.value = response
    // console.log(response);
}

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

const getValues = (values: GetPatient[]) => {
    values.map((item) => {
        if (!patientSend.value.find((item2) => item2.patientId == item.id)) {
            patientSend.value.push({
                patientId: item.id,
                namePatient: item.name,
                phone: item.phone,
                status: "Pendiente",
            })
        }
    })
}

const deletePatient = (id: string) => {
    patientSend.value = patientSend.value.filter((item) => item.patientId !== id)
}
</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        :title="event.id ? 'Editar Evento' : 'Crear Evento'" close-on-esc style="width: 400px;"
        :style="event.extendedProps.calendar !== 'Recordatorio' ? 'width: 850px' : 'width: 400px;'" :auto-focus="false">

        <patientModal :show="showSend" @close="showSend = !showSend" @setPatients="getValues" />

        <n-grid :x-gap="12" :y-gap="12" :cols="event.extendedProps.calendar !== 'Recordatorio' ? 24 : 12"
            layout-shift-disabled>
            <n-gi :span="event.extendedProps.calendar !== 'Recordatorio' ? 10 : 12">
                <n-form ref="formRef" :model="event" :rules="rules" class="flex flex-col gap-1">
                    <n-form-item-gi :span="12" label="Tipo" path="extendedProps.calendar">
                        <n-select v-model:value="event.extendedProps.calendar" value-field="label"
                            :options="store.availableCalendars" :disabled="event.id ? true : false"
                            placeholder="Seleccione" />
                    </n-form-item-gi>

                    <n-form-item label="Nombre" path="title">
                        <n-input v-model:value="event.title" placeholder="Escribe aqui..." />
                    </n-form-item>

                    <n-grid :x-gap="12" :cols="12">
                        <n-gi :span="6">
                            <n-form-item label="Fecha Inicio" path="extendedProps.istart">
                                <n-date-picker type="date" v-model:formatted-value="event.extendedProps.istart"
                                    value-format="yyyy-MM-dd" :actions="null" />
                            </n-form-item>
                        </n-gi>
                        <n-gi :span="6">
                            <n-form-item label="Hora Inicio" path="extendedProps.timeStart" :use-12-hours="false">
                                <n-time-picker v-model:formatted-value="event.extendedProps.timeStart"
                                    value-format="H:mm" format="H:mm" :actions="null" style="width: 100%;" />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-form-item label="Descripción">
                        <n-input type="textarea" v-model:value="event.extendedProps.description"
                            placeholder="Escribe aqui..." :autosize="{ minRows: 2 }" />
                    </n-form-item>

                    <div class="flex gap-2 justify-end mt-2">
                        <n-button @click="closeModal()" quaternary>Cancelar</n-button>
                        <n-button type="primary" :loading="loading" @click="handleSubmit"
                            class="min-w-[25%]">Guardar</n-button>
                    </div>
                </n-form>
            </n-gi>

            <n-gi v-if="event.extendedProps.calendar !== 'Recordatorio'" :span="14">
                <div class="flex flex-col  min-w-full">
                    <div class="flex gap-2 mb-3">
                        <n-select size="small" filterable v-model:value="event.extendedProps.templateId"
                            :options="messageOptions" placeholder="Seleccione Plantilla" />

                        <n-button :disabled="!event.extendedProps.templateId" size="small" type="primary"
                            :loading="loading" @click="showSend = true">
                            <j-icon w="w-[20px]" name="add" />
                            Agregar
                        </n-button>
                    </div>

                    <n-scrollbar style="max-height: 415px; min-height: 415px;"
                        class="bg-gray-50 dark:bg-gray-900/40 rounded-md">
                        <div v-if="patientSend.length > 0" v-for="item in patientSend" :key="item.id" class="flex justify-between items-center px-2 py-1 hover:bg-gray-100/70
                     dark:hover:bg-gray-900/60 cursor-pointer border-b border-gray-200 dark:border-gray-700 group">
                            <div>
                                <strong>{{ item.namePatient }}</strong>
                                <div class="text-sm text-gray-500 dark:text-gray-400 flex gap-1 items-center -mt-1">
                                    <span>Celular: {{ item.phone }}</span>
                                </div>
                            </div>
                            <div @click="deletePatient(item.patientId)"
                                class="p-2 h-8 w-8 bg-gray-200/70 text-gray-500 dark:bg-gray-800 dark:text-white hover:text-red-500 rounded-md hidden group-hover:block">
                                <j-icon w="w-[17px]" name="delete" />
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-1 mt-24 items-center justify-center opacity-70">
                            <span>Seleccione la plantilla</span>
                            <span>y presione agregar para</span>
                            <span>seleccionar los pacientes.</span>
                            <j-icon w="w-[40px] opacity-70" name="people" />
                        </div>
                    </n-scrollbar>

                </div>
            </n-gi>
        </n-grid>

        <!-- <pre>{{ JSON.stringify(props.event, null, 2) }}</pre> -->
    </n-modal>
</template>
