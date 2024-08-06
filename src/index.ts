import Yoga, {
  Align,
  Direction,
  DirtiedFunction,
  Display,
  Edge,
  FlexDirection,
  Gutter,
  Justify,
  MeasureFunction,
  Overflow,
  PositionType,
  Unit,
  Wrap,
  Node as YogaNode,
} from "yoga-layout";
import { isDef } from "./utils";
import process, { stdout } from "node:process";
import { BORDER_STYLE } from "./constants";
import chalk, { backgroundColors } from "chalk";
import Div, { VUICSSStyleDeclaration, VUIDivElement } from "./div";

const { rows, columns } = process.stdout;

// 布局的root节点是自动创建的
const app = new Div({
  style: {
    width: columns,
    height: 30,
    borderWidth: 1,
  },
});
const createBox = () => {
  const box = new Div({
    style: {
      width: 10,
      height: 5,
      borderWidth: 1,
      borderStyle: "round",
    },
  });
  return box;
};

app.setChildren(...Array.from({ length: 3 }, () => createBox()));
app.node.calculateLayout(undefined, undefined, Direction.LTR);

// 创建二维数组 canvas
const canvas = new Array(app.height).fill(null).map(() => new Array(app.width).fill(""));

// 绘制函数
function drawNodeToCanvas(el: VUIDivElement, canvas: any[][], style = {} as VUICSSStyleDeclaration) {
  const { node } = el;
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
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        if (y === top && x === left) {
          canvas[y][x] = borderStyle.topLeft;
        } else if (y === top && x === left + width - 1) {
          canvas[y][x] = borderStyle.topRight;
        } else if (y === top + height - 1 && x === left) {
          canvas[y][x] = borderStyle.bottomLeft;
        } else if (y === top + height - 1 && x === left + width - 1) {
          canvas[y][x] = borderStyle.bottomRight;
        } else if (
          (y > top && y < top + height - 1 && x === left) ||
          (y > top && y < top + height - 1 && x === left + width - 1)
        ) {
          canvas[y][x] = borderStyle.vertical;
        } else {
          canvas[y][x] = borderStyle.horizontal;
        }
      }
    }
  }

  for (let y = top + borderTop; y < top + height - borderBottom; y++) {
    for (let x = left + borderLeft; x < left + width - borderRight; x++) {
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        canvas[y][x] = gapText;
      }
    }
  }

  for (let y = top + borderTop + paddingTop; y < top + height - borderBottom - paddingBottom; y++) {
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
    drawNodeToCanvas(child, canvas);
  }
}

// 将布局绘制到 canvas 上
drawNodeToCanvas(app, canvas);

// 输出 canvas
canvas.forEach((row) => {
  process.stdout.write(row.join("") + "\n");
});
