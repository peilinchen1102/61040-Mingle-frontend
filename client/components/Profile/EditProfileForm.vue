<script setup lang="ts">
import { Ref, ref } from "vue";
import { BodyT, fetchy } from "../../utils/fetchy";

const props = defineProps(["profile"]);
const newProfile = ref({ name: props.profile.name, major: props.profile.major, year: props.profile.year });
const newCourses: Ref<Array<string>> = ref([]);

for (const course of props.profile.courses) {
  newCourses.value.push(course);
}

const emit = defineEmits(["refreshProfile", "edit"]);

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
    newCourses.value.push("");
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
  <div style="width: 35em">
    <h2>Update user profile</h2>
    <form @submit.prevent="editProfile(newProfile), editCourses(newCourses), emit('edit')" class="pure-form">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-trash-fill" viewBox="0 0 16 16">
              <path
                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
              />
            </svg>
          </button>
        </div>
        <button type="button" class="button-4" @click="addCourse">Add Course</button>
      </fieldset>
      <button type="submit" class="button-6" style="background-color: rgb(226, 225, 225)">Update Profile</button>
    </form>
  </div>
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
