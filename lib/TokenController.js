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

function tokenClickedColor(control) {
  return control.tokenClickedColor();
}

function tokenClickedIsCircle(control) {
  return control.tokenClickedIsCircle();
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
  }

  notifyThatTokenHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      token: createToken(
        tokenClickedColor(this.control),
        tokenClickedIsCircle(this.control)
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
  }
}

export class SizedTokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
    this.control = control;
  }

  notifyThatTokenHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      token: createSizedToken(
        tokenClickedColor(this.control),
        tokenClickedIsCircle(this.control),
        this.control.tokenClickedIsSmall()
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
