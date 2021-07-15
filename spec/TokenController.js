import {
  TokenController,
  SizedTokenController,
} from "../lib/TokenController.js";
import { Action, Color, Shape, Size, hashToken } from "../lib/TokenModel.js";

class TokenControlStub {
  constructor() {
    this.positionFromToken = new Map();
  }

  releaseRedSquare() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  releaseRedCircle() {
    this.tokenReleasedColor_ = "red";
    this.tokenReleasedIsCircle_ = true;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  releaseGreenSquare() {
    this.tokenReleasedColor_ = "green";
    this.tokenReleasedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dragRedCircle() {
    this.tokenDraggedColor_ = "red";
    this.tokenDraggedIsCircle_ = true;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dragGreenSquare() {
    this.tokenDraggedColor_ = "green";
    this.tokenDraggedIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDragged();
  }

  dropOntoGreenSquare() {
    this.tokenDroppedOntoColor_ = "green";
    this.tokenDroppedOntoIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
  }

  dropOntoRedSquare() {
    this.tokenDroppedOntoColor_ = "red";
    this.tokenDroppedOntoIsCircle_ = false;
    this.observer.notifyThatTokenHasBeenDroppedOnto();
    this.observer.notifyThatTokenHasBeenReleased();
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

  setTokenPosition(token, position) {
    this.positionFromToken.set(hashToken(token), position);
  }

  tokenPosition(token) {
    return this.positionFromToken.has(hashToken(token))
      ? this.positionFromToken.get(hashToken(token))
      : {
          leftScreenEdgeToLeftEdgePixels: 0,
          topScreenEdgeToTopEdgePixels: 0,
          widthPixels: 0,
          heightPixels: 0,
        };
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
    this.observer.notifyThatTokenHasBeenReleased();
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

  submitSingleTokenInteraction(singleTokenInteraction_, tokenRelation_) {
    this.singleTokenInteraction_ = singleTokenInteraction_;
    this.tokenRelation_ = tokenRelation_;
  }

  submitDualTokenInteraction(dualTokenInteraction_, tokenRelation_) {
    this.dualTokenInteraction_ = dualTokenInteraction_;
    this.tokenRelation_ = tokenRelation_;
  }

  tokenRelation() {
    return this.tokenRelation_;
  }
}

function yDifference(pointA, pointB) {
  return pointA.y - pointB.y;
}

function xDifference(pointA, pointB) {
  return pointA.x - pointB.x;
}

function distance(pointA, pointB) {
  return Math.sqrt(
    xDifference(pointA, pointB) * xDifference(pointA, pointB) +
      yDifference(pointA, pointB) * yDifference(pointA, pointB)
  );
}

function setTokenPosition(control, token, position) {
  control.setTokenPosition(token, position);
}

describe("TokenController", () => {
  beforeEach(function () {
    this.control = new TokenControlStub();
    this.model = new TokenModelStub();
    const controller = new TokenController(this.control, this.model);
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

  it("should determine whether green square is further from yellow square after drag", function () {
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 10,
        topScreenEdgeToTopEdgePixels: 20,
        widthPixels: 30,
        heightPixels: 40,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 50,
        topScreenEdgeToTopEdgePixels: 60,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    this.control.dragGreenSquare();
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 90,
        topScreenEdgeToTopEdgePixels: 100,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    this.control.releaseGreenSquare();
    expect(
      this.model.tokenRelation().movedTokenIsFurtherFrom({
        color: Color.yellow,
        shape: Shape.square,
      })
    ).toBe(
      distance(
        {
          x: 10 + 30 / 2,
          y: 20 + 40 / 2,
        },
        {
          x: 90 + 70 / 2,
          y: 100 + 80 / 2,
        }
      ) >
        distance(
          {
            x: 10 + 30 / 2,
            y: 20 + 40 / 2,
          },
          {
            x: 50 + 70 / 2,
            y: 60 + 80 / 2,
          }
        )
    );
  });

  it("should determine whether green square is further from yellow square after drop onto other token", function () {
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 40,
        topScreenEdgeToTopEdgePixels: 30,
        widthPixels: 20,
        heightPixels: 10,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 80,
        topScreenEdgeToTopEdgePixels: 70,
        widthPixels: 60,
        heightPixels: 50,
      }
    );
    this.control.dragGreenSquare();
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 100,
        topScreenEdgeToTopEdgePixels: 90,
        widthPixels: 60,
        heightPixels: 50,
      }
    );
    this.control.dropOntoRedSquare();
    expect(
      this.model.tokenRelation().movedTokenIsFurtherFrom({
        color: Color.yellow,
        shape: Shape.square,
      })
    ).toBe(
      distance(
        {
          x: 40 + 20 / 2,
          y: 30 + 10 / 2,
        },
        {
          x: 100 + 60 / 2,
          y: 90 + 50 / 2,
        }
      ) >
        distance(
          {
            x: 40 + 20 / 2,
            y: 30 + 10 / 2,
          },
          {
            x: 80 + 60 / 2,
            y: 70 + 50 / 2,
          }
        )
    );
  });

  it("should determine whether red circle is left of yellow square after drag", function () {
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 10,
        topScreenEdgeToTopEdgePixels: 20,
        widthPixels: 30,
        heightPixels: 40,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 15,
        topScreenEdgeToTopEdgePixels: 25,
        widthPixels: 35,
        heightPixels: 45,
      }
    );
    this.control.dragRedCircle();
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 1,
        topScreenEdgeToTopEdgePixels: 25,
        widthPixels: 35,
        heightPixels: 45,
      }
    );
    this.control.releaseRedCircle();
    expect(
      this.model.tokenRelation().movedTokenIsLeftOf({
        color: Color.yellow,
        shape: Shape.square,
      })
    ).toBe(1 + 35 / 2 < 10 + 30 / 2);
  });

  it("should determine whether red circle is between the yellow square and the green square after drag", function () {
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 10,
        topScreenEdgeToTopEdgePixels: 20,
        widthPixels: 30,
        heightPixels: 40,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 50,
        topScreenEdgeToTopEdgePixels: 60,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 90,
        topScreenEdgeToTopEdgePixels: 100,
        widthPixels: 110,
        heightPixels: 120,
      }
    );
    this.control.dragRedCircle();
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 130,
        topScreenEdgeToTopEdgePixels: 140,
        widthPixels: 150,
        heightPixels: 160,
      }
    );
    this.control.releaseRedCircle();
    const redCircleNewPosition = { x: 130 + 150 / 2, y: 140 + 160 / 2 };
    const A = { x: 10 + 30 / 2, y: 20 + 40 / 2 };
    const B = { x: 50 + 70 / 2, y: 60 + 80 / 2 };
    const m = (A.y - B.y) / (A.x - B.x);
    expect(
      this.model.tokenRelation().movedTokenIsBetween(
        {
          color: Color.yellow,
          shape: Shape.square,
        },
        {
          color: Color.green,
          shape: Shape.square,
        }
      )
    ).toBe(
      A.x + A.y * m <= redCircleNewPosition.x + redCircleNewPosition.y * m &&
        redCircleNewPosition.x + redCircleNewPosition.y * m <= B.x + B.y * m
    );
  });

  it("should determine whether red circle is between the yellow square and the green square after drag part 2", function () {
    setTokenPosition(
      this.control,
      { color: Color.green, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 10,
        topScreenEdgeToTopEdgePixels: 20,
        widthPixels: 30,
        heightPixels: 40,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.yellow, shape: Shape.square },
      {
        leftScreenEdgeToLeftEdgePixels: 50,
        topScreenEdgeToTopEdgePixels: 60,
        widthPixels: 70,
        heightPixels: 80,
      }
    );
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 90,
        topScreenEdgeToTopEdgePixels: 100,
        widthPixels: 110,
        heightPixels: 120,
      }
    );
    this.control.dragRedCircle();
    setTokenPosition(
      this.control,
      { color: Color.red, shape: Shape.circle },
      {
        leftScreenEdgeToLeftEdgePixels: 15,
        topScreenEdgeToTopEdgePixels: 25,
        widthPixels: 35,
        heightPixels: 45,
      }
    );
    this.control.releaseRedCircle();
    const redCircleNewPosition = { x: 15 + 35 / 2, y: 25 + 45 / 2 };
    const A = { x: 10 + 30 / 2, y: 20 + 40 / 2 };
    const B = { x: 50 + 70 / 2, y: 60 + 80 / 2 };
    const m = (A.y - B.y) / (A.x - B.x);
    expect(
      this.model.tokenRelation().movedTokenIsBetween(
        {
          color: Color.yellow,
          shape: Shape.square,
        },
        {
          color: Color.green,
          shape: Shape.square,
        }
      )
    ).toBe(
      A.x + A.y * m <= redCircleNewPosition.x + redCircleNewPosition.y * m &&
        redCircleNewPosition.x + redCircleNewPosition.y * m <= B.x + B.y * m
    );
  });

  it("should submit a move action on drag and release", function () {
    this.control.dragGreenSquare();
    this.control.releaseGreenSquare();
    expect(this.model.singleTokenInteraction().action).toBe(Action.move);
    expect(this.model.singleTokenInteraction().token.color).toBe(Color.green);
    expect(this.model.singleTokenInteraction().token.shape).toBe(Shape.square);
  });
});

describe("SizedTokenController", () => {
  beforeEach(function () {
    this.control = new SizedTokenControlStub();
    this.model = new TokenModelStub();
    const controller = new SizedTokenController(this.control, this.model);
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
