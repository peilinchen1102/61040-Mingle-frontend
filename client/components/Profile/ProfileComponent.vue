<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import EditProfileForm from "./EditProfileForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const emit = defineEmits(["editProfile"]);

let profile = ref();
let editing = ref("");

const colors = ["#fbf8cc", "#fde4cf", "#ffcfd2", "#f1c0e8", "#cfbaf0", "#a3c4f3", "#8eecf5", "#98f5e1", "#b9fbc0"];

async function getProfile(username: string) {
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
  await getProfile(currentUsername.value);
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && profile.value == null">
    <div>
      <h1>{{ profile.name }}</h1>
      <h2>{{ profile.major }}</h2>
      <h2>Class of {{ profile.year }}</h2>
    </div>

    <div class="courses">
      <article v-for="(course, index) in profile.courses" :key="course" v-bind:style="{ backgroundColor: colors[index % colors.length] }">
        {{ course }}
      </article>
    </div>
    <EditProfileForm :profile="profile" @refreshProfile="getProfile(currentUsername)" />
  </section>
  <p v-else-if="loaded">No profile found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  text-align: center;
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
  width: fit-content;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5em;
  padding: 1em;
}
.courses {
  display: flex;
  gap: 1em;
  justify-content: center;
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
