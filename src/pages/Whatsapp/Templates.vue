<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
const List = defineAsyncComponent(() => import("../../views/Whatsapp/Templates/TemplatesList.vue"));

const route = useRoute();
const name: string = (route.name as string) || "";

</script>

<template>
    <List :path="name" />
</template>