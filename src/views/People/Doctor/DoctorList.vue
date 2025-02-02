<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, ref, watch } from "vue";
import doctorServices from "../../../services/people/doctor.services";
import {
    Get,
    Params,
} from "../../../services/interfaces/people/doctor.interfaces";
import { DropdownOption } from "naive-ui";
// import dayjs from 'dayjs';
import JIcon from "../../../components/JIcon.vue";
import { downloadExcel, renderIcon } from "../../../utils/Functions";
import { authStores } from "../../../store/auth";
import { validateActions } from "../../../utils/Config/validate";

const add = defineAsyncComponent(() => import('./modals/ShowDoctor.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const actions = ref<string[]>();
const data = ref<Get[]>([]);
const loading = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showModal = ref<boolean>(false);
const showDropdown = ref<boolean>(false);
const x = ref<number>(0);
const y = ref<number>(0);
const params = ref<Params>({
    page: 1,
    perPage: 50,
    search: null,
    status: null,
});
const doctorData = ref<Get>({} as Get);
const pagination = ref({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    total: 0,
    pageSlot: 4,
    prefix() {
        return `${pagination.value.total} Items de ${pagination.value.pageCount} paginas`;
    },
    onUpdatePage(page: any) {
        params.value.page = page;
        pagination.value.page = page;
        getDoctor();
    },
});

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
    data.value = response.data.data;
    // console.log(response.data.data);
    pagination.value.pageCount = response.data.last_page;
    pagination.value.total = response.data.total;
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
    },
    {
        title: "F. Actualización",
        key: "updatedAt",
        width: 140,
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
    const data = await doctorServices.exportToExcel();
    await downloadExcel(data, "Lista Doctores");
    loadingExport.value = false;
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
            :show="showDropdown" :on-clickoutside="() => {
                showDropdown = false;
            }
                " @select="openModal" />
    </div>
</template>

<style scoped></style>
