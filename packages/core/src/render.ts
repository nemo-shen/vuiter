import chalk from "chalk";
import { Node, VuiText, VuiElement } from "./nodeOps";
import { Edge } from "yoga-layout";
import { BORDER_STYLE } from "./constants";
import {
  BgColorNames,
  extractRGBValues,
  isHexColor,
  isNamedColor,
  isRgbColor,
  SupportNamedColor,
} from "./utils";

const columns = 100; // dev
const rows = 40; // dev
const canvas = new Array(rows).fill(null).map(() => new Array(columns).fill(""));

function setColor(text: string, color: string) {
  if (!color) {
    return text;
  }
  if (isHexColor(color)) {
    return chalk.hex(color)(text);
  }

  if (isRgbColor(color)) {
    return chalk.hex(color)(text);
  }

  if (isNamedColor(color)) {
    return chalk[color as SupportNamedColor](text);
  }

  return text;
}

type Layout = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

const printCanvas = (canvas: string[][]) => {
  for (const columns of canvas) {
    console.log(columns.join(""));
  }
};

function drawNodeToCanvas(el: Node, parentLayout: Layout) {
  const { yogaNode: node } = el;
  if (!node) return;
  const style = {
    borderStyle: "solid",
  } as Record<string, any>;
  const left = node.getComputedLeft() + parentLayout.left;
  const top = node.getComputedTop() + parentLayout.top;
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

  // TODO
  let gapText = " ";

  // 绘制 margin
  for (let y = top - marginTop; y < top + height + marginBottom; y++) {
    for (let x = left - marginLeft; x < left + width + marginRight; x++) {
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        canvas[y][x] = " ";
      }
    }
  }

  let contentText = " ";
  if (el.style.backgroundColor) {
    const { backgroundColor } = el.style;
    if (isHexColor(backgroundColor)) {
      contentText = chalk.bgHex(backgroundColor)(contentText);
    } else if (isRgbColor(backgroundColor)) {
      const { red, green, blue } = extractRGBValues(backgroundColor);
      contentText = chalk.bgRgb(red, green, blue)(contentText);
    } else if (isNamedColor(el.style.backgroundColor)) {
      const [firstLetter, ...restLetter] = backgroundColor;
      const bgColorName = `bg${firstLetter.toUpperCase()}${restLetter.join("")}` as BgColorNames;
      contentText = chalk[bgColorName](contentText);
    }
  }

  // 绘制 border
  const right = left + width - 1;
  const bottom = top + height - 1;
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      let text = "";
      if (y >= 0 && y < canvas.length && x >= 0 && x < canvas[y].length) {
        const isLeftBorder = borderLeft && x === left;
        const isRightBorder = borderRight && x === right;
        const isTopBorder = borderTop && y === top;
        const isBottomBorder = borderBottom && y === bottom;
        const isBorder = isLeftBorder || isRightBorder || isTopBorder || isBottomBorder;
        const isTopLeftBorderCorner = isLeftBorder && isTopBorder;
        const isTopRightBorderCorner = isRightBorder && isTopBorder;
        const isBottomLeftBorderCorner = isBottomBorder && isLeftBorder;
        const isBottomRightBorderCorner = isBottomBorder && isRightBorder;
        const isCorner =
          isTopLeftBorderCorner ||
          isTopRightBorderCorner ||
          isBottomLeftBorderCorner ||
          isBottomRightBorderCorner;
        const isLeftBorderNotCorner = isLeftBorder && !isCorner;
        const isRightBorderNotCorner = isRightBorder && !isCorner;
        const isTopBorderNotCorner = isTopBorder && !isCorner;
        const isBottomBorderNotCorner = isBottomBorder && !isCorner;

        if (isLeftBorderNotCorner) {
          text = BORDER_STYLE[el.borderConfig.left.style].vertical;
          text = setColor(text, el.borderConfig.left.color);
        }

        if (isRightBorderNotCorner) {
          text = BORDER_STYLE[el.borderConfig.right.style].vertical;
          text = setColor(text, el.borderConfig.right.color);
        }

        if (isTopBorderNotCorner) {
          text = BORDER_STYLE[el.borderConfig.top.style].horizontal;
          text = setColor(text, el.borderConfig.top.color);
        }

        if (isBottomBorderNotCorner) {
          text = BORDER_STYLE[el.borderConfig.bottom.style].horizontal;
          text = setColor(text, el.borderConfig.bottom.color);
        }

        if (isTopLeftBorderCorner) {
          text = BORDER_STYLE[el.borderConfig.left.style].topLeft;
          text = setColor(text, el.borderConfig.left.color);
        }

        if (isTopRightBorderCorner) {
          text = BORDER_STYLE[el.borderConfig.right.style].topRight;
          text = setColor(text, el.borderConfig.right.color);
        }

        if (isBottomLeftBorderCorner) {
          text = BORDER_STYLE[el.borderConfig.left.style].bottomLeft;
          text = setColor(text, el.borderConfig.left.color);
        }

        if (isBottomRightBorderCorner) {
          text = BORDER_STYLE[el.borderConfig.right.style].bottomRight;
          text = setColor(text, el.borderConfig.right.color);
        }

        if (!isBorder) {
          text = contentText;
        }
      }
      canvas[y][x] = text;
    }
  }

  // 如果碰到有内容就需要换行，除非是inline样式
  let textShader = (char: string) => char;
  if (el.style.color) {
    const { color } = el.style;
    if (isHexColor(color)) {
      textShader = chalk.bgHex(color);
    } else if (isRgbColor(color)) {
      const { red, green, blue } = extractRGBValues(color);
      textShader = chalk.bgRgb(red, green, blue);
    } else if (isNamedColor(color)) {
      textShader = chalk[color];
    }
  }

  if (el.type === Node.TEXT_NODE && el.textContent) {
    const textList = el.textContent.split("");
    let row = paddingTop + top;
    while (textList.length > 0) {
      let col = paddingLeft + left + 1;
      while (col < right - paddingRight && textList.length > 0) {
        const char = textList.shift();
        canvas[row][col] = textShader(char as string);
        col++;
      }
      row++;
    }
  }

  const layout = node.getComputedLayout();
  layout.left += parentLayout.left;
  layout.right += parentLayout.right;
  layout.top += parentLayout.top;
  layout.bottom += parentLayout.bottom;
  for (const child of el.childNodes) {
    drawNodeToCanvas(child, layout);
  }
}

const render = (el: Node) => {
  drawNodeToCanvas(el, el.yogaNode.getComputedLayout());
  canvas.forEach((row) => {
    process.stdout.write(row.join("") + "\n");
  });
};

export { render };
