<script setup lang="ts">
import { ref } from "vue";
const text = ref("Hello World");

const onClick = () => {
  console.log("on click");
};
</script>

<template>
  <div style="border: 1rem solid red; display: flex; flex-direction: row">
    <div style="width: 7rem; height: 1rem">click</div>
    <div style="width: 11rem; height: 1rem">content</div>
    <div style="width: 11rem; height: 1rem">content</div>
    <div style="border: 1rem solid blue; width: 10rem; height: 12rem">
      <div
        style="
          width: 10rem;
          height: 10rem;
          border: 1rem solid yellow;
          padding: 1rem;
          margin: 1rem;
          color: red;
        "
      >
        {{ text }}
      </div>
    </div>
    <div style="border: 1rem solid blue; width: 100rem; height: 12rem">
      <div
        style="
          width: 30rem;
          height: 10rem;
          border: 1rem solid yellow;
          padding: 1rem;
          margin: 1rem;
          color: red;
        "
      >
        Hello World!
      </div>
    </div>
  </div>
</template>
