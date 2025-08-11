<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { Store } from '../../../../services/interfaces/access/connections.interfaces';
import connectionServices from '../../../../services/access/connections.services'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Store,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const formData = ref<Store>(props.items as Store)

const rules: FormRules = {
    name: [
        { required: true, message: "El nombre es Requerido", trigger: "blur" }
    ],
    battery: [
        { required: true, message: "El numero es Requerido", trigger: "blur" }
    ],
}

onUpdated(() => {
    if (props.show == true) {
        formData.value = props.items as Store;
    }
})

const handleSubmit = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            formData.value.id ?
                await connectionServices.update(formData.value.id, formData.value) : await connectionServices.store(formData.value)
            // console.log(response)
            emit('refresh')
            loading.value = false
            closeModal()
            message.success(formData.value.id ? 'Conexión Actualizada' : 'Conexión Creada')
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
        :title="formData.id ? 'Modificar Conexión' : 'Crear Conexión'" close-on-esc style="width: 400px;"
        :auto-focus="false">

        <n-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-1">
            <n-form-item label="Descripción" path="name">
                <n-input v-model:value="formData.name" placeholder="Escribe aqui" />
            </n-form-item>

            <n-form-item label="Numero" path="battery">
                <n-input type="number" v-model:value="formData.battery" placeholder="Ingrese numero" />
            </n-form-item>

            <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
        </n-form>
        <template #footer>
            <div class="flex gap-2 justify-end">
                <n-button @click="closeModal()" quaternary>Cancelar</n-button>
                <n-button type="primary" :loading="loading" @click="handleSubmit" class="min-w-[25%]">Guardar</n-button>
            </div>
        </template>
    </n-modal>
</template>
