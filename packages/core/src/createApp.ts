import {
  Component,
  DefineComponent,
  PropType,
  createRenderer,
  defineComponent,
  h,
  onMounted,
  VNode,
  nextTick,
} from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { VuiElement, Node } from "./node";
import { nodeOps } from "./nodeOps";
import { Direction } from "yoga-layout";
import { extend } from "./utils";
import renderer from "./renderer";

const _print2DArray = (arr: any): void => {
  arr.forEach((row: any[]) => console.log(row.join("")));
};

const { render: baseRender, createApp: baseCreateApp } = createRenderer<Node, VuiElement>(
  extend({ patchProp }, nodeOps),
);

export const VUIApp = defineComponent({
  name: "VUIRoot",
  props: {
    root: {
      type: Object as PropType<DefineComponent>,
      required: true,
    },
    body: {
      type: Object as PropType<VuiElement>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const vnode = h(props.root, { foo: "bar" });
      baseRender(vnode, props.body);
      props.body.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
      const canvas = renderer(props.body);
      _print2DArray(canvas);
      return null; // 或者返回一个占位符元素
    };
  },
});

export const createApp = (rootComponent: Component) => {
  const body = nodeOps.createElement("div");
  body.yogaNode.setWidth(30);
  body.yogaNode.setHeight(20);
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
