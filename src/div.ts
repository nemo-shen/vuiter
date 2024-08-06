/** ************************************************************************************************
 * element:div
 * 对YogaNode的封装，用于和web的div表现尽量保持统一
 * unit: 1row 1col
 ************************************************************************************************ */
import Yoga, {
  Display,
  FlexDirection,
  Direction,
  Edge,
  Node as YogaNode,
  PositionType,
  Wrap,
  Justify,
  Align,
  Gutter,
} from "yoga-layout";
import { BORDER_STYLE } from "./constants";
import { isDef } from "./utils";

export type VUICSSStyleDeclaration = {
  width: number;
  height: number;
  margin: number;
  marginTop?: number | "auto";
  marginRight?: number | "auto";
  marginBottom?: number | "auto";
  marginLeft?: number | "auto";
  padding: number;
  display?: "flex" /* default */ | "none";
  flexDirection: "row" /* default */ | "column" | "row-reverse" | "column-reverse";
  alignItems: "stretch" /* default */ | "flex-start" | "flex-end" | "center" | "baseline";
  backgroundColor?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  position: "relative" /* default */ | "absolute" | "static";
  borderWidth: number;
  borderStyle?: keyof typeof BORDER_STYLE;
  borderColor?: string;
  flexWrap?: "nowrap" /* default */ | "wrap" | "wrap-reverse";
  justifyContent?:
    | "flex-start" /* default */
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flexBasis?: "auto" /* default*/ | number;
  flexGrow?: number;
  flexShrink?: number;
  gap?: number | string /* see: https://developer.mozilla.org/zh-CN/docs/Web/CSS/gap */;
};

export type Node = Div;

/**
 * <div style="width: 100px; height: 100px"></div>
 */
const DEFAULT_STYLE: VUICSSStyleDeclaration = {
  width: 1,
  height: 1,
  display: "flex",
  flexDirection: "row",
  flexBasis: "auto",
  flexWrap: "nowrap",
  alignItems: "stretch",
  justifyContent: "flex-start",
  position: "relative",
  margin: 0,
  padding: 0,
  borderWidth: 0,
};
class Div {
  public style: VUICSSStyleDeclaration = DEFAULT_STYLE;
  public node: YogaNode;
  public children: Node[] = [];

  get width(): number {
    return this.style.width;
  }

  get height(): number {
    return this.style.height;
  }

  constructor(props: { style?: Partial<VUICSSStyleDeclaration> } = {}) {
    if (props.style) this.style = { ...DEFAULT_STYLE, ...props.style };
    this.node = Yoga.Node.create();

    this.setWidth(this.width);
    this.setHeight(this.height);

    this.setBorder(this.style.borderWidth, this.style.borderStyle, this.style.borderColor);

    this.setMargin(this.style.margin);
    this.setMarginTop(this.style.marginTop);
    this.setMarginRight(this.style.marginRight);
    this.setMarginBottom(this.style.marginBottom);
    this.setMarginLeft(this.style.marginLeft);

    this.setPadding(this.style.padding);

    this.setPosition(this.style.position);
    this.setPositionTop(this.style.top);
    this.setPositionRight(this.style.right);
    this.setPositionBottom(this.style.bottom);
    this.setPositionLeft(this.style.left);

    this.setDisplay(this.style.display);
    this.setFlexDirection(this.style.flexDirection);
    this.setFlexWrap(this.style.flexWrap);
    this.setJustifyContent(this.style.justifyContent);
    this.setFlexBasis(this.style.flexBasis);
    this.setAlignItems(this.style.alignItems);
    this.setFlexGrow(this.style.flexGrow);
    this.setFlexShrink(this.style.flexShrink);
    this.setGap(this.style.gap);
  }

  public setWidth(value: number) {
    this.node.setWidth(value);
  }

  public setHeight(value: number) {
    this.node.setHeight(value);
  }

  public setBorder(
    width: number,
    style: VUICSSStyleDeclaration["borderStyle"],
    color?: string,
  ): void {
    if (width > 0) {
      this.node.setBorder(Edge.All, 1);
    }
  }

  public setMargin(...margin: [p1: number, p2?: number, p3?: number, p4?: number]): void {
    switch (margin.length) {
      case 1: // apply to all four sides
        this.node.setMargin(Edge.All, margin[0]);
        break;
      case 2: // top and bottom | left and right
        this.node.setMargin(Edge.Top, margin[0]);
        this.node.setMargin(Edge.Bottom, margin[0]);
        this.node.setMargin(Edge.Left, margin[1]);
        this.node.setMargin(Edge.Right, margin[1]);
        break;
      case 3: // top | left and right | bottom
        this.node.setMargin(Edge.Top, margin[0]);
        this.node.setMargin(Edge.Left, margin[1]);
        this.node.setMargin(Edge.Right, margin[1]);
        this.node.setMargin(Edge.Bottom, margin[2]);
        break;
      case 4: // top | right | bottom | left
        this.node.setMargin(Edge.Top, margin[0]);
        this.node.setMargin(Edge.Right, margin[1]);
        this.node.setMargin(Edge.Bottom, margin[2]);
        this.node.setMargin(Edge.Left, margin[3]);
        break;
    }
  }

  public setMarginTop(value: VUICSSStyleDeclaration["marginTop"]) {
    this.node.setMargin(Edge.Top, value ?? 0);
  }
  public setMarginRight(value: VUICSSStyleDeclaration["marginRight"]) {
    this.node.setMargin(Edge.Right, value ?? 0);
  }
  public setMarginBottom(value: VUICSSStyleDeclaration["marginBottom"]) {
    this.node.setMargin(Edge.Bottom, value ?? 0);
  }
  public setMarginLeft(value: VUICSSStyleDeclaration["marginLeft"]) {
    this.node.setMargin(Edge.Left, value ?? 0);
  }

  /**
   * Set Padding like web. see: https://developer.mozilla.org/en-US/docs/Web/CSS/padding
   * [number]
   */
  public setPadding(...padding: [p1: number, p2?: number, p3?: number, p4?: number]): void {
    switch (padding.length) {
      case 1: // apply to all four sides
        this.node.setPadding(Edge.All, padding[0]);
        break;
      case 2: // top and bottom | left and right
        this.node.setPadding(Edge.Top, padding[0]);
        this.node.setPadding(Edge.Bottom, padding[0]);
        this.node.setPadding(Edge.Left, padding[1]);
        this.node.setPadding(Edge.Right, padding[1]);
        break;
      case 3: // top | left and right | bottom
        this.node.setPadding(Edge.Top, padding[0]);
        this.node.setPadding(Edge.Left, padding[1]);
        this.node.setPadding(Edge.Right, padding[1]);
        this.node.setPadding(Edge.Bottom, padding[2]);
        break;
      case 4: // top | right | bottom | left
        this.node.setPadding(Edge.Top, padding[0]);
        this.node.setPadding(Edge.Right, padding[1]);
        this.node.setPadding(Edge.Bottom, padding[2]);
        this.node.setPadding(Edge.Left, padding[3]);
        break;
    }
  }

  append(...elements: Node[]) {
    // TODO: implement append string
    for (const element of elements) {
      this.appendChild(element);
    }
  }

  appendChild(el: Node) {
    this.children.push(el);
    this.node.insertChild(el.node, this.node.getChildCount());
  }

  public setPosition(position: VUICSSStyleDeclaration["position"]): void {
    switch (position) {
      case "relative":
        this.node.setPositionType(PositionType.Relative);
        break;
      case "absolute":
        this.node.setPositionType(PositionType.Absolute);
        break;
      case "static":
        this.node.setPositionType(PositionType.Static);
        break;
      default:
        this.node.setPositionType(PositionType.Relative);
        break;
    }
  }

  public setPositionTop(value: number | undefined) {
    if (!isDef(value)) return;
    if (this.style.position !== "absolute") return;
    this.node.setPosition(Edge.Top, value);
  }
  public setPositionRight(value: number | undefined) {
    if (!isDef(value)) return;
    if (this.style.position !== "absolute") return;
    this.node.setPosition(Edge.Right, value);
  }
  public setPositionBottom(value: number | undefined) {
    if (!isDef(value)) return;
    if (this.style.position !== "absolute") return;
    this.node.setPosition(Edge.Bottom, value);
  }
  public setPositionLeft(value: number | undefined) {
    if (!isDef(value)) return;
    if (this.style.position !== "absolute") return;
    this.node.setPosition(Edge.Bottom, value);
  }

  public setDisplay(display: VUICSSStyleDeclaration["display"]): void {
    switch (display) {
      case "flex":
        this.node.setDisplay(Display.Flex);
        break;
      case "none":
        this.node.setDisplay(Display.None);
        break;
      default:
        this.node.setDisplay(Display.Flex);
        break;
    }
  }

  public setFlexDirection(flexDirection: VUICSSStyleDeclaration["flexDirection"]): void {
    switch (flexDirection) {
      case "row":
        this.node.setFlexDirection(FlexDirection.Row);
        break;
      case "column":
        this.node.setFlexDirection(FlexDirection.Column);
        break;
      case "row-reverse":
        this.node.setFlexDirection(FlexDirection.RowReverse);
        break;
      case "column-reverse":
        this.node.setFlexDirection(FlexDirection.ColumnReverse);
        break;
    }
  }

  public setFlexWrap(flexWrap: VUICSSStyleDeclaration["flexWrap"]): void {
    switch (flexWrap) {
      case "nowrap":
        this.node.setFlexWrap(Wrap.NoWrap);
        break;
      case "wrap":
        this.node.setFlexWrap(Wrap.Wrap);
        break;
      case "wrap-reverse":
        this.node.setFlexWrap(Wrap.WrapReverse);
        break;
    }
  }

  public setJustifyContent(justifyContent: VUICSSStyleDeclaration["justifyContent"]): void {
    switch (justifyContent) {
      case "flex-start":
        this.node.setJustifyContent(Justify.FlexStart);
        break;
      case "flex-end":
        this.node.setJustifyContent(Justify.FlexEnd);
        break;
      case "center":
        this.node.setJustifyContent(Justify.Center);
        break;
      case "space-between":
        this.node.setJustifyContent(Justify.SpaceBetween);
        break;
      case "space-around":
        this.node.setJustifyContent(Justify.SpaceAround);
        break;
      case "space-evenly":
        this.node.setJustifyContent(Justify.SpaceEvenly);
        break;
    }
  }

  public setFlexBasis(flexBasis: VUICSSStyleDeclaration["flexBasis"]): void {
    this.node.setFlexBasis(flexBasis);
  }

  public setAlignItems(alignItems: VUICSSStyleDeclaration["alignItems"]): void {
    switch (alignItems) {
      case "stretch":
        this.node.setAlignItems(Align.Stretch);
        break;
      case "flex-start":
        this.node.setAlignItems(Align.FlexStart);
        break;
      case "flex-end":
        this.node.setAlignItems(Align.FlexEnd);
        break;
      case "center":
        this.node.setAlignItems(Align.Center);
        break;
      case "baseline":
        this.node.setAlignItems(Align.Baseline);
        break;
    }
  }

  public setFlexGrow(flexGrow?: VUICSSStyleDeclaration["flexGrow"]): void {
    this.node.setFlexGrow(flexGrow);
  }

  public setFlexShrink(flexShrink?: VUICSSStyleDeclaration["flexShrink"]): void {
    this.node.setFlexShrink(flexShrink);
  }

  public setGap(gap: VUICSSStyleDeclaration["gap"]): void {
    if (!isDef(gap)) return;
    const values = String(gap)?.split(" ").map(Number);
    switch (values.length) {
      case 1:
        this.node.setGap(Gutter.All, values[0]);
        break;
      case 2:
        this.node.setGap(Gutter.Row, values[0]);
        this.node.setGap(Gutter.Column, values[1]);
        break;
    }
  }
}

export default Div;
