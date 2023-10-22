<script setup lang="ts">
import { Ref, ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";

const props = defineProps(["profile"]);
const newProfile = ref({ name: props.profile.name, major: props.profile.major, year: props.profile.year });
const newCourses: Ref<Array<string>> = ref([]);

for (const course of props.profile.courses) {
  newCourses.value.push(course);
}

const emit = defineEmits(["refreshProfile"]);

const editProfile = async (update: BodyT) => {
  try {
    await fetchy(`/api/profile`, "PATCH", { body: { update: update } });
  } catch (e) {
    return;
  }
  emit("refreshProfile");
};

const editCourses = async (courses: Array<string>) => {
  try {
    const update = JSON.parse(JSON.stringify(courses));
    await fetchy(`/api/profile`, "PATCH", { body: { update: { courses: update } } });
  } catch (e) {
    return;
  }
  emit("refreshProfile");
};

const addCourse = async () => {
  try {
    newCourses.value.push("[enter course]");
  } catch (e) {
    return;
  }
};

const deleteCourse = async (index: number) => {
  try {
    newCourses.value.splice(index, 1);
  } catch (e) {
    return;
  }
};
</script>

<template>
  <h2>Update user profile</h2>
  <form @submit.prevent="editProfile(newProfile), editCourses(newCourses)" class="pure-form">
    <fieldset>
      <legend>Name</legend>
      <input type="text" v-model="newProfile.name" required />
      <legend>Major</legend>
      <input type="text" v-model="newProfile.major" required />
      <legend>Class Year of</legend>
      <input type="number" v-model="newProfile.year" required />
      <legend>Courses</legend>
      <!-- <p>(format: "[course1]", "[course2]")</p>
      <input type="text" v-model="courses" required /> -->

      <div v-for="(course, index) in newCourses" :key="index">
        <input v-model="newCourses[index]" />
        <button type="button" style="background-color: transparent; border: 0cap" @click="deleteCourse(index)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
      <button type="button" @click="addCourse">Add Course</button>
    </fieldset>
    <button type="submit" class="pure-button pure-button-primary">Update Profile</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

input {
  align-content: center;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

button {
  height: 2em;
}

p {
  margin: 0em;
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
</style>
