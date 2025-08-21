<script setup lang="ts">
import { defineAsyncComponent, h, nextTick, onMounted, ref, toRefs, watch } from 'vue';
import priceServices from '../../../services/sale/price.services';
import { Get, Params } from '../../../services/interfaces/sale/price.interfaces';
import { DropdownOption, NTag } from 'naive-ui';
import JIcon from '../../../components/JIcon.vue';
import { downloadExcel, renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';
import { allStore } from '../../../store/all';

const add = defineAsyncComponent(() => import('./modals/ShowPrice.vue'))

const props = defineProps<{
    path: string
}>();

const auth = authStores()
const actions = ref<string[]>()
const { countries } = toRefs(allStore())
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
    country: 0,
    search: null,
})
const priceData = ref<Get>({} as Get)
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
        getPrice()
    }
})

onMounted(() => {
    getPrice()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getPrice = async () => {
    loading.value = true
    const response = await priceServices.get(params.value)
    data.value = response.data
    // console.log(response);
    pagination.value.pageCount = response.last_page
    pagination.value.total = response.total
    loading.value = false
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
        title: 'Producto',
        key: 'productName',
        ellipsis: {
            tooltip: true
        },
        width: 210,
    },
    {
        title: 'Precio',
        key: 'price',
        width: 100,
    },
    {
        title: 'Cadena',
        key: 'chainName',
        ellipsis: {
            tooltip: true
        },
        width: 170,
    },
    {
        title: 'Pais',
        key: 'countryName',
        width: 130,
    },
    {
        title: 'Estado',
        key: 'status',
        width: 140,
        render(row: any) {
            return h(
                NTag,
                {
                    type: row.status == 1 ? "success" : "error",
                    size: "small",
                    bordered: false,
                    round: true,
                },
                {
                    default: () => (row.status == 1 ? "Activo" : "Inactivo"),
                }
            );
        },
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
        key: 'name',
        icon: renderIcon("copy")
    },
]

const rowProps = (row: any) => {
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
    priceData.value = item
}
const openModal = (key: string) => {
    showDropdown.value = false
    if (key === 'show') {
        showModal.value = true
    } else {
        navigator.clipboard.writeText(priceData.value.productName);
    }
}

const exportToExcel = async () => {
    loadingExport.value = true
    const data = await priceServices.exportToExcel(params.value)
    await downloadExcel(data, "Lista de Precios")
    loadingExport.value = false
}

const clearFilters = () => {
    params.value.page = 1
    params.value.search = null
    pagination.value.page = 1
    params.value.country = 0
    getPrice()
}
</script>

<template>
    <div>
        <add :show="showModal" :items="priceData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Precios</span>

                    <n-popselect v-model:value="params.country" :options="countries"
                        @update:value="pagination.onUpdatePage(1)">
                        <div class="flex items-center gap-1 cursor-pointer select-none opacity-60 hover:opacity-100">
                            <j-icon w="w-[16px]" name="filter" />
                            <span>{{countries.find(c => c.value == params.country)?.label}}</span>
                            <j-icon w="w-[14px]" name="down" />
                        </div>
                    </n-popselect>
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

                    <n-button @click="clearFilters" :loading="loading" size="small" quaternary>
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