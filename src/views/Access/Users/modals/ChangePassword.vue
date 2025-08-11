<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { Store } from '../../../../services/interfaces/access/users.interfaces';
import usersServices from '../../../../services/access/users.services'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Store,
});

const emit = defineEmits(['close']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const formData = ref<Store>(props.items as Store)

const rules: FormRules = {
    password: [
        { required: true, message: "Contraseña Requerida", trigger: "blur", },
        { min: 6, message: "La constraseña debe ser mayor a 6 caracteres", trigger: "blur" }
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
            const response = await usersServices.updatePassword(formData.value.id, formData.value.password)
            // console.log(response);

            if (response) {
                loading.value = false
                closeModal()
                message.success(formData.value.id ? 'Usuario Actualizado' : 'Usuario Creado')
            }
        } else {
            message.error('Campos Requerido')
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
        title="Restablecer Contraseña" close-on-esc style="width: 400px;" :auto-focus="false">

        <div class="text-sm text-gray-500 mb-2 -mt-2">
            Ingresa la contraseña del usuario <strong>{{ formData.name }} ({{ formData.email }})</strong>
        </div>

        <n-form ref="formRef" :model="formData" :rules="rules" label-width="120" class="flex flex-col gap-1">



            <n-form-item label="Nueva Contraseña" path="password">
                <n-input v-model:value="formData.password" type="password" placeholder="Escribe Aqui"
                    show-password-on="click" />
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
