<script setup lang="ts">
import { computed, defineAsyncComponent, h, onMounted, ref, watch } from 'vue';
import connectionServices from '../../../services/access/connections.services';
import { Get, Params, Store } from './../../../services/interfaces/access/connections.interfaces';
import { NButton, NDropdown, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import JIcon from '../../../components/JIcon.vue';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';
import mySocket from '../../../utils/websocket/useWebsocket';
import { renderIcon } from '../../../utils/Functions';
import { useCalendarStore } from '../../../views/Calendar/actions/useCalendarStore';


const add = defineAsyncComponent(() => import('./modals/AddConnection.vue'))
const qrCode = defineAsyncComponent(() => import('./modals/QrCode.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const storeCal = useCalendarStore()
const actions = ref<string[]>();
const data = ref<Get[]>([])
const loading = ref<boolean>(false)
const showModal = ref<boolean>(false)
const showModalQR = ref<boolean>(false)
const showDisconnect = ref<boolean>(false)
const loadingDisconnect = ref<boolean>(false)
const { responseQR, responseStatus } = mySocket();
const params = ref<Params>({
    page: 1,
    perPage: 50,
    search: null,
})
const connectionData = ref<Store>({} as Store)
const connectId = ref<number>(0)
const newQR = ref<string>('');
const pagination = ref({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    total: 0,
    pageSlot: 5,
    prefix() {
        return `${pagination.value.total} Items de ${pagination.value.pageCount} paginas`
    },
    onUpdatePage(page: any) {
        params.value.page = page
        pagination.value.page = page
        getConnections()
    }
})

onMounted(() => {
    getConnections()
    getActions()
})

// Watch for changes in the QR code
watch(responseQR, () => {
    newQR.value = responseQR.value
    if (data.value.length > 0) {
        data.value.map(item => {
            if (item.id === connectId.value) {
                return { ...item, qrcode: newQR.value };
            }
            return item;
        });
    }
})

// Watch for response Status
watch(responseStatus, () => {
    showModalQR.value = false
    loading.value = true

    setTimeout(() => {
        getConnections()
    }, 1000);
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getConnections = async () => {
    loading.value = true
    const response = await connectionServices.get(params.value)
    data.value = response
    // console.log(response);
    pagination.value.total = data.value.length
    loading.value = false
}

const wsReset = () => {
    connectionData.value = {
        name: '',
        battery: '',
    }
    showModal.value = true
}

const setItems = (item: Get) => {
    connectionData.value.id = item.id
    connectionData.value.name = item.name
    connectionData.value.battery = item.battery
    showModal.value = true
}

const showQR = (id: number) => {
    connectId.value = id
    showModalQR.value = true
    if (newQR.value === '') {
        newQR.value = data.value.find(item => item.id === id)?.qrcode || '';
    }
}

const formatDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) { return '-'; }
    return dayjs(date).format('YYYY-MM-DD HH:mm');
}

// const optionsMenu = ref([
//     {
//         label: "Modificar",
//         key: 'edit',
//         icon: renderIcon("edit", "w-3")
//     },
//     {
//         label: 'Desconectar',
//         key: 'disconnect',
//         disabled: storeCal.activeWhatsapp === 'Conectado' ? false : true,
//         icon: renderIcon("logout", "w-3")
//     }
// ])

const optionsMenu = computed(() => [
    {
        label: "Modificar",
        key: 'edit',
        icon: renderIcon("edit", "w-3")
    },
    {
        label: 'Desconectar',
        key: 'disconnect',
        disabled: storeCal.activeWhatsapp === 'Conectado' ? false : true,
        icon: renderIcon("logout", "w-3")
    }
])

const columns = ref([
    {
        title: '#',
        key: 'index',
        width: 50,
        align: 'center',
        render(_, index: number) {
            return index + 1
        }
    },
    {
        title: 'Descripción',
        key: 'name',
        width: 180,
    },
    {
        title: 'Numero',
        key: 'battery',
        width: 100,
    },
    {
        title: 'Codigo QR',
        key: 'actions',
        width: 200,
        align: 'center',
        render(row: any) {
            if (row.status == 'Conectado') { return "Vinculado"; }
            return h(
                NButton,
                {
                    size: 'small',
                    strong: true,
                    secondary: true,
                    onClick: () => {
                        showQR(row.id)
                    }
                },
                {
                    default: () => [h(JIcon, { name: 'qr', w: 'w-4' }), h('span', { style: { marginLeft: '4px' } }, 'Escanear')],
                }
            )
        }
    },
    {
        title: 'Estado',
        key: 'status',
        width: 150,
        render(row: any) {
            return h(
                NTag,
                {
                    type: row.status == 'Conectado' ? 'success' : 'error',
                    bordered: false,
                    round: true,
                    size: 'small',
                },
                {
                    default: () => row.status
                }
            )
        }
    },
    {
        title: 'Fecha de actualización',
        key: 'updatedAt',
        width: 150,
        render(row: any) {
            return formatDate(row.updatedAt)
        }
    },
    {
        title: '',
        key: 'actions',
        width: 40,
        align: 'center',
        render(row: any) {
            return h(
                NDropdown,
                {
                    trigger: "click",
                    options: optionsMenu.value,
                    onSelect: (key: string) => {
                        if (key === 'edit') {
                            setItems(row)
                        }
                        if (key === 'disconnect') {
                            showDisconnect.value = true
                        }
                    }
                },
                {
                    default: () =>
                        h(
                            NButton,
                            {
                                size: 'small',
                                strong: true,
                                quaternary: true,
                            },
                            { default: () => '⋮' }
                        )
                }
            )
        }
    }
])

const disconnectWhatsapp = async () => {
    loadingDisconnect.value = true
    const response = await connectionServices.disconnectWhatsapp()

    if (response) {
        setTimeout(async () => {
            await getConnections()
            loadingDisconnect.value = false
            showDisconnect.value = false
        }, 8000);
    }
}

const closeModal = () => {
    showDisconnect.value = false
    loadingDisconnect.value = false
}

</script>

<template>
    <div>
        <add :show="showModal" :items="connectionData" @close="showModal = !showModal" @refresh="getConnections()" />
        <qrCode :show="showModalQR" :id="connectId" @close="showModalQR = !showModalQR" :qr-connetion="newQR" />

        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Conexion de Whastapp</span>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <n-button v-if="data.length === 0" size="small" type="primary" @click="wsReset">
                        <j-icon w="w-[14px]" name="add" />
                        Nuevo
                    </n-button>
                    <button @click="pagination.onUpdatePage(1)"
                        class="opacity-70 w-7 h-7 flex justify-center items-center hover:bg-slate-200/60 dark:hover:bg-[#141D2C] rounded-md">
                        <j-icon w="w-[12px]" name="refresh" />
                    </button>
                </div>
            </div>
        </div>

        <n-data-table remote striped :columns="columns" :loading="loading" :data="data" :pagination="pagination"
            size="small" min-height="70vh" max-height="70vh" :scroll-x="1000">
        </n-data-table>

        <div>
            <n-modal :show="showDisconnect">
                <n-card style="width: 300px" title="Desconectar Whatsapp" :bordered="false" role="dialog">

                    <div class="text-sm text-gray-500 mb-4 -mt-3">
                        Se procedera a cerrar la session. <strong>(Esto impide que se realize envios de
                            Whastapp)</strong>
                    </div>

                    <div class="flex gap-2 justify-end">
                        <n-button type="error" :loading="loadingDisconnect" @click="disconnectWhatsapp"
                            class="min-w-[35%]">
                            <j-icon w="w-4" name="logout" />
                            Cerrar Sesion
                        </n-button>

                        <n-button @click="closeModal()" quaternary :disabled="loadingDisconnect">Cancelar</n-button>
                    </div>
                </n-card>
            </n-modal>
        </div>
    </div>
</template>

<style scoped></style>