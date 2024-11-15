import { createApp } from "vuiter";
import App from "./App.vue";
import { defineComponent, h } from "@vue/runtime-core";

const EmptyApp = defineComponent({
  setup() {
    return () =>
      h(
        "div",
        {
          style: {
            width: "10",
            height: "1",
          },
        },
        "",
      );
  },
});

const app = createApp(EmptyApp);

const container = {
  log: console.log,
};
app.mount(container);
