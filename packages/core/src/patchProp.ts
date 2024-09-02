import { Node } from "./nodeOps";

const patchStyle = (el: Node, style: any) => {
  const { yogaNode } = el;
  Object.keys(style).forEach((key) => {
    const value = style[key];
    if (key === "width") {
      const val = parseInt(value);
      yogaNode.setWidth(val);
    } else if (key === "height") {
      const val = parseInt(value);
      yogaNode.setHeight(val);
    }
  });
};

export const patchProp = (el: Node, key: "style", prevValue: any, nextValue: any) => {
  if (key === "style") {
    patchStyle(el, nextValue);
  }
  // nextValue = 'abc'
};
