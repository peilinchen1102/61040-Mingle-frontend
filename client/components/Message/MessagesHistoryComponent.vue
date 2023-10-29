<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import SendMessageForm from "./SendMessageForm.vue";

const props = defineProps(["friend", "conversation", "friends"]);
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshConvo", "edit"]);
</script>

<template>
  <div class="conversation">
    <section class="header">
      <p class="author">{{ props.friend }}</p>
      <p v-if="!props.friends.includes(props.friend)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16" @click="emit('edit')" @refreshConvo="emit('refreshConvo')">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </p>
    </section>
    <div class="parentWindow">
      <section v-for="message in props.conversation" :key="message.id" class="window">
        <div v-if="message.from == currentUsername" style="display: flex; justify-content: flex-end">
          <p class="message">{{ message.content }}</p>
        </div>
        <div v-else style="display: flex; justify-content: flex-start">
          <p>{{ message.from }}</p>
          <p class="message">{{ message.content }}</p>
        </div>
      </section>
    </div>
    <SendMessageForm :friends="props.friends" :friend="props.friend" @refreshConvo="emit('refreshConvo')" />
  </div>
</template>

<style scoped>
p {
  margin: 0.25em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

.header {
  display: flex;
  background-color: rgba(204, 204, 204, 0.636);
  padding: 0.75em;
  border-radius: 0.25em;
  position: static;
  justify-content: space-between;
  height: 2em;
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

.friend {
  display: flex;
  justify-content: flex-start;
  gap: 5em;
  padding-left: 1em;
}

.message {
  display: flex;
  justify-content: flex-start;
  background-color: rgb(0, 0, 0);
  width: fit-content;
  border-radius: 25em;
  padding: 0.5em;
  color: white;
}

.window {
  padding: 1em;
}

.parentWindow {
  display: flex;
  overflow: scroll;
  max-height: 40em;
  flex-direction: column-reverse;
}

.conversation {
  width: 70em;
  position: absolute;
  left: 45em;
  top: 8.9em;
}
</style>
