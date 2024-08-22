export type VuiNode = VuiElement | VuiText | VuiComment;

const Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8,
}
export class VuiElement {
  nodeType = Node.ELEMENT_NODE;
  parentNode: VuiElement | null;
  tagName: string;
  children: VuiNode[];
  props: Record<string, any>;

  constructor(tagName = "div") {
    this.parentNode = null;
    this.tagName = tagName;
    this.children = [];
    this.props = {};
  }
}
export class VuiText /* extends Text */ {
  data: string;
  type = Node.TEXT_NODE;
  parentNode: VuiElement | null;

  constructor(data: string) {
    this.data = data;
    this.parentNode = null;
  }
}

class VuiComment {
  type = Node.COMMENT_NODE;
  parentNode: VuiElement | null;
  data: string;

  constructor(data: string) {
    this.data = data;
    this.parentNode = null;
  }
}

let nodeId: number = 0;

const insert = (child: VuiNode, parent: VuiElement, ref?: VuiNode | null): void => {
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
const remove = (child: VuiNode): void => {
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
const createElement = (tag: string): VuiElement => {
  return new VuiElement(tag);
};
const createText = (data: string): VuiNode => {
  return new VuiText(data);
};
const createComment = (data: string): VuiComment => {
  return new VuiComment(data);
};
const setText = (node: VuiText, text: string): void => {
  node.data = text;
};
const setElementText = (el: VuiElement, text: string): void => {
  el.children.forEach((c) => {
    c.parentNode = null;
  });

  if (!text) {
    el.children = [];
  } else {
    el.children = [new VuiComment(text)];
  }
};
const parentNode = (node: VuiNode): VuiElement | null => {
  return node.parentNode;
};
const nextSibling = (node: VuiNode): VuiNode | null => {
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
