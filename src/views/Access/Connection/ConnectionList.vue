<script setup lang="ts">
import { defineAsyncComponent, h, onMounted, ref, watch } from 'vue';
import connectionServices from '../../../services/access/connections.services';
import { Get, Params, Store } from './../../../services/interfaces/access/connections.interfaces';
import { NButton, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import JIcon from '../../../components/JIcon.vue';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('./modals/AddConnection.vue'))
const qrCode = defineAsyncComponent(() => import('./modals/QrCode.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const actions = ref<string[]>();
const data = ref<Get[]>([])
const loading = ref<boolean>(false)
const showModal = ref<boolean>(false)
const showModalQR = ref<boolean>(false)
const params = ref<Params>({
    page: 1,
    perPage: 50,
    search: null,
})
const connectionData = ref<Store>({} as Store)
const connectId = ref<number>(0)
const pagination = ref({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    total: 0,
    pageSlot: 4,
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

const roleReset = () => {
    connectionData.value = {
        name: '',
    }
    showModal.value = true
}

const setItems = (item: Get) => {
    connectionData.value.id = item.id
    connectionData.value.name = item.name
    // connectionData.value.session = item.session
    // connectionData.value.qrcode = item.qrcode
    // connectionData.value.status = item.status
    // connectionData.value.battery = item.battery
    // connectionData.value.plugged = item.plugged
    showModal.value = true
}

const showQR = (id: number) => {
    connectId.value = id
    showModalQR.value = true
}

const formatDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) { return '-'; }
    return dayjs(date).format('YYYY-MM-DD')
}

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
        title: 'Nombre',
        key: 'name',
        width: 180,
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
        width: 20,
        align: 'center',
        render(row: any) {
            return h(
                NButton,
                {
                    size: 'small',
                    strong: true,
                    quaternary: true,
                    onClick: () => {
                        setItems(row)
                    }
                },
                {
                    default: () => h(JIcon, { name: 'edit', w: 'w-4' })
                }
            )
        }
    }
])

</script>

<template>
    <div>
        <add :show="showModal" :items="connectionData" @close="showModal = !showModal" @refresh="getConnections()" />

        <qrCode :show="showModalQR" :id="connectId" @close="showModalQR = !showModalQR" @refresh="getConnections()" />

        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Conexiones</span>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <n-button size="small" type="primary" @click="roleReset">
                        <j-icon w="w-[14px]" name="add" />
                        Nuevo
                    </n-button>
                    <button @click="pagination.onUpdatePage(1)"
                        class="opacity-70 w-7 h-7 flex justify-center items-center hover:bg-slate-200/60 dark:hover:bg-[#141D2C] rounded-md">
                        <j-icon w="w-[12px]" name="refresh" />
                    </button>

                    <!-- <n-input style="width: 200px" placeholder="Buscar..." v-model:value="params.search"
                        @keydown.enter="pagination.onUpdatePage(1)">
                        <template #prefix>
                            <j-icon w="w-[14px]" name="search" />
                        </template>
</n-input> -->
                </div>
            </div>
        </div>

        <n-data-table remote striped :columns="columns" :loading="loading" :data="data" :pagination="pagination"
            size="small" min-height="70vh" max-height="70vh" :scroll-x="1000">
        </n-data-table>
    </div>
</template>

<style scoped></style>