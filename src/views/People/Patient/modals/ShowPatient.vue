<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from 'vue'
import { Get, GetPatient, Update } from '../../../../services/interfaces/people/patient.interfaces';
import patientServices from '../../../../services/people/patient.services'
import { useMessage, type FormInst } from 'naive-ui'
import { allStore } from '../../../../store/all';
import { formatDateLarge } from '../../../../utils/Functions';

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const store = allStore()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const { maritalStatus, gender, patientStatus, patientType } = toRefs(allStore())
const dataValues = ref<GetPatient>({
    "medicationConsumption": "",
    "operatorId": "",
    "gender": null,
    "programStartDate": "",
    "verified": "",
    "quantityRedemptions": "",
    "doctorName": "",
    "institutionName": "",
    "civilStatus": null,
    "patientStatus": null,
    "patientType": null,
    "contactName": "",
    "description": "",
    "dateUpdated": ""
} as GetPatient)

const formData = ref<Update>({
    "gender": null,
    "civilStatus": null,
    "patientStatus": null,
    "patientType": null,
    "contactName": "",
    "description": ""
} as Update)

onMounted(() => {
    getCategories()
})

watch(props, () => {
    if (props.show) {
        formData.value.gender = props.items.gender
        props.items.birthDate = formatDateLarge(props.items.birthDate)
        getPatient()
    }
})

const getPatient = async () => {
    const response = await patientServices.getById(props.items.id)
    // console.log(response.data);

    dataValues.value = response.data
    dataValues.value.programStartDate = formatDateLarge(response.data.programStartDate)
    dataValues.value.dateUpdated = formatDateLarge(response.data.dateUpdated)
    formData.value.gender = response.data.gender
    formData.value.civilStatus = response.data.civilStatus
    formData.value.patientStatus = response.data.patientStatus
    formData.value.patientType = response.data.patientType
    formData.value.contactName = response.data.contactName
    formData.value.description = response.data.description
}

const getCategories = async () => {
    const response = await patientServices.getCategories()
    // console.log(response);

    setTimeout(() => {
        store.setCategories(response.data)
    }, 200)
}

const updatePatient = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            await patientServices.update(props.items.id, formData.value)
            // console.log(response);
            emit('refresh')
            closeModal()

            loading.value = false
            message.success('Paciente Actualizado')
        } else {
            message.error('Campos Requeridos')
        }
    })
}

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        title="Paciente" close-on-esc style="width: 800px; min-height: 490px;" :auto-focus="false">
        <n-tabs type="line" animated class="-mt-6">
            <n-tab-pane name="start" tab="Datos Personales">
                <n-form ref="formRef" :model="items">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Documento">
                            <n-input v-model:value="items.documentNumber" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="9" label="Nombre">
                            <n-input v-model:value="items.fullName" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 100:1 450:12">
                        <n-form-item-gi span="2" label="Genero">
                            <n-select v-model:value="formData.gender" :options="gender" placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="6" label="Email">
                            <n-input v-model:value="items.email" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Telefono">
                            <n-input v-model:value="items.phone" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 100:1 450:12">
                        <n-form-item-gi span="3" label="Cumpleaños">
                            <n-input v-model:value="items.birthDate" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Fecha de Inscripción">
                            <n-input v-model:value="items.enrollmentDate" readonly placeholder="-" />
                        </n-form-item-gi>

                        <n-form-item-gi span="5" label="Pais">
                            <n-input v-model:value="items.countryName" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 100:1 450:12">
                        <n-form-item-gi span="6" label="Departamento">
                            <n-input v-model:value="items.departmentName" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="6" label="Dirección">
                            <n-input v-model:value="items.address" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="add" tab="Datos Complementarios">
                <n-form ref="formRef" :model="formData" class="mb-8">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="6" label="Nombre del Doctor">
                            <n-input v-model:value="dataValues.doctorName" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="6" label="Institución">
                            <n-input v-model:value="dataValues.institutionName" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">


                        <n-form-item-gi span="3" label="Fecha Programación">
                            <n-input v-model:value="dataValues.programStartDate" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Verificado">
                            <n-input v-model:value="dataValues.verified" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Consumo Medicamento">
                            <n-input v-model:value="dataValues.medicationConsumption" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Cantidad Canjes">
                            <n-input v-model:value="dataValues.quantityRedemptions" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Estado Civil">
                            <n-select v-model:value="formData.civilStatus" :options="maritalStatus"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Tipo de Paciente">
                            <n-select v-model:value="formData.patientType" :options="patientType"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="6" label="Estado Paciente">
                            <n-select v-model:value="formData.patientStatus" :options="patientStatus"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <!-- <n-form-item-gi span="3" label="Id Operador">
                            <n-input v-model:value="formData.operatorId" readonly placeholder="" />
                        </n-form-item-gi> -->
                    </n-grid>

                    <!-- <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="12" label="Información del Paciente">
                            <n-input v-model:value="formData.patientInformation" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid> -->
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="contact" tab="Otros Datos">
                <n-form ref="formRef" :model="formData">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="12" label="Nombre de Contacto">
                            <n-input v-model:value="formData.contactName"
                                placeholder="Escribe el nombre del contacto." />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="12" label="Descripción">
                            <n-input v-model:value="formData.description" type="textarea"
                                placeholder="Ingrese información adicional." />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="12" label="Fecha de Actualización">
                            <n-input v-model:value="dataValues.dateUpdated" readonly placeholder="-" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>
        </n-tabs>

        <n-divider />

        <template #footer>
            <div class="flex gap-2 justify-end -mt-3">
                <n-button @click="closeModal" quaternary>Cancelar</n-button>
                <n-button type="primary" :loading="loading" @click="updatePatient()"
                    class="min-w-[20%]">Guardar</n-button>
            </div>
        </template>
        <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
    </n-modal>
</template>
