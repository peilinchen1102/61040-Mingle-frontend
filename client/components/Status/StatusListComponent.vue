<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CurrentAssignmentForm from "./CurrentAssignmentForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const status = ref();
let friends = ref([]);
let loaded = ref(false);

async function getStatus() {
  let statusResult;
  try {
    statusResult = await fetchy(`/api/status/${currentUsername.value}`, "GET");
  } catch (e) {
    return;
  }
  status.value = statusResult;
}

async function getFriendsSameAssignment() {
  let friendsResult;
  try {
    friendsResult = await fetchy("/api/statuses", "GET");
  } catch (e) {
    return;
  }
  friends.value = friendsResult;
}

onBeforeMount(async () => {
  await getStatus();
  await getFriendsSameAssignment();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded" style="display: flex; align-items: center; flex-direction: column">
    <h2>Status: {{ status.userStatus }}</h2>
    <h2>Current Assignment: {{ status.curAssignment }}</h2>
    <div style="display: flex; align-items: center; flex-direction: column; gap: 1em">
      <h2>Friends Working on Same Assignment:</h2>
      <article v-for="friend in friends" :key="friend">
        {{ friend }}
      </article>
    </div>
    <CurrentAssignmentForm @refreshStatus="getStatus" @refreshAssignment="getFriendsSameAssignment" />
  </div>
  <div v-else>loading</div>
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
