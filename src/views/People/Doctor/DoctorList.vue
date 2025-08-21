<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, ref, toRefs, watch } from "vue";
import doctorServices from "../../../services/people/doctor.services";
import {
    Get,
    Params,
} from "../../../services/interfaces/people/doctor.interfaces";
import { DropdownOption } from "naive-ui";
import JIcon from "../../../components/JIcon.vue";
import { downloadExcel, formatDateLa, renderIcon } from "../../../utils/Functions";
import { authStores } from "../../../store/auth";
import { validateActions } from "../../../utils/Config/validate";
import { allStore } from "../../../store/all";

const add = defineAsyncComponent(() => import('./modals/ShowDoctor.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const actions = ref<string[]>();
const { countries } = toRefs(allStore())
const data = ref<Get[]>([]);
const optionDeparment = ref<any>([]);
const optionCity = ref<any>([]);
const loading = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showModal = ref<boolean>(false);
const showDropdown = ref<boolean>(false);
const x = ref<number>(0);
const y = ref<number>(0);
const params = ref<Params>({
    page: 1,
    perPage: 50,
    country: 0,
    search: null,
    department: null,
    city: null,
    startDate: null,
    endDate: null,
});
const doctorData = ref<Get>({} as Get);
const pagination = ref({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    total: 0,
    pageSlot: 5,
    prefix() {
        return `${pagination.value.total} Items de ${pagination.value.pageCount} paginas`;
    },
    onUpdatePage(page: any) {
        params.value.page = page;
        pagination.value.page = page;
        getDoctor();
    },
});
const searchV = ref<{
    searchcity: string | null,
    searchDep: string | null,
}>({
    searchcity: null,
    searchDep: null,
})

onMounted(() => {
    getDoctor();
    getActions();
});

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
};

watch(() => auth.user.permissions, getActions);

const getDoctor = async () => {
    loading.value = true;
    const response = await doctorServices.get(params.value);
    data.value = response.data;
    // console.log(response.data);
    pagination.value.pageCount = response.last_page;
    pagination.value.total = response.total;
    loading.value = false;
};

const columns = ref([
    {
        title: "#",
        key: "index",
        width: 50,
        align: "center",
        render(_, index: number) {
            return index + 1;
        },
    },
    {
        title: "Nombre",
        key: "name",
        ellipsis: {
            tooltip: true,
        },
        width: 210,
    },
    {
        title: "Direccion",
        key: "address",
        ellipsis: {
            tooltip: true,
        },
        width: 170,
    },
    {
        title: "Pais",
        key: "countryName",
        width: 100,
    },
    {
        title: "Departamento",
        key: "departmentName",
        width: 130,
    },
    {
        title: "Municipio",
        key: "city",
        width: 130,
    },
    {
        title: "F. Creación",
        key: "date",
        width: 140,
        render(row: any) {
            return formatDateLa(row.date);
        },
    },
    {
        title: "F. Actualización",
        key: "updatedAt",
        width: 140,
        render(row: any) {
            return formatDateLa(row.updatedAt);
        },
    },
]);

const options: DropdownOption[] = [
    {
        label: "Mostrar",
        key: "show",
        icon: renderIcon("edit"),
    },
    {
        label: "Copiar Nombre",
        key: "name",
        icon: renderIcon("copy"),
    },
];

const rowProps = (row: any) => {
    return {
        onContextmenu: (e: MouseEvent) => {
            setValues(row)
            e.preventDefault();
            showDropdown.value = false;
            nextTick().then(() => {
                showDropdown.value = true;
                x.value = e.clientX;
                y.value = e.clientY;
            });
        },
    };
};

const setValues = (item: Get) => {
    doctorData.value = item
}

const openModal = (key: string) => {
    showDropdown.value = false
    if (key === 'show') {
        showModal.value = true
    } else {
        navigator.clipboard.writeText(doctorData.value.name);
    }
}

const exportToExcel = async () => {
    loadingExport.value = true;
    const data = await doctorServices.exportToExcel(params.value);
    await downloadExcel(data, "Lista Doctores");
    loadingExport.value = false;
}

const deparmentSearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        optionDeparment.value = [];
        const response = await doctorServices.getDepartment(search)
        optionDeparment.value = response;
    } else if (search == "") {
        searchV.value.searchDep = null;
        params.value.department = null;
    }
};

const selectDepartment = async (value: any) => {
    const patt = await optionDeparment.value.find((v: any) => v.value == value).value
    params.value.department = patt;
};

const citySearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        optionCity.value = [];
        const response = await doctorServices.getCity(search)
        optionCity.value = response;
    } else if (search == "") {
        searchV.value.searchcity = null;
        params.value.city = null;
    }
};

const selectCity = async (value: any) => {
    const patt = await optionCity.value.find((v: any) => v.value == value).value
    params.value.city = patt;
};

const clearFilters = () => {
    params.value.search = null;
    params.value.department = null;
    params.value.city = null;
    params.value.startDate = null;
    params.value.endDate = null;
    searchV.value.searchDep = null;
    searchV.value.searchcity = null;
    params.value.country = 0;
    params.value.page = 1;
    pagination.value.page = 1;
    getDoctor();
}

</script>

<template>
    <div>
        <add :show="showModal" :items="doctorData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Doctores</span>

                    <n-popover v-if="actions?.includes('filter')" placement="bottom" trigger="click">
                        <template #trigger>
                            <div
                                class="flex items-center gap-1 cursor-pointer select-none opacity-60 hover:opacity-100">
                                <j-icon w="w-[16px]" name="filter" />
                                <span>Filtros</span>
                                <j-icon w="w-[14px]" name="down" />
                            </div>
                        </template>

                        <div class="grid" style="width: 250px; height: 270px;">
                            <div>
                                <div class="mb-1">Pais</div>
                                <n-select size="small" v-model:value="params.country" :options="countries"
                                    placeholder="Seleccione" />
                            </div>
                            <div>
                                <div class="mb-1">Departamento</div>
                                <n-auto-complete size="small" placeholder="Buscar" v-model:value="searchV.searchDep"
                                    @update:value="deparmentSearch" @select="selectDepartment" clearable
                                    :options="optionDeparment">
                                    <template #prefix>
                                        <n-icon>
                                            <j-icon w="w-[14px]" name="search" />
                                        </n-icon>
                                    </template>
                                </n-auto-complete>
                            </div>

                            <div>
                                <div class="mb-1">Municipio</div>
                                <n-auto-complete size="small" placeholder="Buscar" v-model:value="searchV.searchcity"
                                    @update:value="citySearch" @select="selectCity" clearable :options="optionCity">
                                    <template #prefix>
                                        <n-icon>
                                            <j-icon w="w-[14px]" name="search" />
                                        </n-icon>
                                    </template>
                                </n-auto-complete>
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
            :show="showDropdown" :on-clickoutside="() => {
                showDropdown = false;
            }
                " @select="openModal" />
    </div>
</template>

<style scoped></style>
