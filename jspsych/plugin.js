import { TokenModel } from "../lib/TokenModel.js";
import {
  SizedTokenController,
  TokenController,
} from "../lib/TokenController.js";
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

function divElement() {
  return document.createElement("div");
}

function pixelsString(a) {
  return `${a}px`;
}

const tokenWidthPixels = 150;
const smallTokenWidthPixels = 100;
const tokenBorderWidthPixels = 2;

function tokenBorder(borderWidthPixels) {
  return `${pixelsString(borderWidthPixels)} solid black`;
}

function circleElementWithColorAndDiameterPixels(color, diameterPixels) {
  const circle = divElement();
  circle.style.height = pixelsString(diameterPixels);
  circle.style.width = pixelsString(diameterPixels);
  const borderWidthPixels = tokenBorderWidthPixels;
  circle.style.borderRadius = pixelsString(
    diameterPixels / 2 + borderWidthPixels
  );
  circle.style.border = tokenBorder(borderWidthPixels);
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function circleElementWithColor(color) {
  return circleElementWithColorAndDiameterPixels(color, tokenWidthPixels);
}

function smallCircleElementWithColor(color) {
  return circleElementWithColorAndDiameterPixels(color, smallTokenWidthPixels);
}

function squareElementWithColorAndWidthPixels(color, widthPixels) {
  const square = divElement();
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  square.style.border = tokenBorder(tokenBorderWidthPixels);
  square.style.margin = "auto";
  square.style.backgroundColor = color;
  return square;
}

function squareElementWithColor(color) {
  return squareElementWithColorAndWidthPixels(color, tokenWidthPixels);
}

function smallSquareElementWithColor(color) {
  return squareElementWithColorAndWidthPixels(color, smallTokenWidthPixels);
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

function backgroundColor(token) {
  return token.style.backgroundColor;
}

function isCircle(token) {
  return token.style.borderRadius !== "";
}

function isSmall(token) {
  return token.style.width === pixelsString(smallTokenWidthPixels);
}

function addTokenRow(
  grid,
  row,
  colors,
  create,
  onClicked,
  onDragged,
  onDroppedOnto
) {
  for (let i = 0; i < colors.length; i += 1) {
    const token = create(colors[i]);
    token.draggable = true;
    token.style.gridRow = row;
    token.style.gridColumn = i + 1;
    adopt(grid, token);
    addClickEventListener(token, (e) => {
      onClicked(token);
    });
    addDragEventListener(token, (e) => {
      e.dataTransfer.effectAllowed = "move";
      onDragged(token);
    });
    addEventListener(token, "dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    addEventListener(token, "drop", (e) => {
      e.preventDefault();
      onDroppedOnto(token);
    });
  }
}

function gridWithRows(n) {
  const grid = divElement();
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(5, 1fr)";
  grid.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  grid.style.gridGap = `${pixelsString(60)} ${pixelsString(60)}`;
  return grid;
}

class TokenControl {
  constructor(parent, instructionMessage) {
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = gridWithRows(2);
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
    adopt(parent, grid);
    this.parent = parent;
  }

  addTokenRow(grid, row, colors, create) {
    addTokenRow(
      grid,
      row,
      colors,
      create,
      (token) => {
        this.tokenClicked = token;
        this.observer.notifyThatTokenHasBeenClicked();
      },
      (token) => {
        this.tokenDragged = token;
        this.observer.notifyThatTokenHasBeenDragged();
      },
      (token) => {
        this.tokenDroppedOnto = token;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      }
    );
  }

  tokenClickedColor() {
    return backgroundColor(this.tokenClicked);
  }

  tokenClickedIsCircle() {
    return isCircle(this.tokenClicked);
  }

  tokenDraggedColor() {
    return backgroundColor(this.tokenDragged);
  }

  tokenDraggedIsCircle() {
    return isCircle(this.tokenDragged);
  }

  tokenDroppedOntoColor() {
    return backgroundColor(this.tokenDroppedOnto);
  }

  tokenDroppedOntoIsCircle() {
    return isCircle(this.tokenDroppedOnto);
  }

  attach(observer) {
    this.observer = observer;
  }
}

class SizedTokenControl {
  constructor(parent, instructionMessage) {
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = gridWithRows(4);
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
    this.addTokenRow(
      grid,
      3,
      ["white", "black", "yellow", "red", "green"],
      smallCircleElementWithColor
    );
    this.addTokenRow(
      grid,
      4,
      ["yellow", "green", "red", "black", "white"],
      smallSquareElementWithColor
    );
    adopt(parent, grid);
    this.parent = parent;
  }

  addTokenRow(grid, row, colors, create) {
    addTokenRow(
      grid,
      row,
      colors,
      create,
      (token) => {
        this.tokenClicked = token;
        this.observer.notifyThatTokenHasBeenClicked();
      },
      (token) => {
        this.tokenDragged = token;
        this.observer.notifyThatTokenHasBeenDragged();
      },
      (token) => {
        this.tokenDroppedOnto = token;
        this.observer.notifyThatTokenHasBeenDroppedOnto();
      }
    );
  }

  tokenClickedColor() {
    return backgroundColor(this.tokenClicked);
  }

  tokenClickedIsCircle() {
    return isCircle(this.tokenClicked);
  }

  tokenClickedIsSmall() {
    return isSmall(this.tokenClicked);
  }

  tokenDraggedColor() {
    return backgroundColor(this.tokenDragged);
  }

  tokenDraggedIsCircle() {
    return isCircle(this.tokenDragged);
  }

  tokenDraggedIsSmall() {
    return isSmall(this.tokenDragged);
  }

  tokenDroppedOntoColor() {
    return backgroundColor(this.tokenDroppedOnto);
  }

  tokenDroppedOntoIsCircle() {
    return isCircle(this.tokenDroppedOnto);
  }

  tokenDroppedOntoIsSmall() {
    return isSmall(this.tokenDroppedOnto);
  }

  attach(observer) {
    this.observer = observer;
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
        new TokenControl(display_element, trial.sentence),
        new TokenModel(
          new JsPsychTrial(),
          parseTokenInteractions(trial.commandString)
        )
      );
    },
    info: {
      parameters: {},
    },
  };
}

export function twoSizesPlugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      new SizedTokenController(
        new SizedTokenControl(display_element, trial.sentence),
        new TokenModel(
          new JsPsychTrial(),
          parseTokenInteractions(trial.commandString)
        )
      );
    },
    info: {
      parameters: {},
    },
  };
}
