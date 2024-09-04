import type { Component, DefineComponent, PropType } from "@vue/runtime-core";
import { createRenderer, defineComponent, h, onMounted } from "@vue/runtime-core";
import { patchProp } from "./patchProp";
import { nodeOps, Node, VUIElement, VUINode } from "./nodeOps";
import App from "./app";
import Div, { VUICSSStyleDeclaration } from "./div";
import { Direction, Edge } from "yoga-layout";
import { isDef } from "./utils";
import chalk from "chalk";
import { BORDER_STYLE } from "./constants";
import process from "node:process";

const columns = 50; // dev
const rows = 20; // dev
const canvas = new Array(rows).fill(null).map(() => new Array(columns).fill(""));

function drawNodeToCanvas(el: Node) {
  const { yogaNode: node } = el;
  if (!node) return;
  const style = {
    borderStyle: "solid",
  } as Record<string, any>;
  const left = node.getComputedLeft();
  const top = node.getComputedTop();
  const width = node.getComputedWidth();
  const height = node.getComputedHeight();

  // 绘制节点的 margin 区域
  const marginLeft = node.getComputedMargin(Edge.Left);
  const marginTop = node.getComputedMargin(Edge.Top);
  const marginRight = node.getComputedMargin(Edge.Right);
  const marginBottom = node.getComputedMargin(Edge.Bottom);

  // 绘制节点的 padding 区域
  const paddingLeft = node.getComputedPadding(Edge.Left);
  const paddingTop = node.getComputedPadding(Edge.Top);
  const paddingRight = node.getComputedPadding(Edge.Right);
  const paddingBottom = node.getComputedPadding(Edge.Bottom);

  // 绘制节点的边框区域
  const borderLeft = node.getComputedBorder(Edge.Left);
  const borderTop = node.getComputedBorder(Edge.Top);
  const borderRight = node.getComputedBorder(Edge.Right);
  const borderBottom = node.getComputedBorder(Edge.Bottom);

  const gapText = " ";

  // 绘制 margin
  for (let y = top - marginTop; y < top + height + marginBottom; y++) {
    for (let x = left - marginLeft; x < left + width + marginRight; x++) {
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        canvas[y][x] = gapText;
      }
    }
  }

  const borderStyle = BORDER_STYLE["round"];

  // console.log(borderLeft, borderTop, borderRight, borderBottom, "|", left, width);
  const right = left + width - 1;
  const bottom = top + height - 1;
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      let text = "";
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        const isLeftBorder = borderLeft && x === left;
        const isRightBorder = borderRight && x === right;
        const isTopBorder = borderTop && y === top;
        const isBottomBorder = borderBottom && y === bottom;
        const isBorder = isLeftBorder || isRightBorder || isTopBorder || isBottomBorder;
        const isTopLeftBorderCorner = isLeftBorder && isTopBorder;
        const isTopRightBorderCorner = isRightBorder && isTopBorder;
        const isBottomLeftBorderCorner = isBottomBorder && isLeftBorder;
        const isBottomRightBorderCorner = isBottomBorder && isRightBorder;
        const isCorner =
          isTopLeftBorderCorner ||
          isTopRightBorderCorner ||
          isBottomLeftBorderCorner ||
          isBottomRightBorderCorner;
        const isLeftBorderNotCorner = isLeftBorder && !isCorner;
        const isRightBorderNotCorner = isRightBorder && !isCorner;
        const isTopBorderNotCorner = isTopBorder && !isCorner;
        const isBottomBorderNotCorner = isBottomBorder && !isCorner;

        if (isLeftBorderNotCorner) {
          text = borderStyle.vertical;
        }

        if (isRightBorderNotCorner) {
          text = borderStyle.vertical;
        }

        if (isTopBorderNotCorner) {
          text = borderStyle.horizontal;
        }

        if (isBottomBorderNotCorner) {
          text = borderStyle.horizontal;
        }

        if (isTopLeftBorderCorner) {
          text = borderStyle.topLeft;
        }

        if (isTopRightBorderCorner) {
          text = borderStyle.topRight;
        }

        if (isBottomLeftBorderCorner) {
          text = borderStyle.bottomLeft;
        }

        if (isBottomRightBorderCorner) {
          text = borderStyle.bottomRight;
        }

        if (!isBorder) {
          text = " ";
        }
      }
      canvas[y][x] = style?.borderColor ? chalk.hex(style.borderColor)(text) : text;
    }
  }

  // for (let y = top + borderTop; y < top + height - borderBottom; y++) {
  //   for (let x = left + borderLeft; x < left + width - borderRight; x++) {
  //     if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
  //       canvas[y][x] = gapText;
  //       // if (isDef(style.backgroundColor)) {
  //       //   canvas[y][x] = chalk.bgHex(style.backgroundColor)(gapText);
  //       // }
  //     }
  //   }
  // }

  // for (let y = top + borderTop + paddingTop; y < top + height - borderBottom - paddingBottom; y++) {
  //   for (
  //     let x = left + borderLeft + paddingLeft;
  //     x < left + width - borderRight - paddingRight;
  //     x++
  //   ) {
  //     if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
  //       canvas[y][x] = gapText;
  //       // if (isDef(style.backgroundColor)) {
  //       //   canvas[y][x] = chalk.bgHex(style.backgroundColor)(gapText);
  //       // }
  //     }
  //   }
  // }

  for (const child of el.childNodes) {
    drawNodeToCanvas(child);
  }
}

const render = (canvas: string[][]) => {
  canvas.forEach((row) => {
    process.stdout.write(row.join("") + "\n");
  });
};

const extend = Object.assign;

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
      drawNodeToCanvas(props.body);
      render(canvas);

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
