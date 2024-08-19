<script setup lang="ts">
import { ref } from "vue";
const text = ref("Hello Worldhhhhh");

const onClick = () => {
  console.log("on click");
};
</script>

<template>
  <div
    style="
    border: 1rem solid green;
    padding: 1rem; width: 10rem; height: 5rem; display: flex; flex-direction: row; background-color: blue"
  >
    <div style="width: 2rem; height: 1rem; background-color: red;"></div>
  </div>
</template>
