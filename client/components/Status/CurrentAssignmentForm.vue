<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const status = ref("");
const curAssignment = ref("");
const emit = defineEmits(["refreshStatus", "refreshAssignment"]);
async function updateStatus() {
  try {
    await fetchy(`/api/status`, "PATCH", { body: { update: { userStatus: status.value } } });
  } catch (e) {
    return;
  }
  emit("refreshStatus");
}
async function updateAssignment() {
  try {
    await fetchy(`/api/status`, "PATCH", { body: { update: { curAssignment: curAssignment.value } } });
  } catch (e) {
    return;
  }
  emit("refreshStatus");
  emit("refreshAssignment");
}
</script>

<template>
  <h2>Update Status Details</h2>
  <form @submit.prevent="updateStatus" class="pure-form">
    <fieldset>
      <legend>Update Status</legend>
      <select v-model="status">
        <option value="active">Active</option>
        <option value="away">Away</option>
        <option value="busy">Busy</option>
      </select>
      <button type="submit" class="button-4">Update Status</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateAssignment" class="pure-form">
    <fieldset>
      <legend>Update Current Assignment Working On</legend>
      <input type="text" placeholder="New assignment" v-model="curAssignment" required />
      <button type="submit" class="button-4">Update Assignment</button>
    </fieldset>
  </form>
</template>

<style scoped>
h1 {
  text-align: center;
}
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  width: fit-content;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25em;
  padding: 0.75em;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1em;
  height: fit-content;
  align-items: center;
}
.member {
  display: flex;
  justify-content: space-between;
  padding: 1em;
}
</style>
