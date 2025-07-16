<script setup lang="ts">
import { defineAsyncComponent, h, onMounted, ref, watch } from 'vue';
import templatesServices from '../../../services/whatsapp/template.services';
import { Get, Params, Store } from './../../../services/interfaces/whatsapp/template.interfaces';
import { NButton, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import JIcon from '../../../components/JIcon.vue';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('./modals/AddTemplates.vue'))

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
    search: null
})
const templateData = ref<Store>({
    type: 1,
    name: '',
    message: '',
    contentType: 1,
    file: null,
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
    onUpdatePage(page: any) {
        params.value.page = page
        pagination.value.page = page
        getTemplates()
    }
})

onMounted(() => {
    getTemplates()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getTemplates = async () => {
    loading.value = true
    const response = await templatesServices.get(params.value)
    data.value = response
    // console.log(response);
    pagination.value.total = response.length
    // pagination.value.pageCount = response.data.last_page
    // pagination.value.total = response.data.total
    loading.value = false
}

const templateReset = () => {
    templateData.value = {
        type: 1,
        name: '',
        message: '',
        contentType: 1,
        file: null,
    }
    showModal.value = true
}

const setItems = (item: Get) => {
    templateData.value.id = item.id
    templateData.value.name = item.name
    templateData.value.message = item.message
    templateData.value.type = item.type
    templateData.value.contentType = item.contentType
    templateData.value.file = item.file
    showModal.value = true
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
        title: 'Tipo',
        key: 'type',
        render(row: any) {
            return h(NTag, {
                type: row.type == 1 ? 'success' : 'info',
                size: 'small',
                bordered: false,
                round: true,
            }, {
                default: () => row.type == 1 ? 'Reenvio' : 'Programado'
            })
        }
    },
    {
        title: 'Nombre',
        key: 'name'
    },
    {
        title: 'Mensaje',
        key: 'message',
        render(row: any) {
            return h(
                'div',
                {
                    class: 'overflow-hidden text-ellipsis whitespace-nowrap w-30',
                },
                row.message
            );
        }
    },
    {
        title: 'Contenido',
        key: 'contentType',
        render(row: any) {
            return row.contentType == 1 ? 'Solo Mensaje' : 'Mensaje con Imagen'
        }
    },
    {
        title: 'Fecha de creación',
        key: 'createdAt',
        render(row: any) {
            return formatDate(row.createdAt)
        }
    },
    {
        title: 'Fecha de actualización',
        key: 'updatedAt',
        render(row: any) {
            return formatDate(row.updatedAt)
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

const clearFilters = () => {
    params.value.page = 1
    params.value.search = null
    pagination.value.page = 1
    getTemplates()
}
</script>

<template>
    <div>
        <add :show="showModal" :items="templateData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Plantillas</span>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <n-button v-if="actions?.includes('add')" size="small" type="primary" @click="templateReset">
                        <j-icon w="w-[14px]" name="add" />
                        Nuevo
                    </n-button>
                    <button @click="clearFilters"
                        class="opacity-70 w-7 h-7 flex justify-center items-center hover:bg-slate-200/60 dark:hover:bg-[#141D2C] rounded-md">
                        <j-icon w="w-[12px]" name="refresh" />
                    </button>

                    <n-input v-if="actions?.includes('filter')" style="width: 200px" placeholder="Buscar..."
                        v-model:value="params.search" @keydown.enter="pagination.onUpdatePage(1)">
                        <template #prefix>
                            <j-icon w="w-[14px]" name="search" />
                        </template>
                    </n-input>
                </div>
            </div>
        </div>

        <n-data-table remote striped :columns="columns" :loading="loading" :data="data" :pagination="pagination"
            size="small" min-height="70vh" max-height="70vh" :scroll-x="1000">
        </n-data-table>
    </div>
</template>

<style scoped></style>