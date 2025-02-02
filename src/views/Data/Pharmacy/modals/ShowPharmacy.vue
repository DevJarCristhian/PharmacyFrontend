<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Get } from '../../../../services/interfaces/data/pharmacy.interfaces';
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
        title="Farmacia" close-on-esc style="width: 600px;" :auto-focus="false">

        <n-form ref="formRef" :model="items" class="-mt-2">
            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="9" label="Sucusal">
                    <n-input v-model:value="items.branch" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="3" label="Cadena">
                    <n-input v-model:value="items.chainName" readonly placeholder="" />
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

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="6" label="Email">
                    <n-input v-model:value="items.email" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="6" label="Telefono">
                    <n-input v-model:value="items.phone" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="12" label="Municipalidad">
                    <n-input v-model:value="items.municipality" readonly placeholder="-" />
                </n-form-item-gi>
            </n-grid>

            <!-- <pre>{{ JSON.stringify(items, null, 2) }}</pre> -->
        </n-form>
    </n-modal>
</template>
