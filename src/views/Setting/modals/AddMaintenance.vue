<script lang="ts" setup>
import { onMounted, onUpdated, ref } from 'vue'
import maintenanceServices from '../../../services/setting/maintenance.services';
import { GetCategory, Store, StoreCategory } from '../../../services/interfaces/setting/maintenance.interfaces';
import { useMessage, type FormInst, type FormRules } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Store,
});

const emit = defineEmits(['close', 'refresh']);

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const formRefCategory = ref<FormInst | null>(null)
const loading = ref<boolean>(false)
const loadingCategory = ref<boolean>(false)
const showCategory = ref<boolean>(false)
const formData = ref<Store>(props.items as Store)
const formCategory = ref<StoreCategory>({
    id: null,
    description: "",
})
const categories = ref<GetCategory[]>([])

onMounted(() => {
    getCategory()
})

onUpdated(() => {
    if (props.show == true) {
        formData.value = props.items as Store;
    }
})

const getCategory = async () => {
    const response = await maintenanceServices.get()
    categories.value = response
}

const handleSubmit = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true
            formData.value.id ?
                await maintenanceServices.updateChild(formData.value.id, formData.value) : await maintenanceServices.storeChild(formData.value)
            // console.log(response)
            emit('refresh')
            loading.value = false
            closeModal()
            message.success(formData.value.id ? 'Mantenimiento Actualizado' : 'Mantenimiento Creado')
        } else {
            message.error('Campos Requeridos')
        }
    })
}

const newCategory = () => {
    showCategory.value = true
    formCategory.value = {
        id: null,
        description: "",
    }
}
const editCategory = (id: number) => {
    let values = categories.value.find(x => x.value == id)
    formCategory.value.id = id
    formCategory.value.description = values?.label
    showCategory.value = true
}

const handleSubmitCategory = async () => {
    formRefCategory.value?.validate(async (errors) => {
        if (!errors) {
            loadingCategory.value = true
            const response = formCategory.value.id ?
                await maintenanceServices.update(formCategory.value.id, formCategory.value) : await maintenanceServices.store(formCategory.value)
            // console.log(response);

            if (!formCategory.value.id) {
                categories.value.unshift(response)
            } else {
                const index = categories.value.findIndex(x => x.value == formCategory.value.id)
                categories.value[index] = response
            }
            validatePartial()
            formData.value.maintenanceId = response.value
            loadingCategory.value = false

            message.success(formCategory.value.id ? 'Categoria Actualizada' : 'Categoria Creada')
            showCategory.value = false
        } else {
            message.error('Campos Requeridos')
        }
    })
}


const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};

const closeModalCategory = () => {
    showCategory.value = false
    formRefCategory.value?.restoreValidation()
};

const rules: FormRules = {
    description: [
        { required: true, message: "La descripción es Requerida", trigger: ['input', 'blur'] }
    ],
    maintenanceId: [
        { required: true, type: "number", message: "Categoria Requerida", trigger: ['input', 'blur'] }
    ],
}

const rulesCategory: FormRules = {
    description: [
        { required: true, message: "La descripción es Requerida", trigger: ['input', 'blur'] }
    ],
}

const validatePartial = () => {
    formRef.value?.validate(
        (errors) => {
            if (errors) {
                console.error("aaaaaaaaaaa")
            }
        },
        (rule) => {
            return rule?.key === 'maintenanceId'
        }
    )
}

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        :title="formData.id ? 'Editar Mantenimiento' : 'Crear Mantenimiento'" close-on-esc style="width: 400px;"
        :auto-focus="false">

        <n-form ref="formRef" :model="formData" :rules="rules" class="flex flex-col gap-1">
            <n-form-item path="maintenanceId">
                <n-input-group>
                    <n-select v-model:value="formData.maintenanceId" @update:value="validatePartial"
                        :options="categories" placeholder="Seleccione" />
                    <n-button v-if="formData.maintenanceId && !formData.id" type="primary" ghost
                        @click="editCategory(formData.maintenanceId)">
                        <j-icon w="w-[14px]" name="edit" />
                    </n-button>
                </n-input-group>
                <template #label>Categoria
                    <n-text v-if="!formData.id" style="cursor: pointer; margin-left: 6px" type="primary"
                        @click="newCategory()">
                        [+ Nuevo]
                    </n-text>
                </template>
            </n-form-item>

            <n-form-item label="Descripción" path="description">
                <n-input v-model:value="formData.description" placeholder="Digite" />
            </n-form-item>

            <n-form-item label="Estado">
                <n-switch :disabled="formData.id ? false : true" v-model:value="formData.status" />
            </n-form-item>
            <!-- <pre>{{ JSON.stringify(formData, null, 2) }}</pre> -->
        </n-form>
        <template #footer>
            <div class="flex gap-2 justify-end">
                <n-button @click="closeModal()" quaternary>Cancelar</n-button>
                <n-button type="primary" :loading="loading" @click="handleSubmit" class="min-w-[40%]">Guardar</n-button>
            </div>
        </template>

        <n-modal :show="showCategory" :on-close="closeModalCategory" @esc="closeModalCategory()" preset="card"
            :mask-closable="false" :title="formCategory.id ? 'Editar Categoria' : 'Crear Categoria'" close-on-esc
            style="width: 300px;" :auto-focus="false">

            <n-form ref="formRefCategory" :model="formCategory" :rules="rulesCategory">
                <n-form-item label="Descripción" path="description">
                    <n-input v-model:value="formCategory.description" placeholder="Digite" />
                </n-form-item>
                <!-- <pre>{{ JSON.stringify(formCategory, null, 2) }}</pre> -->
            </n-form>
            <template #footer>
                <div class="flex gap-2 justify-start -mt-3">
                    <n-button type="primary" :loading="loadingCategory" @click="handleSubmitCategory"
                        class="min-w-[50%]">Guardar</n-button>
                    <n-button @click="closeModalCategory()" quaternary>Cancelar</n-button>
                </div>
            </template>
        </n-modal>
    </n-modal>
</template>
