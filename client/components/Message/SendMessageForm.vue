<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["friend"]);
const emit = defineEmits(["refreshConvo"]);
let content = ref("");

async function sendMessage(username: string, content: string) {
  try {
    await fetchy(`/api/messages/${username}`, "POST", { body: { content } });
  } catch (_) {
    return;
  }
  emptyForm();
  emit("refreshConvo");
}

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form id="texting" @submit.prevent="sendMessage(props.friend, content)" class="pure-form">
    <input class="textbox" type="text" v-model="content" placeholder="Send Message" required />
    <button type="submit" class="pure-button pure-button-primary">Send</button>
  </form>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
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
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.textbox {
  width: 65em;
}

#texting {
  position: absolute;
  top: 45em;
}
</style>
