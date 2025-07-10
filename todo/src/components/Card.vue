<script setup>
import { defineProps, defineEmits } from 'vue';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const props = defineProps({
    title: String,
    description: String,
    completed: Boolean,
    id: Number
});

const emit = defineEmits(['changeStatus', 'deleteTodo']);

function toggleStatus(event) {
    emit('changeStatus', props.id, event.checked);
}
</script>

<template>
    <div class="card w-[400px] h-50 rounded-2xl bg-[#f5f0ff]/80 border border-[#c4b5fd] shadow-[0_4px_20px_rgba(167,139,250,0.3)] backdrop-blur-md p-5 transition hover:shadow-[0_6px_24px_rgba(139,92,246,0.4)] flex flex-col justify-between">
        <div class="card-header mb-4">
            <h2 class="text-[24px] font-semibold text-gray-800">{{ title }}</h2>
            <p v-if="description" class="text-x text-gray-600 mt-1">{{ description }}</p>
        </div>

        <div class="card-footer flex justify-between items-center">
            <div class="flex items-center gap-2">
                <Checkbox :binary="true" :modelValue="completed" @change="toggleStatus" />
                <span class="text-sm text-gray-700">{{ completed ? '✅ Done' : '📝 To Do' }}</span>
            </div>
            <Button icon="pi pi-trash" severity="danger" aria-label="Delete" @click="$emit('deleteTodo', id)" />

        </div>

    </div>
</template>
