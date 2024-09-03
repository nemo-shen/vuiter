import { Edge } from "yoga-layout";
import { Node } from "./nodeOps";
import { BORDER_STYLE } from "./constants";
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
type BorderConfig = {
  width: number;
  style: BorderStyleKey;
  color: string;
};

const DEFAULT_BORDER_CONFIG: BorderConfig = {
  width: 0,
  style: "solid",
  color: "#ffffff",
};

const genBorderConfig = (...configs: BorderConfig[]) => {
  const config = DEFAULT_BORDER_CONFIG;
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
};

const patchStyle = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  Object.keys(style).forEach((key) => {
    const value = style[key as keyof CSSStyleDeclaration];
    if (key === "width") {
      const val = parseInt(value);
      yogaNode.setWidth(val);
    } else if (key === "height") {
      const val = parseInt(value);
      yogaNode.setHeight(val);
    }
  });
  patchBorder(el, style);
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
  // nextValue = 'abc'
};
