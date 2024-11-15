import { createRenderer, h, Component, VNode } from "@vue/runtime-core";
import type { RendererOptions } from "@vue/runtime-core";
import Yoga, { Edge, Node as YogaNode, FlexDirection, Direction } from "yoga-layout";

// 扩展 ConsoleElement 接口，添加 yogaNode
interface ConsoleElement {
  type: string;
  props: Record<string, any>;
  children: (ConsoleElement | string)[];
  parentElement: ConsoleElement | null;
  yogaNode: YogaNode;
}

type Layout = {
    left: number;
    // right: number;
    top: number;
    // bottom: number;
    width: number;
    height: number;
};

// 修改渲染器选项
const renderOptions: RendererOptions<ConsoleElement, ConsoleElement> = {
  createElement(type: string): ConsoleElement {
    return {
      type,
      props: {},
      children: [],
      parentElement: null,
      yogaNode: Yoga.Node.create(), // 创建 yoga 节点
    };
  },

  createText(text: string): ConsoleElement {
    const yogaNode = Yoga.Node.create();
    // 设置文本节点的默认尺寸
    yogaNode.setMeasureFunc(() => ({
      width: text.length,
      height: 1,
    }));

    return {
      type: "text",
      props: {},
      children: [text],
      parentElement: null,
      yogaNode,
    };
  },

  setText(node: ConsoleElement, text: string) {
    node.children = [text];
    // 更新测量函数
    node.yogaNode.setMeasureFunc(() => ({
      width: text.length,
      height: 1,
    }));
  },

  setElementText(node: ConsoleElement, text: string) {
    node.children = [text];
    // 更新测量函数
    node.yogaNode.setMeasureFunc(() => ({
      width: text.length,
      height: 1,
    }));
  },

  insert(child: ConsoleElement, parent: ConsoleElement, anchor?: ConsoleElement | null) {
    child.parentElement = parent;
    if (anchor) {
      const index = parent.children.indexOf(anchor);
      if (index !== -1) {
        parent.children.splice(index, 0, child);
        parent.yogaNode.insertChild(child.yogaNode, index);
      } else {
        parent.children.push(child);
        parent.yogaNode.insertChild(child.yogaNode, parent.yogaNode.getChildCount());
      }
    } else {
      parent.children.push(child);
      parent.yogaNode.insertChild(child.yogaNode, parent.yogaNode.getChildCount());
    }
  },

  remove(el: ConsoleElement) {
    const parent = el.parentElement;
    if (parent) {
      const index = parent.children.indexOf(el);
      if (index !== -1) {
        parent.children.splice(index, 1);
        parent.yogaNode.removeChild(el.yogaNode);
      }
    }
  },

  patchProp(el: ConsoleElement, key: string, prevValue: any, nextValue: any) {
    el.props[key] = nextValue;

    // 处理样式属性
    if (key === "style") {
      const style = nextValue || {};

      // 设置宽度
      if (style.width) {
        el.yogaNode.setWidth(parseInt(style.width));
      }

      // 设置高度
      if (style.height) {
        el.yogaNode.setHeight(parseInt(style.height));
      }

      // 处理其他 yoga 相关的样式属性
      if (style.padding) {
        el.yogaNode.setPadding(Yoga.EDGE_ALL, style.padding);
      }

      if (style.margin) {
        el.yogaNode.setMargin(Yoga.EDGE_ALL, style.margin);
      }

      // 处理 flex 相关属性
      // if (style.flexDirection) {
      //   el.yogaNode.setFlexDirection(Yoga[`FLEX_DIRECTION_${style.flexDirection.toUpperCase()}`]);
      // }

      // if (style.justifyContent) {
      //   el.yogaNode.setJustifyContent(Yoga[`JUSTIFY_${style.justifyContent.toUpperCase()}`]);
      // }

      // if (style.alignItems) {
      //   el.yogaNode.setAlignItems(Yoga[`ALIGN_${style.alignItems.toUpperCase()}`]);
      // }
    }
  },

  parentNode(node: ConsoleElement): ConsoleElement | null {
    return node.parentElement;
  },

  nextSibling(node: ConsoleElement): ConsoleElement | null {
    const parent = node.parentElement;
    if (!parent) return null;
    const index = parent.children.indexOf(node);
    return (parent.children[index + 1] as ConsoleElement) || null;
  },

  createComment(text: string): ConsoleElement {
    return {
      type: "comment",
      props: {},
      children: [text],
      parentElement: null,
      yogaNode: Yoga.Node.create(),
    };
  },
};

// 修改渲染函数，使用 yoga 布局信息
function renderNode(node: ConsoleElement | string, layout?: Layout): string {
  if (typeof node === "string") {
    return node;
  }

  if (!layout) {
    node.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
    layout = {
      left: node.yogaNode.getComputedLeft(),
      top: node.yogaNode.getComputedTop(),
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight(),
    };
  }

  if (node.type === "text" || node.type === "comment") {
    return node.children.join("");
  }

  let output = "";
  if (node.type === "div") {
    const width = Math.floor(layout.width);
    const height = Math.floor(layout.height);

    // 创建边框
    const horizontalBorder = "─".repeat(width);
    output += `┌${horizontalBorder}┐\n`;

    // 内容区域
    for (let i = 0; i < height; i++) {
      let line = "";
      // 处理子节点
      // node.children.forEach((child) => {
      //   if (typeof child !== "string") {
      //     const childLayout = {
      //       left: child.yogaNode.getComputedLeft(),
      //       top: child.yogaNode.getComputedTop(),
      //       width: child.yogaNode.getComputedWidth(),
      //       height: child.yogaNode.getComputedHeight(),
      //     };
      //     if (childLayout.top <= i && i < childLayout.top + childLayout.height) {
      //       const content = renderNode(child, childLayout);
      //       line += content;
      //     }
      //   }
      // });
      // 如果这一行没有内容，填充空格
      if (!line) {
        line = " ".repeat(width);
      }
      output += `│${line.padEnd(width)}│\n`;
    }

    output += `└${horizontalBorder}┘\n`;
  }

  return output;
}

// 创建自定义渲染器
const renderer = createRenderer<ConsoleElement, ConsoleElement>(renderOptions);

// // 创建应用
export default function createConsoleApp(rootComponent: Component) {
  const app = renderer.createApp(rootComponent);

  return {
    mount(container: { log: (message: string) => void }) {
      const root: ConsoleElement = {
        type: "root",
        props: {},
        children: [],
        parentElement: null,
        yogaNode: Yoga.Node.create(), // 创建 yoga 节点
      };

      const containerElement: ConsoleElement = {
        type: "div",
        props: {},
        children: [],
        parentElement: root,
        yogaNode: Yoga.Node.create(), // 创建 yoga 节点
      };

      root.children.push(containerElement);

      app._container = containerElement;
      renderer.render(h(rootComponent), containerElement);

      const output = renderNode(containerElement);
      container.log(output);

      return app;
    },
  };
}
