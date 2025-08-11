<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import whatsappServices from '../../../services/whatsapp/whatsapp.services';

import { useMessage, type FormInst } from 'naive-ui'
import { ParamsPatient, GetPatient, StoreManyMessage } from '../../../services/interfaces/whatsapp/whatsapp.interfaces';

const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['close', 'setPatients']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const showFilter = ref<boolean>(true)
const checkAll = ref<boolean>(false)
const params = ref<ParamsPatient>({
    search: null,
    gender: null,
    birthDate: null,
    startDate: null,
    endDate: null,
});
const patientData = ref<GetPatient[]>([])
const patientSend = ref<GetPatient[]>([])
const messageOptions = ref<{ value: number, label: string }[]>([])
const valuesSend = ref<StoreManyMessage>({
    templateId: null,
    patients: [],
} as StoreManyMessage);

onMounted(() => {
    getTemplates()
    getPatients()
})

watch(() => props.show, () => {
    if (!props.show) {
        setTimeout(() => {
            patientSend.value = []
            patientData.value.forEach((v) => {
                v.selected = false;
            });
        }, 250);
    }
})

const getTemplates = async () => {
    const response = await whatsappServices.getTemplates("1")
    messageOptions.value = response
}

const getPatients = async () => {
    const response = await whatsappServices.getPatientFilters(params.value)
    // console.log(response);
    patientData.value = response
}

const checkValues = (id: string) => {
    patientData.value.forEach((v) => {
        if (v.id === id) {
            v.selected = !v.selected;
            if (v.selected) {
                if (!patientSend.value.find((item: any) => item.id === v.id)) {
                    patientSend.value.push(v);
                }
            } else {
                patientSend.value = patientSend.value.filter((item: any) => item.id !== v.id);
            }
        }
    });
}

const deleteSelected = (id: string) => {
    patientSend.value = patientSend.value.filter((v: any) => v.id !== id)
    patientData.value.forEach((v) => {
        if (v.id == id) {
            v.selected = false;
        }
    });
    checkAll.value = false;
}

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

const selectAll = (checked: boolean) => {
    checkAll.value = checked;
    patientData.value.forEach((v) => {
        if (v.selected !== checked) {
            v.selected = checked;
        }
    });

    if (checked) {
        patientData.value.forEach((v) => {
            if (!patientSend.value.find((item: any) => item.id === v.id)) {
                patientSend.value.push(v);
            }
        });
    } else {
        patientSend.value = [];
    }
}

const setPatients = async () => {
    if (patientSend.value.length > 0) {
        emit("setPatients", patientSend.value);
        message.success(`${patientSend.value.length} pacientes seleccionados`);
        closeModal();
    }
}

const clearValues = () => {
    patientSend.value = []
    valuesSend.value.templateId = null
    checkAll.value = false
    patientData.value.forEach((v) => {
        v.selected = false
    });
}

const genderOptions = [
    {
        label: 'Hombre',
        value: 1,
    },
    {
        label: 'Mujer',
        value: 2,
    },
]
</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false" close-on-esc
        style="width: 850px; height: 580px;" :auto-focus="false">
        <template #header>
            <div class="flex gap-2 items-center cursor-pointer select-none -mb-3" @click="showFilter = !showFilter">
                <j-icon w="w-[17px]" name="comunication" />
                <div> Seleccione los Pacientes</div>
            </div>
        </template>

        <!-- <n-collapse-transition :show="showFilter" class="mb-3"> -->
        <n-spin :show="loading">
            <div class="flex gap-2 alifn-center items-center mb-3">

                <n-input style="width: 170px" size="small" placeholder="Buscar" v-model:value="params.search"
                    @keydown.enter="getPatients()">
                    <template #prefix>
                        <j-icon w="w-[14px]" name="search" />
                    </template>
                </n-input>

                <n-date-picker style="width: 130px" size="small" type="date" value-format="yyyy-MM-dd"
                    placeholder="Inscripción" v-model:formatted-value="params.incriptionDate" :actions="null"
                    clearable />

                <n-date-picker style="width: 130px" size="small" type="date" value-format="MM-dd"
                    placeholder="Cumpleaños" v-model:formatted-value="params.birthDate" :actions="null" clearable />

                <n-select style="width: 100px" size="small" v-model:value="params.gender" :options="genderOptions"
                    placeholder="Genero" clearable />

                <n-button type="primary" size="small" @click="getPatients()">
                    <j-icon w="w-[14px]" name="search" />
                </n-button>

                <div v-if="patientData.length > 0">
                    Resultados: <span class="font-semibold">{{ patientData.length }}</span>
                </div>
            </div>
            <!-- </n-collapse-transition> -->

            <div class="grid grid-cols-2 gap-2 items-center">
                <div class="flex flex-col">
                    <n-scrollbar style="max-height: 415px; min-height: 415px;"
                        class="bg-gray-50/40 dark:bg-gray-900/40 rounded-md">
                        <div v-for="item in patientData" :key="item.id" @click="checkValues(item.id)"
                            class="px-2 py-1.5 hover:bg-gray-100/70 dark:hover:bg-gray-900/60 cursor-pointer border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-center gap-2 text-xs">
                                <div class="flex items-center gap-2">
                                    <n-checkbox size="small" v-model:checked="item.selected" />
                                    <span class="font-semibold text-xs">{{ item.name }}
                                        <n-tag :bordered="false" :type="item.gender === 'Hombre' ? 'info' : 'error'"
                                            size="tiny">
                                            {{ item.gender }}
                                        </n-tag>
                                    </span>
                                </div>
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.age }} años, DPI: {{
                                item.documentNumber }},
                                Celular: {{
                                    item.phone
                                }}
                            </div>
                        </div>
                    </n-scrollbar>

                    <div class="mt-3 mx-2 flex gap-2 items-center justify-between">
                        <div class="flex items-center">
                            <n-checkbox :disabled="patientData.length == 0" v-model:checked="checkAll"
                                label="Seleccionar todos" @update:checked="selectAll" />

                            <n-tag v-if="patientSend.length > 0" :bordered="false" type="success" size="small">
                                {{ patientSend.length }}
                            </n-tag>
                        </div>

                        <n-button v-if="patientSend.length > 0" size="small" @click="clearValues()" quaternary>
                            <j-icon w="w-4 text-red-400" name="delete" />
                            Limpiar
                        </n-button>
                    </div>
                </div>

                <div class="flex flex-col  min-w-full">
                    <n-scrollbar style="max-height: 415px; min-height: 415px;"
                        class="bg-gray-50/40 dark:bg-gray-900/40 rounded-md">
                        <div v-if="patientSend.length > 0" v-for="item in patientSend" :key="item.id" class="flex justify-between p-2 hover:bg-gray-100/70
                     dark:hover:bg-gray-900/60 cursor-pointer border-b border-gray-200 dark:border-gray-700
                    group">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-xs">{{ item.name }}
                                        <n-tag :bordered="false" :type="item.gender === 'Hombre' ? 'info' : 'error'"
                                            size="tiny">
                                            {{ item.gender }}
                                        </n-tag>
                                    </span>
                                </div>
                                <div class="text-sm text-gray-500 dark:text-gray-400"> {{ item.age }} años, DPI: {{
                                    item.documentNumber }}, Celular: {{ item.phone }}
                                </div>
                            </div>

                            <div @click="deleteSelected(item.id)"
                                class="p-2 h-8 w-8 bg-gray-200/70 text-gray-500 dark:bg-gray-800 dark:text-white hover:text-red-500 rounded-md hidden group-hover:block">
                                <j-icon w="w-[17px]" name="delete" />
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-1 mt-24 items-center justify-center opacity-70">
                            <span>Filtre y seleccione</span>
                            <span>los pacientes para</span>
                            <span>enviar el mensaje.</span>
                            <j-icon w="w-[40px] opacity-70" name="comunication" />
                        </div>
                    </n-scrollbar>

                    <div class="flex gap-2 justify-end mt-3">
                        <n-button size="small" type="primary" :loading="loading" @click="setPatients()">
                            <j-icon w="w-[20px]" name="add" />
                            Agregar Pacientes
                        </n-button>
                    </div>
                </div>
            </div>
        </n-spin>

        <!-- <pre>{{ JSON.stringify(params, null, 2) }}</pre> -->
    </n-modal>
</template>
