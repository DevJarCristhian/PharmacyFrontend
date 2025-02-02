<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Get } from '../../../../services/interfaces/sale/product.interfaces';
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
        title="Producto" close-on-esc style="width: 700px;" :auto-focus="false">

        <n-form ref="formRef" :model="items" class="-mt-2">
            <n-grid x-gap="12" cols="12 200:1 450:12">
                <n-form-item-gi span="8" label="Nombre">
                    <n-input v-model:value="items.name" readonly placeholder="" :maxlength="3" />
                </n-form-item-gi>

                <n-form-item-gi span="4" label="Unidad de Medida">
                    <n-input v-model:value="items.unitMeasure" readonly placeholder="" :maxlength="3" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 200:1 450:12">
                <n-form-item-gi span="8" label="Descripción">
                    <n-input v-model:value="items.description" readonly placeholder="" :maxlength="3" />
                </n-form-item-gi>

                <n-form-item-gi span="4" label="Recibe">
                    <n-input v-model:value="items.receive" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 200:1 450:12">
                <n-form-item-gi span="9" label="Descripción Larga">
                    <n-input v-model:value="items.longDescription" readonly placeholder="" :maxlength="20" />
                </n-form-item-gi>

                <n-form-item-gi span="3" label="Maximo Canjes">
                    <n-input v-model:value="items.maxRedemptions" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="24 100:1 450:24">
                <n-form-item-gi span="9" label="Linea">
                    <n-input v-model:value="items.line" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="9" label="Condición">
                    <n-input v-model:value="items.condition" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="6" label="Guatemala">
                    <n-input v-model:value="items.guatemala" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="3" label="Costa Rica">
                    <n-input v-model:value="items.costarica" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="3" label="Nicaragua">
                    <n-input v-model:value="items.nicaragua" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="3" label="Panama">
                    <n-input v-model:value="items.panama" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="3" label="Honduras">
                    <n-input v-model:value="items.honduras" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="9" label="Observación">
                    <n-input v-model:value="items.observation" readonly placeholder="" />
                </n-form-item-gi>
                <n-form-item-gi span="3" label="Estado">
                    <n-input v-model:value="items.status" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>
            <!-- <pre>{{ JSON.stringify(items, null, 2) }}</pre> -->
        </n-form>
    </n-modal>
</template>
