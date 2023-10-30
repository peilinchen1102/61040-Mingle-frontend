<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["groupName"]);
const emit = defineEmits(["done"]);
const { currentUsername } = storeToRefs(useUserStore());
const group = ref();
let loaded = ref(false);

async function getGroup(groupName: string) {
  let groupResult;
  try {
    groupResult = await fetchy(`/api/groups/${groupName}`, "GET");
  } catch (e) {
    return;
  }
  group.value = groupResult[0];
}

async function removeMember(memberUsername: string) {
  try {
    await fetchy(`/api/group/remove/${props.groupName}`, "PATCH", { body: { memberUsername } });
  } catch (e) {
    return;
  }
  emit("done");
}

async function deleteGroup() {
  try {
    await fetchy(`/api/group/delete/${props.groupName}`, "DELETE");
  } catch (e) {
    return;
  }
  emit("done");
}

async function leaveGroup() {
  try {
    await fetchy(`/api/group/leave/${props.groupName}`, "PATCH");
  } catch (e) {
    return;
  }
  emit("done");
}

onBeforeMount(async () => {
  await getGroup(props.groupName);
  loaded.value = true;
});
</script>

<template>
  <div style="display: flex; align-items: center; flex-direction: column">
    <section>
      <h2>{{ props.groupName }}</h2>
    </section>
    <section v-if="loaded && group">
      <section class="column">
        <h2>Group Owner</h2>
        {{ group.owner }}
      </section>
      <section class="column">
        <h2>Group Members</h2>
        <article v-for="member in group.members" :key="member" style="width: 10em" class="member">
          {{ member }}
          <button v-if="group.owner == currentUsername" class="button-error button-4 small" @click="removeMember(member)">Remove</button>
        </article>
        <button v-if="group.owner == currentUsername" class="button-4 button-error" @click="deleteGroup">Delete Group</button>
        <button v-if="group.owner != currentUsername" class="button-4 button-error" @click="leaveGroup">Leave Group</button>
        <button class="button-4 pure-button-primary" @click="emit('done')">Done</button>
      </section>
    </section>
    <p v-else-if="loaded">No group found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  width: fit-content;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25em;
  padding: 0.75em;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1em;
  height: fit-content;
  align-items: center;
}
.member {
  display: flex;
  justify-content: space-between;
  padding: 1em;
}
</style>
