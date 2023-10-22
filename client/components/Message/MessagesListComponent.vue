<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import MessageComponent from "./MessageComponent.vue";
import MessagesHistoryComponent from "./MessagesHistoryComponent.vue";

const loaded = ref(false);
let conversations = ref(new Map());
let friends = ref<Array<string>>([]);
let groups = ref<Array<Record<string, string>>>([]);
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

async function getGroups() {
  let groupsResult;
  try {
    groupsResult = await fetchy("/api/groups", "GET");
  } catch (e) {
    return;
  }
  groups.value = groupsResult;
}

async function getMessages(username?: string) {
  let conversationResults = new Map();
  try {
    for (const friend of friends.value) {
      const conversation = await fetchy(`/api/messages/${friend}`, "GET");
      if (conversation.length !== 0) {
        conversationResults.set(friend, conversation);
      }
    }

    await getGroups();
    for (const group of groups.value) {
      if (group.messages.length !== 0) {
        conversationResults.set(group.name, group.messages);
      }
    }
  } catch (e) {
    return;
  }
  conversations.value = new Map([...conversationResults.entries()].sort((a, b) => -Date.parse(a[1][0].dateCreated) + Date.parse(b[1][0].dateCreated)).reverse());

  if (username) {
    curConversation.value = username;
  } else {
    if (curConversation.value === "") {
      curConversation.value = conversations.value.keys().next().value;
    }
  }
}

async function getMessagesBetween(username: string) {
  // user
  if (JSON.parse(JSON.stringify(friends)).includes(username)) {
    try {
      const conversation = await fetchy(`/api/messages/${username}`, "GET");
      conversations.value.delete(username);
      conversations.value.set(username, conversation);
    } catch (e) {
      return;
    }
  }
  // group
  else {
    try {
      const group = await fetchy(`/api/groups/${username}`, "GET");
      conversations.value.delete(username);
      conversations.value.set(username, group.messages);
    } catch (e) {
      return;
    }
  }
}

async function updateCurConversation(person: string) {
  curConversation.value = person;
}

onBeforeMount(async () => {
  await getFriends();
  await getGroups();
  await getMessages();
  loaded.value = true;
});
</script>

<template>
  <section class="column">
    <section v-if="loaded && conversations.size !== 0" class="reverse">
      <article v-for="[friend, messages] in conversations" :key="friend">
        <MessageComponent :messages="messages" :friend="friend" @click="updateCurConversation(friend)" />
      </article>
    </section>
    <p v-else-if="loaded">No messages found</p>
    <p v-else>Loading...</p>
    <section v-if="loaded && conversations.size !== 0">
      <MessagesHistoryComponent :friends="friends" :friend="curConversation" :conversation="conversations.get(curConversation)" @refreshConvo="getMessages(curConversation)" />
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

.reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>
