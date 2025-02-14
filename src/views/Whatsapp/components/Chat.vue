<script setup lang="ts">
import { onMounted, ref } from "vue";

const scrollableDiv = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (scrollableDiv.value) {
        scrollableDiv.value.scrollTop = scrollableDiv.value.scrollHeight;
    }
});
</script>

<template>
    <div ref="scrollableDiv" class="scrollable-div">

        <slot>
            <n-scrollbar ref="scrollbar" class=" px-4">

            </n-scrollbar>
        </slot>
    </div>
</template>



<style scoped>
.scrollable-div {
    /* max-height: 500px; */
    overflow-y: auto;
}
</style>