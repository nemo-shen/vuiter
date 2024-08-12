const extend = Object.assign;
import { createRenderer } from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { nodeOps, VUIElement, VUINode } from "./nodeOps";

export const { render, createApp } = createRenderer<VUINode, VUIElement>(
  extend({ patchProp }, nodeOps),
);
// const app = createApp(App /* root */);
// const { mount } = app;
// const root = nodeOps.createElement("div");
// mount(root);
