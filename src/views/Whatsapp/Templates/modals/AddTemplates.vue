<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { Store, } from '../../../../services/interfaces/whatsapp/template.interfaces';
import templatesServices from '../../../../services/whatsapp/template.services'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import Bubble from '../../Chats/components/Bubble.vue';

const props = defineProps({
    show: Boolean,
    items: Object as () => Store,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref<boolean>(false)

const URLIMG = ref<any>()
const formData = ref<Store>(props.items as Store)
const dateNow = ref<string>(new Date().toISOString())

const rules: FormRules = {
    name: [
        { required: true, message: "El nombre es Requerido", trigger: ["input", "blur"] },
    ],
    message: [
        { required: true, message: "El Mensaje es Requerido", trigger: ["input", "blur"] }
    ],
}

onUpdated(() => {
    if (props.show == true) {
        formData.value = props.items as Store;
        if (formData.value.contentType === 2) {
            URLIMG.value = formData.value.file
        } else {
            URLIMG.value = null
        }
    }
})

const handleSubmit = async () => {
    formRef.value?.validate(async (errors) => {
        if (formData.value.contentType === 2 && !formData.value.file) {
            message.info('Necesitas subir una Imagen')
            return
        }

        if (!errors) {
            loading.value = true
            formData.value.id ?
                await templatesServices.update(formData.value.id, formData.value) : await templatesServices.store(formData.value)

            emit('refresh')
            loading.value = false
            closeModal()
            message.success(formData.value.id ? 'Plantilla Actualizada' : 'Plantilla Creada')
        } else {
            message.error('Campos Requeridos')
        }
    })
}


const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

const typeOptions = [
    {
        label: 'Reenvio',
        value: 1,
    },
    {
        label: 'Programado',
        value: 2,
    },
]

const contentOptions = [
    {
        label: 'Solo Mensaje',
        value: 1,
    },
    {
        label: 'Mensaje con Imagen',
        value: 2,
    },
]

const beforeUpload = async ({ file }) => {
    if (file.file.type == "image/png" || file.file.type == "image/jpg" || file.file.type == "image/jpeg") {
        URLIMG.value = URL.createObjectURL(file.file);
        formData.value.file = file.file
        return true;
    }
    message.error("El archivo necesita ser una Imagen.");
    return false;
}

const clearImage = () => {
    URLIMG.value = null
    formData.value.file = null
}

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        :title="formData.id ? 'Editar Plantilla' : 'Crear Plantilla'" close-on-esc style="width: 800px;"
        :auto-focus="false">

        <n-grid :x-gap="12" :y-gap="12" :cols="24" layout-shift-disabled>
            <n-gi :span="14">
                <n-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-1">
                    <n-grid :span="12" :x-gap="12">
                        <n-form-item-gi :span="12" label="Tipo" path="type">
                            <n-select v-model:value="formData.type" :options="typeOptions" placeholder="Seleccione" />
                        </n-form-item-gi>
                        <n-form-item-gi :span="12" label="Contenido" path="contentType">
                            <n-select v-model:value="formData.contentType" :options="contentOptions"
                                placeholder="Seleccione" />
                        </n-form-item-gi>
                    </n-grid>

                    <n-form-item label="Nombre" path="name">
                        <n-input v-model:value="formData.name" placeholder="Escribe el nombre" />
                    </n-form-item>

                    <n-form-item label="Mensaje" path="message">
                        <n-input type="textarea" v-model:value="formData.message" placeholder="Escribe el mensaje"
                            :autosize="{
                                minRows: 3,
                            }" />
                    </n-form-item>

                    <n-form-item class="-mt-5" v-if="formData.contentType == 2">
                        <n-upload @before-upload="beforeUpload" :max="1" @remove="clearImage">
                            <div class="flex items-center gap-2">
                                <n-button> + Imagen</n-button>
                                <div v-if="!formData.file" class="text-red-400">
                                    Requerida
                                </div>
                            </div>
                        </n-upload>
                    </n-form-item>

                    <div class="flex gap-2 justify-end mt-2">
                        <n-button @click="closeModal()" quaternary>Cancelar</n-button>
                        <n-button type="primary" :loading="loading" @click="handleSubmit"
                            class="min-w-[25%]">Guardar</n-button>
                    </div>
                </n-form>
            </n-gi>
            <n-gi :span="10">
                <div class="bg-slate-100 rounded-lg p-1 dark:bg-slate-700/70 h-auto min-h-60">
                    <Bubble :message="formData.message" sender="user" :timestamp="dateNow" :status="false"
                        :img="URLIMG" />
                </div>
            </n-gi>
        </n-grid>
        <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
    </n-modal>
</template>
