<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import MatchRequestForm from "./MatchRequestForm.vue";
import SwiperCarousel from "./SwiperCarousel.vue";

let matches = ref<Array<string>>([]);

async function getMatches() {
  let matchResults;
  try {
    matchResults = await fetchy(`/api/matches`, "GET");
  } catch {
    return;
  }
  matches.value = matchResults;
}
</script>

<template>
  <MatchRequestForm @refreshMatch="getMatches" />
  <!-- <section>
    <swiper :slides-per-view="1" :navigation="true">
      <swiper-slide v-for="n in 7" :key="n"> {{ n }} </swiper-slide>
    </swiper>
  </section> -->
  <SwiperCarousel />
  <ProfileComponent />
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.friend {
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
}

.swiper-slide {
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  width: 50% !important;
  margin: 0 25%;
  font-size: 24px;
  font-weight: 700;
}
.swiper-slide:nth-child(1n) {
  background-color: palevioletred;
}
.swiper-slide:nth-child(2n) {
  background-color: skyblue;
}
.swiper-slide:nth-child(3n) {
  background-color: peru;
}
.swiper-slide:nth-child(4n) {
  background-color: cadetblue;
}
.swiper-slide:nth-child(5n) {
  background-color: plum;
}
.swiper-slide:nth-child(6n) {
  background-color: goldenrod;
}
.swiper-slide:nth-child(7n) {
  background-color: palegreen;
}

.swiper {
  width: 600px;
  height: 300px;
}
</style>
