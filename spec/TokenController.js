import { TokenController } from "../lib/TokenController.js";

class TokenControlStub {
  clickRedSquare() {
    this.observer.notifyThatRedSquareHasBeenClicked();
  }

  attach(observer) {
    this.observer = observer;
  }
}

describe("Controller", () => {
  it("should do something when user clicks red square", () => {
    const control = new TokenControlStub();
    const controller = new TokenController(control);
    control.clickRedSquare();
  });
});
