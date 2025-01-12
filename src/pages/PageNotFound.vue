<script lang="ts" setup>
window.document.title = "CRM | Page Not Found";
const goBack = () => {
    window.history.back();
}
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen w-full bg-white dark:bg-gray-900">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">Page Not Found</p>
        <button @click="goBack" class="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600">
            <div class="flex gap-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" />
                </svg>
                <div>
                    Volver
                </div>
            </div>
        </button>
    </div>
</template>

<style scoped></style>
