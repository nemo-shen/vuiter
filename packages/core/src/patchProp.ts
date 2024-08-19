import { Align, Edge, FlexDirection, Justify, Wrap } from "yoga-layout";
import { Node } from "./node";
import { BORDER_STYLE } from "./constants";
import { convertKeysToCamelCase, extend, isValidColor } from "./utils";
const supportBorderStyles = Object.keys(BORDER_STYLE);

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
  color: "white",
} as const;

const genBorderConfig = (...configs: (BorderConfig | undefined)[]) => {
  const config = extend({}, DEFAULT_BORDER_CONFIG);
  for (const cfg of configs) {
    if (cfg === undefined) {
      continue;
    }
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

const parseBorderStyle = (border: string): BorderConfig | undefined => {
  const borderObj: BorderConfig = extend({}, DEFAULT_BORDER_CONFIG);
  if (!border || border === "") {
    return undefined;
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

const patchMargin = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  const {
    margin = "",
    marginLeft = "",
    marginTop = "",
    marginRight = "",
    marginBottom = "",
  } = style;
  const marginProps = margin.split(" ");
  let marginConfig = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  if (marginProps.length === 1) {
    const all = parseInt(marginProps[0]);
    if (!Number.isNaN(all)) {
      marginConfig.top = all;
      marginConfig.right = all;
      marginConfig.bottom = all;
      marginConfig.left = all;
    }
  } else if (marginProps.length === 2) {
    const topAndBottom = parseInt(marginProps[0]);
    const leftAndRight = parseInt(marginProps[1]);
    if (!Number.isNaN(topAndBottom)) {
      marginConfig.top = topAndBottom;
      marginConfig.bottom = topAndBottom;
    }
    if (!Number.isNaN(leftAndRight)) {
      marginConfig.left = leftAndRight;
      marginConfig.right = leftAndRight;
    }
  } else if (marginProps.length === 3) {
    const top = parseInt(marginProps[0]);
    const leftAndRight = parseInt(marginProps[1]);
    const bottom = parseInt(marginProps[2]);
    if (!Number.isNaN(top)) {
      marginConfig.top = top;
    }
    if (!Number.isNaN(leftAndRight)) {
      marginConfig.left = leftAndRight;
      marginConfig.right = leftAndRight;
    }
    if (!Number.isNaN(bottom)) {
      marginConfig.bottom = bottom;
    }
  } else if (marginProps.length === 4) {
    const top = parseInt(marginProps[0]);
    const right = parseInt(marginProps[1]);
    const bottom = parseInt(marginProps[2]);
    const left = parseInt(marginProps[3]);
    if (!Number.isNaN(top)) marginConfig.top = top;
    if (!Number.isNaN(right)) marginConfig.right = right;
    if (!Number.isNaN(bottom)) marginConfig.bottom = bottom;
    if (!Number.isNaN(left)) marginConfig.left = left;
  }

  if (!Number.isNaN(parseInt(marginTop))) marginConfig.top = parseInt(marginTop);
  if (!Number.isNaN(parseInt(marginRight))) marginConfig.right = parseInt(marginRight);
  if (!Number.isNaN(parseInt(marginBottom))) marginConfig.bottom = parseInt(marginBottom);
  if (!Number.isNaN(parseInt(marginLeft))) marginConfig.left = parseInt(marginLeft);

  if (marginConfig.top > 0) yogaNode.setMargin(Edge.Top, marginConfig.top);
  if (marginConfig.right > 0) yogaNode.setMargin(Edge.Right, marginConfig.right);
  if (marginConfig.bottom > 0) yogaNode.setMargin(Edge.Bottom, marginConfig.bottom);
  if (marginConfig.left > 0) yogaNode.setMargin(Edge.Left, marginConfig.left);
};

const patchFlexBox = (el: Node, style: CSSStyleDeclaration) => {
  const { yogaNode } = el;
  switch (style.flexDirection) {
    case "row":
      yogaNode.setFlexDirection(FlexDirection.Row);
      break;
    case "column":
      yogaNode.setFlexDirection(FlexDirection.Column);
      break;
    case "row-reverse":
      yogaNode.setFlexDirection(FlexDirection.RowReverse);
      break;
    case "column-reverse":
      yogaNode.setFlexDirection(FlexDirection.ColumnReverse);
      break;
    default:
      yogaNode.setFlexDirection(FlexDirection.Column);
      break;
  }
  switch (style.alignContent) {
    case "flex-start":
      yogaNode.setAlignContent(Align.FlexStart);
      break;
    case "flex-end":
      yogaNode.setAlignContent(Align.FlexEnd);
      break;
    case "stretch":
      yogaNode.setAlignContent(Align.Stretch);
      break;
    case "center":
      yogaNode.setAlignContent(Align.Center);
      break;
    case "space-between":
      yogaNode.setAlignContent(Align.SpaceBetween);
      break;
    case "space-around":
      yogaNode.setAlignContent(Align.SpaceAround);
      break;
    case "space-evenly":
      yogaNode.setAlignContent(Align.SpaceEvenly);
      break;
    default:
      yogaNode.setAlignContent(Align.FlexStart);
      break;
  }
  switch (style.alignItems) {
    case "stretch":
      yogaNode.setAlignItems(Align.Stretch);
      break;
    case "flex-start":
      yogaNode.setAlignItems(Align.FlexStart);
      break;
    case "flex-end":
      yogaNode.setAlignItems(Align.FlexEnd);
      break;
    case "center":
      yogaNode.setAlignItems(Align.Center);
      break;
    case "baseline":
      yogaNode.setAlignItems(Align.Baseline);
      break;
    default:
      yogaNode.setAlignItems(Align.Stretch);
      break;
  }
  switch (style.justifyContent) {
    case "flex-start":
      yogaNode.setJustifyContent(Justify.FlexStart);
      break;
    case "flex-end":
      yogaNode.setJustifyContent(Justify.FlexEnd);
      break;
    case "center":
      yogaNode.setJustifyContent(Justify.Center);
      break;
    case "space-between":
      yogaNode.setJustifyContent(Justify.SpaceBetween);
      break;
    case "space-around":
      yogaNode.setJustifyContent(Justify.SpaceAround);
      break;
    case "space-evenly":
      yogaNode.setJustifyContent(Justify.SpaceEvenly);
      break;
    default:
      yogaNode.setJustifyContent(Justify.FlexStart);
      break;
  }
  switch (style.flexWrap) {
    case "nowrap":
      yogaNode.setFlexWrap(Wrap.NoWrap);
      break;
    case "wrap":
      yogaNode.setFlexWrap(Wrap.Wrap);
      break;
    case "wrap-reverse":
      yogaNode.setFlexWrap(Wrap.WrapReverse);
      break;
    default:
      yogaNode.setFlexWrap(Wrap.NoWrap);
      break;
  }
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
  patchFlexBox(el, style);
  patchBorder(el, style);
  patchMargin(el, style);
  patchPadding(el, style);
};

export const patchProp = (
  el: Node,
  key: "style",
  prevValue: Record<string, any>,
  nextValue: Record<string, any>,
) => {
  if (key === "style") {
    const style = convertKeysToCamelCase(nextValue);
      patchStyle(el, style as CSSStyleDeclaration);
  }
};
