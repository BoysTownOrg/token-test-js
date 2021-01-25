import { Color, Action } from "./TokenModel.js";

export class TokenController {
  constructor(control, model) {
    control.attach(this);
    this.model = model;
  }

  notifyThatRedSquareHasBeenClicked() {
    this.model.submitSingleTokenInteraction({
      color: Color.red,
      action: Action.touch,
    });
  }
}
