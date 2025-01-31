<script setup lang="ts">
import { defineAsyncComponent, h, nextTick, onMounted, ref, watch } from 'vue';
import opportunityServices from '../../../services/sale/opportunity.services';
import { Get, Params, Store } from '../../../services/interfaces/sale/opportunity.interfaces';
import { DropdownOption, NTooltip } from 'naive-ui';
import JIcon from '../../../components/JIcon.vue';
import { downloadExcel, renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('../../../views/Sale/Opportunity/modals/AddOpportunity.vue'))

const props = defineProps<{
    path: string
}>()

const auth = authStores()
const actions = ref<string[]>()
const data = ref<Get[]>([])
const loading = ref<boolean>(false)
const loadingExport = ref<boolean>(false)
const showModal = ref<boolean>(false)
const showDropdown = ref<boolean>(false)
const x = ref<number>(0)
const y = ref<number>(0)
const params = ref<Params>({
    page: 1,
    perPage: 50,
    search: null,
    status: null,
})
const oportunityData = ref<Store>({
    description: '',
    permissions: []
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
        getOpportunity()
    }
})

onMounted(() => {
    getOpportunity()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path)
    }
}

watch(() => auth.user.permissions, getActions)

const getOpportunity = async () => {
    loading.value = true
    const response = await opportunityServices.get(params.value)
    data.value = response.data.data
    // console.log(response.data.data)
    pagination.value.pageCount = response.data.last_page
    pagination.value.total = response.data.total
    loading.value = false
}

const columns = ref([
    {
        title: 'Documento',
        key: 'invoiceSerie',
        width: 100,
        align: 'left',
        render(row: any) {
            return h('div', { style: 'text-align: left;' }, [
                h('div', { style: 'font-weight: bold;' }, row.invoiceSerie),
                h('div', row.invoiceNumber)
            ]);
        }
    },
    {
        title: 'Fecha Emisión',
        key: 'invoiceDate',
        width: 100,
    },
    {
        title: 'Paciente',
        key: 'patientFullName',
        width: 150,
        align: 'left',
        render(row: any) {
            return h('div', { style: 'text-align: left;' }, [
                h('div', { style: 'font-weight: bold;' }, row.documentNumber),
                h(NTooltip, { trigger: 'hover', placement: 'top' }, {
                    default: () => row.patientFullName,
                    trigger: () => h('div', {
                        style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'max-content',
                        }
                    }, row.patientFullName)
                })
            ]);
        }
    },

    {
        title: 'Producto',
        key: 'productName',
        ellipsis: {
            tooltip: true
        },
        width: 200,
    },

    {
        title: 'Cantidad',
        key: 'quantity',
        width: 60,
        align: 'center',
    },
    {
        title: 'Farmacia',
        key: 'farmacyName',
        ellipsis: {
            tooltip: true
        },
        width: 150,
    },
    {
        title: 'F. Creación',
        key: 'createdAt',
        width: 140,
    },
    {
        title: 'F. Actualización',
        key: 'updatedAt',
        width: 140,
    },
])


const options: DropdownOption[] = [
    {
        label: 'Complementar',
        key: 'edit',
        icon: renderIcon("edit")

    },
    {
        label: 'Copiar Nombre',
        key: 'name',
        icon: renderIcon("copy")
    },
]

const rowProps = (row: any) => {
    return {
        onContextmenu: (e: MouseEvent) => {
            console.log(row);
            e.preventDefault()
            showDropdown.value = false
            nextTick().then(() => {
                showDropdown.value = true
                x.value = e.clientX
                y.value = e.clientY
            })
        }
    }
}

const exportToExcel = async () => {
    loadingExport.value = true
    const data = await opportunityServices.exportToExcel()
    await downloadExcel(data, "Lista Oportunidades")
    loadingExport.value = false
}
</script>

<template>
    <div>
        <add :show="showModal" :items="oportunityData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Oportunidades</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <n-button v-if="actions?.includes('export')" :loading="loadingExport" size="small"
                        @click="exportToExcel" quaternary class="group" icon-placement="right">
                        <div class="hidden group-hover:block text-xs">
                            Exportar
                        </div>
                        <template #icon>
                            <j-icon w="w-7" class="opacity-70" name="excel" />
                        </template>
                    </n-button>

                    <n-button @click="pagination.onUpdatePage(1)" :loading="loading" size="small" quaternary>
                        <template #icon>
                            <j-icon w="w-[14px]" name="refresh" />
                        </template>
                    </n-button>

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
            size="small" min-height="70vh" max-height="70vh" :scroll-x="900" :row-props="rowProps">
        </n-data-table>

        <n-dropdown placement="bottom" :show-arrow="true" trigger="manual" :x="x" :y="y" :options="options"
            :show="showDropdown" :on-clickoutside="() => { showDropdown = false }"
            @select="() => { showDropdown = false }" />
    </div>
</template>

<style scoped></style>