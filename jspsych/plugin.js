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
import interact from "https://cdn.interactjs.io/v1.10.11/interactjs/index.js";

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

const tokenWidthPixels = 100;
const smallTokenWidthPixels = 60;
const tokenBorderWidthPixels = 2;

function tokenBorder(borderWidthPixels) {
  return `${pixelsString(borderWidthPixels)} solid black`;
}

function cssColorString(color) {
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
    case Color.brown:
      return "#511a11";
    case Color.orange:
      return "#fc7303";
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
  circle.style.backgroundColor = cssColorString(color);
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
  square.style.backgroundColor = cssColorString(color);
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

function tokenColor(token) {
  return token.color;
}

function isCircle(token) {
  return token.shape === Shape.circle;
}

function isSmall(token) {
  return token.size === Size.small;
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
  tokens.forEach((token, index) => {
    const tokenElement = createElement(token);
    elementFromToken.set(hashToken(token), tokenElement);
    tokenElement.style.gridRow = row;
    tokenElement.style.gridColumn = index + 1;
    tokenElement.style.touchAction = "none";
    adopt(grid, tokenElement);
    addClickEventListener(tokenElement, () => {
      onReleased(token);
    });
    const tokenPosition = { x: 0, y: 0 };
    let tokenPositions = [];
    interact(tokenElement)
      .draggable({
        listeners: {
          start() {
            onDragged(token);
            tokenElement.style.zIndex = 1;
          },
          move(event) {
            tokenPosition.x += event.dx;
            tokenPosition.y += event.dy;

            event.target.style.transform = `translate(${tokenPosition.x}px, ${tokenPosition.y}px)`;
            tokenPositions.push({ ...tokenPosition });
          },
          end() {
            onDraggedReleased(token, tokenPositions);
            tokenPositions = [];
            tokenElement.style.zIndex = 0;
          },
        },
      })
      .dropzone({
        overlap: 0.01,
        ondrop() {
          onDroppedOnto(token);
          tokenElement.style.borderColor = "black";
        },
        ondragenter() {
          tokenElement.style.borderColor = "#22e";
        },
        ondragleave() {
          tokenElement.style.borderColor = "black";
        },
      });
  });
}

function tokenGridWithRows(n) {
  const grid = divElement();
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(5, 1fr)";
  grid.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  grid.style.gridGap = `${pixelsString(20)} ${pixelsString(20)}`;
  return grid;
}

function audioBufferSource(jsPsych, url) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  return jsPsych.pluginAPI.getAudioBuffer(url).then((buffer) => {
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(audioContext.destination);
    return bufferSource;
  });
}

function addProgressElement(parent, trialParameters) {
  const progressElement = document.createElement("div");
  progressElement.textContent = `trial ${trialParameters.currentTrial} of ${trialParameters.totalTrials}`;
  adopt(parent, progressElement);
}

function onTokenReleased(jsPsych, control, token) {
  control.tokenReleased = token;
  audioBufferSource(jsPsych, control.trialParameters.tokenDropUrl).then(
    (source) => {
      source.start();
    }
  );
  control.observer.notifyThatTokenHasBeenReleased();
}

function onTokenDragged(control, token) {
  control.tokenDragged = token;
  control.observer.notifyThatTokenHasBeenDragged();
}

function onTokenDroppedOnto(control, token) {
  control.tokenDroppedOnto = token;
  control.observer.notifyThatTokenHasBeenDroppedOnto();
}

class TokenControl {
  constructor(jsPsych, parent, trial, trialParameters, tokenRows) {
    this.jsPsych = jsPsych;
    this.trial = trial;
    this.trialParameters = trialParameters;
    this.elementFromToken = new Map();
    addProgressElement(parent, trialParameters);
    const boxImage = new Image();
    boxImage.src = trialParameters.boxUrl;
    boxImage.style.border = `${pixelsString(2)} solid black`;
    boxImage.style.margin = "5% auto";
    adopt(parent, boxImage);
    const grid = tokenGridWithRows(tokenRows.length);
    tokenRows.forEach((tokenRow, index) => {
      this.addTokenRow(grid, index + 1, tokenRow);
    });
    const onHoldingAreaDrop = () => {
      this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    };
    interact(boxImage).dropzone({
      ondrop(event) {
        onHoldingAreaDrop();
        boxImage.style.borderColor = "black";
        interact(event.relatedTarget).dropzone(false);
      },
      ondragenter() {
        boxImage.style.borderColor = "#22e";
      },
      ondragleave() {
        boxImage.style.borderColor = "black";
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
        onTokenReleased(this.jsPsych, this, token);
      },
      (token) => {
        onTokenDragged(this, token);
      },
      (token) => {
        onTokenDroppedOnto(this, token);
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
    return tokenColor(this.tokenReleased);
  }

  tokenReleasedIsCircle() {
    return isCircle(this.tokenReleased);
  }

  tokenDraggedColor() {
    return tokenColor(this.tokenDragged);
  }

  tokenDraggedIsCircle() {
    return isCircle(this.tokenDragged);
  }

  tokenDroppedOntoColor() {
    return tokenColor(this.tokenDroppedOnto);
  }

  tokenDroppedOntoIsCircle() {
    return isCircle(this.tokenDroppedOnto);
  }

  attach(observer) {
    this.observer = observer;
  }
}

class SizedTokenControl {
  constructor(jsPsych, parent, trial, trialParameters, tokenRows) {
    this.jsPsych = jsPsych;
    this.trial = trial;
    this.trialParameters = trialParameters;
    this.elementFromToken = new Map();
    addProgressElement(parent, trialParameters);
    const grid = tokenGridWithRows(tokenRows.length);
    tokenRows.forEach((tokenRow, index) => {
      this.addTokenRow(grid, index + 1, tokenRow);
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
        onTokenReleased(this.jsPsych, this, token);
      },
      (token) => {
        onTokenDragged(this, token);
      },
      (token) => {
        onTokenDroppedOnto(this, token);
      },
      (token, positions) => {
        this.trial.recordSizedTokenDragPath(token, positions);
      }
    );
  }

  tokenReleasedColor() {
    return tokenColor(this.tokenReleased);
  }

  tokenReleasedIsCircle() {
    return isCircle(this.tokenReleased);
  }

  tokenReleasedIsSmall() {
    return isSmall(this.tokenReleased);
  }

  tokenDraggedColor() {
    return tokenColor(this.tokenDragged);
  }

  tokenDraggedIsCircle() {
    return isCircle(this.tokenDragged);
  }

  tokenDraggedIsSmall() {
    return isSmall(this.tokenDragged);
  }

  tokenDroppedOntoColor() {
    return tokenColor(this.tokenDroppedOnto);
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
  constructor(jsPsych, sentenceNumber, sentenceUrl, sentence) {
    this.jsPsych = jsPsych;
    this.tokenDragPaths = [];
    this.sentenceNumber = sentenceNumber;
    this.sentenceUrl = sentenceUrl;
    this.sentence = sentence;
  }

  conclude(result) {
    this.jsPsych.finishTrial({
      ...result,
      tokenDragPaths: this.tokenDragPaths,
      sentenceNumber: this.sentenceNumber,
      sentenceUrl: this.sentenceUrl,
      sentence: this.sentence,
    });
  }

  recordTokenDragPath(token, positions) {
    const copiedPositions = [];
    positions.forEach((position) => {
      copiedPositions.push({ ...position });
    });
    this.tokenDragPaths.push({
      positions: copiedPositions,
      token,
    });
  }

  recordSizedTokenDragPath(token, positions) {
    const copiedPositions = [];
    positions.forEach((position) => {
      copiedPositions.push({ ...position });
    });
    this.tokenDragPaths.push({
      positions: copiedPositions,
      token,
    });
  }
}

class PerformanceTimer {
  milliseconds() {
    return performance.now();
  }
}

function pluginClass(TokenControllerType, createTokenControl) {
  class Plugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trialParameters) {
      clear(display_element);
      const jsPsychTrial = new JsPsychTrial(
        this.jsPsych,
        trialParameters.sentenceNumber,
        trialParameters.sentenceUrl,
        trialParameters.sentence
      );
      const model = new TokenModel(
        jsPsychTrial,
        new PerformanceTimer(),
        parseTokenInteractionRule(trialParameters.commandString)
      );
      const controller = new TokenControllerType(
        createTokenControl(
          this.jsPsych,
          display_element,
          jsPsychTrial,
          trialParameters
        ),
        model
      );
      audioBufferSource(this.jsPsych, trialParameters.sentenceUrl).then(
        (sentenceSource) => {
          sentenceSource.onended = () => {
            audioBufferSource(this.jsPsych, trialParameters.beepUrl).then(
              (beepSource) => {
                beepSource.start();
                this.jsPsych.pluginAPI.setTimeout(() => {
                  model.concludeTrial();
                }, trialParameters.timeoutMilliseconds);
              }
            );
          };
          sentenceSource.start();
        }
      );
    }
  }
  return Plugin;
}

function pluginUsingControllerAndControlFactories(
  TokenControllerType,
  createTokenControl,
  name,
  jsPsychModule,
  additionalParameters = {}
) {
  const Plugin = pluginClass(TokenControllerType, createTokenControl);
  Plugin.info = {
    name,
    parameters: {
      sentenceNumber: {
        type: jsPsychModule.ParameterType.INT,
        default: 1,
      },
      sentenceUrl: {
        type: jsPsychModule.ParameterType.AUDIO,
        default: undefined,
      },
      sentence: {
        type: jsPsychModule.ParameterType.STRING,
        default: "",
      },
      commandString: {
        type: jsPsychModule.ParameterType.STRING,
        default: "nothing",
      },
      timeoutMilliseconds: {
        type: jsPsychModule.ParameterType.INT,
        default: 10000,
      },
      beepUrl: {
        type: jsPsychModule.ParameterType.AUDIO,
        default: undefined,
      },
      tokenDropUrl: {
        type: jsPsychModule.ParameterType.AUDIO,
        default: undefined,
      },
      ...additionalParameters,
    },
  };

  return Plugin;
}

export function plugin(jsPsychModule) {
  return pluginUsingControllerAndControlFactories(
    TokenController,
    (jsPsych, parent, trial, trialParameters) =>
      new TokenControl(jsPsych, parent, trial, trialParameters, [
        [
          { color: Color.red, shape: Shape.circle },
          { color: Color.blue, shape: Shape.circle },
          { color: Color.brown, shape: Shape.circle },
          { color: Color.white, shape: Shape.circle },
          { color: Color.orange, shape: Shape.circle },
        ],
        [
          { color: Color.blue, shape: Shape.square },
          { color: Color.red, shape: Shape.square },
          { color: Color.white, shape: Shape.square },
          { color: Color.orange, shape: Shape.square },
          { color: Color.brown, shape: Shape.square },
        ],
      ]),
    "Token",
    jsPsychModule,
    {
      boxUrl: {
        type: jsPsychModule.ParameterType.IMAGE,
        default: undefined,
      },
    }
  );
}

export function twoSizesPlugin(jsPsychModule) {
  return pluginUsingControllerAndControlFactories(
    SizedTokenController,
    (jsPsych, parent, trial, trialParameters) =>
      new SizedTokenControl(jsPsych, parent, trial, trialParameters, [
        [
          { color: Color.red, shape: Shape.circle, size: Size.large },
          { color: Color.blue, shape: Shape.circle, size: Size.large },
          { color: Color.brown, shape: Shape.circle, size: Size.large },
          { color: Color.white, shape: Shape.circle, size: Size.large },
          { color: Color.orange, shape: Shape.circle, size: Size.large },
        ],
        [
          { color: Color.blue, shape: Shape.square, size: Size.large },
          { color: Color.red, shape: Shape.square, size: Size.large },
          { color: Color.white, shape: Shape.square, size: Size.large },
          { color: Color.orange, shape: Shape.square, size: Size.large },
          { color: Color.brown, shape: Shape.square, size: Size.large },
        ],
        [
          { color: Color.white, shape: Shape.circle, size: Size.small },
          { color: Color.blue, shape: Shape.circle, size: Size.small },
          { color: Color.brown, shape: Shape.circle, size: Size.small },
          { color: Color.red, shape: Shape.circle, size: Size.small },
          { color: Color.orange, shape: Shape.circle, size: Size.small },
        ],
        [
          { color: Color.brown, shape: Shape.square, size: Size.small },
          { color: Color.orange, shape: Shape.square, size: Size.small },
          { color: Color.red, shape: Shape.square, size: Size.small },
          { color: Color.blue, shape: Shape.square, size: Size.small },
          { color: Color.white, shape: Shape.square, size: Size.small },
        ],
      ]),
    "Sized Token",
    jsPsychModule
  );
}
