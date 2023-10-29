<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["groupTask"]);
const emit = defineEmits(["refreshTasks"]);

async function deleteGroupTask(task: Record<string, string>) {
  try {
    await fetchy(`/api/task/group/delete/${task._id}/${task.group}`, "DELETE");
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshTasks");
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
  emit("refreshTasks");
}
</script>

<template>
  <div v-if="props.groupTask.status === 'incomplete'" style="display: flex">
    <div class="checkbox-wrapper-4" @click="toggleGroupTask(props.groupTask)">
      <input class="inp-cbx" type="checkbox" />
      <label class="cbx"
        ><span>
          <svg width="12px" height="10px">
            <use xlink:href="#check-4"></use></svg></span
        ><span>{{ props.groupTask.todo }}</span></label
      >
      <svg class="inline-svg">
        <symbol id="check-4" viewbox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  </div>
  <div v-else style="display: flex">
    <div class="checkbox-wrapper-4" @click="toggleGroupTask(props.groupTask)">
      <input class="inp-cbx" type="checkbox" checked />
      <label class="cbx"
        ><span>
          <svg width="12px" height="10px">
            <use xlink:href="#check-4"></use></svg></span
        ><span class="strikethrough">{{ props.groupTask.todo }}</span></label
      >
      <svg class="inline-svg">
        <symbol id="check-4" viewbox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-trash-fill" viewBox="0 0 16 16" @click="deleteGroupTask(props.groupTask)">
        <path
          d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
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
