<script setup>
  import { onMounted, reactive } from 'vue';
  import Card from './components/Card.vue';
  import AddTodoPopup from './components/AddTodoPopup.vue';
  import { ref, computed } from 'vue';
  import mqtt from 'mqtt';
  import Button from 'primevue/button';

  let todos = reactive([]);
  const showAddPopup = ref(false)

  const alertMessage = ref('');
  const showAlert = ref(false);

  const filter = ref('all');

  const baseClass = 'px-4 py-2 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition';
  const activeClass = 'px-4 py-2 rounded-lg text-white bg-purple-600 border border-purple-600 hover:bg-purple-700 transition';

  const getAll = async () => {
    try {
      if (todos.length > 0) {
        todos.splice(0);
      }

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
  }

  onMounted(getAll);

  onMounted(() => {
    const client = mqtt.connect('ws://localhost:9001'); 

    client.on('connect', () => {
      console.log('✅ MQTT connected');
      client.subscribe('todo/alert', (err) => {
        if (err) console.error('Subscription error:', err);
      });
    });

    client.on('message', (topic, message) => {
      if (topic === 'todo/alert') {
        alertMessage.value = message.toString();
        alert(alertMessage.value);
        showAlert.value = true;

        setTimeout(() => {
          showAlert.value = false;
        }, 4000);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
  });

  async function changeStatus(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }

    const updateTodo = await fetch(`http://localhost:3501/todo/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    });

    const updateTodoData = await updateTodo.json();

    if (!updateTodoData.success) {
      console.error('Failed to update todo:', updateTodo.statusText);
    }

    else {
      await getAll();
    }
  }

  async function deleteTodo(id) {
    const response = await fetch(`http://localhost:3501/todo/delete/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Failed to delete todo:', data.message);
      return;
    }

    await getAll();
  }

  async function addTodo(newTodo) {
    const response = await fetch("http://localhost:3501/todo/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTodo)
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Failed to add todo:', data.message);
      return;
    }

    await getAll();

    showAddPopup.value = false;
  }

  function updateTodo(id, updatedTodo) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = updatedTodo;
    }
  }

  const filteredTodos = computed(() => {
    if (filter.value === 'pending') {
      return todos.filter(todo => !todo.completed);
    } else if (filter.value === 'done') {
      return todos.filter(todo => todo.completed);
    } else {
      return todos;
    }
  });
</script>

<template>
  <div class="todo-list px-6 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-5xl font-bold text-white">Todo List</h1>
    <button
      @click="showAddPopup = true"
      class="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md"
    >
      + Add
    </button>
  </div>

  <div class="flex items-center gap-4 mb-6">
    <Button
    unstyled
    :class="filter === 'all' ? activeClass : baseClass"
    @click="filter = 'all'"
  >
    All
  </Button>
  <Button
    unstyled
    :class="filter === 'pending' ? activeClass : baseClass"
    @click="filter = 'pending'"
  >
    Pending
  </Button>
  <Button
    unstyled
    :class="filter === 'done' ? activeClass : baseClass"
    @click="filter = 'done'"
  >
    Done
  </Button>
  </div>

  <div class="flex flex-wrap gap-4">
    <div v-for="todo in filteredTodos" :key="todo.id" class="todo-container mb-4">
      <Card
        :title="todo.title"
        :description="todo.description"
        :completed="todo.completed"
        :id="todo.id"
        @changeStatus="changeStatus"
        @deleteTodo="deleteTodo"
        @updateTodo="updateTodo"
      />
    </div>
  </div>

  <AddTodoPopup v-if="showAddPopup" @close="showAddPopup = false" @addTodo="addTodo" />
</div>

</template>


<style scoped>
</style>
