import type { Component } from "@vue/runtime-core";
import { createRenderer } from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { nodeOps, VUIElement, VUINode } from "./nodeOps";

const extend = Object.assign;

const { render, createApp: baseCreateApp } = createRenderer<VUINode, VUIElement>(
  extend({ patchProp }, nodeOps),
);

export const createApp = (rootComponent: Component) => {
  const root = nodeOps.createElement("div");
  const app = baseCreateApp(root);
  const { mount } = app;
  const newApp: any = app;
  newApp.mount = () => {
    console.log("nemo 99999 mount");
    mount(root);
  };
  return newApp;
};
