import { TokenModel } from "../lib/TokenModel.js";
import { TokenController } from "../lib/TokenController.js";
import { parseTokenInteractions } from "../lib/TokenTrialConfigurationParser.js";

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
  constructor(parent, instructionMessage) {
    this.parent = parent;
    const instructions = documentElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = documentElement();
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    grid.style.gridGap = `${pixelsString(20)} ${pixelsString(20)}`;
    adopt(parent, grid);
    this.addTokenRow(
      grid,
      1,
      ["red", "black", "yellow", "white", "green"],
      circleElementWithColor
    );
    this.addTokenRow(
      grid,
      2,
      ["black", "red", "white", "green", "yellow"],
      squareElementWithColor
    );
  }

  addTokenRow(grid, row, colors, create) {
    for (let i = 0; i < colors.length; i += 1) {
      const token = create(colors[i]);
      token.draggable = true;
      token.style.gridRow = row;
      token.style.gridColumn = i + 1;
      adopt(grid, token);
      addClickEventListener(token, (e) => {
        this.tokenClicked = token;
        this.observer.notifyThatTokenHasBeenClicked();
      });
      addDragEventListener(token, (e) => {
        e.dataTransfer.effectAllowed = "move";
        this.tokenDragged = token;
        this.observer.notifyThatTokenHasBeenDragged();
      });
      addEventListener(token, "dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      addEventListener(token, "drop", (e) => {
        e.preventDefault();
        this.tokenDroppedOnto = token;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      });
    }
  }

  tokenClickedColor() {
    return this.tokenClicked.style.backgroundColor;
  }

  tokenClickedIsCircle() {
    return this.tokenClicked.style.borderRadius !== "";
  }

  tokenDraggedColor() {
    return this.tokenDragged.style.backgroundColor;
  }

  tokenDraggedIsCircle() {
    return this.tokenDragged.style.borderRadius !== "";
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOnto.style.backgroundColor;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOnto.style.borderRadius !== "";
  }

  attach(observer) {
    this.observer = observer;
  }

  showDoneButton() {
    this.doneButton.style.visibility = "visible";
  }
}

class JsPsychTrial {
  conclude(result) {
    jsPsych.finishTrial(result);
  }
}

export function plugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      new TokenController(
        new TokenControl(
          display_element,
          "Using the circle that is above the white square, touch the blue circle."
        ),
        new TokenModel(
          new JsPsychTrial(),
          parseTokenInteractions("use yellow circle to touch blue circle")
        )
      );
    },
    info: {
      parameters: {},
    },
  };
}
