import { Color, Action, Shape, Size } from "./TokenModel.js";

function color(name) {
  switch (name) {
    case "red":
      return Color.red;
    case "yellow":
      return Color.yellow;
    case "green":
      return Color.green;
    case "white":
      return Color.white;
    case "blue":
      return Color.blue;
    case "black":
      return Color.black;
    default:
      return Color.unknown;
  }
}

function createToken(tokenColorName, tokenIsCircle) {
  return {
    color: color(tokenColorName),
    shape: tokenIsCircle ? Shape.circle : Shape.square,
  };
}

function createSizedToken(tokenColorName, tokenIsCircle, tokenIsSmall) {
  return {
    ...createToken(tokenColorName, tokenIsCircle),
    size: tokenIsSmall ? Size.small : Size.large,
  };
}

function tokenReleasedColor(control) {
  return control.tokenReleasedColor();
}

function tokenReleasedIsCircle(control) {
  return control.tokenReleasedIsCircle();
}

function tokenDraggedColor(control) {
  return control.tokenDraggedColor();
}

function tokenDraggedIsCircle(control) {
  return control.tokenDraggedIsCircle();
}

function tokenDroppedOntoColor(control) {
  return control.tokenDroppedOntoColor();
}

function tokenDroppedOntoIsCircle(control) {
  return control.tokenDroppedOntoIsCircle();
}

export class TokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
    this.lastActionWasADrop = false;
  }

  notifyThatTokenHasBeenReleased() {
    if (this.lastActionWasADrop) this.lastActionWasADrop = false;
    else
      this.model.submitSingleTokenInteraction({
        token: createToken(
          tokenReleasedColor(this.control),
          tokenReleasedIsCircle(this.control)
        ),
        action: Action.touch,
      });
  }

  notifyThatTokenHasBeenDragged() {
    this.tokenBeingDragged = createToken(
      tokenDraggedColor(this.control),
      tokenDraggedIsCircle(this.control)
    );
  }

  notifyThatTokenHasBeenDroppedOnto() {
    this.model.submitDualTokenInteraction({
      firstToken: this.tokenBeingDragged,
      secondToken: createToken(
        tokenDroppedOntoColor(this.control),
        tokenDroppedOntoIsCircle(this.control)
      ),
      action: Action.useToTouch,
    });
    this.lastActionWasADrop = true;
  }

  notifyThatHoldingAreaHasBeenDroppedOnto() {
    this.model.submitSingleTokenInteraction({
      token: this.tokenBeingDragged,
      action: Action.pickUp,
    });
    this.lastActionWasADrop = true;
  }
}

export class SizedTokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
  }

  notifyThatTokenHasBeenReleased() {
    this.model.submitSingleTokenInteraction({
      token: createSizedToken(
        tokenReleasedColor(this.control),
        tokenReleasedIsCircle(this.control),
        this.control.tokenReleasedIsSmall()
      ),
      action: Action.touch,
    });
  }

  notifyThatTokenHasBeenDragged() {
    this.tokenBeingDragged = createSizedToken(
      tokenDraggedColor(this.control),
      tokenDraggedIsCircle(this.control),
      this.control.tokenDraggedIsSmall()
    );
  }

  notifyThatTokenHasBeenDroppedOnto() {
    this.model.submitDualTokenInteraction({
      firstToken: this.tokenBeingDragged,
      secondToken: createSizedToken(
        tokenDroppedOntoColor(this.control),
        tokenDroppedOntoIsCircle(this.control),
        this.control.tokenDroppedOntoIsSmall()
      ),
      action: Action.useToTouch,
    });
  }
}
