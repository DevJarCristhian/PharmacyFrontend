<script lang="ts" setup>
import { onMounted, onUpdated, ref } from 'vue'
import { Store, Permissions } from '../../../../services/interfaces/access/roles.interfaces';
import rolesServices from '../../../../services/access/roles.services'
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
const permissions = ref<Permissions[]>([])

const rules: FormRules = {
    description: [
        { required: true, message: "La descripción es Requerida", trigger: "blur" }
    ],
}

onMounted(() => {
    getPermissions()
})

onUpdated(() => {
    // formData.value.permissions = [];
    if (props.show == true) {
        formData.value = props.items as Store;
    }
})

const getPermissions = async () => {
    const response = await rolesServices.getPermissions()
    const newData = response.map((item: any) => {
        const children = item.children;
        children.unshift({ key: item.id, label: "Lista" });
        return {
            ...item,
            children: children
        };
    });

    permissions.value = newData
}


const handleSubmit = async () => {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            if (formData.value.permissions.length === 0) {
                message.warning('Debe seleccionar al menos un permiso');
                return;
            }
            loading.value = true
            formData.value.id ?
                await rolesServices.update(formData.value.id, formData.value) : await rolesServices.store(formData.value)
            // console.log(response)
            emit('refresh')
            loading.value = false
            closeModal()
            message.success(formData.value.id ? 'Rol Actualizado' : 'Rol Creado')
        } else {
            message.warning('Campos Requeridos')
        }
    })
}

const updateCheckedKeys = (keys: any) => {
    formData.value.permissions = keys
}

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};
</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        :title="formData.id ? 'Editar Rol' : 'Crear Rol'" close-on-esc style="width: 500px;" :auto-focus="false">

        <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="120"
            require-mark-placement="right-hanging" class="flex flex-col gap-1">
            <n-form-item label="Descripción" path="description">
                <n-input v-model:value="formData.description" placeholder="Ingrese Descripción" />
            </n-form-item>
            <n-form-item label="Permisos" path="permissions" class="h-72">
                <n-scrollbar style="max-height: 290px">
                    <n-tree style="font-size: 18px;" accordion expand-on-click cascade checkable selectable
                        :data="permissions" :default-checked-keys="formData.permissions"
                        @update:checked-keys="updateCheckedKeys" />
                </n-scrollbar>
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
