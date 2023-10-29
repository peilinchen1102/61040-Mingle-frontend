<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["refreshConvo"]);
let name = ref("");

async function joinGroup(name: string) {
  try {
    await fetchy(`/api/group/join/${name}`, "PATCH");
  } catch (e) {
    return;
  }
  emptyForm();
  emit("refreshConvo");
}

const emptyForm = () => {
  name.value = "";
};
</script>

<template>
  <form id="texting" @submit.prevent="joinGroup(name)" class="pure-form">
    <div class="column" style="display: flex; align-items: flex-start">
      <div>
        <label>Group Name:</label>
        <input class="textbox" type="text" v-model="name" placeholder="18.404 Pset Group" required />
        <button type="submit" class="pure-button pure-button-primary" style="background-color: black">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
            <path
              d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.textbox {
  width: 15em;
}

label {
  padding-right: 1em;
}
</style>
