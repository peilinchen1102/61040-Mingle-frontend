<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import MatchComponent from "./MatchComponent.vue";
import MatchRequestForm from "./MatchRequestForm.vue";

let matches = ref<Array<string>>([]);
let len = ref(0);
let index = ref(0);
let match = ref(matches.value[index.value]);

async function getMatches() {
  let matchResults;
  try {
    matchResults = await fetchy(`/api/matches`, "GET");
  } catch {
    return;
  }
  matches.value = matchResults;
  len.value = matches.value.length;
  index.value = 0;
}

async function incr() {
  if (index.value !== len.value - 1) {
    index.value = index.value + 1;
  } else {
    index.value = 0;
  }
  match.value = matches.value[index.value];
  return;
}

async function decr() {
  if (index.value !== 0) {
    index.value = index.value - 1;
  } else {
    index.value = len.value - 1;
  }
  match.value = matches.value[index.value];
  return;
}
</script>

<template>
  <div class="match">
    <MatchRequestForm @refreshMatch="getMatches" />
    <section v-if="matches.length != 0">
      <div class="row">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16" @click="decr">
          <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z" />
        </svg>

        <!-- <div v-for="(match, idx) in matches" :key="match"> -->
        <div class="card">
          <MatchComponent :username="match" :key="index" />
        </div>
        <!-- </div> -->

        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16" @click="incr">
          <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z" />
        </svg>
      </div>
    </section>
    <p v-else>No matches found</p>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.match {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 30px; /* 5px rounded corners */
  width: 30em;
  height: 25em;
  padding: 3em;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
