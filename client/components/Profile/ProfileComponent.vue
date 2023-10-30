<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import EditProfileForm from "./EditProfileForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const loaded = ref(false);
const edit = ref();
let profile = ref();

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

async function editProfile() {
  edit.value = !edit.value;
}
onBeforeMount(async () => {
  await getProfile(currentUsername.value);

  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && profile.value == null" class="profile">
    <section v-if="!edit">
      <div class="info">
        <h1>{{ profile.name }}</h1>
        <h2>{{ currentUsername }}</h2>
        <h2>{{ profile.major }}</h2>
        <h2>Class of {{ profile.year }}</h2>
      </div>
      <section class="profile">
        <div class="courses">
          <article v-for="(course, index) in profile.courses" :key="course" v-bind:style="{ backgroundColor: colors[index % colors.length] }">
            {{ course }}
          </article>
        </div>
        <button class="button-4" @click="editProfile">
          Edit Profile
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path
              d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
            />
            <path
              fill-rule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
        </button>
      </section>
    </section>
    <section v-else>
      <EditProfileForm :profile="profile" @refreshProfile="getProfile(currentUsername)" @edit="editProfile" />
    </section>
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
  gap: 0.25em;
  padding: 0.75em;
}
.courses {
  display: flex;
  gap: 1em;
  width: 30em;
  justify-content: center;
  flex-flow: row wrap;
}

.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10em;
}

.button-4 {
  width: 40em;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0em;
}
</style>
