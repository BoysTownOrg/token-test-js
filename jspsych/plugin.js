import { SizedTokenModel, TokenModel } from "../lib/TokenModel.js";
import {
  SizedTokenController,
  TokenController,
} from "../lib/TokenController.js";
import { parseTokenInteractions } from "../lib/TokenTrialConfigurationParser.js";
import interact from "https://cdn.interactjs.io/v1.10.8/interactjs/index.js";

function addEventListener(element, event, f) {
  element.addEventListener(event, f);
}

function addClickEventListener(element, f) {
  addEventListener(element, "click", f);
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
  createTokenWithColor,
  onReleased,
  onDragged,
  onDroppedOnto
) {
  for (let i = 0; i < colors.length; i += 1) {
    const token = createTokenWithColor(colors[i]);
    token.style.gridRow = row;
    token.style.gridColumn = i + 1;
    token.style.touchAction = "none";
    adopt(grid, token);
    addClickEventListener(token, () => {
      onReleased(token);
    });
    const position = { x: 0, y: 0 };
    interact(token)
      .draggable({
        listeners: {
          start() {
            onDragged(token);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      })
      .dropzone({
        ondrop() {
          onDroppedOnto(token);
        },
        ondragenter() {
          token.style.borderColor = "#22e";
        },
        ondragleave() {
          token.style.borderColor = "black";
        },
      });
  }
}

function tokenGridWithRows(n) {
  const grid = divElement();
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(5, 1fr)";
  grid.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  grid.style.gridGap = `${pixelsString(60)} ${pixelsString(60)}`;
  return grid;
}

class TokenControl {
  constructor(parent, instructionMessage) {
    const holdingArea = divElement();
    holdingArea.style.height = pixelsString(300);
    holdingArea.style.width = pixelsString(5 * 150);
    holdingArea.style.border = `${pixelsString(2)} solid black`;
    holdingArea.style.margin = "5% auto";
    holdingArea.style.backgroundColor = "lightgrey";
    adopt(parent, holdingArea);
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    instructions.style.margin = "5% auto";
    adopt(parent, instructions);
    const grid = tokenGridWithRows(2);
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
    const onHoldingAreaDrop = () => {
      this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    };
    interact(holdingArea).dropzone({
      ondrop() {
        onHoldingAreaDrop();
        holdingArea.style.borderColor = "black";
      },
      ondragenter() {
        holdingArea.style.borderColor = "#22e";
      },
      ondragleave() {
        holdingArea.style.borderColor = "black";
      },
    });
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
        this.tokenReleased = token;
        this.observer.notifyThatTokenHasBeenReleased();
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

  tokenReleasedColor() {
    return backgroundColor(this.tokenReleased);
  }

  tokenReleasedIsCircle() {
    return isCircle(this.tokenReleased);
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
    const grid = tokenGridWithRows(4);
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
        this.tokenReleased = token;
        this.observer.notifyThatTokenHasBeenReleased();
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

  tokenReleasedColor() {
    return backgroundColor(this.tokenReleased);
  }

  tokenReleasedIsCircle() {
    return isCircle(this.tokenReleased);
  }

  tokenReleasedIsSmall() {
    return isSmall(this.tokenReleased);
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

function pluginUsingControllerAndControlFactories(
  createTokenController,
  createTokenControl,
  createTokenModel
) {
  return {
    trial(display_element, trial) {
      clear(display_element);
      createTokenController(
        createTokenControl(display_element, trial.sentence),
        createTokenModel(
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

export function plugin() {
  return pluginUsingControllerAndControlFactories(
    (control, model) => new TokenController(control, model),
    (display_element, sentence) => new TokenControl(display_element, sentence),
    (trial, tokenInteractions) => new TokenModel(trial, tokenInteractions)
  );
}

export function twoSizesPlugin() {
  return pluginUsingControllerAndControlFactories(
    (control, model) => new SizedTokenController(control, model),
    (display_element, sentence) =>
      new SizedTokenControl(display_element, sentence),
    (trial, tokenInteractions) => new SizedTokenModel(trial, tokenInteractions)
  );
}
