<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
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

async function toggleTask(task: Record<string, string>) {
  if (task.status === "incomplete") {
    try {
      await fetchy("/api/task/complete", "PATCH", { body: { _id: task._id } });
    } catch (e) {
      return;
    }
  } else {
    try {
      await fetchy("/api/task/incomplete", "PATCH", { body: { _id: task._id } });
    } catch (e) {
      return;
    }
  }
  await getTasks();
}

async function toggleGroupTask(task: Record<string, string>) {
  if (task.status === "incomplete") {
    try {
      await fetchy(`/api/task/group/complete`, "PATCH", { body: { _id: task._id, groupName: task.group } });
    } catch (e) {
      return;
    }
  } else {
    try {
      await fetchy(`/api/task/group/incomplete`, "PATCH", { body: { _id: task._id, groupName: task.group } });
    } catch (e) {
      return;
    }
  }
  await getTasks();
}

onBeforeMount(async () => {
  await getTasks();
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && personalTasks.length !== 0">
    <ul v-for="personalTask in personalTasks" :key="personalTask._id">
      <TaskComponent :personalTask="personalTask" @click="toggleTask(personalTask)" />
    </ul>
  </section>
  <p v-else-if="loaded">No messages found</p>
  <p v-else>Loading...</p>
  <section v-if="loaded && groupTasks.length !== 0">
    <ul v-for="groupTask in groupTasks" :key="groupTask._id">
      <GroupTaskComponent :groupTask="groupTask" @click="toggleGroupTask(groupTask)" />
    </ul>
  </section>
  <p v-else-if="loaded">No messages found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
}

section,
p {
  margin: 0 auto;
  align-content: center;
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
  justify-content: center;
  align-content: center;
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
