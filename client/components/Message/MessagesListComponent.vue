<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateGroupForm from "../Group/CreateGroupForm.vue";
import GroupEditComponent from "../Group/GroupEditComponent.vue";
import JoinGroupForm from "../Group/JoinGroupForm.vue";
import MessageComponent from "./MessageComponent.vue";
import MessagesHistoryComponent from "./MessagesHistoryComponent.vue";
import SendMessageWithUsernameForm from "./SendMessageWithUsernameForm.vue";

const loaded = ref(false);
let conversations = ref(new Map());
let friends = ref<Array<string>>([]);
let groups = ref<Array<Record<string, string>>>([]);
let curConversation = ref<string>("");
let action = ref("sendMessage");

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

let groupEdit = ref(false);

async function edit() {
  groupEdit.value = !groupEdit.value;
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
  <section v-if="!groupEdit" class="column">
    <section v-if="loaded && conversations.size !== 0" class="reverse">
      <article v-for="[friend, messages] in conversations" :key="friend">
        <MessageComponent :messages="messages" :friend="friend" @click="updateCurConversation(friend)" />
      </article>
      <section>
        <form class="row">
          <input type="radio" v-model="action" value="sendMessage" checked />Send Message<br />
          <input type="radio" v-model="action" value="createGroup" />Create Group<br />
          <input type="radio" v-model="action" value="joinGroup" />Join Group
        </form>

        <SendMessageWithUsernameForm v-if="action == 'sendMessage'" :friends="friends" @refreshConvo="getMessages(curConversation)" />
        <CreateGroupForm v-else-if="action == 'createGroup'" />
        <JoinGroupForm v-else-if="action == 'joinGroup'" />
      </section>
    </section>
    <p v-else-if="loaded">No messages found</p>
    <p v-else>Loading...</p>
    <section v-if="loaded && conversations.size !== 0">
      <MessagesHistoryComponent :friends="friends" :friend="curConversation" :conversation="conversations.get(curConversation)" @refreshConvo="getMessages(curConversation)" @edit="edit" />
    </section>
  </section>
  <section v-else>
    <GroupEditComponent :groupName="curConversation" @refreshGroup="getMessages(curConversation)" @done="edit" />
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
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 auto;
  width: 20em;
}

.column {
  display: flex;
  flex-direction: row;
  gap: 70em;
}

.reverse {
  display: flex;
  flex-direction: column-reverse;
  overflow: scroll;
  max-height: 70em;
}
</style>
