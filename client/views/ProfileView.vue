<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import ProfileComponent from "../components/Profile/ProfileComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">{{ currentUsername }}'s Profile'</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <ProfileComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
