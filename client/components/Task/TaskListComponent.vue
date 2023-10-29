<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateTaskForm from "./CreateTaskForm.vue";
import GroupTaskComponent from "./GroupTaskComponent.vue";
import TaskComponent from "./TaskComponent.vue";
const loaded = ref(false);
let personalTasks = ref<Array<Record<string, string>>>([]);
let groupTasks = ref<Array<Record<string, string>>>([]);

async function getTasks() {
  let taskResults;
  try {
    taskResults = await fetchy("/api/tasks", "GET");
  } catch (e) {
    return;
  }
  personalTasks.value = taskResults.personal;
  groupTasks.value = taskResults.group;
}

onBeforeMount(async () => {
  await getTasks();
  loaded.value = true;
});
</script>

<template>
  <div class="todo">
    <h2 style="font-family: &quot;Playpen Sans&quot;, cursive; text-align: center">Todo</h2>
    <section v-if="loaded && personalTasks.length + groupTasks.length !== 0" style="font-family: &quot;Playpen Sans&quot;, cursive">
      <ul v-for="groupTask in groupTasks" :key="groupTask._id">
        <GroupTaskComponent :groupTask="groupTask" @refreshTasks="getTasks" />
      </ul>
      <ul v-for="personalTask in personalTasks" :key="personalTask._id">
        <TaskComponent :personalTask="personalTask" @refreshTasks="getTasks" />
      </ul>
    </section>
    <p v-else-if="loaded">No tasks found</p>
    <p v-else>Loading...</p>
    <div style="display: flex; justify-content: center">
      <CreateTaskForm @refreshTasks="getTasks" />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playpen+Sans&display=swap");

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  max-height: 30em;
  overflow: scroll;
  overflow-y: scroll; /* Show vertical scrollbar */
}

section,
p {
  margin: 0 auto;
  align-content: center;
}

.todo {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 25em;
  height: 5em;
}

ul {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  width: fit-content;
}

.row {
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
  width: 30em;
}

.column {
  display: flex;
  flex-direction: row;
  gap: 50em;
}

.reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>
