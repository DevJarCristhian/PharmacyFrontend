<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from 'vue'
import { Get, GetOpportunity, Update } from '../../../../services/interfaces/sale/opportunity.interfaces';
import opportunityServices from '../../../../services/sale/opportunity.services'
import { useMessage, type FormInst } from 'naive-ui'
import { allStore } from '../../../../store/all';
import { formatDateLarge, formatDateLa } from '../../../../utils/Functions';

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const store = allStore()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const { diagnosis, tratmentTime, doseRecommended, reasonBuy, reasonAnulation } = toRefs(allStore())
const dataValues = ref<GetOpportunity>({
    "patientFullName": "",
    "active": "",
    "usedQuantity": "",
    "cancellation": "",
    "certificationDate": null,
    "exchangeState": null,
    "validation": null,
    "lastDateTaken": null,
    "dateAbandonTreatment": null,
    "reasonBuyId": null,
    "reasonAnulationId": null,
    "diagnosisId": null,
    "doseId": null,
    "treatmentTimeId": null,
    "observations": "",
    "dateUpdated": ""
} as GetOpportunity)

const formData = ref<Update>(
    {
        "reasonBuyId": null,
        "reasonAnulationId": null,
        "diagnosisId": null,
        "doseId": null,
        "treatmentTimeId": null,
        "lastDateTaken": null,
        "dateAbandonTreatment": null,
        "observations": "",
    } as Update)

onMounted(() => {
    getCategories()
})

watch(props, () => {
    if (props.show) {
        getOpportunity()
        props.items.invoiceDate = formatDateLa(props.items.invoiceDate, 'short')
    }
})

const getOpportunity = async () => {
    const response = await opportunityServices.getById(props.items.id)
    // console.log(response.data);
    dataValues.value = response.data

    dataValues.value.active = dataValues.value.active.toString()
    dataValues.value.dateUpdated = formatDateLarge(response.data.dateUpdated)
    dataValues.value.usedQuantity = dataValues.value.usedQuantity.toString()

    formData.value.lastDateTaken = formatDateLa(response.data.lastDateTaken)
    formData.value.dateAbandonTreatment = formatDateLa(response.data.dateAbandonTreatment)
    formData.value.reasonBuyId = response.data.reasonBuyId
    formData.value.reasonAnulationId = response.data.reasonAnulationId
    formData.value.diagnosisId = response.data.diagnosisId
    formData.value.doseId = response.data.doseId
    formData.value.treatmentTimeId = response.data.treatmentTimeId
    formData.value.observations = response.data.observations
}

const getCategories = async () => {
    const response = await opportunityServices.getCategories()
    // console.log(response.data);

    setTimeout(() => {
        store.setCategories(response.data)
    }, 200)
}

const updateOpportunity = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            await opportunityServices.update(props.items.id, formData.value)
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
        title="Oportunidad" close-on-esc style="width: 800px; min-height: 490px;" :auto-focus="false">
        <n-tabs type="line" animated class="-mt-6">
            <n-tab-pane name="start" tab="Datos Principales">
                <n-form ref="formRef" :model="items">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Serie">
                            <n-input v-model:value="items.invoiceSerie" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="2" label="Numero">
                            <n-input v-model:value="items.invoiceNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Fecha Facturación">
                            <n-input v-model:value="items.invoiceDate" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Sucursal">
                            <n-input v-model:value="items.farmacyName" readonly placeholder="-" :maxlength="20" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Documento Paciente">
                            <n-input v-model:value="items.documentNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="9" label="Nombre Paciente">
                            <n-input v-model:value="items.patientFullName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="8" label="Producto">
                            <n-input v-model:value="items.productName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Cantidad">
                            <n-input v-model:value="items.quantity" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="add" tab="Datos Complementarios">
                <n-form ref="formRef" :model="formData">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="4" label="Cantidades utilizadas">
                            <n-input v-model:value="dataValues.usedQuantity" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Fecha bonificacion">
                            <n-input v-model:value="dataValues.certificationDate" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Estado canje">
                            <n-input v-model:value="dataValues.exchangeState" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="4" label="validacion">
                            <n-input v-model:value="dataValues.validation" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="activo">
                            <n-input v-model:value="dataValues.active" readonly placeholder="" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="anulacion">
                            <n-input v-model:value="dataValues.cancellation" readonly placeholder="" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="4" label="Motivo compra">
                            <n-select v-model:value="formData.reasonBuyId" :options="reasonBuy"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Motivo anulacion">
                            <n-select v-model:value="formData.reasonAnulationId" :options="reasonAnulation"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Diagnostico ">
                            <n-select v-model:value="formData.diagnosisId" :options="diagnosis"
                                placeholder="Seleccione" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Dosis ">
                            <n-select v-model:value="formData.doseId" :options="doseRecommended"
                                placeholder="Seleccione" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Tiempo tratamiento ">
                            <n-select v-model:value="formData.treatmentTimeId" :options="tratmentTime"
                                placeholder="Seleccione" />
                        </n-form-item-gi>


                        <n-form-item-gi span="3" label="Fecha Ultima toma">
                            <n-date-picker type="date" value-format="yyyy-MM-dd HH:mm" placeholder="Seleccione"
                                v-model:formatted-value="formData.lastDateTaken" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Abandono tratamiento">
                            <n-date-picker type="date" value-format="yyyy-MM-dd HH:mm" placeholder="Seleccione"
                                v-model:formatted-value="formData.dateAbandonTreatment" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="contact" tab="Otros Datos">
                <n-form ref="formRef" :model="formData">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="12" label="Observaciones">
                            <n-input v-model:value="formData.observations" type="textarea"
                                placeholder="Ingrese observaciones adicionales." />
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
                <n-button type="primary" :loading="loading" @click="updateOpportunity()"
                    class="min-w-[20%]">Guardar</n-button>
            </div>
        </template>
        <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
    </n-modal>
</template>
