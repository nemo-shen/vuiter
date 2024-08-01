import { markRaw } from "@vue/reactivity";

export enum VUINodeTypes {
  TEXT = "text",
  ELEMENT = "element",
  COMMENT = "comment",
}

export interface VUIElement {
  id: number;
  type: VUINodeTypes.ELEMENT;
  parentNode: VUIElement | null;
  tag: string;
  children: VUINode[];
  props: Record<string, any>;
  eventListeners: Record<string, Function | Function[]> | null;
}

export interface VUIText {
  id: number;
  type: VUINodeTypes.TEXT;
  parentNode: VUIElement | null;
  text: string;
}

export interface VUIComment {
  id: number;
  type: VUINodeTypes.COMMENT;
  parentNode: VUIElement | null;
  text: string;
}

export type VUINode = VUIElement | VUIText | VUIComment;

let nodeId: number = 0;

const insert = (child: VUINode, parent: VUIElement, ref?: VUINode | null): void => {
  let refIndex;
  if (ref) {
    refIndex = parent.children.indexOf(ref);
    if (refIndex === -1) {
      console.error("ref: ", ref);
      console.error("parent: ", parent);
      throw new Error("ref is not a child of parent");
    }
  }
  remove(child);
  refIndex = ref ? parent.children.indexOf(ref) : -1;
  if (refIndex === -1) {
    parent.children.push(child);
    child.parentNode = parent;
  } else {
    parent.children.splice(refIndex, 0, child);
    child.parentNode = parent;
  }
};
const remove = (child: VUINode): void => {
  const parent = child.parentNode;
  if (parent) {
    const i = parent.children.indexOf(child);
    if (i > -1) {
      parent.children.splice(i, 1);
    } else {
      console.error("target: ", child);
      console.error("parent: ", parent);
      throw Error("target is not a childNode of parent");
    }
    child.parentNode = null;
  }
};
const createElement = (tag: string): VUIElement => {
  const node: VUIElement = {
    id: nodeId++,
    type: VUINodeTypes.ELEMENT,
    tag,
    children: [],
    props: {},
    parentNode: null,
    eventListeners: null,
  };
  markRaw(node);
  return node;
};
const createText = (text: string): VUINode => {
  const node: VUIText = {
    id: nodeId++,
    type: VUINodeTypes.TEXT,
    text,
    parentNode: null,
  };
  markRaw(node);
  return node;
};
const createComment = (text: string): VUINode => {
  const node: VUIComment = {
    id: nodeId++,
    type: VUINodeTypes.COMMENT,
    text,
    parentNode: null,
  };
  markRaw(node);
  return node;
};
const setText = (node: VUIText, text: string): void => {
  node.text = text;
};
const setElementText = (el: VUIElement, text: string): void => {
  el.children.forEach((c) => {
    c.parentNode = null;
  });

  if (!text) {
    el.children = [];
  } else {
    el.children = [
      {
        id: nodeId++,
        type: VUINodeTypes.TEXT,
        text,
        parentNode: el,
      },
    ];
  }
};
const parentNode = (node: VUINode): VUIElement | null => {
  return node.parentNode;
};
const nextSibling = (node: VUINode): VUINode | null => {
  const parent = node.parentNode;
  if (!parent) {
    return null;
  }
  const i = parent.children.indexOf(node);
  return parent.children[i + 1] || null;
};

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
  // querySelector,
  // setScopeId,
};
