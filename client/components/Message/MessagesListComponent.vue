<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import MessageComponent from "./MessageComponent.vue";
import MessagesHistoryComponent from "./MessagesHistoryComponent.vue";

const loaded = ref(false);
let conversations = ref(new Map());
let friends = ref<Array<string>>([]);
let curConversation = ref<string>("");

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (e) {
    return;
  }
  friends.value = friendResults;
}

async function getMessages() {
  let conversationResults = new Map();
  try {
    for (const friend of friends.value) {
      const conversation = await fetchy(`/api/messages/${friend}`, "GET");
      conversationResults.set(friend, conversation);
      // if (conversation) {
      //   curConversation.value = friend;
      // }
    }
  } catch (e) {
    return;
  }
  conversations.value = new Map([...conversationResults.entries()].sort((a, b) => a[1][0].dateCreated - b[1][0].dateCreated));
  curConversation.value = conversations.value.entries().next().value[0];
}

async function updateCurConversation(person: string) {
  curConversation.value = person;
}

onBeforeMount(async () => {
  await getFriends();
  await getMessages();
  loaded.value = true;
});
</script>

<template>
  <section class="column">
    <section v-if="loaded && conversations.size !== 0">
      <article v-for="[friend, messages] in conversations" :key="friend">
        <MessageComponent :messages="messages" :friend="friend" @click="updateCurConversation(friend)" />
      </article>
    </section>
    <p v-else-if="loaded">No messages found</p>
    <p v-else>Loading...</p>
    <section v-if="loaded && conversations.size !== 0">
      <MessagesHistoryComponent :friend="curConversation" :conversation="conversations.get(curConversation)" @refreshConvo="getMessages" />
    </section>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 25em;
  height: 5em;
}

.row {
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
  width: 30em;
}

.column {
  display: flex;
  flex-direction: row;
  gap: 50em;
}
</style>
