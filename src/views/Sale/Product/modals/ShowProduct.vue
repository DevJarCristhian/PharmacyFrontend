<script lang="ts" setup>
import { onMounted, onUpdated, ref } from 'vue'
import { Get } from '../../../../services/interfaces/sale/product.interfaces';
// import rolesServices from '../../../../services/people/dependent.services'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const formData = ref<Get>(props.items as Get)
const items = ref<Get>(
    {
        "condition": 2,
        "description": "ARBI 300 MG",
        "longDescription": "ARBI 300 MG",
        "status": 1,
        "id": 41,
        "name": "ARBI 300 MG",
        "observation": "",
        "receive": "1 Caja",
        "unitMeasure": 0
    }
)
// const permissions = ref<Get[]>([])

onMounted(() => {
    // // getPermissions()
})

onUpdated(() => {
    if (props.show == true) {
        formData.value = props.items as Get;
    }
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
        :title="formData.id ? 'Editar Dependiente' : 'Crear Dependiente'" close-on-esc
        style="width: 700px; height: 500px;" :auto-focus="false">

        <n-form ref="formRef" :model="formData" class="flex flex-col gap-1">
            <n-form-item label="Nombre">
                <n-input v-model:value="items.name" readonly placeholder="Cargando..." />
            </n-form-item>
            <n-form-item label="Descripción">
                <n-input v-model:value="items.description" readonly placeholder="Cargando..." />
            </n-form-item>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item label="Descripción">
                    <n-input v-model:value="items.description" readonly placeholder="Cargando..." />
                </n-form-item>

                <n-form-item-gi span="3" label="Fecha Nacimiento">
                    <n-date-picker type="date" value-format="yyyy-MM-dd" :actions="null" style="width: 100%" />
                </n-form-item-gi>

                <n-form-item-gi span="2" label="Edad">
                    <n-input v-model:value="items.description" placeholder="Edad" @paste.prevent :maxlength="3" />
                </n-form-item-gi>

                <n-form-item-gi span="4" label="Telefono">
                    <n-input v-model:value="items.longDescription" placeholder="Telefono" @paste.prevent
                        :maxlength="20" />
                </n-form-item-gi>
            </n-grid>
            <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
        </n-form>
    </n-modal>
</template>
