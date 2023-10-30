<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateGroupTaskForm from "./CreateGroupTaskForm.vue";

const props = defineProps(["groupName", "members"]);

let tasks = ref();
let loaded = ref(false);

async function viewTasksInGroup() {
  let tasksResults;
  try {
    tasksResults = await fetchy(`/api/tasks/groups/${props.groupName}`, "GET");
  } catch (e) {
    return;
  }
  tasks.value = tasksResults;
}

onBeforeMount(async () => {
  await viewTasksInGroup();
  loaded.value = true;
});
</script>

<template>
  <h2>Group Assigned Tasks</h2>
  <div class="tasks" v-if="loaded && tasks && tasks.length !== 0">
    <article v-for="task in tasks" :key="task._id">
      <p>Assigned: {{ task.assigned }}</p>
      <p>Task: {{ task.todo }}</p>
      <p>Status: {{ task.status }}</p>
    </article>
    <CreateGroupTaskForm :groupName="props.groupName" :members="props.members" @refreshTasks="viewTasksInGroup" />
  </div>
  <div v-else>No assigned tasks</div>
</template>

<style scoped>
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em;
  width: 25em;
  height: fit-content;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 2em;
  max-height: 50em;
  overflow: scroll;
}

.strikethrough {
  text-decoration: line-through;
}

.checkbox-wrapper-4 * {
  box-sizing: border-box;
}
.checkbox-wrapper-4 .cbx {
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
  display: inline-block;
}
.checkbox-wrapper-4 .cbx:not(:last-child) {
  margin-right: 6px;
}
.checkbox-wrapper-4 .cbx:hover {
  background: rgba(0, 119, 255, 0.06);
}
.checkbox-wrapper-4 .cbx span {
  float: left;
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}
.checkbox-wrapper-4 .cbx span:first-child {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  transform: scale(1);
  border: 1px solid #cccfdb;
  transition: all 0.2s ease;
  box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
}
.checkbox-wrapper-4 .cbx span:first-child svg {
  position: absolute;
  top: 3px;
  left: 2px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
  transition-delay: 0.1s;
  transform: translate3d(0, 0, 0);
}
.checkbox-wrapper-4 .cbx span:last-child {
  padding-left: 8px;
  line-height: 18px;
}
.checkbox-wrapper-4 .cbx:hover span:first-child {
  border-color: #07f;
}
.checkbox-wrapper-4 .inp-cbx {
  position: absolute;
  visibility: hidden;
}
.checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child {
  background: #07f;
  border-color: #07f;
  animation: wave-4 0.4s ease;
}
.checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child svg {
  stroke-dashoffset: 0;
}
.checkbox-wrapper-4 .inline-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  user-select: none;
}
@media screen and (max-width: 640px) {
  .checkbox-wrapper-4 .cbx {
    width: 100%;
    display: inline-block;
  }
}
@-moz-keyframes wave-4 {
  50% {
    transform: scale(0.9);
  }
}
@-webkit-keyframes wave-4 {
  50% {
    transform: scale(0.9);
  }
}
@-o-keyframes wave-4 {
  50% {
    transform: scale(0.9);
  }
}
@keyframes wave-4 {
  50% {
    transform: scale(0.9);
  }
}

button {
  background-color: white;
  border: none;
}
</style>
