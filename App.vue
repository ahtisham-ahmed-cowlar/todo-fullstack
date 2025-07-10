<script setup>
  import { onMounted, reactive } from 'vue';
  import Card from './components/Card.vue';

  const todos = reactive([]);

  onMounted(async () => {

    try {
      const getTodos = await fetch("http://localhost:3501/todo/all");
      const todosData = await getTodos.json();

      if(!todosData.success) {
        console.error('Failed to fetch todos:', todosData.message);
        return;
      }

      todosData.todos.forEach(todo => {
        todos.push({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          description: todo.description
        });
      });
    }

    catch (error) {
      console.error('Error fetching todos:', error);
    }

    finally {
      console.log('Todos fetched successfully:', todos);
    }
  });

  function changeStatus(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
  }

  function addTodo(newTodo) {
    todos.push(newTodo);
  }

  function updateTodo(id, updatedTodo) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = updatedTodo;
    }
  }
</script>

<template>
  <div class="todo-list px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Todo List</h1>
    <div v-for="todo in todos" :key="todo.id" class="todo-container mb-4">
      <Card
        :title="todo.title"
        :description="todo.description"
        :completed="todo.completed"
        :id="todo.id"
        @update:completed="() => changeStatus(todo.id)"
      />
    </div>
  </div>
</template>


<style scoped>
</style>
