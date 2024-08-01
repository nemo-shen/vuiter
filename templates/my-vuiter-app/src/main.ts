import { createRenderer } from "@vue/runtime-core";
import { createApp } from 'vuiter';
// import { patchProp } from "./patchProp";
// import { nodeOps } from "./nodeOps";

// import App from "./App.vue";
// import { VUIElement, VUINode } from "./nodeOps";

// const extend = Object.assign;

// export const { render, createApp: baseCreateApp } = createRenderer<VUINode, VUIElement>(
//   extend({ patchProp }, nodeOps),
// );

// const { render, createApp } = createRenderer({
// });
// export const createApp = () => {
//   const app = baseCreateApp(App /* root */);
//   const { mount } = app;
//   const root = nodeOps.createElement("div");
//   const newApp: any = app;
//   newApp.mount = () => {
//     console.log('mount');
//     mount(root);
//   }
//   return newApp;
// };

createApp().mount();