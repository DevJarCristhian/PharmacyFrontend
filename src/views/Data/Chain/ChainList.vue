<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue';
import chainServices from '../../../services/data/chain.services';
import { Get, Params, Store } from '../../../services/interfaces/data/chain.interfaces';
import { DropdownOption } from 'naive-ui';
// import dayjs from 'dayjs';
import JIcon from '../../../components/JIcon.vue';
import { renderIcon } from '../../../utils/Functions';
import { authStores } from '../../../store/auth';
import { validateActions } from '../../../utils/Config/validate';

const add = defineAsyncComponent(() => import('../../../views/Data/Chain/modals/AddChain.vue'))

const props = defineProps<{
    path: string;
}>();

const auth = authStores();
const actions = ref<string[]>();
const data = ref<Get[]>([])
const loading = ref<boolean>(false)
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
const chainData = ref<Store>({
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
        getChain()
    }
})

onMounted(() => {
    getChain()
    getActions()
})

const getActions = () => {
    if (auth.user.permissions) {
        actions.value = validateActions(auth.user.permissions, props.path);
    }
}

watch(() => auth.user.permissions, getActions);

const getChain = async () => {
    loading.value = true
    const response = await chainServices.get(params.value)
    data.value = response.data.data
    // console.log(response.data.data);
    pagination.value.pageCount = response.data.last_page
    pagination.value.total = response.data.total
    loading.value = false
}

// const chainReset = () => {
//     chainData.value = {
//         description: '',
//         permissions: []
//     }
//     showModal.value = true
// }

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
        title: 'Cadena',
        key: 'chain',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Pais',
        key: 'countryName',
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

</script>

<template>
    <div>
        <add :show="showModal" :items="chainData" @close="showModal = !showModal"
            @refresh="pagination.onUpdatePage(1)" />
        <div class="bg-white dark:bg-[#1E2838] shadow min-h-12 rounded mb-4 font-semibold p-2 px-3">
            <div class="flex flex-wrap justify-between gap-1 items-center">
                <div class="flex items-center gap-4">
                    <span class="text-lg -mt-1">Cadenas</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <!-- <n-button size="small" type="primary" @click="chainReset">
                        <j-icon w="w-[14px]" name="add" />
                        Nuevo
                    </n-button> -->
                    <button @click="pagination.onUpdatePage(1)"
                        class="opacity-70 w-7 h-7 flex justify-center items-center hover:bg-slate-200/60 dark:hover:bg-[#141D2C] rounded-md">
                        <j-icon w="w-[12px]" name="refresh" />
                    </button>
                    <button v-if="actions?.includes('export')"
                        class="opacity-70 w-7 h-7 flex justify-center items-center hover:bg-slate-200/60 dark:hover:bg-[#141D2C] rounded-md">
                        <j-icon w="w-[18px]" name="export" />
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
            size="small" min-height="70vh" max-height="70vh" :scroll-x="800" :row-props="rowProps">
        </n-data-table>

        <n-dropdown placement="bottom" :show-arrow="true" trigger="manual" :x="x" :y="y" :options="options"
            :show="showDropdown" :on-clickoutside="() => { showDropdown = false }"
            @select="() => { showDropdown = false }" />
    </div>
</template>

<style scoped></style>