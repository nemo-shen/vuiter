import type { Component, DefineComponent, PropType } from "@vue/runtime-core";
import { createRenderer, defineComponent, h, onMounted } from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { nodeOps, VUIElement, VUINode } from "./nodeOps";
import { Direction } from "yoga-layout";
import { extend } from "./utils";
import { render } from "./render";

const { render: baseRender, createApp: baseCreateApp } = createRenderer<VUINode, VUIElement>(
  extend({ patchProp }, nodeOps),
);

// 为什么要给她包一层是因为我们要处理一些事情，比如重新渲染之类的事情
export const VUIApp = defineComponent({
  name: "VUIRoot",
  props: {
    root: {
      type: Object as PropType<DefineComponent>,
      required: true,
    },
    body: {
      type: Object as PropType<VUIElement>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    onMounted(() => {
      const yogaNode = props.body.yogaNode;
      yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
      render(props.body);

      // 在onMounted中处理yogaNode，然后render出来
      console.log("onMounted");

      /**
       * nodeOps的时候就已经挂载好了全部的yogaNode
       * 在onMounted的时候只不过是把布局好的内容渲染出来
       */
    });

    return () =>
      h(props.root /* 这个root是外部开发传入的根组件 */, {
        foo: "bar",
      });
  },
});

export const createApp = (rootComponent: Component) => {
  const body = nodeOps.createElement("div");
  // const rootContainer = nodeOps.createElement("div");
  const app = baseCreateApp(VUIApp, {
    root: rootComponent, // 开发者的根节点应该作为vuiter app 的子节点
    body,
  });
  const { mount } = app;
  const newApp: any = app;
  newApp.mount = () => {
    mount(body); // 实际上这里是vuiter内部在帮开发者完成 mount挂载 我们这里简单弄了一个div的组件去挂载
  };
  return newApp;
};
