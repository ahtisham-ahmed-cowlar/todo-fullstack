<script setup>
import { ref } from 'vue'

// Define emitted events
const emit = defineEmits(['addTodo', 'close'])

const title = ref('')
const description = ref('')

function handleAdd() {
  if (!title.value.trim()) return
  emit('addTodo', {
    id: Date.now(),
    title: title.value,
    description: description.value,
    completed: false,
  })
  title.value = ''
  description.value = ''
  emit('close')
}
</script>


<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
      <h2 class="text-xl font-semibold mb-4">Add New Todo</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="title" type="text" class="mt-1 w-full px-3 py-2 border rounded-md" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="description" class="mt-1 w-full px-3 py-2 border rounded-md"></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">Cancel</button>
        <button
          @click="handleAdd"
          class="px-4 py-2 rounded-md bg-violet-500 hover:bg-violet-600 text-white font-medium"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>


