<script setup lang="ts">
import { formatDate } from "../../utils/formatDate";
const props = defineProps(["messages", "friend"]);
const emit = defineEmits(["refreshConversation"]);

async function switchConversation(person: string) {
  emit("refreshConversation", person);
}
</script>

<template>
  <div v-if="props.messages" @click="switchConversation(props.friend)">
    <p class="author">{{ props.friend }}</p>
    <p class="truncate" style="color: rgb(121, 120, 120)">{{ props.messages[0].content }}</p>
    <p class="timestamp">{{ formatDate(props.messages[0].dateCreated) }}</p>
  </div>
  <div></div>
</template>

<style scoped>
p {
  margin: 0.25em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.truncate {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
