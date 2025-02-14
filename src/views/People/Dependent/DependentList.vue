<script setup lang="ts">
import { defineAsyncComponent, h, nextTick, onMounted, ref, watch } from 'vue';
import dependentServices from '../../../services/people/dependent.services';
import { Get, Params } from '../../../services/interfaces/people/dependent.interfaces';
import { DropdownOption, NTag } from 'naive-ui';
import JIcon from '../../../components/JIcon.vue';
import { downloadExcel, renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('./modals/ShowDependent.vue'))

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
const dependentData = ref<Get>({} as Get)
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
        getDependent()
    }
})

onMounted(() => {
    getDependent()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getDependent = async () => {
    loading.value = true
    const response = await dependentServices.get(params.value)
    // console.log(response);
    data.value = response.data
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
        key: 'fullName',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Documento',
        key: 'documentNumber',
        width: 140,
    },
    {
        title: 'Direccion',
        key: 'address',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Correo',
        key: 'email',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Genero',
        key: 'gender',
        width: 90,
        render(row: any) {
            return h(NTag, {
                type: row.gender == 1 ? 'success' : 'error',
                size: 'small',
                bordered: false,
                round: true,
            }, {
                default: () => row.gender == 1 ? 'Hombre' : 'Mujer'
            })
        }
    },
    {
        title: 'Telefono',
        key: 'phone',
        width: 120,
    },
    {
        title: 'Pais',
        key: 'countryName',
        width: 90,
    },
    {
        title: 'Departamento',
        key: 'departmentName',
        width: 120,
    },
    {
        title: 'F.Nacimiento',
        key: 'birthDate',
        width: 120,
    },
    {
        title: 'F.Inscripción',
        key: 'enrollmentDate',
        width: 120,
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
        label: 'Copiar Telefono',
        key: 'phone',
        icon: renderIcon("copy")
    },
    {
        label: 'Copiar Doocumento',
        key: 'document',
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
    dependentData.value = item
}

const openModal = (key: string) => {
    showDropdown.value = false
    if (key === 'show') {
        showModal.value = true
    }
    if (key === 'name') {
        navigator.clipboard.writeText(dependentData.value.fullName);
    }
    if (key === 'phone') {
        navigator.clipboard.writeText(dependentData.value.phone);
    }
    if (key === 'document') {
        navigator.clipboard.writeText(dependentData.value.documentNumber);
    }
}

const exportToExcel = async () => {
    loadingExport.value = true;
    const data = await dependentServices.exportToExcel();
    await downloadExcel(data, "Lista Dependientes");
    loadingExport.value = false;
}
</script>

<template>
    <div>
        <add :show="showModal" :items="dependentData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Dependientes</span>
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
            size="small" min-height="70vh" max-height="70vh" :scroll-x="1700" :row-props="rowProps">
        </n-data-table>

        <n-dropdown placement="bottom" :show-arrow="true" trigger="manual" :x="x" :y="y" :options="options"
            :show="showDropdown" :on-clickoutside="() => { showDropdown = false }" @select="openModal" />
    </div>
</template>

<style scoped></style>