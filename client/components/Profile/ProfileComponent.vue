<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let profile = ref();
let editing = ref("");

async function getUser(username: string) {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/profiles/${username}`, "GET");
  } catch (_) {
    return;
  }
  profile.value = profileResult;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  console.log(currentUsername.value);
  await getUser(currentUsername.value);
  console.log(loaded);
  loaded.value = true;
  console.log(loaded.value);
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
  </section>
  <section v-if="loaded">
    {{ profile.name }}
    {{ profile.major }}
    <!-- <article v-for="course in profile.courses">
      {{ course }} -->
    <!-- </article> -->
  </section>
  <!-- <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p> -->
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

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
