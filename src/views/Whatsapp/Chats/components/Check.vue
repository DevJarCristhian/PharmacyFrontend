<script setup lang="ts">
interface Props {
    status?: boolean;
}

defineProps<Props>();
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        :class="['mr-1', status ? 'text-sky-400' : 'text-gray-400/80 dark:text-gray-500', 'min-w-[14px]', 'min-h-[14px]']">
        <g fill="none">
            <path
                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z">
            </path>
            <path fill="currentColor"
                d="M2.222 11.121a1 1 0 0 1 1.32-.083l.094.083l4.242 4.243a1 1 0 0 1-1.32 1.497l-.094-.083l-4.242-4.242a1 1 0 0 1 0-1.415m20.556-5.656a1 1 0 0 1 .083 1.32l-.083.094l-9.829 9.828a1.1 1.1 0 0 1-1.46.086l-.096-.085l-4.171-4.172a1 1 0 0 1 1.32-1.498l.094.083l3.535 3.536l9.193-9.192a1 1 0 0 1 1.414 0m-5 0a1 1 0 0 1 .083 1.32l-.083.094l-4.95 4.95a1 1 0 0 1-1.497-1.32l.083-.095l4.95-4.95a1 1 0 0 1 1.414 0Z">
            </path>
        </g>
    </svg>
</template>

<style scoped>
/* Aquí puedes agregar tus estilos personalizados si los necesitas */
</style>