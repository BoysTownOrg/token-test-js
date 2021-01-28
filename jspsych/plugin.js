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
  const borderWidthPixels = 2;
  circle.style.borderRadius = pixelsString(
    diameterPixels / 2 + borderWidthPixels
  );
  circle.style.border = `${pixelsString(borderWidthPixels)} solid black`;
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function squareElementWithColor(color) {
  const square = documentElement();
  const widthPixels = 100;
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  const borderWidthPixels = 2;
  square.style.border = `${pixelsString(borderWidthPixels)} solid black`;
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
    grid.style.gridGap = `${pixelsString(20)} ${pixelsString(20)}`;
    adopt(parent, grid);
    const circleColorsInOrder = ["red", "black", "yellow", "white", "green"];
    for (let i = 0; i < circleColorsInOrder.length; i += 1) {
      const circle = circleElementWithColor(circleColorsInOrder[i]);
      circle.draggable = true;
      circle.style.gridRow = 1;
      circle.style.gridColumn = i + 1;
      adopt(grid, circle);
      addClickEventListener(circle, (e) => {
        this.tokenClicked = circle;
        this.observer.notifyThatTokenHasBeenClicked();
      });
      addDragEventListener(circle, (e) => {
        e.dataTransfer.effectAllowed = "move";
        this.tokenDragged = circle;
        this.observer.notifyThatTokenHasBeenDragged();
      });
      addEventListener(circle, "dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      addEventListener(circle, "drop", (e) => {
        e.preventDefault();
        this.tokenDroppedOnto = circle;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      });
    }
    const squareColorsInOrder = ["black", "red", "white", "green", "yellow"];
    for (let i = 0; i < squareColorsInOrder.length; i += 1) {
      const square = squareElementWithColor(squareColorsInOrder[i]);
      square.draggable = true;
      square.style.gridRow = 2;
      square.style.gridColumn = i + 1;
      adopt(grid, square);
      addClickEventListener(square, (e) => {
        this.tokenClicked = square;
        this.observer.notifyThatTokenHasBeenClicked();
      });
      addDragEventListener(square, (e) => {
        e.dataTransfer.effectAllowed = "move";
        this.tokenDragged = square;
        this.observer.notifyThatTokenHasBeenDragged();
      });
      addEventListener(square, "dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      addEventListener(square, "drop", (e) => {
        e.preventDefault();
        this.tokenDroppedOnto = square;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      });
    }
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
