import type { Component, DefineComponent, PropType } from "@vue/runtime-core";
import { createRenderer, defineComponent, h, onMounted } from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { nodeOps, VUIElement, VUINode } from "./nodeOps";
import App from "./app";
import Div, { VUICSSStyleDeclaration } from "./div";

// ------------ test code ------------
const appLayout = new App();
const createBox = (index: number) => {
  const style: Partial<VUICSSStyleDeclaration> = {
    width: 20,
    height: 5,
    borderWidth: 1,
    // borderStyle: "round",
    // flexGrow: 1,
  };
  if (index === 2) {
    // style.gap = 2
    // style.flexShrink = 1;
    // style.flexGrow = 2;
    // style.marginLeft = 'auto';
  }
  const box = new Div({
    style,
  });
  return box;
};

appLayout.append(...Array.from({ length: 3 }, (_, index) => createBox(index)));
// ------------ test code ------------

const extend = Object.assign;

const { render: baseRender, createApp: baseCreateApp } = createRenderer<VUINode, VUIElement>(
  extend({ patchProp }, nodeOps),
);
const Comp = defineComponent({
  render() {
    console.log(123012301203);
    return "Hello World";
  },
});

// 为什么要给她包一层是因为我们要处理一些事情，比如重新渲染之类的事情
export const VUIApp = defineComponent({
  name: "VUIRoot",
  props: {
    root: {
      type: Object as PropType<DefineComponent>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    onMounted(() => {
      // 在onMounted中处理yogaNode，然后render出来
      console.log("onMounted");

      appLayout.flow();
      appLayout.paint();
      appLayout.render();
    });

    return () => h(props.root /* 这个root是外部开发传入的根组件 */, attrs);
  },
});

export const createApp = (rootComponent: Component) => {
  const body = nodeOps.createElement("div");
  // const rootContainer = nodeOps.createElement("div");
  const app = baseCreateApp(VUIApp, {
    root: rootComponent, // 开发者的根节点应该作为vuiter app 的子节点
  });
  const { mount } = app;
  const newApp: any = app;
  newApp.mount = () => {
    mount(body); // 实际上这里是vuiter内部在帮开发者完成 mount挂载 我们这里简单弄了一个div的组件去挂载
  };
  return newApp;
};
