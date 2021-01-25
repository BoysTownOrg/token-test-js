import { Color, Action, Shape } from "./TokenModel.js";

export class TokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
  }

  notifyThatRedSquareHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
  }

  notifyThatRedCircleHasBeenDragged() {
    this.tokenBeingDragged = { color: Color.red, shape: Shape.circle };
  }

  notifyThatGreenSquareHasBeenDroppedOnto() {
    this.model.submitDualTokenInteraction({
      firstToken: this.tokenBeingDragged,
      secondToken: {
        color: Color.green,
        shape: Shape.square,
      },
      action: Action.useToTouch,
    });
  }
}
