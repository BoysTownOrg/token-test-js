import { TokenModel } from "../lib/TokenModel.js";
import { TokenController } from "../lib/TokenController.js";

function addEventListener(element, event, f) {
  element.addEventListener(event, f);
}

function addClickEventListener(element, f) {
  addEventListener(element, "click", f);
}

function addDragEventListener(element, f) {
  addEventListener(element, "dragstart", f);
}

function documentElement() {
  return document.createElement("div");
}

function pixelsString(a) {
  return `${a}px`;
}

function circleElementWithColor(color) {
  const circle = documentElement();
  const diameterPixels = 100;
  circle.style.height = pixelsString(diameterPixels);
  circle.style.width = pixelsString(diameterPixels);
  circle.style.borderRadius = pixelsString(diameterPixels / 2);
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function squareElementWithColor(color) {
  const square = documentElement();
  const widthPixels = 100;
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  square.style.margin = "auto";
  square.style.backgroundColor = color;
  return square;
}

function adopt(parent, child) {
  parent.append(child);
}

function clear(parent) {
  // https://stackoverflow.com/a/3955238
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

class TokenControl {
  constructor(parent) {
    this.parent = parent;
    const grid = documentElement();
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    this.redSquare = squareElementWithColor("red");
    this.redSquare.draggable = true;
    this.redCircle = circleElementWithColor("red");
    this.redCircle.draggable = true;
    this.greenSquare = squareElementWithColor("green");
    this.greenSquare.draggable = true;
    adopt(parent, grid);
    this.redSquare.style.gridRow = 1;
    this.redSquare.style.gridColumn = 1;
    adopt(grid, this.redSquare);
    this.redCircle.style.gridRow = 2;
    this.redCircle.style.gridColumn = 1;
    adopt(grid, this.redCircle);
    this.greenSquare.style.gridRow = 1;
    this.greenSquare.style.gridColumn = 2;
    adopt(grid, this.greenSquare);
    addClickEventListener(this.redSquare, (e) => {
      this.observer.notifyThatRedSquareHasBeenClicked();
    });
    addDragEventListener(this.redCircle, (e) => {
      e.dataTransfer.effectAllowed = "move";
      this.observer.notifyThatRedCircleHasBeenDragged();
    });
    addEventListener(this.greenSquare, "dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    addEventListener(this.greenSquare, "drop", (e) => {
      e.preventDefault();
      this.observer.notifyThatGreenSquareHasBeenDroppedOnto();
    });
  }

  attach(observer) {
    this.observer = observer;
  }

  showDoneButton() {
    this.doneButton.style.visibility = "visible";
  }
}

export function plugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      const control = new TokenControl(display_element);
      const model = new TokenModel();
      new TokenController(control, model);
    },
    info: {
      parameters: {},
    },
  };
}
