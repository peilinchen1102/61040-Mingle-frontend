<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const props = defineProps(["friend", "friends"]);
const emit = defineEmits(["refreshConvo"]);
let content = ref("");

async function sendMessage(username: string, content: string) {
  if (JSON.parse(JSON.stringify(props.friends)).includes(username)) {
    try {
      await fetchy(`/api/messages/${username}`, "POST", { body: { content } });
    } catch (_) {
      return;
    }
  } else {
    try {
      await fetchy(`/api/group/sendMsg/${username}`, "POST", { body: { content } });
    } catch (e) {
      return;
    }
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
    <button type="submit" class="pure-button pure-button-primary" style="background-color: black">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
        <path
          d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
        ></path>
      </svg>
    </button>
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
