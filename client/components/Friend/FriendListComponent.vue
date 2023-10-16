<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import FriendComponent from "./FriendComponent.vue";
import FriendRequestComponent from "./FriendRequestComponent.vue";
import SendFriendRequestForm from "./SendFriendRequestForm.vue";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let friends = ref<Array<Record<string, string>>>([]);
let friendReqs = ref<Array<Record<string, string>>>([]);

async function getFriendRequests() {
  let friendReqResults;
  try {
    friendReqResults = await fetchy("/api/friend/requests", "GET");
  } catch (e) {
    console.log(e);
    return;
  }
  friendReqs.value = friendReqResults;
}

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (e) {
    console.log(e);
    return;
  }

  friends.value = friendResults;
}

onBeforeMount(async () => {
  await getFriends();
  await getFriendRequests();
  loaded.value = true;
});
</script>

<template>
  <section class="column">
    <section>
      <h2>Friends</h2>
      <section class="row" v-if="loaded && friends.length !== 0">
        <article v-for="friend in friends" :key="friend._id" style="width: 15em">
          <FriendComponent :friend="friend" @refreshFriends="getFriends" />
        </article>
      </section>
      <p v-else-if="loaded">No friends found</p>
      <p v-else>Loading...</p>
    </section>

    <section>
      <h2>Friend Requests</h2>
      <SendFriendRequestForm @refreshReqs="getFriendRequests" />
      <section class="column">
        <section>
          <h3>To:</h3>
          <section v-if="loaded && friendReqs.filter((r) => r.from == currentUsername).length !== 0">
            <article v-for="req in friendReqs.filter((r) => r.from == currentUsername)" :key="req._id">
              <FriendRequestComponent v-if="req.from == currentUsername" :req="req" @refreshReqs="getFriendRequests" @refreshFriends="getFriends" />
            </article>
          </section>
          <p v-else-if="loaded">No requests found</p>
          <p v-else>Loading...</p>
        </section>

        <section>
          <h3>From:</h3>
          <section v-if="loaded && friendReqs.filter((r) => r.from !== currentUsername).length !== 0">
            <article v-for="req in friendReqs.filter((r) => r.from !== currentUsername)" :key="req._id">
              <FriendRequestComponent v-if="req.from !== currentUsername" :req="req" @refreshReqs="getFriendRequests" @refreshFriends="getFriends" />
            </article>
          </section>
          <p v-else-if="loaded">No requests found</p>
          <p v-else>Loading...</p>
        </section>
      </section>
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
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
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
  align-items: flex-start;
  margin: 0 auto;
  gap: 5em;
}
</style>
