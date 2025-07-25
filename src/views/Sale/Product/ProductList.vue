<script setup lang="ts">
import { defineAsyncComponent, h, nextTick, onMounted, ref, watch } from 'vue';
import productServices from '../../../services/sale/product.services';
import { Get, Params, } from '../../../services/interfaces/sale/product.interfaces';
import { DropdownOption, NTag } from 'naive-ui';
import JIcon from '../../../components/JIcon.vue';
import { downloadExcel, renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('./modals/ShowProduct.vue'))

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
    search: null
})
const productData = ref<Get>({} as Get)
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
        getProduct()
    }
})

onMounted(() => {
    getProduct()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getProduct = async () => {
    loading.value = true
    const response = await productServices.get(params.value)
    data.value = response.data
    // console.log(response.data);
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
        title: 'Nombre',
        key: 'name',
        ellipsis: {
            tooltip: true
        },
        width: 210,
    },
    {
        title: 'Descripción',
        key: 'description',
        ellipsis: {
            tooltip: true
        },
        width: 170,
    },
    {
        title: 'Descripción Larga',
        key: 'longDescription',
        ellipsis: {
            tooltip: true
        },
        width: 170,
    },
    {
        title: 'Recibe',
        key: 'receive',
        width: 100,
        align: 'center',
    },
    {
        title: 'Condición',
        key: 'condition',
        width: 100,
        align: 'center',
    },
    {
        title: 'Maximo Canjes',
        key: 'maxRedemptions',
        width: 130,
        align: 'center',
    },
    {
        title: 'Linea',
        key: 'line',
        width: 130,
        align: 'center',
    },
    {
        title: 'Estado',
        key: 'status',
        width: 80,
        render(row: any) {
            return h(NTag, {
                type: row.status == 1 ? 'success' : 'error', bordered: false,
                round: true,
                size: 'small',
            }, () => row.status == 1 ? 'Activo' : 'Inactivo')
        }
    },
    {
        title: 'Guatemala',
        key: 'guatemala',
        width: 120,
        align: 'center',
    },
    {
        title: 'Honduras',
        key: 'honduras',
        width: 120,
        align: 'center',

    },
    {
        title: 'Panama',
        key: 'panama',
        width: 120,
        align: 'center',
    },
    {
        title: 'Nicaragua',
        key: 'nicaragua',
        width: 120,
        align: 'center',
    },
    {
        title: 'Costa Rica',
        key: 'costarica',
        width: 120,
        align: 'center',
    },
])


const options: DropdownOption[] = [
    {
        label: 'Mostrar',
        key: 'show',
        icon: renderIcon("show")

    },
    {
        label: 'Copiar Nombre',
        key: 'name',
        icon: renderIcon("copy")
    },
    {
        label: 'Copiar Descripción',
        key: 'description',
        icon: renderIcon("copy")
    },
    {
        label: 'Copiar Descripción Larga',
        key: 'longDescription',
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
    productData.value = item
    productData.value.costarica = item.costarica.toString()
    productData.value.guatemala = item.guatemala.toString()
    productData.value.honduras = item.honduras.toString()
    productData.value.nicaragua = item.nicaragua.toString()
    productData.value.panama = item.panama.toString()
    productData.value.status = item.status.toString()
    productData.value.line = item.line.toString()
    productData.value.maxRedemptions = item.maxRedemptions.toString()
    productData.value.condition = item.condition.toString()
    productData.value.observation = item.observation
}

const openModal = (key: string) => {
    showDropdown.value = false
    if (key === 'show') {
        showModal.value = true
    }
    if (key === 'name') {
        navigator.clipboard.writeText(productData.value.name);
    }
    if (key === 'description') {
        navigator.clipboard.writeText(productData.value.description);
    }
    if (key === 'longDescription') {
        navigator.clipboard.writeText(productData.value.longDescription);
    }
}

const exportToExcel = async () => {
    loadingExport.value = true
    const data = await productServices.exportToExcel(params.value)
    await downloadExcel(data, "Lista Productos")
    loadingExport.value = false
}

const clearFilters = () => {
    params.value.page = 1
    params.value.search = null
    pagination.value.page = 1
    getProduct()
}
</script>

<template>
    <div>
        <add :show="showModal" :items="productData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Productos</span>
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
            size="small" min-height="70vh" max-height="70vh" :scroll-x="1900" :row-props="rowProps"
            style="font-size: 12.5px;">
        </n-data-table>

        <n-dropdown placement="bottom" :show-arrow="true" trigger="manual" :x="x" :y="y" :options="options"
            :show="showDropdown" :on-clickoutside="() => { showDropdown = false }" @select="openModal" />
    </div>
</template>

<style scoped></style>