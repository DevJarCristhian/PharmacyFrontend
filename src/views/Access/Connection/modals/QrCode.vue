<script lang="ts" setup>
import { ref, watch } from 'vue'
import { type FormInst } from 'naive-ui'
import mySocket from '../../../../utils/websocket/myWebsocket';

defineProps({
    show: Boolean,
    id: Number,
});

const emit = defineEmits(['close', 'refresh']);

const formRef = ref<FormInst | null>(null)
const { responseQR, responseReady } = mySocket();

watch(responseReady, () => {
    emit("refresh");
    closeModal();
})

const closeModal = () => {
    emit("close");
    formRef.value?.restoreValidation()
};
</script>
<template>
    <n-modal :show="show" :on-close="closeModal" @esc="closeModal()" preset="card" :mask-closable="false"
        title="Escanear QR" close-on-esc style="width: 650px;" :auto-focus="false">

        <div class="flex items-center gap-4 mb-4">
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    1. Abre WhatsApp en tu celular
                </div>
                <div class="flex items-center gap-2">
                    2. Toca el Menu de Opciónes
                </div>
                <div class="flex items-center gap-2">
                    3. Toca Dispositivos vinculados y luego vincular un dispositivo
                </div>
                <div class="flex items-center gap-2">
                    4. Apunta la cámara a este código QR para conectarte
                </div>
            </div>

            <div class="bg-white  w-48 h-48">
                <n-qr-code :value="responseQR" :size="170" />
            </div>
        </div>
    </n-modal>
</template>
