import chalk, { ColorName } from "chalk";
import { Node, VuiCSSStyleDeclaration } from "./node";
import { Direction, Edge, Node as YogaNode } from "yoga-layout";
import { BORDER_STYLE, SupportBorderStyleTypes } from "./constants";
import {
  BgColorNames,
  extractRGBValues,
  isHexColor,
  isNamedColor,
  isRgbColor,
  SupportNamedColor,
} from "./utils";
import { capitalize } from "@vue/runtime-core";
import { BorderConfig } from "./patchProp";

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

const _printCanvas = (canvas: string[][]) => {
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

  let textShader = (char: string) => char;
  el.style.color = el.style.color || el.parentNode?.style.color || "";
  const { color } = el.style;
  if (isHexColor(color)) {
    textShader = chalk.hex(color);
  } else if (isRgbColor(color)) {
    const { red, green, blue } = extractRGBValues(color);
    textShader = chalk.rgb(red, green, blue);
  } else if (isNamedColor(color)) {
    textShader = chalk[color as SupportNamedColor];
  }

  /**
   * https://codesandbox.io/p/sandbox/rnmhcw?file=%2Findex.html%3A1%2C1-24%2C1
<!DOCTYPE html>
<html lang="en">
  <body>
    <!-- 如果固定了宽度，那么就是给定的宽度 -->
    <!-- 如果宽度不够子元素展示，则自动增长宽度直到能够装下子元素 -->
    <div
      style="
        display: flex;
        flex-direction: row;
        width: 1px;
        height: 30px;
        background-color: red;
      "
    >
      <!-- 它如果没有设置宽度是跟随子元素的宽度增长 -->
      <div style="background-color: blue; display: flex; flex-direction: row">
        <!-- 如果button设置了宽度，那就根据他指定的宽度展示 -->
        <!-- 但是内部的textContent 'click' 还是照样展示，因为没有设置wrap -->
        <button style="width: 1px">click</button>
      </div>
    </div>
  </body>
</html>
  */

  // 实际上没一个元素都应该是0,0开始绘制，然后再进行偏移
  /**
   * button
   * ^    ^
   * 0    n
   * |but|ton
   * ^    ^
   * 0    n
   *
   * 如果他的el自身有宽度那么
   */

  if (el.type === Node.TEXT_NODE && el.textContent) {
    const textList = el.textContent.split("");
    let row = paddingTop + top;
    while (textList.length > 0) {
      let col = paddingLeft + left + 1;
      // console.log(textList, col < right - paddingRight && textList.length > 0);
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

type Matrix = string[][];
const create2DArray = (rows: number, cols: number, text = " "): Matrix => {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(text));
};
const print2DArray = (arr: Matrix): void => {
  arr.forEach((row) => console.log(row.join("")));
};

const processBackgroundColor = (color: string | undefined, content: string): string => {
  if (!color) return content;
  if (isHexColor(color)) {
    return chalk.bgHex(color)(content);
  }
  if (isRgbColor(color)) {
    const { red, green, blue } = extractRGBValues(color);
    return chalk.bgRgb(red, green, blue)(content);
  }
  if (isNamedColor(color)) {
    const bgColorName = `bg${capitalize(color)}`;
    return chalk[bgColorName as BgColorNames](content);
  }
  return content;
};

const processFontColor = (color: string | undefined, content: string): string => {
  if (!color) return content;
  if (isHexColor(color)) {
    return chalk.hex(color)(content);
  }
  if (isRgbColor(color)) {
    const { red, green, blue } = extractRGBValues(color);
    return chalk.rgb(red, green, blue)(content);
  }
  if (isNamedColor(color)) {
    return chalk[color as ColorName](content);
  }
  return content;
};

const drawBorder = (canvas: Matrix, computedStyle: ComputedStyle): Matrix => {
  const rows = canvas.length - 1;
  const cols = canvas[0].length - 1;
  canvas = canvas.map((row, x) => {
    return row.map((content, y) => {
      const isLeftBorder = y === 0 && computedStyle.borderLeftWidth > 0;
      const isRightBorder = y === cols && computedStyle.borderRightWidth > 0;
      const isTopBorder = x === 0 && computedStyle.borderTopWidth > 0;
      const isBottomBorder = x === rows && computedStyle.borderBottomWidth > 0;
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

      if (isTopLeftBorderCorner) {
        content = processFontColor(computedStyle.borderLeftColor, BORDER_STYLE[computedStyle.borderLeftStyle].topLeft);
      } else if (isTopRightBorderCorner) {
        content = processFontColor(computedStyle.borderRightColor, BORDER_STYLE[computedStyle.borderRightStyle].topRight);
      } else if (isBottomLeftBorderCorner) {
        content = processFontColor(computedStyle.borderLeftColor, BORDER_STYLE[computedStyle.borderLeftStyle].bottomLeft);
      } else if (isBottomRightBorderCorner) {
        content = processFontColor(computedStyle.borderRightColor, BORDER_STYLE[computedStyle.borderRightStyle].bottomRight);
      } else if (isTopBorderNotCorner) {
        content = processFontColor(computedStyle.borderTopColor, BORDER_STYLE[computedStyle.borderTopStyle].horizontal);
      } else if (isBottomBorderNotCorner) {
        content = processFontColor(computedStyle.borderBottomColor, BORDER_STYLE[computedStyle.borderBottomStyle].horizontal);
      } else if (isLeftBorderNotCorner) {
        content = processFontColor(computedStyle.borderLeftColor, BORDER_STYLE[computedStyle.borderBottomStyle].vertical);
      } else if (isRightBorderNotCorner) {
        content = processFontColor(computedStyle.borderRightColor, BORDER_STYLE[computedStyle.borderRightStyle].vertical);
      }
      return content;
    });
  });
  return canvas;
};

type Object<K extends number | string | symbol = string, V = unknown> = Record<K, V>;
const pick = <T extends Object, K extends keyof T>(source: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (key in source) {
        result[key] = source[key];
      }
      return result;
    },
    {} as Pick<T, K>,
  );
};

type ComputedStyle = {
  backgroundColor: string;
  borderLeftWidth: number;
  borderRightWidth: number;
  borderTopWidth: number;
  borderBottomWidth: number;
  borderLeftColor: string;
  borderRightColor: string;
  borderTopColor: string;
  borderBottomColor: string;
  borderLeftStyle: SupportBorderStyleTypes;
  borderRightStyle: SupportBorderStyleTypes;
  borderTopStyle: SupportBorderStyleTypes;
  borderBottomStyle: SupportBorderStyleTypes;
};
const getComputedStyle = <T extends VuiCSSStyleDeclaration>(
  style: T,
  borderConfig: Node["borderConfig"],
): ComputedStyle => {
  const pickFromStyle = pick(style, ["backgroundColor"]);
  return {
    backgroundColor: pickFromStyle.backgroundColor,
    borderLeftWidth: borderConfig.left.width,
    borderRightWidth: borderConfig.right.width,
    borderTopWidth: borderConfig.top.width,
    borderBottomWidth: borderConfig.bottom.width,
    borderLeftColor: borderConfig.left.color,
    borderRightColor: borderConfig.right.color,
    borderTopColor: borderConfig.top.color,
    borderBottomColor: borderConfig.bottom.color,
    borderLeftStyle: borderConfig.left.style,
    borderRightStyle: borderConfig.right.style,
    borderTopStyle: borderConfig.top.style,
    borderBottomStyle: borderConfig.bottom.style,
  };
};

type Replace2DArrayOptions = {
  startX: number;
  startY: number;
};
const replace2DArray = (
  target: Matrix,
  source: Matrix,
  options: Replace2DArrayOptions = { startX: 0, startY: 0 },
): Matrix => {
  if (
    !Array.isArray(target) ||
    !Array.isArray(source) ||
    target.length === 0 ||
    source.length === 0
  ) {
    throw new Error("输入必须是非空的二维数组");
  }

  // 获取两个数组的尺寸
  const targetRows = target.length;
  const targetCols = target[0].length;
  const sourceRows = source.length;
  const sourceCols = source[0].length;

  // 创建一个新数组来存储结果
  const result = target;

  for (let row = 0; row < source.length; row++) {
    for (let col = 0; col < source[row].length; col++) {
      const x = row + options.startY;
      const y = col + options.startX;
      if (x < targetRows && y < targetCols) {
        result[x][y] = source[row][col];
      }
    }
  }

  return result;
};

type RendererOptions = {
  startX: number;
  startY: number;
};

const renderer = (
  el: Node,
  target: Matrix | undefined = undefined,
  options: RendererOptions = { startX: 0, startY: 0 },
): Matrix => {
  const _el = el;
  let { startX, startY } = options;
  const { yogaNode, type, borderConfig } = _el;
  const computedStyle = getComputedStyle(el.style, borderConfig);
  const { backgroundColor } = computedStyle;

  const layout = yogaNode.getComputedLayout();
  startX += layout.left;
  startY += layout.top;

  const fillContent = processBackgroundColor(backgroundColor, " ");
  let canvas = create2DArray(layout.height, layout.width, fillContent);

  if (type === Node.TEXT_NODE && el.textContent) {
    canvas = [el.textContent.split("")];
  }

  if (computedStyle.borderLeftWidth === 1) {
    canvas = drawBorder(canvas, computedStyle);
  }

  if (target) {
    console.log(layout);
    canvas = replace2DArray(target, canvas, { startX, startY });
  }

  for (const childNode of el.childNodes) {
    canvas = renderer(childNode, canvas);
  }

  return canvas;
};

export default renderer;
