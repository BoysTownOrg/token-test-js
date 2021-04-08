import {
  Color,
  hashToken,
  Shape,
  Size,
  TokenModel,
} from "../lib/TokenModel.js";
import {
  SizedTokenController,
  TokenController,
} from "../lib/TokenController.js";
import { parseTokenInteractionRule } from "../lib/TokenTrialConfigurationParser.js";
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

function colorName(color) {
  switch (color) {
    case Color.red:
      return "red";
    case Color.yellow:
      return "yellow";
    case Color.green:
      return "green";
    case Color.white:
      return "white";
    case Color.blue:
      return "blue";
    case Color.black:
      return "black";
    default:
      return "";
  }
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
  circle.style.backgroundColor = colorName(color);
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
  square.style.backgroundColor = colorName(color);
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
  tokens,
  createElement,
  elementFromToken,
  onReleased,
  onDragged,
  onDroppedOnto,
  onDraggedReleased
) {
  for (let i = 0; i < tokens.length; i += 1) {
    const tokenElement = createElement(tokens[i]);
    elementFromToken.set(hashToken(tokens[i]), tokenElement);
    tokenElement.style.gridRow = row;
    tokenElement.style.gridColumn = i + 1;
    tokenElement.style.touchAction = "none";
    adopt(grid, tokenElement);
    addClickEventListener(tokenElement, () => {
      onReleased(tokenElement);
    });
    const position = { x: 0, y: 0 };
    const positions = [];
    for (let j = 0; j < 1000; j += 1) positions.push({ x: 0, y: 0 });
    let positionIndex = 0;
    interact(tokenElement)
      .draggable({
        listeners: {
          start() {
            onDragged(tokenElement);
            tokenElement.style.zIndex = 1;
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
            positions[positionIndex].x = position.x;
            positions[positionIndex].y = position.y;
            positionIndex += 1;
          },
          end() {
            onDraggedReleased(tokenElement, positions.slice(0, positionIndex));
            tokenElement.style.zIndex = 0;
            positionIndex = 0;
          },
        },
      })
      .dropzone({
        ondrop() {
          onDroppedOnto(tokenElement);
          tokenElement.style.borderColor = "black";
        },
        ondragenter() {
          tokenElement.style.borderColor = "#22e";
        },
        ondragleave() {
          tokenElement.style.borderColor = "black";
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
  constructor(parent, instructionMessage, trial, tokenRows) {
    this.trial = trial;
    this.elementFromToken = new Map();
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
    const grid = tokenGridWithRows(tokenRows.length);
    for (let i = 0; i < tokenRows.length; i += 1)
      this.addTokenRow(grid, i + 1, tokenRows[i]);
    const onHoldingAreaDrop = () => {
      this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    };
    interact(holdingArea).dropzone({
      ondrop(event) {
        onHoldingAreaDrop();
        holdingArea.style.borderColor = "black";
        interact(event.relatedTarget).dropzone(false);
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

  addTokenRow(grid, row, tokens) {
    addTokenRow(
      grid,
      row,
      tokens,
      (token) =>
        token.shape === Shape.circle
          ? circleElementWithColor(token.color)
          : squareElementWithColor(token.color),
      this.elementFromToken,
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
      },
      (token, positions) => {
        this.trial.recordTokenDragPath(token, positions);
      }
    );
  }

  tokenPosition(token) {
    const domRect = this.elementFromToken
      .get(hashToken(token))
      .getBoundingClientRect();
    return {
      leftScreenEdgeToLeftEdgePixels: domRect.left,
      topScreenEdgeToTopEdgePixels: domRect.top,
      widthPixels: domRect.width,
      heightPixels: domRect.height,
    };
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
  constructor(parent, instructionMessage, trial, tokenRows) {
    this.trial = trial;
    this.elementFromToken = new Map();
    const holdingArea = divElement();
    holdingArea.style.height = pixelsString(300);
    holdingArea.style.width = pixelsString(5 * 150);
    holdingArea.style.border = `${pixelsString(2)} solid black`;
    holdingArea.style.margin = "5% auto";
    holdingArea.style.backgroundColor = "lightgrey";
    adopt(parent, holdingArea);
    const instructions = divElement();
    instructions.textContent = instructionMessage;
    adopt(parent, instructions);
    const grid = tokenGridWithRows(tokenRows.length);
    for (let i = 0; i < tokenRows.length; i += 1)
      this.addTokenRow(grid, i + 1, tokenRows[i]);
    const onHoldingAreaDrop = () => {
      this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    };
    interact(holdingArea).dropzone({
      ondrop(event) {
        onHoldingAreaDrop();
        holdingArea.style.borderColor = "black";
        interact(event.relatedTarget).dropzone(false);
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

  addTokenRow(grid, row, tokens) {
    addTokenRow(
      grid,
      row,
      tokens,
      (token) =>
        token.shape === Shape.circle
          ? token.size === Size.large
            ? circleElementWithColor(token.color)
            : smallCircleElementWithColor(token.color)
          : token.size === Size.large
          ? squareElementWithColor(token.color)
          : smallSquareElementWithColor(token.color),
      this.elementFromToken,
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
      },
      (token, positions) => {
        this.trial.recordSizedTokenDragPath(token, positions);
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
  constructor() {
    this.tokenDragPaths = [];
  }

  conclude(result) {
    jsPsych.finishTrial({ ...result, tokenDragPaths: this.tokenDragPaths });
  }

  recordTokenDragPath(token, positions) {
    const copiedPositions = [];
    for (let j = 0; j < positions.length; j += 1)
      copiedPositions.push({ x: positions[j].x, y: positions[j].y });
    this.tokenDragPaths.push({
      positions: copiedPositions,
      token: {
        color: backgroundColor(token),
        shape: isCircle(token) ? Shape.circle : Shape.square,
      },
    });
  }

  recordSizedTokenDragPath(token, positions) {
    const copiedPositions = [];
    for (let j = 0; j < positions.length; j += 1)
      copiedPositions.push({ x: positions[j].x, y: positions[j].y });
    this.tokenDragPaths.push({
      positions: copiedPositions,
      token: {
        color: backgroundColor(token),
        shape: isCircle(token) ? Shape.circle : Shape.square,
        size: isSmall(token) ? Size.small : Size.large,
      },
    });
  }
}

class PerformanceTimer {
  milliseconds() {
    return performance.now();
  }
}

function pluginUsingControllerAndControlFactories(
  TokenControllerType,
  createTokenControl
) {
  return {
    trial(display_element, trial) {
      clear(display_element);
      const jsPsychTrial = new JsPsychTrial();
      const model = new TokenModel(
        jsPsychTrial,
        new PerformanceTimer(),
        parseTokenInteractionRule(trial.commandString)
      );
      const controller = new TokenControllerType(
        createTokenControl(display_element, trial.sentence, jsPsychTrial),
        model
      );
      jsPsych.pluginAPI.setTimeout(() => {
        model.concludeTrial();
      }, trial.timeoutMilliseconds);
    },
    info: {
      parameters: {},
    },
  };
}

export function plugin() {
  return pluginUsingControllerAndControlFactories(
    TokenController,
    (parent, sentence, trial) =>
      new TokenControl(parent, sentence, trial, [
        [
          { color: Color.red, shape: Shape.circle },
          { color: Color.black, shape: Shape.circle },
          { color: Color.yellow, shape: Shape.circle },
          { color: Color.white, shape: Shape.circle },
          { color: Color.blue, shape: Shape.circle },
        ],
        [
          { color: Color.black, shape: Shape.square },
          { color: Color.red, shape: Shape.square },
          { color: Color.white, shape: Shape.square },
          { color: Color.blue, shape: Shape.square },
          { color: Color.yellow, shape: Shape.square },
        ],
      ])
  );
}

export function twoSizesPlugin() {
  return pluginUsingControllerAndControlFactories(
    SizedTokenController,
    (parent, sentence, trial) =>
      new SizedTokenControl(parent, sentence, trial, [
        [
          { color: Color.red, shape: Shape.circle, size: Size.large },
          { color: Color.black, shape: Shape.circle, size: Size.large },
          { color: Color.yellow, shape: Shape.circle, size: Size.large },
          { color: Color.white, shape: Shape.circle, size: Size.large },
          { color: Color.blue, shape: Shape.circle, size: Size.large },
        ],
        [
          { color: Color.black, shape: Shape.square, size: Size.large },
          { color: Color.red, shape: Shape.square, size: Size.large },
          { color: Color.white, shape: Shape.square, size: Size.large },
          { color: Color.blue, shape: Shape.square, size: Size.large },
          { color: Color.yellow, shape: Shape.square, size: Size.large },
        ],
        [
          { color: Color.white, shape: Shape.circle, size: Size.small },
          { color: Color.black, shape: Shape.circle, size: Size.small },
          { color: Color.yellow, shape: Shape.circle, size: Size.small },
          { color: Color.red, shape: Shape.circle, size: Size.small },
          { color: Color.blue, shape: Shape.circle, size: Size.small },
        ],
        [
          { color: Color.yellow, shape: Shape.square, size: Size.small },
          { color: Color.blue, shape: Shape.square, size: Size.small },
          { color: Color.red, shape: Shape.square, size: Size.small },
          { color: Color.black, shape: Shape.square, size: Size.small },
          { color: Color.white, shape: Shape.square, size: Size.small },
        ],
      ])
  );
}
