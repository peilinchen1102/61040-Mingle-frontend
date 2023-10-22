<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refreshTasks"]);

const createTask = async (content: string) => {
  try {
    await fetchy("/api/task/add", "POST", {
      body: { content },
    });
  } catch (_) {
    return;
  }
  emit("refreshTasks");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form class="addTask" @submit.prevent="createTask(content)">
    <textarea id="content" v-model="content" required></textarea>
    <button type="submit" class="button-4">Add Task</button>
  </form>
</template>

<style scoped>
form {
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1.5em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  width: 20em;
}

.addTask {
  position: absolute;
  top: 45em;
  display: flex;
  flex-direction: column;
}
</style>
