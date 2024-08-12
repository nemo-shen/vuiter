import Div, { VUICSSStyleDeclaration } from "./div";
import App from "./app";
export { createApp } from './createApp';

// dom -> render function -> new Div()
const appLayout = new App();
const createBox = (index: number) => {
  const style: Partial<VUICSSStyleDeclaration> = {
    width: 20,
    height: 5,
    borderWidth: 1,
    // borderStyle: "round",
    // flexGrow: 1,
  };
  if (index === 2) {
    // style.gap = 2
    // style.flexShrink = 1;
    // style.flexGrow = 2;
    // style.marginLeft = 'auto';
  }
  const box = new Div({
    style,
  });
  return box;
};

appLayout.append(...Array.from({ length: 3 }, (_, index) => createBox(index)));
appLayout.flow();
appLayout.paint();
appLayout.render();
