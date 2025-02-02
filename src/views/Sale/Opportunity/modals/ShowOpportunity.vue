<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Get } from '../../../../services/interfaces/sale/opportunity.interfaces';
// import rolesServices from '../../../../services/people/dependent.services'
import { type FormInst } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
});

const emit = defineEmits(['close', 'refresh']);

// const message = useMessage()
const formRef = ref<FormInst | null>(null)
// const loading = ref<boolean>(false)
const formData = ref<Get>(
    {
        "id": 30361,
        "documentNumber": "2306956120",
        "patientFullName": "GEMIMA LOPEZ RODRIGUEZ DE BARRIOS",
        "farmacyName": null,
        "productName": "INOSITA PLUS 50/1000 mg x 28 Tab\n",
        "invoiceSerie": "91826BB2",
        "invoiceNumber": "2819610492",
        "quantity": "1",
        "invoiceDate": "2025-01-23",
        "dateUpdated": "2025-01-23 16:43:39"
    } as Get)
// const permissions = ref<Get[]>([])

onMounted(() => {
    // // getPermissions()
})

watch(props, (newVal) => {
    formData.value = newVal.items as Get;
})

// // const getPermissions = async () => {
// //     const response = await rolesServices.getPermissions()
//     const newData = response.data.map((item: any) => ({
//         ...item, children: JSON.parse(item.children)
//     }))
//     // console.log(newData);
// //     permissions.value = newData
// }

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        title="Oportunidad" close-on-esc style="width: 800px; min-height: 530px;" :auto-focus="false">
        <n-tabs type="line" animated class="-mt-6">
            <n-tab-pane name="start" tab="Datos Principales">
                <n-form ref="formRef" :model="formData">
                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Serie">
                            <n-input v-model:value="formData.invoiceSerie" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="2" label="Numero">
                            <n-input v-model:value="formData.invoiceNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Fecha Facturación">
                            <n-input v-model:value="formData.invoiceDate" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Sucursal">
                            <n-input v-model:value="formData.farmacyName" readonly placeholder="-" :maxlength="20" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Documento Paciente">
                            <n-input v-model:value="formData.documentNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="9" label="Nombre Paciente">
                            <n-input v-model:value="formData.patientFullName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="8" label="Producto">
                            <n-input v-model:value="formData.productName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Cantidad">
                            <n-input v-model:value="formData.quantity" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>

            <n-tab-pane name="add" tab="Datos Complementarios">
                <n-form ref="formRef" :model="formData">
                    <!-- <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Serie">
                            <n-input v-model:value="formData.invoiceSerie" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="2" label="Numero">
                            <n-input v-model:value="formData.invoiceNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="3" label="Fecha Facturación">
                            <n-input v-model:value="formData.invoiceDate" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Sucursal">
                            <n-input v-model:value="formData.farmacyName" readonly placeholder="-" :maxlength="20" />
                        </n-form-item-gi>
                    </n-grid> -->

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="3" label="Documento Paciente">
                            <n-input v-model:value="formData.documentNumber" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="9" label="Nombre Paciente">
                            <n-input v-model:value="formData.patientFullName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-grid x-gap="12" cols="12 200:1 450:12">
                        <n-form-item-gi span="8" label="Producto">
                            <n-input v-model:value="formData.productName" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>

                        <n-form-item-gi span="4" label="Cantidad">
                            <n-input v-model:value="formData.quantity" readonly placeholder="" :maxlength="3" />
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-tab-pane>
        </n-tabs>
        <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
    </n-modal>
</template>
