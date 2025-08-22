<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Get } from '../../../../services/interfaces/sale/price.interfaces';
import priceServices from '../../../../services/sale/price.services';
import { FormRules, useMessage, type FormInst } from 'naive-ui'

const props = defineProps({
    show: Boolean,
    items: Object as () => Get,
})

const emit = defineEmits(['close', 'refresh'])

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const items = ref<Get>(props.items as Get)
const formPrice = ref<{ price: string }>({ price: '0' })
const loading = ref<boolean>(false)

watch(props, (newVal) => {
    items.value = newVal.items as Get
    formPrice.value.price = items.value.price.toString()
})

const rules: FormRules = {
    price: [
        { required: true, message: "El Precio es Requerido", trigger: "blur" }
    ],
}

const updatePrice = async () => {
    formRef.value?.validate(async (errors) => {
        try {
            if (!errors) {
                loading.value = true
                await priceServices.update(props.items.id, { price: formPrice.value.price, chainId: props.items.chainId })

                emit('refresh')
                closeModal()

                message.success('Precio Actualizado')
            } else {
                message.warning('Precio Requerido')
            }
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    })
}

const closeModal = () => {
    emit("close")
};

</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false" title="Cadena"
        close-on-esc style="width: 600px;" :auto-focus="false">

        <n-form ref="formRef" :model="formPrice" :rules="rules" class="-mt-2">
            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="8" label="Producto">
                    <n-input v-model:value="items.productName" readonly placeholder="" />
                </n-form-item-gi>
                <n-form-item-gi span="4" label="Precio" path="price">
                    <n-input type="number" v-model:value="formPrice.price" placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="12" label="Cadena">
                    <n-input v-model:value="items.chainName" readonly placeholder="" />
                </n-form-item-gi>
            </n-grid>

            <n-grid x-gap="12" cols="12 100:1 450:12">
                <n-form-item-gi span="8" label="Pais">
                    <n-input v-model:value="items.countryName" readonly placeholder="" />
                </n-form-item-gi>

                <n-form-item-gi span="4" label="Estado">
                    <n-tag :bordered="false" :type="items.status == 1 ? 'success' : 'error'" round>
                        {{ items.status == 1 ? 'Activo' : 'Inactivo' }}
                    </n-tag>
                </n-form-item-gi>
            </n-grid>

            <!-- <pre>{{ JSON.stringify(items, null, 2) }}</pre> -->
        </n-form>

        <template #footer>
            <div class="flex gap-2 justify-end -mt-3">
                <n-button @click="closeModal" quaternary>Cancelar</n-button>
                <n-button type="primary" :loading="loading" @click="updatePrice()"
                    class="min-w-[20%]">Guardar</n-button>
            </div>
        </template>
    </n-modal>
</template>
