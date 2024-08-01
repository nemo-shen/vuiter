/** ************************************************************************************************
 * 这是生成应用的入口
 * 可以将他理解为html
 ************************************************************************************************ */

import { Direction, Edge, FlexDirection } from "yoga-layout";
import Div, { Node, VUICSSStyleDeclaration } from "./div";
import { BORDER_STYLE } from "./constants";
import { isDef } from "./utils";
import chalk from "chalk";

class App {
  root: Div;
  canvas: string[][];

  constructor() {
    let { rows, columns } = process.stdout;
    columns = 50; // dev
    rows = 20; // dev
    this.canvas = new Array(rows).fill(null).map(() => new Array(columns).fill(""));
    this.root = new Div({
      style: {
        width: columns,
        height: rows,
        borderWidth: 1,
        // borderColor: "#646cff",
        borderStyle: "round",
        // backgroundColor: "#bcc0ff",
        padding: 1,
        flexWrap: "wrap",
        gap: 1,
      },
    });
  }

  // also can be called as reflow
  flow() {
    this.root.node.calculateLayout(undefined, undefined, Direction.LTR);
  }

  // also can be called as repaint
  paint() {
    this.drawNodeToCanvas(this.root);
  }

  render() {
    this.canvas.forEach((row) => {
      process.stdout.write(row.join("") + "\n");
    });
  }

  append(...element: Node[]) {
    this.root.append(...element);
  }

  drawNodeToCanvas(el: Node) {
    const canvas = this.canvas;
    const { node, style } = el;
    const left = node.getComputedLeft();
    const top = node.getComputedTop();
    const width = node.getComputedWidth();
    const height = node.getComputedHeight();

    // 绘制节点的 margin 区域
    const marginLeft = node.getComputedMargin(Edge.Left);
    const marginTop = node.getComputedMargin(Edge.Top);
    const marginRight = node.getComputedMargin(Edge.Right);
    const marginBottom = node.getComputedMargin(Edge.Bottom);

    // 绘制节点的 padding 区域
    const paddingLeft = node.getComputedPadding(Edge.Left);
    const paddingTop = node.getComputedPadding(Edge.Top);
    const paddingRight = node.getComputedPadding(Edge.Right);
    const paddingBottom = node.getComputedPadding(Edge.Bottom);

    // 绘制节点的边框区域
    const borderLeft = node.getComputedBorder(Edge.Left);
    const borderTop = node.getComputedBorder(Edge.Top);
    const borderRight = node.getComputedBorder(Edge.Right);
    const borderBottom = node.getComputedBorder(Edge.Bottom);

    const gapText = " ";

    // 绘制 margin
    for (let y = top - marginTop; y < top + height + marginBottom; y++) {
      for (let x = left - marginLeft; x < left + width + marginRight; x++) {
        if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
          canvas[y][x] = gapText;
        }
      }
    }

    const borderStyle = BORDER_STYLE[el.style?.borderStyle ?? "soild"];

    for (let y = top; y < top + height; y++) {
      for (let x = left; x < left + width; x++) {
        let text = "";
        if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
          if (y === top && x === left) {
            text = borderStyle.topLeft;
          } else if (y === top && x === left + width - 1) {
            text = borderStyle.topRight;
          } else if (y === top + height - 1 && x === left) {
            text = borderStyle.bottomLeft;
          } else if (y === top + height - 1 && x === left + width - 1) {
            text = borderStyle.bottomRight;
          } else if (
            (y > top && y < top + height - 1 && x === left) ||
            (y > top && y < top + height - 1 && x === left + width - 1)
          ) {
            text = borderStyle.vertical;
          } else {
            text = borderStyle.horizontal;
          }
        }
        // canvas[y][x] = text;
        canvas[y][x] = el.style.borderColor ? chalk.hex(el.style.borderColor)(text) : text;
      }
    }

    for (let y = top + borderTop; y < top + height - borderBottom; y++) {
      for (let x = left + borderLeft; x < left + width - borderRight; x++) {
        if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
          canvas[y][x] = gapText;
          if (isDef(style.backgroundColor)) {
            canvas[y][x] = chalk.bgHex(style.backgroundColor)(gapText);
          }
        }
      }
    }

    for (
      let y = top + borderTop + paddingTop;
      y < top + height - borderBottom - paddingBottom;
      y++
    ) {
      for (
        let x = left + borderLeft + paddingLeft;
        x < left + width - borderRight - paddingRight;
        x++
      ) {
        if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
          canvas[y][x] = gapText;
          if (isDef(style.backgroundColor)) {
            canvas[y][x] = chalk.bgHex(style.backgroundColor)(gapText);
          }
        }
      }
    }

    for (const child of el.children) {
      this.drawNodeToCanvas(child);
    }
  }
}

export default App;
