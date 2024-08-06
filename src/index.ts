import Div, { VUICSSStyleDeclaration } from "./div";
import App from "./app";

const appLayout = new App();
const createBox = (index: number) => {
  const style: Partial<VUICSSStyleDeclaration> = {
    width: 10,
    height: 5,
    borderWidth: 1,
    borderStyle: "round",
    // flexGrow: 1,
  };
  if (index === 3) {
    // style.flexGrow = 2;
    // style.marginLeft = 'auto';
  }
  const box = new Div({
    style,
  });
  return box;
};

appLayout.append(...Array.from({ length: 5 }, (_, index) => createBox(index)));
appLayout.flow();
appLayout.paint();
appLayout.render();
