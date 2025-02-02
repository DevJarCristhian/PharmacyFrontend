<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Get } from '../../../../services/interfaces/people/dependent.interfaces';
import { type FormInst } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
});

const emit = defineEmits(['close', 'refresh']);

const formRef = ref<FormInst | null>(null)
const items = ref<Get>(props.items as Get)

watch(props, (newVal) => {
    items.value = newVal.items as Get;
})

const closeModal = () => {
    emit("close");
};

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        title="Dependiente" close-on-esc style="width: 600px;" :auto-focus="false">

        <n-form ref="formRef" :model="items" class="-mt-2">
            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="3" label="Documento">
                    <n-input v-model:value="items.documentNumber" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="9" label="Nombre">
                    <n-input v-model:value="items.fullName" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="2" label="Genero">
                    <n-tag class="w-full flex justify-center" :type="items.gender === 1 ? 'success' : 'error'" bordered
                        round>
                        {{ items.gender === 1 ? 'Hombre' : 'Mujer' }}
                    </n-tag>
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

            <!-- <pre>{{ JSON.stringify(items, null, 2) }}</pre> -->
        </n-form>
    </n-modal>
</template>
