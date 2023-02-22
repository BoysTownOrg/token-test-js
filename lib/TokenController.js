import { Action, Shape, Size } from "./TokenModel.js";

const ActionState = Object.freeze({
    dragging: 1,
    dropped: 2,
    idle: 3,
});

function createToken(color, tokenIsCircle) {
    return {
        color,
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

function center(tokenPosition) {
    return {
        x:
            tokenPosition.leftScreenEdgeToLeftEdgePixels +
            tokenPosition.widthPixels / 2,
        y:
            tokenPosition.topScreenEdgeToTopEdgePixels +
            tokenPosition.heightPixels / 2,
    };
}

export class TokenController {
    constructor(control, model) {
        control.attach(this);
        this.model = model;
        this.control = control;
        this.actionState = ActionState.idle;
    }

    notifyThatDoneButtonHasBeenClicked() {
        this.model.concludeTrial();
    }

    notifyThatTokenHasBeenReleased() {
        switch (this.actionState) {
            case ActionState.idle:
                this.model.submitSingleTokenInteraction({
                    token: createToken(
                        tokenReleasedColor(this.control),
                        tokenReleasedIsCircle(this.control)
                    ),
                    action: Action.touch,
                });
                break;
            case ActionState.dragging:
                this.model.submitSingleTokenInteraction(
                    {
                        token: this.tokenBeingDragged,
                        action: Action.move,
                    },
                    this
                );
                break;
            case ActionState.dropped:
                break;
            default:
                break;
        }
        this.actionState = ActionState.idle;
    }

    notifyThatTokenHasBeenDragged() {
        this.tokenBeingDragged = createToken(
            tokenDraggedColor(this.control),
            tokenDraggedIsCircle(this.control)
        );
        this.tokenBeingDraggedCenter = center(
            this.control.tokenPosition(this.tokenBeingDragged)
        );
        this.actionState = ActionState.dragging;
    }

    notifyThatTokenHasBeenDroppedOnto() {
        this.model.submitDualTokenInteraction(
            {
                firstToken: this.tokenBeingDragged,
                secondToken: createToken(
                    tokenDroppedOntoColor(this.control),
                    tokenDroppedOntoIsCircle(this.control)
                ),
                action: Action.useToTouch,
            },
            this
        );
        this.actionState = ActionState.dropped;
    }

    notifyThatHoldingAreaHasBeenDroppedOnto() {
        this.model.submitSingleTokenInteraction(
            {
                token: this.tokenBeingDragged,
                action: Action.pickUp,
            },
            this
        );
        this.actionState = ActionState.dropped;
    }

    movedTokenIsFurtherFrom(token) {
        return (
            distance(
                center(this.control.tokenPosition(token)),
                center(this.control.tokenPosition(this.tokenBeingDragged))
            ) >
            distance(
                center(this.control.tokenPosition(token)),
                this.tokenBeingDraggedCenter
            )
        );
    }

    movedTokenIsBetween(tokenA, tokenB) {
        const tokenACenter = center(this.control.tokenPosition(tokenA));
        const tokenBCenter = center(this.control.tokenPosition(tokenB));
        const tokenMovedCenter = center(
            this.control.tokenPosition(this.tokenBeingDragged)
        );
        const pointFurthestLeft =
            tokenACenter.x < tokenBCenter.x ? tokenACenter : tokenBCenter;
        const pointFurthestRight =
            tokenACenter.x < tokenBCenter.x ? tokenBCenter : tokenACenter;
        const slope =
            (pointFurthestLeft.y - pointFurthestRight.y) /
            (pointFurthestLeft.x - pointFurthestRight.x);
        return (
            pointFurthestLeft.x + pointFurthestLeft.y * slope <=
            tokenMovedCenter.x + tokenMovedCenter.y * slope &&
            tokenMovedCenter.x + tokenMovedCenter.y * slope <=
            pointFurthestRight.x + pointFurthestRight.y * slope
        );
    }

    movedTokenIsLeftOf(token) {
        return (
            center(this.control.tokenPosition(this.tokenBeingDragged)).x <
            center(this.control.tokenPosition(token)).x
        );
    }
}

export class SizedTokenController {
    constructor(control, model) {
        control.attach(this);
        this.model = model;
        this.control = control;
        this.lastActionWasADrop = false;
    }

    notifyThatDoneButtonHasBeenClicked() {
        this.model.concludeTrial();
    }

    notifyThatTokenHasBeenReleased() {
        if (this.lastActionWasADrop) this.lastActionWasADrop = false;
        else
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
