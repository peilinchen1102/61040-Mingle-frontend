<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FriendListComponent from "../components/Friend/FriendListComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Friends</h1>
    <FriendListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
