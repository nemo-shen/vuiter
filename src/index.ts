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
import App from "./app";

const { rows, columns } = process.stdout;

const appLayout = new App();
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

appLayout.append(...Array.from({ length: 3 }, () => createBox()));
appLayout.flow();
appLayout.paint();
appLayout.render();