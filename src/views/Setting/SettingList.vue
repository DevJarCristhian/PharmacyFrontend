<script setup lang="ts">
import { defineAsyncComponent, h, onMounted, ref, watch } from 'vue';
import maintenanceServices from '../../services/setting/maintenance.services';
import { Get, Params, Store } from '../../services/interfaces/setting/maintenance.interfaces';
import { NButton, NTag } from 'naive-ui';
import JIcon from '../../components/JIcon.vue';
import { validateActions } from '../../utils/Config/validate';
import { authStores } from '../../store/auth';

const add = defineAsyncComponent(() => import('./modals/AddMaintenance.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const actions = ref<string[]>();
const data = ref<Get[]>([])
const loading = ref<boolean>(false)
const showModal = ref<boolean>(false)
const params = ref<Params>({
    page: 1,
    perPage: 50,
    search: null,
})
const maintenanceData = ref<Store>({
    description: '',
    maintenanceId: null,
    status: true,
})
const pagination = ref({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    total: 0,
    pageSlot: 4,
    prefix() {
        return `${pagination.value.total} Items de ${pagination.value.pageCount} paginas`
    },
    async onUpdatePage(page: any) {
        params.value.page = page
        pagination.value.page = page
        await getMaintenance()
    }
})

onMounted(() => {
    getMaintenance()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getMaintenance = async () => {
    loading.value = true
    const response = await maintenanceServices.getChild(params.value)
    // console.log(response.data.data);
    data.value = response.data.data
    pagination.value.pageCount = response.data.last_page
    pagination.value.total = response.data.total
    loading.value = false
}

const setItems = (item: Get) => {
    maintenanceData.value.id = item.id
    maintenanceData.value.description = item.description
    maintenanceData.value.maintenanceId = item.maintenanceId
    maintenanceData.value.status = item.status == 1 ? true : false
    showModal.value = true
}

const maintenanceReset = () => {
    maintenanceData.value = {
        description: '',
        maintenanceId: null,
        status: true,
    }
    showModal.value = true
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
        title: 'Categoria',
        key: 'category',
    },
    {
        title: 'Descripción',
        key: 'description',
    },
    {
        title: 'Estado',
        key: 'status',
        render(row: any) {
            return h(
                NTag,
                {
                    type: row.status == 1 ? 'success' : 'error',
                    bordered: false,
                    round: true,
                    size: 'small',
                },
                {
                    default: () => row.status == 1 ? 'Activo' : 'Inactivo'
                }
            )
        }
    },
    {
        title: '',
        key: 'actions',
        width: 60,
        align: 'center',
        render(row: any) {
            if (!actions?.value?.includes('update')) { return; }
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
        <n-tabs type="line" animated>
            <n-tab-pane name="maintenance" tab="Mantenimientos">
                <add :show="showModal" :items="maintenanceData" @close="showModal = !showModal"
                    @refresh="pagination.onUpdatePage(1)" />
                <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
                    <div class="flex flex-wrap justify-between gap-1 items-center">
                        <div class="flex items-center gap-4">
                            <span class="text-lg -mt-1">Padres/Hijos</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <n-button v-if="actions?.includes('add')" size="small" type="primary"
                                @click="maintenanceReset">
                                <j-icon w="w-[14px]" name="add" />
                                Nuevo
                            </n-button>

                            <n-button @click="pagination.onUpdatePage(1)" :loading="loading" size="small" quaternary>
                                <template #icon>
                                    <j-icon w="w-[14px]" name="refresh" />
                                </template>
                            </n-button>

                            <n-input style="width: 200px" placeholder="Buscar..." v-model:value="params.search"
                                @keydown.enter="pagination.onUpdatePage(1)">
                                <template #prefix>
                                    <j-icon w="w-[14px]" name="search" />
                                </template>
                            </n-input>
                        </div>
                    </div>
                </div>

                <n-data-table remote striped :columns="columns" :loading="loading" :data="data" :pagination="pagination"
                    size="small" min-height="60vh" max-height="70vh" :scroll-x="800">
                </n-data-table>
            </n-tab-pane>
            <n-tab-pane name="others" tab="Otros">
                En desarrollo
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<style scoped></style>