<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let content = ref("");
let to = ref("");
const props = defineProps(["groupName", "members"]);
const emit = defineEmits(["refreshTasks"]);

const assignTask = async (content: string, groupName: string, to: string) => {
  try {
    await fetchy(`/api/task/add/${groupName}`, "POST", {
      body: { content, to },
    });
  } catch (_) {
    return;
  }
  emptyForm();
  emit("refreshTasks");
};

const emptyForm = () => {
  content.value = "";
  to.value = "";
};
</script>

<template>
  <form class="addTask" @submit.prevent="assignTask(content, props.groupName, to)">
    <label>Assign to:</label>
    <select style="height: 2em" v-model="to">
      <option :value="member" v-for="member in props.members" :key="member">{{ member }}</option>
    </select>
    <label>Task</label>
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
  top: 55em;
  display: flex;
  flex-direction: column;
}
</style>
