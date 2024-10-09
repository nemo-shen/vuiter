import Yoga, { Edge, Node as YogaNode } from "yoga-layout";
import { BorderConfig, DEFAULT_BORDER_CONFIG } from "./patchProp";
import { extend } from "./utils";

export interface Node {
  /**
   * Returns the children.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/childNodes)
   */
  childNodes: Node[];
  /**
   * Returns the parent.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentNode)
   */
  parentNode: Node | null;
  /**
   * Returns the next sibling.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)
   */
  nextSibling: Node | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/textContent) */
  textContent: string | null;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/insertBefore) */
  insertBefore<T extends Node>(node: T, child: Node | null): T;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/removeChild) */
  removeChild<T extends Node>(child: T): T;

  ELEMENT_NODE: 1;
  TEXT_NODE: 3;
  COMMENT_NODE: 8;

  yogaNode: YogaNode;
  borderConfig: {
    left: BorderConfig;
    top: BorderConfig;
    right: BorderConfig;
    bottom: BorderConfig;
  };
}

type SupportCSSStyleDeclarationKeys =
  | "width"
  | "height"
  | "border"
  | "borderWidth"
  | "borderStyle"
  | "borderColor"
  | "borderLeft"
  | "borderLeftColor"
  | "borderLeftStyle"
  | "borderLeftWidth"
  | "borderRight"
  | "borderRightColor"
  | "borderRightStyle"
  | "borderRightWidth"
  | "borderTop"
  | "borderTopColor"
  | "borderTopStyle"
  | "borderTopWidth"
  | "borderBottom"
  | "borderBottomColor"
  | "borderBottomStyle"
  | "borderBottomWidth"
  | "backgroundColor"
  | "color";

export class Node implements Node {
  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static COMMENT_NODE = 8;
  type = Node.ELEMENT_NODE | Node.TEXT_NODE | Node.COMMENT_NODE;
  childNodes: Node[] = [];
  parentNode: Node | null = null;
  textContent: string | null = null;
  yogaNode: YogaNode;
  style: Pick<CSSStyleDeclaration, SupportCSSStyleDeclarationKeys> = {
    border: "",
    borderLeft: "",
    borderLeftColor: "",
    borderLeftStyle: "",
    borderLeftWidth: "",
    borderRight: "",
    borderRightColor: "",
    borderRightStyle: "",
    borderRightWidth: "",
    borderTop: "",
    borderTopColor: "",
    borderTopStyle: "",
    borderTopWidth: "",
    borderBottom: "",
    borderBottomColor: "",
    borderBottomStyle: "",
    borderBottomWidth: "",
    width: "",
    height: "",
    borderWidth: "",
    borderStyle: "",
    borderColor: "",
    color: "",
    backgroundColor: "",
  };
  borderConfig = {
    left: extend({}, DEFAULT_BORDER_CONFIG),
    top: extend({}, DEFAULT_BORDER_CONFIG),
    right: extend({}, DEFAULT_BORDER_CONFIG),
    bottom: extend({}, DEFAULT_BORDER_CONFIG),
  };

  constructor() {
    this.yogaNode = Yoga.Node.create();
  }

  insertBefore<T extends Node>(node: T, ref: Node | null = null): T {
    node.parentNode = this;
    if (ref) {
      const index = this.childNodes.indexOf(ref);
      if (index !== -1) {
        node.nextSibling = ref;
        this.childNodes.splice(index, 0, node);
        this.yogaNode.insertChild(node.yogaNode, index);
      }
    } else {
      this.childNodes.push(node);
      this.yogaNode.insertChild(node.yogaNode, this.yogaNode.getChildCount());
    }
    return node;
  }

  removeChild<T extends Node>(child: T): T {
    const index = this.childNodes.indexOf(child);
    if (index !== -1) {
      this.childNodes.splice(index, 1);
      if (index > 1) {
        this.childNodes[index - 1].nextSibling = this.childNodes[index] || null;
        this.yogaNode.removeChild(child.yogaNode);
      }
    }
    return child;
  }
}
export class VuiElement extends Node {
  type = Node.ELEMENT_NODE;
  tagName: string;
  props: Record<string, any>;

  constructor(tagName = "div") {
    super();
    this.tagName = tagName;
    this.props = {};
  }
}
export class VuiText extends Node {
  type = Node.TEXT_NODE;

  constructor(data: string) {
    super();
    this.textContent = data;
  }
}

class VuiComment extends Node {
  type = Node.COMMENT_NODE;
  parentNode: VuiElement | null;
  data: string;

  constructor(data: string) {
    super();
    this.data = data;
    this.parentNode = null;
  }
}

const insert = (child: Node, parent: Node, ref: Node | null = null): void => {
  console.log("insert", !!child, child.textContent, !!parent, ref);
  parent.insertBefore(child, ref);
};
const remove = (child: Node): void => {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
};
const createElement = (tag: string): VuiElement => {
  return new VuiElement(tag);
};
const createText = (data: string): VuiText => {
  console.log("createText", data);
  return new VuiText(data);
};
const createComment = (data: string): VuiComment => {
  return new VuiComment(data);
};
const setText = (node: VuiText, text: string): void => {
  console.log("setText", text);
  node.data = text;
};
const setElementText = (el: VuiElement, text: string): void => {
  el.textContent = text;

  el.childNodes.forEach((child) => {
    el.removeChild(child);
  });

  if (text) {
    el.insertBefore(new VuiText(text));
  }
};
const parentNode = (node: Node): Node | null => {
  return node.parentNode;
};
const nextSibling = (node: Node): Node | null => {
  return node.nextSibling;
};

// TODO: 实现对静态内容的优化处理
const insertStaticContent = (
  content: string,
  parent: VuiElement,
  anchor: Node | null,
) => {
  return [null, null];
}

export const nodeOps = {
  insert,
  remove,
  createElement,
  createText,
  createComment,
  setText,
  setElementText,
  parentNode,
  nextSibling,
  insertStaticContent,
};
