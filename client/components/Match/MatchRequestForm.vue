<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["refreshMatch"]);
let year = ref("");
let clas = ref("");
let collab = ref("");
let size = ref("");
let hours = ref("");
let loc = ref("");

async function match(year: string, clas: string, collab: string, size: string, hours: string, loc: string) {
  const update: Record<string, string> = {
    year: year,
    clas: clas,
    collaborationType: collab,
    groupSize: size,
    hoursCommitted: hours,
    location: loc,
  };

  try {
    await fetchy(`/api/matches/preferences`, "PATCH", { body: { update: { update: update } } });
  } catch (_) {
    return;
  }

  emit("refreshMatch");
}
</script>

<template>
  <div>
    <form @submit.prevent="match(year, clas, collab, size, hours, loc)" class="column">
      <h1>Match Preferences</h1>
      <label>Class Year of</label>
      <input type="number" v-model="year" placeholder="2025" required />
      <label>Course</label>
      <input type="text" v-model="clas" placeholder="18.404" required />
      <label>Collaboration Type</label>
      <select v-model="collab" required>
        <option value="" disabled selected hidden>Please Choose...</option>
        <option value="research">research</option>
        <option value="discussion">discussion</option>
        <option value="programming">programming</option>
        <option value="presentation">presentation</option>
        <option value="problem set">problem set</option>
      </select>
      <label>Group Size</label>
      <select v-model="size" placeholder="small" required>
        <option value="" disabled selected hidden>Please Choose...</option>
        <option value="small">small</option>
        <option value="medium">medium</option>
        <option value="large">large</option>
      </select>
      <label>Hours Committed</label>
      <input type="number" v-model="hours" placeholder="3" required />
      <label>Location</label>
      <select v-model="loc" required>
        <option value="" disabled selected hidden>Please Choose...</option>
        <option value="off-campus">off-campus</option>
        <option value="on-campus">on-campus</option>
      </select>
      <button type="submit" class="button-4">Send</button>
    </form>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.button-4 {
  width: 15em;
}

.posts {
  padding: 1em;
}

.column {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 10em;
  gap: 2em;
}

label {
  font-size: 20px;
}
</style>
