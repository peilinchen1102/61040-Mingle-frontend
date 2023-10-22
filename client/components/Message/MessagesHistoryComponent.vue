<script setup lang="ts">
const props = defineProps(["friend", "conversation"]);
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <div class="conversation">
    <div>
      <div class="header">
        <p class="author">{{ props.friend }}</p>
      </div>
      <section v-for="message in props.conversation.slice().reverse()" :key="message.id" class="window">
        <div v-if="message.from == currentUsername" style="display: flex; justify-content: flex-end">
          <p class="message">{{ message.content }}</p>
        </div>
        <div v-else style="display: flex; justify-content: flex-start">
          <p>{{ message.from }}</p>
          <p class="message">{{ message.content }}</p>
        </div>
      </section>
    </div>
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
  background-color: rgba(171, 171, 171, 0.636);
  padding: 0.75em;
  border-radius: 0.25em;
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

.conversation {
  width: 70em;
}
</style>
