import {
  TokenController,
  SizedTokenController,
} from "../lib/TokenController.js";
import { Action, Color, Shape, Size } from "../lib/TokenModel.js";

class TokenControlStub {
  releaseRedSquare() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dragRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
  }

  dropOntoHoldingArea() {
    this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
  }

  tokenReleasedColor() {
    return this.tokenReleasedColor_;
  }

  tokenReleasedIsCircle() {
    return this.tokenReleasedIsCircle_;
  }

  tokenDraggedColor() {
    return this.tokenDraggedColor_;
  }

  tokenDraggedIsCircle() {
    return this.tokenDraggedIsCircle_;
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOntoColor_;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOntoIsCircle_;
  }

  attach(observer) {
    this.observer = observer;
  }
}

class SizedTokenControlStub {
  releaseSmallRedSquare() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = false;
    this.tokenReleasedIsSmall_ = true;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dragSmallRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.tokenDraggedIsSmall_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoLargeGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.tokenDroppedOntoIsSmall_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
  }

  dropOntoHoldingArea() {
    this.observer.notifyThatHoldingAreaHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
  }

  tokenDraggedColor() {
    return this.tokenDraggedColor_;
  }

  tokenDraggedIsCircle() {
    return this.tokenDraggedIsCircle_;
  }

  tokenDroppedOntoColor() {
    return this.tokenDroppedOntoColor_;
  }

  tokenDroppedOntoIsCircle() {
    return this.tokenDroppedOntoIsCircle_;
  }

  tokenDraggedIsSmall() {
    return this.tokenDraggedIsSmall_;
  }

  tokenDroppedOntoIsSmall() {
    return this.tokenDroppedOntoIsSmall_;
  }

  tokenReleasedColor() {
    return this.tokenReleasedColor_;
  }

  tokenReleasedIsCircle() {
    return this.tokenReleasedIsCircle_;
  }

  tokenReleasedIsSmall() {
    return this.tokenReleasedIsSmall_;
  }

  attach(observer) {
    this.observer = observer;
  }
}

class TokenModelStub {
  singleTokenInteraction() {
    return this.singleTokenInteraction_;
  }

  dualTokenInteraction() {
    return this.dualTokenInteraction_;
  }

  submitSingleTokenInteraction(singleTokenInteraction_) {
    this.singleTokenInteraction_ = singleTokenInteraction_;
  }

  submitDualTokenInteraction(dualTokenInteraction_) {
    this.dualTokenInteraction_ = dualTokenInteraction_;
  }
}

describe("TokenController", () => {
  beforeEach(function () {
    this.control = new TokenControlStub();
    this.model = new TokenModelStub();
    new TokenController(this.control, this.model);
  });

  it("should submit touch action when user releases red square", function () {
    this.control.releaseRedSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
  });

  it("should submit use-to-touch action when user drags red circle onto green square", function () {
    this.control.dragRedCircle();
    this.control.dropOntoGreenSquare();
    expect(this.model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(this.model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(this.model.dualTokenInteraction().firstToken.shape).toBe(
      Shape.circle
    );
    expect(this.model.dualTokenInteraction().secondToken.color).toBe(
      Color.green
    );
    expect(this.model.dualTokenInteraction().secondToken.shape).toBe(
      Shape.square
    );
  });

  it("should submit pick-up action when user drags red circle onto holding area", function () {
    this.control.dragRedCircle();
    this.control.dropOntoHoldingArea();
    expect(this.model.singleTokenInteraction().action).toBe(Action.pickUp);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.circle);
  });
});

describe("SizedTokenController", () => {
  beforeEach(function () {
    this.control = new SizedTokenControlStub();
    this.model = new TokenModelStub();
    new SizedTokenController(this.control, this.model);
  });

  it("should submit touch action when user releases small red square", function () {
    this.control.releaseSmallRedSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.touch);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
    expect(this.model.singleTokenInteraction().token.size).toBe(Size.small);
  });

  it("should submit use-to-touch action when user drags small red circle onto large green square", function () {
    this.control.dragSmallRedCircle();
    this.control.dropOntoLargeGreenSquare();
    expect(this.model.dualTokenInteraction().action).toBe(Action.useToTouch);
    expect(this.model.dualTokenInteraction().firstToken.color).toBe(Color.red);
    expect(this.model.dualTokenInteraction().firstToken.shape).toBe(
      Shape.circle
    );
    expect(this.model.dualTokenInteraction().firstToken.size).toBe(Size.small);
    expect(this.model.dualTokenInteraction().secondToken.color).toBe(
      Color.green
    );
    expect(this.model.dualTokenInteraction().secondToken.shape).toBe(
      Shape.square
    );
    expect(this.model.dualTokenInteraction().secondToken.size).toBe(Size.large);
  });

  it("should submit pick-up action when user drags small red circle onto holding area", function () {
    this.control.dragSmallRedCircle();
    this.control.dropOntoHoldingArea();
    expect(this.model.singleTokenInteraction().action).toBe(Action.pickUp);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.red);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.circle);
    expect(this.model.singleTokenInteraction().token.size).toBe(Size.small);
  });
});
