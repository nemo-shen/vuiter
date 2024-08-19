import { VuiElement, VuiText, VuiComment } from "./node";

const insert = (child: Node, parent: Node, ref: Node | null = null): void => {
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
  node.textContent = text;
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
