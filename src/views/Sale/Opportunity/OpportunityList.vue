<script setup lang="ts">
import { defineAsyncComponent, h, nextTick, onMounted, ref, watch } from 'vue';
import opportunityServices from '../../../services/sale/opportunity.services';
import { Get, Params } from '../../../services/interfaces/sale/opportunity.interfaces';
import { DropdownOption, NTooltip } from 'naive-ui';
import JIcon from '../../../components/JIcon.vue';
import { downloadExcel, formatDateLa, renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('./modals/ShowOpportunity.vue'))

const props = defineProps<{
    path: string
}>()

const auth = authStores()
const actions = ref<string[]>()
const data = ref<Get[]>([])
const optionPatients = ref<any>([]);
const optionProducts = ref<any>([]);
const optionPharmacies = ref<any>([]);

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
    emissionDate: null,
    patientId: null,
    productId: null,
    pharmacyId: null,
    userId: null,
    startDate: null,
    endDate: null,

})
const searchV = ref<{
    searchP: string | null,
    searchPro: string | null,
    searchPhar: string | null,
}>({
    searchP: null,
    searchPro: null,
    searchPhar: null,
})
const opportunityData = ref<Get>({} as Get)
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
    data.value = response.data
    // console.log(response.data)
    pagination.value.pageCount = response.last_page
    pagination.value.total = response.total
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
        render(row: Get) {
            return formatDateLa(row.invoiceDate, "short");
        }
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
        title: 'Cant',
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
        title: 'F. Actualización',
        key: 'dateUpdated',
        width: 140,
        render(row: Get) {
            return formatDateLa(row.dateUpdated);
        }
    },
])


const options: DropdownOption[] = [
    {
        label: 'Complementar',
        key: 'show',
        icon: renderIcon("show")

    },
    {
        label: 'Copiar Producto',
        key: 'product',
        icon: renderIcon("copy")
    },
]

const rowProps = (row: Get) => {
    return {
        onContextmenu: (e: MouseEvent) => {
            setValues(row)
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

const setValues = (item: Get) => {
    opportunityData.value = item
    opportunityData.value.quantity = item.quantity.toString()
}

const openModal = (key: string) => {
    showDropdown.value = false
    if (key === 'show') {
        showModal.value = true
    }
    if (key === 'product') {
        navigator.clipboard.writeText(opportunityData.value.productName);
    }
}

const exportToExcel = async () => {
    loadingExport.value = true
    const data = await opportunityServices.exportToExcel(params.value)
    await downloadExcel(data, "Lista Oportunidades")
    loadingExport.value = false
}

const patientSearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        optionPatients.value = [];
        const response = await opportunityServices.getPatients(search)
        optionPatients.value = response;
    }
    if (search == "") {
        searchV.value.searchP = null;
        params.value.patientId = null;
    }
};

const selectPatient = async (value: any) => {
    const patt = await optionPatients.value.find((v: any) => v.value == value).id
    params.value.patientId = patt;
};

const productSearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        optionProducts.value = [];
        const response = await opportunityServices.getProduct(search)
        optionProducts.value = response;
    }
    if (search == "") {
        searchV.value.searchPro = null;
        params.value.productId = null;
    }
};

const selectProduct = async (value: any) => {
    const patt = await optionProducts.value.find((v: any) => v.value == value).value
    params.value.productId = patt;
};

const pharmacySearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        optionPharmacies.value = [];
        const response = await opportunityServices.getPharmacy(search)
        optionPharmacies.value = response;
    }
    if (search == "") {
        searchV.value.searchPhar = null;
        params.value.pharmacyId = null;
    }
};

const selectPharmacy = async (value: any) => {
    const patt = await optionPharmacies.value.find((v: any) => v.value == value).value
    params.value.pharmacyId = patt;
};

const clearFilters = () => {
    params.value.search = null;
    params.value.emissionDate = null;
    params.value.patientId = null;
    params.value.productId = null;
    params.value.pharmacyId = null;
    params.value.userId = null;
    params.value.startDate = null;
    params.value.endDate = null;
    searchV.value.searchP = null;
    searchV.value.searchPro = null;
    searchV.value.searchPhar = null;
    pagination.value.onUpdatePage(1)
}
</script>

<template>
    <div>
        <add :show="showModal" :items="opportunityData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Oportunidades</span>

                    <n-popover v-if="actions?.includes('filter')" placement="bottom" trigger="click">
                        <template #trigger>
                            <div
                                class="flex items-center gap-1 cursor-pointer select-none opacity-60 hover:opacity-100">
                                <j-icon w="w-[16px]" name="filter" />
                                <span>Filtros</span>
                                <j-icon w="w-[14px]" name="down" />
                            </div>
                        </template>

                        <div class="grid" style="width: 250px; height: 350px;">
                            <div>
                                <div class="mb-1">Paciente</div>
                                <n-auto-complete size="small" placeholder="Buscar" v-model:value="searchV.searchP"
                                    @update:value="patientSearch" @select="selectPatient" clearable
                                    :options="optionPatients">
                                    <template #prefix>
                                        <n-icon>
                                            <j-icon w="w-[14px]" name="search" />
                                        </n-icon>
                                    </template>
                                </n-auto-complete>
                            </div>

                            <div>
                                <div class="mb-1">Producto</div>
                                <n-auto-complete size="small" placeholder="Buscar" v-model:value="searchV.searchPro"
                                    @update:value="productSearch" @select="selectProduct" clearable
                                    :options="optionProducts">
                                    <template #prefix>
                                        <n-icon>
                                            <j-icon w="w-[14px]" name="search" />
                                        </n-icon>
                                    </template>
                                </n-auto-complete>
                            </div>

                            <div>
                                <div class="mb-1">Farmacia</div>
                                <n-auto-complete size="small" placeholder="Buscar" v-model:value="searchV.searchPhar"
                                    @update:value="pharmacySearch" @select="selectPharmacy" clearable
                                    :options="optionPharmacies">
                                    <template #prefix>
                                        <n-icon>
                                            <j-icon w="w-[14px]" name="search" />
                                        </n-icon>
                                    </template>
                                </n-auto-complete>
                            </div>

                            <!-- <div>
                                <div class="mb-1">Usuario</div>
                                <n-select size="small" filterable v-model:value="params.userId" :options="[]"
                                    placeholder="Seleccione" clearable />
                            </div> -->

                            <div>
                                <div class="mb-1">Fecha Emisión</div>
                                <n-date-picker size="small" type="date" value-format="yyyy-MM-dd HH:mm"
                                    placeholder="Seleccione" v-model:formatted-value="params.emissionDate"
                                    :actions="null" clearable />
                            </div>

                            <div class="flex items-center gap-2">
                                <div>
                                    <div class="mb-1">Fecha Inicio</div>
                                    <n-date-picker size="small" type="date" value-format="yyyy-MM-dd HH:mm"
                                        placeholder="Inicio" v-model:formatted-value="params.startDate" :actions="null"
                                        clearable />
                                </div>

                                <div>
                                    <div class="mb-1">Fecha Fin</div>
                                    <n-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="Fin"
                                        v-model:formatted-value="params.endDate" :actions="null" clearable />
                                </div>
                            </div>

                            <div class="flex gap-2 mt-3">
                                <n-button class="w-[60%]" size="small" type="primary"
                                    @click="pagination.onUpdatePage(1)">
                                    <j-icon w="w-[14px]" name="filter" />
                                    Filtrar
                                </n-button>

                                <n-button size="small" quaternary @click="clearFilters">
                                    <j-icon w="w-[14px]" name="delete" />
                                    Limpiar
                                </n-button>
                            </div>
                            <!-- <pre class="bg-black">{{ JSON.stringify(params, null, 2) }}</pre> -->
                        </div>
                    </n-popover>
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
            :show="showDropdown" :on-clickoutside="() => { showDropdown = false }" @select="openModal" />
    </div>
</template>

<style scoped></style>