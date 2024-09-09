import { Edge } from "yoga-layout";
import { Node } from "./nodeOps";
import { BORDER_STYLE } from "./constants";
import { extend } from "./utils";
const supportBorderStyles = Object.keys(BORDER_STYLE);
const isValidColor = (color: string) => {
  if (!color) return false;
  // Regular expressions for different color formats
  const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  const rgbRegex = /^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/;
  const namedColors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray", // alias blackBright
    "grey", // alias blackBright
  ];

  return hexRegex.test(color) || rgbRegex.test(color) || namedColors.includes(color.toLowerCase());
};
const isStyle = (value: string) => supportBorderStyles.includes(value);
const isColor = (value: string) => isValidColor(value);

type BorderStyleKey = keyof typeof BORDER_STYLE;
export type BorderConfig = {
  width: number;
  style: BorderStyleKey;
  color: string;
};

export const DEFAULT_BORDER_CONFIG: BorderConfig = {
  width: 0,
  style: "solid",
  color: "#ffffff",
};

const genBorderConfig = (...configs: BorderConfig[]) => {
  const config = extend({}, DEFAULT_BORDER_CONFIG);
  for (const cfg of configs) {
    if (cfg.width && cfg.width !== 0) {
      config.width = 1;
    }
    if (isStyle(cfg.style)) {
      config.style = cfg.style;
    }
    if (isColor(cfg.color)) {
      config.color = cfg.color;
    }
  }
  return config;
};

const parseBorderStyle = (border: string): BorderConfig => {
  const borderObj: BorderConfig = DEFAULT_BORDER_CONFIG;
  if (!border || border === "") {
    return borderObj;
  }
  borderObj.width = 1;
  const borderSplitList = border.split(" ");
  if (borderSplitList.length === 1) {
    if (isStyle(borderSplitList[0])) {
      borderObj.style = borderSplitList[0] as BorderStyleKey;
    }
    // if index 0 is width, need not to set, cause terminal ui just only support 1 width
  } else if (borderSplitList.length === 2) {
    // <width> <style>
    if (isStyle(borderSplitList[1])) {
      borderObj.style = borderSplitList[1] as BorderStyleKey;
    }

    // <style> <color>
    if (isStyle(borderSplitList[0]) && isColor(borderSplitList[1])) {
      borderObj.style = borderSplitList[0] as BorderStyleKey;
      borderObj.color = borderSplitList[1];
    }
  } else if (borderSplitList.length >= 3) {
    // <width> <style> <color>
    if (isStyle(borderSplitList[1]) && isColor(borderSplitList[2])) {
      borderObj.style = borderSplitList[1] as BorderStyleKey;
      borderObj.color = borderSplitList[2];
    }
  }
  return borderObj;
};

const patchBorder = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  // 1rem solid
  // solid
  // 1rem
  const { borderLeftWidth = "0", borderLeftStyle = "solid", borderLeftColor = "#ffffff" } = style;
  const borderConfig = {
    left: genBorderConfig(parseBorderStyle(style.border), parseBorderStyle(style.borderLeft), {
      width: parseInt(style.borderLeftWidth),
      style: style.borderLeftStyle as BorderStyleKey,
      color: style.borderLeftColor,
    }),
    top: genBorderConfig(parseBorderStyle(style.border), parseBorderStyle(style.borderTop), {
      width: parseInt(style.borderTopWidth),
      style: style.borderTopStyle as BorderStyleKey,
      color: style.borderTopColor,
    }),
    right: genBorderConfig(parseBorderStyle(style.border), parseBorderStyle(style.borderTop), {
      width: parseInt(style.borderRightWidth),
      style: style.borderRightStyle as BorderStyleKey,
      color: style.borderRightColor,
    }),
    bottom: genBorderConfig(parseBorderStyle(style.border), parseBorderStyle(style.borderTop), {
      width: parseInt(style.borderBottomWidth),
      style: style.borderBottomStyle as BorderStyleKey,
      color: style.borderBottomColor,
    }),
  };
  // if ("border" in style) {
  //   const border = style["border"];
  //   console.log(borderWidth, borderStyle, borderColor);
  // }
  for (const edge in borderConfig) {
    const config = borderConfig[edge as keyof typeof borderConfig];
    switch (edge) {
      case "left":
        config.width !== 0 && yogaNode.setBorder(Edge.Left, config.width);
        break;
      case "top":
        config.width !== 0 && yogaNode.setBorder(Edge.Top, config.width);
        break;
      case "right":
        config.width !== 0 && yogaNode.setBorder(Edge.Right, config.width);
        break;
      case "bottom":
        config.width !== 0 && yogaNode.setBorder(Edge.Bottom, config.width);
        break;
    }
  }

  el.borderConfig = extend({}, borderConfig);
};

const patchPadding = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  const {
    padding = "",
    paddingLeft = "",
    paddingTop = "",
    paddingRight = "",
    paddingBottom = "",
  } = style;
  const paddingProps = padding.split(" ");
  let paddingConfig = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  if (paddingProps.length === 1) {
    const all = parseInt(paddingProps[0]);
    if (!Number.isNaN(all)) {
      paddingConfig.top = all;
      paddingConfig.right = all;
      paddingConfig.bottom = all;
      paddingConfig.left = all;
    }
  } else if (paddingProps.length === 2) {
    const topAndBottom = parseInt(paddingProps[0]);
    const leftAndRight = parseInt(paddingProps[1]);
    if (!Number.isNaN(topAndBottom)) {
      paddingConfig.top = topAndBottom;
      paddingConfig.bottom = topAndBottom;
    }
    if (!Number.isNaN(leftAndRight)) {
      paddingConfig.left = leftAndRight;
      paddingConfig.right = leftAndRight;
    }
  } else if (paddingProps.length === 3) {
    const top = parseInt(paddingProps[0]);
    const leftAndRight = parseInt(paddingProps[1]);
    const bottom = parseInt(paddingProps[2]);
    if (!Number.isNaN(top)) {
      paddingConfig.top = top;
    }
    if (!Number.isNaN(leftAndRight)) {
      paddingConfig.left = leftAndRight;
      paddingConfig.right = leftAndRight;
    }
    if (!Number.isNaN(bottom)) {
      paddingConfig.bottom = bottom;
    }
  } else if (paddingProps.length === 4) {
    const top = parseInt(paddingProps[0]);
    const right = parseInt(paddingProps[1]);
    const bottom = parseInt(paddingProps[2]);
    const left = parseInt(paddingProps[3]);
    if (!Number.isNaN(top)) paddingConfig.top = top;
    if (!Number.isNaN(right)) paddingConfig.right = right;
    if (!Number.isNaN(bottom)) paddingConfig.bottom = bottom;
    if (!Number.isNaN(left)) paddingConfig.left = left;
  }

  if (!Number.isNaN(parseInt(paddingTop))) paddingConfig.top = parseInt(paddingTop);
  if (!Number.isNaN(parseInt(paddingRight))) paddingConfig.right = parseInt(paddingRight);
  if (!Number.isNaN(parseInt(paddingBottom))) paddingConfig.bottom = parseInt(paddingBottom);
  if (!Number.isNaN(parseInt(paddingLeft))) paddingConfig.left = parseInt(paddingLeft);

  if (paddingConfig.top > 0) yogaNode.setPadding(Edge.Top, paddingConfig.top);
  if (paddingConfig.right > 0) yogaNode.setPadding(Edge.Right, paddingConfig.right);
  if (paddingConfig.bottom > 0) yogaNode.setPadding(Edge.Bottom, paddingConfig.bottom);
  if (paddingConfig.left > 0) yogaNode.setPadding(Edge.Left, paddingConfig.left);
};

const patchStyle = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  Object.keys(style).forEach((key) => {
    const value = style[key as keyof CSSStyleDeclaration];
    if (key === "width") {
      const val = parseInt(value as string);
      yogaNode.setWidth(val);
    } else if (key === "height") {
      const val = parseInt(value as string);
      yogaNode.setHeight(val);
    }
  });
  el.style = extend(el.style, style);
  patchBorder(el, style);
  patchPadding(el, style);
};

export const patchProp = (
  el: Node,
  key: "style",
  prevValue: Record<string, any>,
  nextValue: Record<string, any>,
) => {
  if (key === "style") {
    patchStyle(el, nextValue as CSSStyleDeclaration);
  }
};
