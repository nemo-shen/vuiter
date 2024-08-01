import process from "node:process";
import Yoga, { FlexDirection, Direction, Edge, Node as YogaNode } from "yoga-layout";
import chalk from "chalk";
import { EDGE_ALL } from "yoga-layout-prebuilt";

const HORIZONTAL_LINE = "━";
const VERTICAL_LINE = "┃";
const BORDER_TOP_LEFT = "┏";
const BORDER_TOP_RIGHT = "┓";
const BORDER_BOTTOM_LEFT = "┗";
const BORDER_BOTTOM_RIGHT = "┛";

type PickCSSStyleDeclaration = Pick<
  CSSStyleDeclaration,
  | "margin"
  | "marginTop"
  | "marginBottom"
  | "marginLeft"
  | "marginRight"
  | "padding"
  | "paddingTop"
  | "paddingBottom"
  | "paddingLeft"
  | "paddingRight"
  | "border"
  | "borderTop"
  | "borderBottom"
  | "borderLeft"
  | "borderRight"
>;
interface VUICSSStyleDeclaration extends PickCSSStyleDeclaration {
  width: string | number;
  height: string | number;
  display: "flex";
  flexDirection: "row" | "column";
  alignItems: "start" | "center" | "end";
  justifyContent: "center" | "start" | "end";
  backgroundColor?: string;
}

export interface VUIDivElement {
  style?: VUICSSStyleDeclaration;
  render(): void;
}

type Node = VUIDivElement;

const isString = (value: unknown) =>
  typeof value === "string" && Object.prototype.toString.call(value) === "[object String]";
const isNumber = (value: unknown) =>
  !isNaN(value) && Object.prototype.toString.call(value) === "[object Number]";

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
};
class Div implements VUIDivElement {
  public style?: VUICSSStyleDeclaration = DEFAULT_STYLE;
  public node?: YogaNode;
  public children: Node[] = [];

  get width(): number {
    if (isNumber(this.style?.width)) {
      return this.style?.width;
    }
    if (isString(this.style?.width)) {
      return Number((this.style?.width as string).replace("px", ""));
    }
    return NaN;
  }

  get height(): number {
    if (isNumber(this.style?.height)) {
      return this.style?.height;
    }
    if (isString(this.style?.height)) {
      return Number((this.style?.height as string).replace("px", ""));
    }
    return NaN;
  }

  // <div></div>
  constructor(props: { style?: Partial<VUICSSStyleDeclaration> } = {}) {
    if (props.style) this.style = { ...DEFAULT_STYLE, ...props.style };
    this.node = Yoga.Node.create();
    this.node.setWidth(this.width);
    this.node.setHeight(this.height);
    if (this.style.border) {
      this.node.setBorder(Edge.All, 1);
    }
    if (this.style.padding) {
      this.node.setPadding(Edge.All, 1);
    }
    if (this.style.margin) {
      this.node.setMargin(Edge.All, 1);
    }

    this.node.setFlexDirection(FlexDirection.Row);

    // const child1 = Yoga.Node.create();
    // child1.setWidth(10);
    // child1.setHeight(10);
    // child1.setPadding(Edge.All, 1);
    // child1.setMargin(Edge.All, 1);
    // child1.setBorder(Edge.All, 1);
    // root.insertChild(child1, 0);

    // const child2 = Yoga.Node.create();
    // child2.setWidth(20);
    // child2.setHeight(10);
    // child2.setPadding(Edge.All, 1);
    // child2.setMargin(Edge.All, 1);
    // child2.setBorder(Edge.All, 1);
    // root.insertChild(child2, 1);
  }

  public setChildren(...elements: Node[]) {
    this.children = elements;
    for (let i = 0; i < elements.length; i++) {
      this.node.insertChild(elements[i].node, i);
    }
  }
}

export default Div;
