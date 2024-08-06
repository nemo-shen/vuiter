/** ************************************************************************************************
 * element:div
 * 对YogaNode的封装，用于和web的div表现尽量保持统一
 ************************************************************************************************ */
import Yoga, {
  Display,
  FlexDirection,
  Direction,
  Edge,
  Node as YogaNode,
  PositionType,
} from "yoga-layout";
import chalk from "chalk";
import { BORDER_STYLE } from "./constants";
import { isDef } from "./utils";

export type VUICSSStyleDeclaration = {
  width: number;
  height: number;
  margin: number;
  padding: number;
  display?: "flex" | "none";
  flexDirection: "row" | "column";
  alignItems: "start" | "center" | "end";
  justifyContent: "center" | "start" | "end";
  backgroundColor?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  position: "relative" | "absolute" | "static";
  borderWidth: number;
  borderStyle?: keyof typeof BORDER_STYLE;
  borderColor?: string;
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
  alignItems: "start",
  justifyContent: "start",
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
    this.setPadding(this.style.padding);

    this.setPosition(this.style.position);
    this.setPositionTop(this.style.top);
    this.setPositionRight(this.style.right);
    this.setPositionBottom(this.style.bottom);
    this.setPositionLeft(this.style.left);

    this.setDisplay(this.style.display);
    this.setFlexDirection(this.style.flexDirection);
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
    this.node.setBorder(Edge.All, 1);
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
      default:
        this.node.setFlexDirection(FlexDirection.Row);
        break;
    }
  }
}

export default Div;
