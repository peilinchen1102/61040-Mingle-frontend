<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["friend"]);
const emit = defineEmits(["refreshFriends"]);

async function removeFriend(username: string) {
  try {
    await fetchy(`/api/friends/${username}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFriends");
}
</script>

<template>
  <div class="friend">
    <p class="author">{{ props.friend }}</p>
    <button class="button-error button-4 small" @click="removeFriend(props.friend)">Remove</button>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.friend {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
}
</style>
